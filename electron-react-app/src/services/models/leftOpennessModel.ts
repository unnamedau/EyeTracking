// src/services/models/leftOpennessModel.ts

/**
 * Left Openness Prediction Service
 *
 * This module provides functionality to load a TensorFlow.js model that predicts the openness value
 * of the left eye from an input tensor. The input tensor (of shape [128,128,3]) is first expanded to
 * include a batch dimension (resulting in [1,128,128,3]) and then processed by the model to produce a
 * continuous openness value. If Kalman filtering is enabled via configuration, the raw prediction is
 * filtered to yield a smoother output. Finally, the (optionally filtered) left openness value is dispatched
 * to the Redux store along with a timestamp.
 */

import store from '../../store';
import * as tf from '@tensorflow/tfjs';
import { updateLeftOpenness } from '../../slices/statusSlice';
import { fileSystemIOHandler } from '../../utilities/fileSystemIOHandler';
import kalmanFilterManager from '../../utilities/KalmanFilterManager';

let currentModel: tf.LayersModel | null = null;
const MODEL_ID = 'leftOpenness'; // Unique identifier for this model's openness filter

/**
 * Loads the left openness model from the specified folder.
 *
 * Uses a custom file system I/O handler to load the model's JSON file from the given folder,
 * and initializes the TensorFlow.js model. The loaded model is cached for subsequent predictions.
 *
 * @param modelFolderPath - The folder path containing the model's JSON file.
 */
export async function loadModel(modelFolderPath: string): Promise<void> {
  try {
    currentModel = await tf.loadLayersModel(
      fileSystemIOHandler(`${modelFolderPath}\\model.json`)
    );
    console.log('LeftOpenness model loaded from', modelFolderPath);
  } catch (err) {
    console.error('Error loading LeftOpenness model:', err);
  }
}

/**
 * Predicts the left eye openness from the provided image tensor.
 *
 * The left eye image tensor (shape [128,128,3]) is expanded to add a batch dimension (resulting in [1,128,128,3])
 * and then fed into the loaded model to obtain a continuous openness value. If Kalman filtering for openness
 * is enabled (via the configuration), the raw prediction is filtered to produce a smoother output. Finally,
 * the resulting left openness value is dispatched to the Redux store along with the current timestamp.
 *
 * @param leftTensor - The left eye image tensor (shape [128,128,3]).
 * @returns A promise that resolves with the predicted left openness value.
 */
export async function makePrediction(
  leftTensor: tf.Tensor3D
): Promise<number> {
  if (!currentModel) {
    console.warn('LeftOpenness model not loaded.');
    return 0;
  }
  try {
    // Expand the dimensions of the left tensor to add a batch dimension: [1,128,128,3].
    const batchedTensor = leftTensor.expandDims(0);
    
    // Run the model prediction. Expect the output to have shape [1,1] containing a continuous openness value.
    const predictionTensor = currentModel.predict(batchedTensor) as tf.Tensor;
    const predictionData = await predictionTensor.data();
    
    // Dispose of intermediate tensors to free memory.
    batchedTensor.dispose();
    predictionTensor.dispose();
    
    // Extract the predicted openness value.
    let predictedOpenness = predictionData[0];
    
    // Retrieve current configuration to determine if Kalman filtering is enabled.
    const config = store.getState().config;
    if (config.kalmanEnabledOpenness) {
      predictedOpenness = kalmanFilterManager.filterOpenness(MODEL_ID, predictedOpenness, config);
    }
    
    // Dispatch the (optionally filtered) left openness value along with the current timestamp.
    store.dispatch(updateLeftOpenness({ leftOpenness: predictedOpenness, timestamp: Date.now() }));
    return predictedOpenness;
  } catch (err) {
    console.error('Error during LeftOpenness prediction:', err);
    return 0;
  }
}
