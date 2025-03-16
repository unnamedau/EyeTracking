// src/components/atoms/CheckboxWithLabel.tsx

/**
 * CheckboxWithLabel Component
 *
 * This component renders a reusable checkbox accompanied by a text label and an optional tooltip.
 * It is designed as an atomic UI element to be used in larger forms or settings where binary input is required.
 *
 * Props:
 * - label: The text to display next to the checkbox.
 * - tooltip: (Optional) Tooltip text that appears when hovering over the label.
 * - checked: A boolean indicating whether the checkbox is selected.
 * - onChange: A callback function triggered when the checkbox state changes.
 */

import React from 'react';

export interface CheckboxWithLabelProps {
  /** The text label displayed next to the checkbox. */
  label: string;
  /** Optional tooltip text shown when hovering over the label. */
  tooltip?: string;
  /** Boolean flag indicating whether the checkbox is checked. */
  checked: boolean;
  /**
   * Callback function invoked when the checkbox state changes.
   * @param e - The change event from the checkbox input.
   */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({
  label,
  tooltip,
  checked,
  onChange,
}) => {
  return (
    <div className="flex-label text-bold" title={tooltip}>
      <label>{label}</label>
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="toggle-slider" />
      </label>
    </div>
  );
};

export default CheckboxWithLabel;
