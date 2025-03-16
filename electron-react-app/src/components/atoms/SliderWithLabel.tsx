// src/components/atoms/SliderWithLabel.tsx

/**
 * SliderWithLabel Component
 *
 * This component renders a reusable range slider with a text label and an optional tooltip.
 * It is designed as a basic UI element ("atom") for inclusion in forms or settings panels.
 *
 * The component consists of:
 * 1. A text label (with an optional tooltip) displayed above the slider.
 * 2. A range input (slider) that allows users to select a numeric value between defined minimum and maximum values.
 *
 * Props:
 * - label: The text displayed above the slider.
 * - tooltip: (Optional) Additional information shown as a tooltip on hover.
 * - value: The current numeric value of the slider.
 * - min: The minimum allowed value for the slider.
 * - max: The maximum allowed value for the slider.
 * - step: The step increment for value changes.
 * - onChange: A callback function invoked when the slider value changes.
 */

import React from 'react';

export interface SliderWithLabelProps {
  /** The text label displayed above the slider. */
  label: string;
  /** Optional tooltip text shown when hovering over the label. */
  tooltip?: string;
  /** The current numeric value of the slider. */
  value: number;
  /** The minimum allowed value for the slider. */
  min: number;
  /** The maximum allowed value for the slider. */
  max: number;
  /** The step increment for slider value changes. */
  step: number;
  /**
   * Event handler triggered when the slider value changes.
   * @param e The change event from the slider input.
   */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SliderWithLabel: React.FC<SliderWithLabelProps> = ({
  label,
  tooltip,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  return (
    <label className="flex-col mt-p5">
      {/* Render the label text with an optional tooltip */}
      <span className="mb-1" title={tooltip}>
        {label}
      </span>
      {/* Render the slider input */}
      <input
        type="range"
        min={min.toString()}
        max={max.toString()}
        step={step.toString()}
        value={value}
        onChange={onChange}
        className="range mb-p5"
      />
    </label>
  );
};

export default SliderWithLabel;
