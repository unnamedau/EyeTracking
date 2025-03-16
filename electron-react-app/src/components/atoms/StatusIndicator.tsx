// src/components/atoms/StatusIndicator.tsx

/**
 * StatusIndicator Component
 *
 * This component renders a status indicator that visually displays a status
 * using a colored dot, a label, and a status description. It is designed as an atomic
 * UI element for inclusion in larger components or pages.
 *
 * The component accepts the following properties:
 * - label: The text label representing the item or context.
 * - status: The status value which can be 'good', 'bad', or 'forced'. This value
 *           determines the color of the indicator dot.
 * - statusText: The descriptive text corresponding to the status (e.g., "Online",
 *               "Offline", "Forced Offline").
 * - tooltip: An optional tooltip text that appears when hovering over the component.
 *
 * The dot color is determined by the status:
 * - For 'good', it uses the CSS variable "--color-status-dot-good".
 * - For 'bad' or 'forced', it uses the CSS variable "--color-status-dot-bad".
 */

import React from 'react';

export type StatusType = 'good' | 'bad' | 'forced';

export interface StatusIndicatorProps {
  /** The label (e.g. the card title or name). */
  label: string;
  /** The status (good, bad, or forced). */
  status: StatusType;
  /** The text to show for the status (e.g. "Online", "Offline", "Forced Offline"). */
  statusText: string;
  /** Optional tooltip text (e.g. helpful info on hover). */
  tooltip?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  label,
  status,
  statusText,
  tooltip,
}) => {
  const dotColorVar =
    status === 'good'
      ? 'var(--color-status-dot-good)'
      : 'var(--color-status-dot-bad)';

  const inlineStyles: React.CSSProperties = {
    backgroundColor: dotColorVar,
  };

  return (
    <div className="flex-label" title={tooltip}>
      <div className="indicator-dot mr-1" style={inlineStyles} />
      <div className="flex-col">
        <span className="text-header text-bold">{label}</span>
        <span className="text-header">{statusText}</span>
      </div>
    </div>
  );
};

export default StatusIndicator;
