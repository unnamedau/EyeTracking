// src/utilities/NormalizationUtils.ts

/**
 * Provides utility methods for normalizing raw theta (angle) values.
 *
 * The normalization process scales raw angle values between 0 and 1 (or -1 and 0 for negative values)
 * based on the largest positive and negative values seen so far. This dynamic (or online) normalization
 * ensures that outputs remain consistent even as new extreme values are encountered.
 *
 * The normalization values (maxima) are stored as static properties, so they persist between calls.
 * Use `resetNormalization()` to clear the stored maxima when needed.
 */
export class NormalizationUtils {
  // Static properties storing the largest positive and negative theta values encountered.
  static maxPosTheta1: number = 0;
  static maxNegTheta1: number = 0;
  static maxPosTheta2: number = 0;
  static maxNegTheta2: number = 0;

  /**
   * Normalizes a theta1 value based on the maximum positive and negative theta1 values seen so far.
   *
   * For non-negative input values, the raw value is divided by the current maximum positive value.
   * For negative inputs, the raw value is divided by the absolute value of the current maximum negative value.
   *
   * @param deg - The raw theta1 value (in degrees).
   * @returns The normalized theta1 value, scaled between 0 and 1 (or 0 and -1 for negatives).
   */
  static normalizeTheta1(deg: number): number {
    if (deg >= 0) {
      if (deg > NormalizationUtils.maxPosTheta1) {
        NormalizationUtils.maxPosTheta1 = deg;
      }
      return NormalizationUtils.maxPosTheta1 === 0
        ? 0
        : deg / NormalizationUtils.maxPosTheta1;
    } else {
      if (deg < NormalizationUtils.maxNegTheta1) {
        NormalizationUtils.maxNegTheta1 = deg;
      }
      return NormalizationUtils.maxNegTheta1 === 0
        ? 0
        : deg / Math.abs(NormalizationUtils.maxNegTheta1);
    }
  }

  /**
   * Normalizes a theta2 value based on the maximum positive and negative theta2 values seen so far.
   *
   * For non-negative input values, the raw value is divided by the current maximum positive value.
   * For negative inputs, the raw value is divided by the absolute value of the current maximum negative value.
   *
   * @param deg - The raw theta2 value (in degrees).
   * @returns The normalized theta2 value, scaled between 0 and 1 (or 0 and -1 for negatives).
   */
  static normalizeTheta2(deg: number): number {
    if (deg >= 0) {
      if (deg > NormalizationUtils.maxPosTheta2) {
        NormalizationUtils.maxPosTheta2 = deg;
      }
      return NormalizationUtils.maxPosTheta2 === 0
        ? 0
        : deg / NormalizationUtils.maxPosTheta2;
    } else {
      if (deg < NormalizationUtils.maxNegTheta2) {
        NormalizationUtils.maxNegTheta2 = deg;
      }
      return NormalizationUtils.maxNegTheta2 === 0
        ? 0
        : deg / Math.abs(NormalizationUtils.maxNegTheta2);
    }
  }

  /**
   * Resets all normalization values for theta1 and theta2 to zero.
   *
   * This method is useful when you want to start a fresh normalization process,
   * such as when processing a new data stream or after a significant context change.
   */
  static resetNormalization(): void {
    NormalizationUtils.maxPosTheta1 = 0;
    NormalizationUtils.maxNegTheta1 = 0;
    NormalizationUtils.maxPosTheta2 = 0;
    NormalizationUtils.maxNegTheta2 = 0;
  }
}
