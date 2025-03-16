// src/services/models/rightThetaModel.ts

/**
 * Right Theta Prediction Service
 *
 * This module provides functionality to load a TensorFlow.js model that predicts right eye theta values
 * (theta1 and theta2) from an input image tensor. The right eye image tensor (with shape [128,128,3]) is
 * expanded to include a batch dimension (resulting in [1,128,128,3]) and then processed by the model to produce
 * two continuous angle predictions. Optionally, if Kalman filtering is enabled via configuration, the raw
 * predictions are smoothed using a dedicated Kalman filter. Finally, the (optionally filtered) theta values are
 * dispatched to the Redux store along with a timestamp.
 */

import store from '../../store';
import * as tf from '@tensorflow/tfjs';
import { updateRightTheta } from '../../slices/statusSlice';
import { fileSystemIOHandler } from '../../utilities/fileSystemIOHandler';
import kalmanFilterManager from '../../utilities/KalmanFilterManager';

let currentModel: tf.LayersModel | null = null;
const MODEL_ID = 'rightTheta'; // Unique identifier for the right theta model's filtering

/**
 * Loads the right theta model from the specified folder.
 *
 * This function uses a custom file system I/O handler to load the model's JSON file from the given folder,
 * then initializes and caches the TensorFlow.js model for subsequent predictions.
 *
 * @param modelFolderPath - The folder path where the model JSON file is located.
 */
export async function loadModel(modelFolderPath: string): Promise<void> {
  try {
    currentModel = await tf.loadLayersModel(
      fileSystemIOHandler(`${modelFolderPath}\\model.json`)
    );
    console.log('RightTheta model loaded from', modelFolderPath);
  } catch (err) {
    console.error('Error loading RightTheta model:', err);
  }
}

/**
 * Predicts right theta values (theta1 and theta2) using the provided right eye image tensor.
 *
 * The right eye image tensor (shape [128,128,3]) is expanded to add a batch dimension (resulting in [1,128,128,3])
 * and then passed to the loaded model to obtain two continuous theta predictions. If Kalman filtering is enabled
 * (via configuration), the raw predictions are smoothed using the Kalman filter manager. Finally, the resulting
 * theta values are dispatched to the Redux store along with the current timestamp.
 *
 * @param rightTensor - The right eye image tensor (shape [128,128,3]).
 * @param trustworthiness - A numeric factor indicating the reliability of the measurement, used by the Kalman filter.
 * @returns A promise that resolves once the prediction and dispatching are complete.
 */
export async function makePrediction(
  rightTensor: tf.Tensor3D,
  trustworthiness: number
): Promise<void> {
  if (!currentModel) {
    console.warn('RightTheta model not loaded.');
    return;
  }
  try {
    // Expand dimensions of the right tensor to create a batch: [1,128,128,3].
    const batchedTensor = rightTensor.expandDims(0);
    
    // Run the model prediction; expect the output to have shape [1,2] with two continuous theta values.
    const predictionTensor = currentModel.predict(batchedTensor) as tf.Tensor;
    const predictionData = await predictionTensor.data();
    
    // Dispose of intermediate tensors to free memory.
    batchedTensor.dispose();
    predictionTensor.dispose();
    
    // Extract the raw theta predictions.
    let theta1 = predictionData[0];
    let theta2 = predictionData[1];
    
    // Retrieve the current configuration from the store.
    const config = store.getState().config;
    
    // If Kalman filtering is enabled, apply it to the raw predictions.
    if (config.kalmanEnabled) {
      const [filteredTheta1, filteredTheta2] =
        kalmanFilterManager.filterTwoAngles(MODEL_ID, theta1, theta2, config, trustworthiness);
      theta1 = filteredTheta1;
      theta2 = filteredTheta2;
    }
    
    // Dispatch the (optionally filtered) theta values along with the current timestamp.
    store.dispatch(
      updateRightTheta({
        rightTheta1: theta1,
        rightTheta2: theta2,
        timestamp: Date.now(),
      })
    );
  } catch (err) {
    console.error('Error during RightTheta prediction:', err);
  }
}
