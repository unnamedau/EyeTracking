// src/services/models/combinedThetaModel.ts

/**
 * Combined Theta Prediction Service
 *
 * This module provides functionality to load a TensorFlow.js model that predicts combined theta
 * values (theta1 and theta2) from concatenated left and right eye image tensors. The left and right
 * tensors (each with shape [128,128,3]) are concatenated side-by-side to create a combined tensor
 * of shape [128,256,3]. A batch dimension is then added (resulting in [1,128,256,3]), and the model
 * outputs two continuous angle values. Optionally, these raw predictions are filtered using a Kalman
 * filter to smooth the output. Finally, the (filtered) theta values are dispatched to the Redux store
 * along with a timestamp.
 */

import store from '../../store';
import * as tf from '@tensorflow/tfjs';
import { updateTheta } from '../../slices/statusSlice';
import { fileSystemIOHandler } from '../../utilities/fileSystemIOHandler';
import kalmanFilterManager from '../../utilities/KalmanFilterManager';

let currentModel: tf.LayersModel | null = null;
const MODEL_ID = 'combinedTheta'; // Unique identifier for this model's filters

/**
 * Loads the combined theta model from the specified folder.
 *
 * This function utilizes a file system I/O handler to load the model JSON from the given folder and
 * initializes the TensorFlow.js model. The loaded model is cached for subsequent predictions.
 *
 * @param modelFolderPath - The folder path containing the model JSON file.
 */
export async function loadModel(modelFolderPath: string): Promise<void> {
  try {
    currentModel = await tf.loadLayersModel(
      fileSystemIOHandler(`${modelFolderPath}\\model.json`)
    );
    console.log('CombinedTheta model loaded from', modelFolderPath);
  } catch (err) {
    console.error('Error loading CombinedTheta model:', err);
  }
}

/**
 * Predicts combined theta values from left and right eye image tensors.
 *
 * This function concatenates the left and right eye tensors along the width (axis=1) to form a combined
 * tensor with shape [128,256,3]. It then expands the dimensions to add a batch dimension, yielding a tensor
 * of shape [1,128,256,3]. The model then processes this tensor to produce two continuous angle predictions.
 * If Kalman filtering is enabled in the current configuration, the raw predictions are filtered for a smoother
 * output. Finally, the resulting theta values (theta1 and theta2) are dispatched to the Redux store along with
 * a timestamp.
 *
 * @param leftTensor - The left eye image tensor (shape [128,128,3]).
 * @param rightTensor - The right eye image tensor (shape [128,128,3]).
 * @param trustworthiness - A numeric factor indicating the trustworthiness for the Kalman filter.
 * @returns A promise that resolves when the prediction process is complete.
 */
export async function makePrediction(
  leftTensor: tf.Tensor3D,
  rightTensor: tf.Tensor3D,
  trustworthiness: number
): Promise<void> {
  if (!currentModel) {
    console.warn('CombinedTheta model not loaded.');
    return;
  }

  try {
    const batchedTensor = tf.tidy(() => {
      // Concatenate left and right tensors along the width (axis=1) to form a [128,256,3] tensor.
      const combinedTensor = tf.concat([leftTensor, rightTensor], 1);
      // Expand dimensions to add a batch dimension: [1,128,256,3].
      return combinedTensor.expandDims(0);
    });

    // Run the model prediction, expecting the output to be a tensor with two elements.
    const predictionTensor = currentModel.predict(batchedTensor) as tf.Tensor;
    const predictionData = await predictionTensor.data();

    // Dispose of tensors to free memory.
    batchedTensor.dispose();
    predictionTensor.dispose();

    // Extract raw theta values from the prediction.
    let theta1 = predictionData[0];
    let theta2 = predictionData[1];

    // Retrieve the current configuration to check if Kalman filtering is enabled.
    const config = store.getState().config;
    if (config.kalmanEnabled) {
      const [filtTheta1, filtTheta2] =
        kalmanFilterManager.filterTwoAngles(MODEL_ID, theta1, theta2, config, trustworthiness);
      theta1 = filtTheta1;
      theta2 = filtTheta2;
    }

    // Dispatch the (filtered) theta values along with the current timestamp to update the store.
    store.dispatch(
      updateTheta({
        theta1,
        theta2,
        timestamp: Date.now(),
      })
    );
  } catch (err) {
    console.error('Error during CombinedTheta prediction:', err);
  }
}
