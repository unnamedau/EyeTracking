// src/utilities/fileSystemIOHandler.ts

import * as tf from '@tensorflow/tfjs';

/**
 * Returns the directory portion of a file path.
 *
 * This helper function extracts the directory name from a full file path.
 * It works cross-platform by supporting both forward (/) and backward (\) slashes.
 *
 * @param filePath - The full file path.
 * @returns The directory name of the file path.
 */
function getDirname(filePath: string): string {
  const pos = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
  if (pos < 0) return '';
  return filePath.substring(0, pos);
}

/**
 * Joins multiple path segments into a single file path.
 *
 * This helper function concatenates path segments using the appropriate separator.
 * It determines the separator based on whether the first segment contains a backslash.
 * Trailing separator characters are removed from each segment.
 *
 * @param segments - The path segments to join.
 * @returns The joined file path.
 */
function joinPath(...segments: string[]): string {
  const separator = segments[0].includes('\\') ? '\\' : '/';
  // Escape the separator for regex construction.
  const escapedSeparator = separator.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  return segments
    .map(segment => segment.replace(new RegExp(`[${escapedSeparator}]+$`), ''))
    .join(separator);
}

/**
 * Converts a Base64-encoded string into an ArrayBuffer.
 *
 * This utility function decodes a Base64 string and converts it into an ArrayBuffer,
 * which is used to represent binary data such as model weights.
 *
 * @param base64 - The Base64-encoded string.
 * @returns The resulting ArrayBuffer.
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Concatenates an array of ArrayBuffers into a single ArrayBuffer.
 *
 * This function merges multiple ArrayBuffers into one continuous block.
 * It is useful when a model's weight data is split across several files.
 *
 * @param buffers - An array of ArrayBuffers to concatenate.
 * @returns A single ArrayBuffer containing the concatenated data.
 */
function concatArrayBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const temp = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of buffers) {
    temp.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }
  return temp.buffer;
}

/**
 * Creates a custom TensorFlow.js IOHandler to load a model from the local filesystem.
 *
 * This IOHandler reads a TensorFlow.js model JSON file and its corresponding weight files
 * from the local filesystem via a custom Electron API. The files are read as Base64-encoded
 * strings; the handler decodes and concatenates the weight files as needed, returning the
 * model artifacts in the format expected by TensorFlow.js.
 *
 * Assumptions:
 * - The model JSON file conforms to the TensorFlow.js model format.
 * - The weightsManifest in the model JSON contains exactly one group.
 * - File paths are constructed in a cross-platform manner using the helper functions.
 *
 * @param modelJsonPath - The absolute path to the model.json file.
 * @returns An IOHandler compliant with TensorFlow.js's tf.io.IOHandler interface.
 */
export function fileSystemIOHandler(modelJsonPath: string): tf.io.IOHandler {
  return {
    async load() {
      // Read the model JSON file as a Base64-encoded string via the Electron API.
      const modelJsonBase64 = await window.electronAPI.readFile(modelJsonPath);
      // Decode the Base64 string to obtain the JSON text.
      const modelJsonStr = atob(modelJsonBase64);
      // Parse the JSON text into an object.
      const modelJSON = JSON.parse(modelJsonStr);

      // Extract the base directory from the modelJsonPath using a cross-platform helper.
      const baseDir = getDirname(modelJsonPath);
      console.log(`modelJsonPath = ${modelJsonPath}`);
      console.log(`BaseDir = ${baseDir}`);

      // For simplicity, assume the weightsManifest contains only one group.
      const manifestGroup = modelJSON.weightsManifest[0];

      // Load and decode each weight file specified in the manifest.
      const weightBuffers: ArrayBuffer[] = [];
      for (const weightFileName of manifestGroup.paths) {
        // Construct the full path to the weight file.
        const weightFilePath = joinPath(baseDir, weightFileName);
        // Read the weight file as a Base64-encoded string.
        const weightBase64 = await window.electronAPI.readFile(weightFilePath);
        // Convert the Base64 string to an ArrayBuffer.
        const weightBuffer = base64ToArrayBuffer(weightBase64);
        weightBuffers.push(weightBuffer);
      }

      // Concatenate weight buffers if there are multiple files; otherwise, use the single buffer.
      const weightData =
        weightBuffers.length === 1 ? weightBuffers[0] : concatArrayBuffers(weightBuffers);

      // Return the model artifacts in the format expected by TensorFlow.js.
      return {
        modelTopology: modelJSON.modelTopology,
        weightSpecs: manifestGroup.weights,
        weightData: weightData,
      };
    }
  };
}
