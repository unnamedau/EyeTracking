// src/components/atoms/TextInputWithLabel.tsx

/**
 * TextInputWithLabel Component
 *
 * This component renders a text input field accompanied by a label and an optional tooltip.
 * It is designed as a reusable UI element for forms or any interfaces requiring user text input.
 *
 * Props:
 * - label: The text displayed above the input field.
 * - tooltip: (Optional) Text shown on hover over the label to provide additional context.
 * - value: The current value contained within the input field.
 * - placeholder: (Optional) Placeholder text for the input when it is empty.
 * - onChange: A callback function invoked when the input value changes.
 * - onBlur: (Optional) A callback function invoked when the input loses focus.
 */

import React from 'react';

export interface TextInputWithLabelProps {
  /** The label text displayed above the text input field. */
  label: string;
  /** Optional tooltip text shown when hovering over the label. */
  tooltip?: string;
  /** The current text value of the input field. */
  value: string;
  /** Placeholder text for the input field when empty. */
  placeholder?: string;
  /**
   * Callback function invoked when the text input value changes.
   * Receives the change event from the input element.
   */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Optional callback function invoked when the input field loses focus.
   * Receives the focus event from the input element.
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const TextInputWithLabel: React.FC<TextInputWithLabelProps> = ({
  label,
  tooltip,
  value,
  placeholder,
  onChange,
  onBlur,
}) => {
  return (
    <label className="flex-col mb-1">
      <span title={tooltip}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="input text-normal text-standard-color"
        placeholder={placeholder}
      />
    </label>
  );
};

export default TextInputWithLabel;
