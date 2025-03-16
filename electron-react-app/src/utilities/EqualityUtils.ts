// src/utilities/equalityUtils.ts

/**
 * Utility class for comparing floating point values in objects with tolerance.
 *
 * This class provides helper methods to compare properties of objects that represent
 * different types of measurements (e.g., angles and openness values). Each comparison
 * uses a fixed tolerance to account for the imprecision of floating point arithmetic.
 */
export class EqualityUtils {
  /**
   * Tolerance used for floating point comparisons.
   */
  private static readonly EPSILON: number = 0.001;

  /**
   * Determines if two objects with combined theta measurements are equal.
   *
   * This method compares the `theta1` and `theta2` properties of both objects.
   * If the absolute difference for each property is less than EPSILON, the objects are
   * considered equal.
   *
   * @param a - Object containing `theta1` and `theta2` values.
   * @param b - Object containing `theta1` and `theta2` values.
   * @returns True if both theta values in the objects differ by less than EPSILON; otherwise, false.
   */
  static isEqualCombinedThetas(
    a: { theta1: number; theta2: number },
    b: { theta1: number; theta2: number }
  ): boolean {
    return (
      Math.abs(a.theta1 - b.theta1) < EqualityUtils.EPSILON &&
      Math.abs(a.theta2 - b.theta2) < EqualityUtils.EPSILON
    );
  }

  /**
   * Determines if two objects with independent left and right theta measurements are equal.
   *
   * This method compares the left and right theta properties (`leftTheta1`, `leftTheta2`,
   * `rightTheta1`, and `rightTheta2`) of both objects. Each corresponding property is compared
   * using the EPSILON tolerance.
   *
   * @param a - Object containing left and right theta values.
   * @param b - Object containing left and right theta values.
   * @returns True if all corresponding theta values differ by less than EPSILON; otherwise, false.
   */
  static isEqualIndThetas(
    a: { leftTheta1: number; leftTheta2: number; rightTheta1: number; rightTheta2: number },
    b: { leftTheta1: number; leftTheta2: number; rightTheta1: number; rightTheta2: number }
  ): boolean {
    return (
      Math.abs(a.leftTheta1 - b.leftTheta1) < EqualityUtils.EPSILON &&
      Math.abs(a.leftTheta2 - b.leftTheta2) < EqualityUtils.EPSILON &&
      Math.abs(a.rightTheta1 - b.rightTheta1) < EqualityUtils.EPSILON &&
      Math.abs(a.rightTheta2 - b.rightTheta2) < EqualityUtils.EPSILON
    );
  }

  /**
   * Determines if two objects with openness measurements are equal.
   *
   * This method compares the `leftOpenness` and `rightOpenness` properties of both objects.
   * The objects are considered equal if the absolute differences for both properties are
   * less than EPSILON.
   *
   * @param a - Object containing `leftOpenness` and `rightOpenness` values.
   * @param b - Object containing `leftOpenness` and `rightOpenness` values.
   * @returns True if both openness values differ by less than EPSILON; otherwise, false.
   */
  static isEqualOpenness(
    a: { leftOpenness: number; rightOpenness: number },
    b: { leftOpenness: number; rightOpenness: number }
  ): boolean {
    return (
      Math.abs(a.leftOpenness - b.leftOpenness) < EqualityUtils.EPSILON &&
      Math.abs(a.rightOpenness - b.rightOpenness) < EqualityUtils.EPSILON
    );
  }
}
