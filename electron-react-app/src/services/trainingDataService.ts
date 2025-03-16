// src/services/trainingDataService.ts

/**
 * Training Data Service
 *
 * This module manages the periodic recording of training data and the deletion of recent training records.
 * It subscribes to Redux store changes to determine when training data should be recorded based on configurable
 * conditions, and it triggers the insertion of training records into the SQLite database via the Electron API.
 * Additionally, it listens for a flag to delete records (e.g., to remove data recorded within the last 10 seconds).
 */

import store, { RootState } from '../store';

// Global variables for managing the periodic recording task.
let intervalId: NodeJS.Timeout | null = null;
let currentRecordingRate: number = 1000;

/**
 * Starts the training data service.
 *
 * Sets up two subscriptions:
 * 1. One subscription monitors changes to the recording flag and recording rate to start or stop a periodic
 *    task that processes training records.
 * 2. A separate subscription monitors the theta.deleteRecent flag to trigger deletion of recent records.
 */
export function startTrainingDataService() {
  // Subscription for recording training data.
  let previousRecording = store.getState().config.recordTrainingData;
  store.subscribe(() => {
    const state = store.getState();
    const isRecording = state.config.recordTrainingData;
    const newRecordingRate = state.config.recordingRate;

    // If the recording rate changes while recording is active, update the interval.
    if (newRecordingRate !== currentRecordingRate && intervalId !== null) {
      currentRecordingRate = newRecordingRate;
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        processTrainingRecord(store.getState());
      }, currentRecordingRate);
    }

    // If recording is enabled and was previously disabled, start the periodic task.
    if (isRecording && !previousRecording) {
      currentRecordingRate = newRecordingRate;
      intervalId = setInterval(() => {
        processTrainingRecord(store.getState());
      }, currentRecordingRate);
    }
    // If recording has been disabled, clear the interval.
    else if (!isRecording && previousRecording) {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
    previousRecording = isRecording;
  });

  // Separate subscription for the deleteRecent flag.
  let previousDeleteRecent = false;
  store.subscribe(() => {
    const state = store.getState();
    const deleteRecent = state.status.theta.deleteRecent;
    // When the flag changes from false to true, trigger deletion of recent records.
    if (deleteRecent && !previousDeleteRecent) {
      deleteRecentRecords(state);
    }
    previousDeleteRecent = deleteRecent;
  });
}

/**
 * Processes a training record if conditions are met.
 *
 * Checks that:
 * - Theta data is recent (within the recording rate).
 * - At least one of the left or right eye frames is recent.
 * - The theta.record flag is set to true.
 *
 * If these conditions are met, this function sends a request via the Electron API to insert
 * a new training record into the SQLite database.
 *
 * @param state The current Redux state.
 */
function processTrainingRecord(state: RootState) {
  const now = Date.now();
  const recordingRate = state.config.recordingRate;

  // Retrieve the relevant data from the state.
  const theta = state.status.theta;
  const leftEye = state.status.imageData.leftEye;
  const rightEye = state.status.imageData.rightEye;

  // Determine if the theta data and at least one eye frame are recent.
  const isThetaRecent =
    theta.timestamp !== null && now - theta.timestamp <= recordingRate;
  const isLeftRecent =
    leftEye.timestamp !== null && now - leftEye.timestamp <= recordingRate;
  const isRightRecent =
    rightEye.timestamp !== null && now - rightEye.timestamp <= recordingRate;
  const isImageRecent = isLeftRecent || isRightRecent;
  const thetaRecordFlag = theta.record === true;

  if (isThetaRecent && isImageRecent && thetaRecordFlag) {
    const entryTimestamp = now; // Use current time as the record's timestamp.
    const leftEyeFrame = isLeftRecent ? leftEye.frame : null;
    const rightEyeFrame = isRightRecent ? rightEye.frame : null;
    const { theta1, theta2, openness, mode } = theta;
    const dbPath = state.database.selectedDb;

    if (!dbPath) {
      console.error("No database selected for training data insertion.");
      return;
    }

    // Insert the training data record via the Electron API.
    console.log("Saving Theta 1 = " + theta1 + "  and Theta 2 = " + theta2);
    window.electronAPI
      .insertTrainingData({
        dbPath,
        timestamp: entryTimestamp,
        leftEyeFrame,
        rightEyeFrame,
        theta1,
        theta2,
        openness,
        type: mode,
      })
      .catch((err) => {
        console.error("Failed to insert training data:", err);
      });
  }
}

/**
 * Deletes recent training data records from the database.
 *
 * Calculates a cutoff timestamp (current time minus 10,000 ms) and calls the Electron API
 * to delete all training records newer than that cutoff.
 *
 * @param state The current Redux state.
 */
function deleteRecentRecords(state: RootState) {
  const now = Date.now();
  const cutoff = now - 10000; // 10 seconds ago.
  const dbPath = state.database.selectedDb;

  if (!dbPath) {
    console.error("No database selected for deletion.");
    return;
  }

  window.electronAPI
    .deleteRecentTrainingData({ dbPath, cutoff })
    .then(() => {
      console.log(`Deleted training records with timestamp >= ${cutoff}`);
    })
    .catch((err) => {
      console.error("Failed to delete recent training data:", err);
    });
}
