// src/services/models/leftThetaModel.ts

/**
 * Left Theta Prediction Service
 *
 * This module provides functionality to load a TensorFlow.js model that predicts left eye theta values
 * (theta1 and theta2) from an input image tensor. The left eye image tensor (with shape [64,64,3]) is first
 * expanded to include a batch dimension (resulting in [1,64,64,3]) and then processed by the model to produce
 * two continuous angle predictions. Optionally, if Kalman filtering is enabled via configuration, the raw
 * predictions are smoothed using a dedicated Kalman filter. Finally, the (possibly filtered) theta values are
 * dispatched to the Redux store along with a timestamp.
 */

import store from '../../store';
import * as tf from '@tensorflow/tfjs';
import { updateLeftTheta } from '../../slices/statusSlice';
import { fileSystemIOHandler } from '../../utilities/fileSystemIOHandler';
import kalmanFilterManager from '../../utilities/KalmanFilterManager';

let currentModel: tf.LayersModel | null = null;
const MODEL_ID = 'leftTheta'; // Unique identifier for the left theta model's filtering

/**
 * Loads the left theta model from the specified folder.
 *
 * This function uses a custom file system I/O handler to load the model JSON file from the given folder,
 * then initializes and caches the TensorFlow.js model for subsequent predictions.
 *
 * @param modelFolderPath - The folder path where the model JSON file is located.
 */
export async function loadModel(modelFolderPath: string): Promise<void> {
  try {
    currentModel = await tf.loadLayersModel(
      fileSystemIOHandler(`${modelFolderPath}\\model.json`)
    );
    console.log('LeftTheta model loaded from', modelFolderPath);
  } catch (err) {
    console.error('Error loading LeftTheta model:', err);
  }
}

/**
 * Predicts left theta values (theta1 and theta2) using the provided left eye image tensor.
 *
 * The input tensor (shape [64,64,3]) is expanded to add a batch dimension ([1,64,64,3]) and fed into the model
 * to produce two continuous theta predictions. If Kalman filtering is enabled in the configuration, the raw predictions
 * are smoothed using the Kalman filter manager. The final theta values are then dispatched to the Redux store
 * with the current timestamp.
 *
 * @param leftTensor - The left eye image tensor (shape [64,64,3]).
 * @param trustworthiness - A factor indicating the reliability of the measurement, used by the Kalman filter.
 * @returns A promise that resolves once the prediction and dispatching are complete.
 */
export async function makePrediction(
  leftTensor: tf.Tensor3D,
  trustworthiness: number
): Promise<void> {
  if (!currentModel) {
    console.warn('LeftTheta model not loaded.');
    return;
  }
  try {
    // Expand dimensions of the left tensor to create a batch: [1,64,64,3].
    const batchedTensor = leftTensor.expandDims(0);
    
    // Run prediction: the model is expected to output a tensor with shape [1,2] containing two theta values.
    const predictionTensor = currentModel.predict(batchedTensor) as tf.Tensor;
    const predictionData = await predictionTensor.data();
    
    // Dispose of intermediate tensors to free memory.
    batchedTensor.dispose();
    predictionTensor.dispose();
    
    // Extract raw theta values from the prediction.
    let theta1 = predictionData[0];
    let theta2 = predictionData[1];
    
    // Retrieve the current configuration to check if Kalman filtering is enabled.
    const config = store.getState().config;
    if (config.kalmanEnabled) {
      const [filteredTheta1, filteredTheta2] =
        kalmanFilterManager.filterTwoAngles(MODEL_ID, theta1, theta2, config, trustworthiness);
      theta1 = filteredTheta1;
      theta2 = filteredTheta2;
    }
    
    // Dispatch the (possibly filtered) theta values along with the current timestamp to update the store.
    store.dispatch(
      updateLeftTheta({
        leftTheta1: theta1,
        leftTheta2: theta2,
        timestamp: Date.now(),
      })
    );
  } catch (err) {
    console.error('Error during LeftTheta prediction:', err);
  }
}
