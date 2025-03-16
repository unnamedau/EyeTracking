// src/services/thetaService.ts

/**
 * Theta Service Module
 *
 * This module manages the WebSocket connection for receiving theta data from Unity.
 * It establishes a connection to a local WebSocket endpoint using the configured headset port,
 * dispatches incoming data to the Redux store, and monitors the connection status.
 * In case of connection closure, it attempts to reconnect automatically unless the service is
 * forced offline or the headset port configuration changes. The service also listens for configuration
 * changes to restart the connection if needed.
 */

import store from '../store';
import { setThetaData, setThetaStatus } from '../slices/statusSlice';

// Holds the active WebSocket, reconnection timeout, current headset port, and a subscription
// to configuration changes.
let socket: WebSocket | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let currentHeadsetPort: string = store.getState().config.headsetPort;
let unsubscribe: (() => void) | null = null;

/**
 * Opens a WebSocket connection to Unity using the current headset port.
 *
 * The connection will dispatch theta data (theta1, theta2, record, deleteRecent, openness, mode)
 * to the Redux store, and update the theta connection status. If the connection closes, the service
 * will attempt to reconnect after 2 seconds provided that the headset port remains unchanged and the
 * thetaForcedOffline flag is not set.
 */
function connectTheta() {
  // Check if theta is forced offline.
  const forcedOffline = store.getState().config.thetaForcedOffline;
  if (forcedOffline) {
    console.log("Theta Service: Forced offline - not attempting to connect.");
    return;
  }
  if (!currentHeadsetPort) {
    console.warn("Theta Service: No headset port configured.");
    return;
  }
  const wsUrl = `ws://127.0.0.1:${currentHeadsetPort}/theta`;
  console.log(`Theta Service: Connecting to ${wsUrl}`);
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log(`Theta Service: WebSocket connection opened on port ${currentHeadsetPort}`);
    store.dispatch(setThetaStatus('online'));
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      // Expect data to include theta1, theta2, record, deleteRecent, openness, and mode.
      if (
        typeof data.theta1 === 'number' &&
        typeof data.theta2 === 'number' &&
        typeof data.record === 'boolean' &&
        typeof data.deleteRecent === 'boolean' &&
        typeof data.openness === 'number' &&
        typeof data.mode === 'string'
      ) {
        store.dispatch(
          setThetaData({
            theta1: data.theta1,
            theta2: data.theta2,
            timestamp: Date.now(),
            record: data.record,
            deleteRecent: data.deleteRecent,
            openness: data.openness,
            mode: data.mode,
          })
        );
      } else {
        console.warn("Theta Service: Received invalid theta data", data);
      }
    } catch (err) {
      console.error("Theta Service: Error parsing theta data", err);
    }
  };

  socket.onerror = (error) => {
    console.error("Theta Service: WebSocket error:", error);
  };

  socket.onclose = (event) => {
    console.log("Theta Service: WebSocket closed:", event);
    store.dispatch(setThetaStatus('offline'));
    // Attempt to reconnect after 2 seconds if the headset port hasn't changed and theta is not forced offline.
    reconnectTimeout = setTimeout(() => {
      const configState = store.getState().config;
      if (configState.thetaForcedOffline) {
        console.log("Theta Service: Forced offline - not reconnecting.");
        return;
      }
      const latestPort = configState.headsetPort;
      if (latestPort === currentHeadsetPort) {
        console.log("Theta Service: Reconnecting...");
        connectTheta();
      } else {
        console.log("Theta Service: Headset port changed, not reconnecting on old port.");
      }
    }, 2000);
  };
}

/**
 * Starts the Theta Service by connecting the WebSocket and subscribing to configuration changes.
 *
 * This function initializes the connection using the current headset port from the Redux store,
 * and subscribes to changes so that if the headset port or the forced-offline flag changes,
 * the connection is restarted appropriately.
 */
export function startThetaService() {
  currentHeadsetPort = store.getState().config.headsetPort;
  console.log("Theta Service: Starting with headsetPort:", currentHeadsetPort);
  connectTheta();

  // Subscribe to configuration changes.
  unsubscribe = store.subscribe(() => {
    const configState = store.getState().config;
    const newPort = configState.headsetPort;
    const forcedOffline = configState.thetaForcedOffline;

    // If forced offline is active, close any connection and clear reconnect timeout.
    if (forcedOffline) {
      if (socket) {
        console.log("Theta Service: Forced offline - closing active connection.");
        socket.close();
        socket = null;
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
      return; // Do not attempt to connect.
    }

    // If forced offline is not active, handle headset port changes.
    if (newPort !== currentHeadsetPort) {
      console.log(`Theta Service: Headset port changed from ${currentHeadsetPort} to ${newPort}. Restarting connection.`);
      currentHeadsetPort = newPort;
      if (socket) {
        socket.close();
        socket = null;
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
      if (newPort) {
        connectTheta();
      }
    }

    // If there is no active connection and a valid port is set, attempt to connect.
    if (!socket && newPort) {
      connectTheta();
    }
  });
}