// src/components/atoms/ButtonAtom.tsx

/**
 * ButtonAtom Component
 *
 * A simple, reusable button component that renders a native HTML button element.
 * This component is designed for use as an atomic UI component within a design system.
 * 
 * It accepts the following properties:
 * - text: The label text displayed on the button.
 * - onClick: A callback function triggered when the button is clicked.
 * - className: Additional CSS class names for custom styling.
 * - disabled: A flag that, when true, disables the button.
 *
 * @component
 */

import React from 'react';

export interface ButtonAtomProps {
  /** 
   * The text displayed on the button.
   */
  text: string;

  /**
   * Callback function to handle click events on the button.
   */
  onClick: () => void;

  /**
   * Optional additional CSS classes for custom styling.
   */
  className?: string;

  /**
   * Optional flag to disable the button.
   */
  disabled?: boolean;
}

const ButtonAtom: React.FC<ButtonAtomProps> = ({
  text,
  onClick,
  className = '',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn ${className}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default ButtonAtom;
