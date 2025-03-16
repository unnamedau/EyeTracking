/**
 * Right Openness Prediction Service
 *
 * This module provides functionality to load a TensorFlow.js model that predicts the openness value
 * of the right eye from an input image tensor. The right eye image tensor (with shape [128,128,3]) is
 * expanded to include a batch dimension (resulting in [1,128,128,3]) and processed by the model to produce
 * a continuous openness value. Optionally, if Kalman filtering for openness is enabled via the configuration,
 * the raw prediction is smoothed using the dedicated Kalman filter. Finally, the (optionally filtered) right
 * openness value is dispatched to the Redux store along with a timestamp.
 */

import store from '../../store';
import * as tf from '@tensorflow/tfjs';
import { updateRightOpenness } from '../../slices/statusSlice';
import { fileSystemIOHandler } from '../../utilities/fileSystemIOHandler';
import kalmanFilterManager from '../../utilities/KalmanFilterManager';

let currentModel: tf.LayersModel | null = null;
const MODEL_ID = 'rightOpenness'; // Unique identifier for this model's openness filter

/**
 * Loads the right openness model from the specified folder.
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
    console.log('RightOpenness model loaded from', modelFolderPath);
  } catch (err) {
    console.error('Error loading RightOpenness model:', err);
  }
}

/**
 * Predicts the right eye openness from the provided image tensor.
 *
 * The right eye image tensor (shape [128,128,3]) is expanded to add a batch dimension (resulting in [1,128,128,3])
 * and then passed to the loaded model to obtain a continuous openness value. If Kalman filtering for openness
 * is enabled (via configuration), the raw prediction is filtered for a smoother output. Finally, the resulting
 * right openness value is dispatched to the Redux store along with the current timestamp.
 *
 * @param rightTensor - The right eye image tensor (shape [128,128,3]).
 * @returns A promise that resolves with the predicted right openness value.
 */
export async function makePrediction(
  rightTensor: tf.Tensor3D
): Promise<number> {
  if (!currentModel) {
    console.warn('RightOpenness model not loaded.');
    return 0;
  }
  try {
    // Expand the dimensions of the right tensor to create a batch: [1,128,128,3].
    const batchedTensor = rightTensor.expandDims(0);
    
    // Run the model prediction, expecting the output to have shape [1,1] with a continuous openness value.
    const predictionTensor = currentModel.predict(batchedTensor) as tf.Tensor;
    const predictionData = await predictionTensor.data();
    
    // Dispose of intermediate tensors to free memory.
    batchedTensor.dispose();
    predictionTensor.dispose();
    
    // Extract the predicted openness value.
    let predictedOpenness = predictionData[0];
    
    // Retrieve current configuration to check if Kalman filtering for openness is enabled.
    const config = store.getState().config;
    if (config.kalmanEnabledOpenness) {
      predictedOpenness = kalmanFilterManager.filterOpenness(MODEL_ID, predictedOpenness, config);
    }
    
    // Dispatch the (optionally filtered) right openness along with the current timestamp.
    store.dispatch(updateRightOpenness({ rightOpenness: predictedOpenness, timestamp: Date.now() }));
    return predictedOpenness;
  } catch (err) {
    console.error('Error during RightOpenness prediction:', err);
    return 0;
  }
}
