// src/utilities/AdaptiveKalmanFilter.ts

/**
 * AdaptiveKalmanFilter implements an adaptive Kalman filter that dynamically adjusts its
 * process noise based on the magnitude of change between the current state estimate and 
 * incoming measurements. This approach is particularly useful in systems where sudden 
 * changes may occur, requiring the filter to be more responsive.
 *
 * Key concepts:
 * - The filter maintains an estimated state and its error covariance.
 * - It uses two different process noise covariances:
 *    • A lower covariance for small, gradual changes.
 *    • A higher covariance for large, abrupt changes, determined by a specified threshold.
 * - The measurement noise variance is adapted based on a trust value provided with each measurement.
 *   - A trust value of 0 treats the measurement as completely untrusted (infinite noise).
 *   - Trust values between 0 and 0.75 interpolate the effective noise from a maximum value down to the base noise.
 *   - Trust values 0.75 and above treat the measurement as fully trusted.
 *
 * Usage:
 *   const filter = new AdaptiveKalmanFilter(initialState, initialErrorCovariance, measurementNoise,
 *                                             processNoiseSmall, processNoiseLarge, changeThreshold);
 *   const filteredState = filter.update(newMeasurement, trustValue);
 */
export class AdaptiveKalmanFilter {
  /**
   * Current estimated state (in degrees).
   */
  private stateEstimate: number;

  /**
   * Current estimation error covariance.
   */
  private errorCovariance: number;

  /**
   * Base measurement noise variance.
   */
  private measurementNoiseVariance: number;

  /**
   * Process noise covariance for small (gradual) changes.
   */
  private processNoiseSmall: number;

  /**
   * Process noise covariance for large (abrupt) changes.
   */
  private processNoiseLarge: number;

  /**
   * Threshold (in degrees) to decide whether the change is considered large.
   */
  private changeThreshold: number;

  /**
   * Maximum interpolation factor used to scale the measurement noise when trust is low.
   * A higher factor implies that measurements with low trust are treated as significantly noisier.
   */
  private maxInterpolationFactor: number = 20;

  /**
   * Creates an instance of AdaptiveKalmanFilter.
   *
   * @param initialState - The initial state estimate (in degrees).
   * @param initialErrorCovariance - The initial estimation error covariance.
   * @param measurementNoise - The base measurement noise variance.
   * @param processNoiseSmall - Process noise covariance when changes are small.
   * @param processNoiseLarge - Process noise covariance when a large change is detected.
   * @param changeThreshold - Threshold (in degrees) to differentiate small vs. large changes.
   */
  constructor(
    initialState: number,
    initialErrorCovariance: number,
    measurementNoise: number,
    processNoiseSmall: number,
    processNoiseLarge: number,
    changeThreshold: number
  ) {
    this.stateEstimate = initialState;
    this.errorCovariance = initialErrorCovariance;
    this.measurementNoiseVariance = measurementNoise;
    this.processNoiseSmall = processNoiseSmall;
    this.processNoiseLarge = processNoiseLarge;
    this.changeThreshold = changeThreshold;
  }

  /**
   * Updates the Kalman filter with a new measurement.
   *
   * This method adjusts the effective measurement noise based on the provided trust value.
   * Measurements with a trust value of 0 are treated as completely untrusted (infinite noise),
   * while those with a trust value between 0 and 0.75 have their effective noise interpolated
   * between (maxInterpolationFactor × base noise) and the base measurement noise.
   * Measurements with trust 0.75 or above use the base measurement noise.
   *
   * The process noise covariance is chosen based on whether the absolute difference between the
   * new measurement and the current state estimate exceeds the change threshold.
   *
   * @param measurement - The new measurement (in degrees).
   * @param trust - The trust rating for the measurement, in the range [0, 1]. Values outside this
   *                range are clamped. Defaults to 1 (fully trusted) if not provided.
   * @returns The updated state estimate.
   */
  public update(measurement: number, trust: number = 1): number {
    // Clamp the trust value to the [0, 1] range.
    const clampedTrust = Math.max(0, Math.min(trust, 1));

    let effectiveMeasurementNoise: number;
    if (clampedTrust === 0) {
      // Completely untrusted measurement: treat as infinite noise.
      effectiveMeasurementNoise = Number.POSITIVE_INFINITY;
    } else if (clampedTrust < 0.75) {
      // For trust values below 0.75, linearly interpolate the effective measurement noise.
      // At trust = 0: noise is maxInterpolationFactor × measurementNoiseVariance.
      // At trust = 0.75: noise is the base measurementNoiseVariance.
      const factor =
        this.maxInterpolationFactor -
        ((this.maxInterpolationFactor - 1) / 0.75) * clampedTrust;
      effectiveMeasurementNoise = this.measurementNoiseVariance * factor;
    } else {
      // Fully trusted measurement: use the base measurement noise.
      effectiveMeasurementNoise = this.measurementNoiseVariance;
    }

    // Determine the process noise covariance based on the measurement difference.
    const measurementDifference = Math.abs(measurement - this.stateEstimate);
    const processNoise =
      measurementDifference > this.changeThreshold
        ? this.processNoiseLarge
        : this.processNoiseSmall;

    // Prediction step (assuming a constant state model).
    const predictedState = this.stateEstimate;
    const predictedErrorCovariance = this.errorCovariance + processNoise;

    // Compute the Kalman gain using the predicted error covariance and the effective measurement noise.
    const kalmanGain =
      predictedErrorCovariance / (predictedErrorCovariance + effectiveMeasurementNoise);

    // Update step: refine the state estimate and error covariance using the new measurement.
    this.stateEstimate = predictedState + kalmanGain * (measurement - predictedState);
    this.errorCovariance = (1 - kalmanGain) * predictedErrorCovariance;

    return this.stateEstimate;
  }
}
