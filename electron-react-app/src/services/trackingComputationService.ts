// src/services/trackingComputationService.ts

/**
 * Tracking Computation Service
 *
 * This module computes gaze tracking predictions using TensorFlow.js models. It processes image
 * frames for left and right eyes by loading, scaling, and normalizing them into tensors. It then
 * uses several pre-trained models (for theta and openness predictions) to compute gaze measurements.
 * The service conditionally reloads models if the configuration changes, ensures that frames are
 * fresh before processing, and integrates with the transmission service to send out computed data.
 */

import store, { RootState } from '../store';
import * as tf from '@tensorflow/tfjs';
import * as combinedThetaModel from './models/combinedThetaModel';
import * as combinedOpennessModel from './models/combinedOpennessModel';
import * as rightThetaModel from './models/rightThetaModel';
import * as rightOpennessModel from './models/rightOpennessModel';
import * as leftThetaModel from './models/leftThetaModel';
import * as leftOpennessModel from './models/leftOpennessModel';
import { startTrackingTransmission } from './trackingTransmissionService';
import { NormalizationUtils } from '../utilities/NormalizationUtils';

let currentModelFolder = "";
const debugVisual = false;
let ongoingTracking = false;

// Module-level variables to track previous timestamps for frame updates.
let previousLeftTimestamp: number = Date.now();
let previousRightTimestamp: number = Date.now();

/**
 * Loads and preprocesses an image from a data URL.
 *
 * This function creates an HTMLImageElement from the provided data URL, draws it on a canvas
 * scaled to the specified target size, and then converts the canvas pixels into a normalized
 * TensorFlow.js tensor. Optionally, if debugging is enabled, it appends a snapshot of the processed
 * image to a debug container in the DOM.
 *
 * @param frameDataUrl - The image data URL (typically a Base64 string).
 * @param targetSize - The desired width and height for the output image tensor.
 * @returns A promise that resolves to a normalized 3D tensor representing the image.
 */
async function loadAndPreprocessImage(
  frameDataUrl: string,
  targetSize: [number, number]
): Promise<tf.Tensor3D> {
  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const img = await loadImage(frameDataUrl);
  return tf.tidy(() => {
    const canvas = document.createElement('canvas');
    canvas.width = targetSize[0];
    canvas.height = targetSize[1];
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    // Draw the image scaled to the target size.
    ctx.drawImage(img, 0, 0, targetSize[0], targetSize[1]);

    // Debugging visual: Append the scaled image snapshot to a debug container.
    if (debugVisual) {
      const debugContainer = document.getElementById('debug-container') || (() => {
        const container = document.createElement('div');
        container.id = 'debug-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.right = '0';
        container.style.zIndex = '1000';
        container.style.backgroundColor = 'rgba(255,255,255,0.8)';
        container.style.border = '1px solid black';
        container.style.padding = '5px';
        container.style.maxHeight = '100vh';
        container.style.overflowY = 'auto';
        document.body.appendChild(container);
        return container;
      })();
      const debugImage = document.createElement('img');
      debugImage.src = canvas.toDataURL();
      debugImage.style.margin = '2px';
      debugImage.width = targetSize[0];
      debugImage.height = targetSize[1];
      debugContainer.appendChild(debugImage);
    }
    
    // Convert the canvas image to a normalized tensor.
    return (tf.browser.fromPixels(canvas).toFloat().div(tf.scalar(255))) as tf.Tensor3D;
  });
}

/**
 * Runs the tracking computation based on the current Redux store state.
 *
 * This function checks if new frames are available and if they have passed the configured
 * tracking rate before processing. It reloads tracking models if the model configuration has changed.
 * It then loads and preprocesses image data for each eye and computes openness and theta predictions
 * using the appropriate models. Finally, it disposes of any created tensors and signals the transmission
 * service to send out computed tracking data.
 */
async function runTracking() {
  if (ongoingTracking) {
    return;
  }
  ongoingTracking = true;
  const state: RootState = store.getState();
  const now = Date.now();
  const leftEye = state.status.imageData.leftEye;
  const rightEye = state.status.imageData.rightEye;
  const {
    trackingRate,
    modelFile,
    independentEyes,
    independentOpenness,
    syncedEyeUpdates,
    eyelidBasedGazeTrust
  } = state.config;

  // Reload models if the model folder configuration has changed.
  if (modelFile && modelFile !== currentModelFolder) {
    NormalizationUtils.resetNormalization();
    try {
      await Promise.all([
        combinedThetaModel.loadModel(`${modelFile}\\combined_pitchyaw`),
        combinedOpennessModel.loadModel(`${modelFile}\\combined_openness`),
        rightThetaModel.loadModel(`${modelFile}\\right_pitchyaw`),
        rightOpennessModel.loadModel(`${modelFile}\\right_openness`),
        leftThetaModel.loadModel(`${modelFile}\\left_pitchyaw`),
        leftOpennessModel.loadModel(`${modelFile}\\left_openness`)
      ]);
      console.log('All tracking models loaded.');
    } catch (err) {
      console.error('Error loading tracking models:', err);
    }
  }
  // In react the modelFile will only be updated if the value changes, which means
  // we need a system to know when the same file has been loaded twice. To handle this
  // we store '' to model file then the actual value on any change. 
  // So we need to track the "currentModelFolder" here outside the if block to catch
  // the change from '' -> '<actual-path>' 
  currentModelFolder = modelFile;

  let proceed = false;
  let validLeft = false;
  let validRight = false;
  const targetSize: [number, number] = [128, 128];

  // Check conditions for processing frames based on status, timestamps, and frame data.
  if (leftEye.status === 'online' && rightEye.status === 'online') {
    if (
      leftEye.timestamp && rightEye.timestamp && // Timestamps exist
      (now - previousLeftTimestamp >= trackingRate && now - previousRightTimestamp >= trackingRate) && // Enough time has passed
      leftEye.frame.trim() !== '' && rightEye.frame.trim() !== '' && // Valid frame data exists
      (leftEye.timestamp !== previousLeftTimestamp || rightEye.timestamp !== previousRightTimestamp) // At least one eye updated
    ) {
      if (syncedEyeUpdates) {
        // Process only if both eyes have fresh updates.
        if (
          leftEye.timestamp !== previousLeftTimestamp &&
          rightEye.timestamp !== previousRightTimestamp &&
          now - previousLeftTimestamp >= trackingRate &&
          now - previousRightTimestamp >= trackingRate
        ) {
          proceed = true;
          validLeft = true;
          validRight = true;
          previousLeftTimestamp = leftEye.timestamp;
          previousRightTimestamp = rightEye.timestamp;
        }
      } else {
        if (
          leftEye.timestamp !== previousLeftTimestamp &&
          now - previousLeftTimestamp >= trackingRate
        ) {
          proceed = true;
          validLeft = true;
          validRight = true;
          previousLeftTimestamp = leftEye.timestamp;
        }
        if (
          rightEye.timestamp !== previousRightTimestamp &&
          now - previousRightTimestamp >= trackingRate
        ) {
          proceed = true;
          validLeft = true;
          validRight = true;
          previousRightTimestamp = rightEye.timestamp;
        }
      }
    }
  } else if (leftEye.status === 'online') {
    if (
      leftEye.timestamp &&
      now - previousLeftTimestamp >= trackingRate &&
      leftEye.frame.trim() !== '' &&
      leftEye.timestamp !== previousLeftTimestamp
    ) {
      proceed = true;
      validLeft = true;
      previousLeftTimestamp = leftEye.timestamp;
    }
  } else if (rightEye.status === 'online') {
    if (
      rightEye.timestamp &&
      now - previousRightTimestamp >= trackingRate &&
      rightEye.frame.trim() !== '' &&
      rightEye.timestamp !== previousRightTimestamp
    ) {
      proceed = true;
      validRight = true;
      previousRightTimestamp = rightEye.timestamp;
    }
  }

  if (proceed) {
    try {
      // Load and preprocess image tensors for each eye or create a zero tensor if invalid.
      const leftTensor = validLeft
        ? await loadAndPreprocessImage(leftEye.frame, targetSize)
        : tf.zeros([targetSize[1], targetSize[0], 3]) as tf.Tensor3D;
      const rightTensor = validRight
        ? await loadAndPreprocessImage(rightEye.frame, targetSize)
        : tf.zeros([targetSize[1], targetSize[0], 3]) as tf.Tensor3D;

      // Initialize default gaze trust values.
      let combinedGazeTrust = 0.75;
      let leftGazeTrust = 0.75;
      let rightGazeTrust = 0.75;

      // Compute openness predictions.
      if (!independentOpenness) {
        if (validLeft && validRight) {
          combinedGazeTrust = await combinedOpennessModel.makePrediction(leftTensor, rightTensor);
        } else if (validLeft) {
          leftGazeTrust = await leftOpennessModel.makePrediction(leftTensor);
        } else if (validRight) {
          rightGazeTrust = await rightOpennessModel.makePrediction(rightTensor);
        }
      } else {
        if (validLeft) leftGazeTrust = await leftOpennessModel.makePrediction(leftTensor);
        if (validRight) rightGazeTrust = await rightOpennessModel.makePrediction(rightTensor);
      }

      // Override openness trust values if eyelid-based gaze trust is disabled.
      if (!eyelidBasedGazeTrust) {
        combinedGazeTrust = 0.75;
        leftGazeTrust = 0.75;
        rightGazeTrust = 0.75;
      }

      // Compute theta predictions based on whether eyes are processed independently.
      if (!independentEyes) {
        if (validLeft && validRight) {
          await combinedThetaModel.makePrediction(leftTensor, rightTensor, combinedGazeTrust);
        } else if (validLeft) {
          await leftThetaModel.makePrediction(leftTensor, leftGazeTrust);
        } else if (validRight) {
          await rightThetaModel.makePrediction(rightTensor, rightGazeTrust);
        }
      } else {
        if (validLeft && validRight) {
          await combinedThetaModel.makePrediction(leftTensor, rightTensor, combinedGazeTrust);
        }
        if (validLeft) await leftThetaModel.makePrediction(leftTensor, leftGazeTrust);
        if (validRight) await rightThetaModel.makePrediction(rightTensor, rightGazeTrust);
      }

      // Clean up tensors to free memory.
      leftTensor.dispose();
      rightTensor.dispose();
    } catch (err) {
      console.error('Error during tracking prediction:', err);
    }
  }
  startTrackingTransmission();
  ongoingTracking = false;
}

/**
 * Subscribes to Redux store changes to trigger tracking computations.
 *
 * Each time the store state changes, the tracking computation is executed.
 */
export function startTrackingComputation() {
  store.subscribe(() => {
    runTracking();
  });
}
