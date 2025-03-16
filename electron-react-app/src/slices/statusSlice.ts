// src/slices/statusSlice.ts

/**
 * @module statusSlice
 * 
 * Manages connection and data status for camera frames, theta data, and tracking data.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  toggleLeftEyeForcedOffline,
  toggleRightEyeForcedOffline,
} from '../slices/configSlice';

/** Connection status for components */
export type ConnectionStatus = 'online' | 'offline' | 'warning';

/** Camera frame data with timestamp and connection status */
export interface CameraFrame {
  frame: string;
  timestamp: number | null;
  status: ConnectionStatus;
}

/** Theta measurement data and state */
export interface ThetaData {
  theta1: number;
  theta2: number;
  status: 'online' | 'offline';
  timestamp: number | null;
  record: boolean;
  deleteRecent: boolean;
  openness: number;
  mode: string;
}

/** Detailed tracking data for theta and openness (overall, left, and right) */
export interface TrackingData {
  theta1: number;
  theta2: number;
  thetaTimestamp: number | null;
  openness: number;
  opennessTimestamp: number | null;
  rightTheta1: number;
  rightTheta2: number;
  rightThetaTimestamp: number | null;
  rightOpenness: number;
  rightOpennessTimestamp: number | null;
  leftTheta1: number;
  leftTheta2: number;
  leftThetaTimestamp: number | null;
  leftOpenness: number;
  leftOpennessTimestamp: number | null;
}

/** Combined status state for the application */
export interface StatusState {
  database: ConnectionStatus;
  imageData: {
    leftEye: CameraFrame;
    rightEye: CameraFrame;
  };
  theta: ThetaData;
  tracking: TrackingData;
}

const initialState: StatusState = {
  database: 'offline',
  imageData: {
    leftEye: { frame: '', timestamp: null, status: 'offline' },
    rightEye: { frame: '', timestamp: null, status: 'offline' },
  },
  theta: {
    theta1: 0,
    theta2: 0,
    status: 'offline',
    timestamp: null,
    record: false,
    deleteRecent: false,
    openness: 0.75,
    mode: 'gaze',
  },
  tracking: {
    theta1: 0,
    theta2: 0,
    thetaTimestamp: null,
    openness: 0.75,
    opennessTimestamp: null,
    rightTheta1: 0,
    rightTheta2: 0,
    rightThetaTimestamp: null,
    rightOpenness: 0.75,
    rightOpennessTimestamp: null,
    leftTheta1: 0,
    leftTheta2: 0,
    leftThetaTimestamp: null,
    leftOpenness: 0.75,
    leftOpennessTimestamp: null,
  },
};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setCameraFrame(
      state,
      action: PayloadAction<{
        side: 'leftEye' | 'rightEye';
        frame: string;
        timestamp: number;
        status: ConnectionStatus;
      }>
    ) {
      const { side, frame, timestamp, status: connStatus } = action.payload;
      state.imageData[side] = { frame, timestamp, status: connStatus };
    },
    setThetaData(
      state,
      action: PayloadAction<{
        theta1: number;
        theta2: number;
        timestamp: number;
        record: boolean;
        deleteRecent: boolean;
        openness: number;
        mode: string;
      }>
    ) {
      state.theta.theta1 = action.payload.theta1;
      state.theta.theta2 = action.payload.theta2;
      state.theta.timestamp = action.payload.timestamp;
      state.theta.record = action.payload.record;
      state.theta.deleteRecent = action.payload.deleteRecent;
      state.theta.openness = action.payload.openness;
      state.theta.mode = action.payload.mode;
      state.theta.status = 'online';
    },
    setThetaStatus(state, action: PayloadAction<'online' | 'offline'>) {
      state.theta.status = action.payload;
    },
    updateTheta(
      state,
      action: PayloadAction<{
        theta1: number;
        theta2: number;
        timestamp: number;
      }>
    ) {
      state.tracking.theta1 = action.payload.theta1;
      state.tracking.theta2 = action.payload.theta2;
      state.tracking.thetaTimestamp = action.payload.timestamp;
    },
    updateOpenness(
      state,
      action: PayloadAction<{
        openness: number;
        timestamp: number;
      }>
    ) {
      state.tracking.openness = action.payload.openness;
      state.tracking.opennessTimestamp = action.payload.timestamp;
    },
    updateRightTheta(
      state,
      action: PayloadAction<{
        rightTheta1: number;
        rightTheta2: number;
        timestamp: number;
      }>
    ) {
      state.tracking.rightTheta1 = action.payload.rightTheta1;
      state.tracking.rightTheta2 = action.payload.rightTheta2;
      state.tracking.rightThetaTimestamp = action.payload.timestamp;
    },
    updateRightOpenness(
      state,
      action: PayloadAction<{
        rightOpenness: number;
        timestamp: number;
      }>
    ) {
      state.tracking.rightOpenness = action.payload.rightOpenness;
      state.tracking.rightOpennessTimestamp = action.payload.timestamp;
    },
    updateLeftTheta(
      state,
      action: PayloadAction<{
        leftTheta1: number;
        leftTheta2: number;
        timestamp: number;
      }>
    ) {
      state.tracking.leftTheta1 = action.payload.leftTheta1;
      state.tracking.leftTheta2 = action.payload.leftTheta2;
      state.tracking.leftThetaTimestamp = action.payload.timestamp;
    },
    updateLeftOpenness(
      state,
      action: PayloadAction<{
        leftOpenness: number;
        timestamp: number;
      }>
    ) {
      state.tracking.leftOpenness = action.payload.leftOpenness;
      state.tracking.leftOpennessTimestamp = action.payload.timestamp;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleLeftEyeForcedOffline, (state) => {
      state.imageData.leftEye.frame = '';
      state.imageData.leftEye.timestamp = Date.now();
      state.imageData.leftEye.status = 'offline';
    });
    builder.addCase(toggleRightEyeForcedOffline, (state) => {
      state.imageData.rightEye.frame = '';
      state.imageData.rightEye.timestamp = Date.now();
      state.imageData.rightEye.status = 'offline';
    });
  },
});

export const {
  setCameraFrame,
  setThetaData,
  setThetaStatus,
  updateTheta,
  updateOpenness,
  updateRightTheta,
  updateRightOpenness,
  updateLeftTheta,
  updateLeftOpenness,
} = statusSlice.actions;

export default statusSlice.reducer;
