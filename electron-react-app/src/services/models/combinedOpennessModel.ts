// src/services/models/combinedOpennessModel.ts

/**
 * Combined Openness Prediction Service
 *
 * This module provides functionality to load a TensorFlow.js model that predicts a continuous
 * openness value from combined left and right eye images. The two input tensors (each of shape
 * 128x128x3) are concatenated along the width to form a single tensor of shape [128,256,3], which is
 * then expanded to include a batch dimension ([1,128,256,3]) before being passed to the model. The raw
 * prediction may be filtered using a Kalman filter (if enabled in the configuration) to smooth the output.
 * Finally, the (optionally filtered) openness value is dispatched to the Redux store along with a timestamp.
 */

import store from '../../store';
import * as tf from '@tensorflow/tfjs';
import { updateOpenness } from '../../slices/statusSlice';
import { fileSystemIOHandler } from '../../utilities/fileSystemIOHandler';
import kalmanFilterManager from '../../utilities/KalmanFilterManager';

let currentModel: tf.LayersModel | null = null;
const MODEL_ID = 'combinedOpenness'; // Unique identifier for the combined openness model's Kalman filter

/**
 * Loads the combined openness model from the specified folder.
 *
 * This function uses a custom file system I/O handler to load the model JSON from a given folder
 * and then initializes the TensorFlow.js model. The loaded model is stored for later predictions.
 *
 * @param modelFolderPath - The folder path where the model's JSON file is located.
 */
export async function loadModel(modelFolderPath: string): Promise<void> {
  console.log("Folder Path = " + modelFolderPath);
  try {
    currentModel = await tf.loadLayersModel(
      fileSystemIOHandler(`${modelFolderPath}\\model.json`)
    );
    console.log('CombinedOpenness model loaded from', modelFolderPath);
  } catch (err) {
    console.error('Error loading CombinedOpenness model:', err);
  }
}

/**
 * Predicts the combined openness value from left and right eye image tensors.
 *
 * This function concatenates the left and right eye tensors (each 128x128x3) along the width to
 * form a combined tensor of shape [128,256,3]. It then adds a batch dimension (resulting in [1,128,256,3])
 * and passes the tensor through the loaded model to predict a continuous openness value. If Kalman filtering
 * is enabled in the configuration, the raw prediction is filtered to provide a smoother output.
 * Finally, the resulting openness value is dispatched to the Redux store along with a timestamp.
 *
 * @param leftTensor - The left eye image tensor with shape 128x128x3.
 * @param rightTensor - The right eye image tensor with shape 128x128x3.
 * @returns The predicted (and optionally filtered) openness value.
 */
export async function makePrediction(
  leftTensor: tf.Tensor3D,
  rightTensor: tf.Tensor3D
): Promise<number> {
  if (!currentModel) {
    console.warn('CombinedOpenness model not loaded.');
    return 0;
  }
  try {
    // Concatenate the left and right tensors along the width (axis=1) to form [128,256,3].
    const combinedTensor = tf.concat([leftTensor, rightTensor], 1);
    // Expand dimensions to add a batch dimension: [1,128,256,3].
    const batchedTensor = combinedTensor.expandDims(0);
    
    // Run the model prediction, expecting an output shape [1,1] containing a continuous openness value.
    const predictionTensor = currentModel.predict(batchedTensor) as tf.Tensor;
    const predictionData = await predictionTensor.data();
    
    // Dispose intermediate tensors to free memory.
    combinedTensor.dispose();
    batchedTensor.dispose();
    predictionTensor.dispose();
    
    // Extract the predicted openness value.
    let predictedOpenness = predictionData[0];
    
    // Check if Kalman filtering is enabled in the configuration.
    const config = store.getState().config;
    if (config.kalmanEnabledOpenness) {
      predictedOpenness = kalmanFilterManager.filterOpenness(MODEL_ID, predictedOpenness, config);
    }
    
    // Dispatch the (possibly filtered) openness value along with the current timestamp.
    store.dispatch(updateOpenness({ openness: predictedOpenness, timestamp: Date.now() }));
    return predictedOpenness;
  } catch (err) {
    console.error('Error during CombinedOpenness prediction:', err);
    return 0;
  }
}
