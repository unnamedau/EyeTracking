// src/components/molecules/StatusCardMolecule.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import StatusIndicator, { StatusType } from '../atoms/StatusIndicator';

/**
 * Object with text labels for each status state.
 * e.g., { good: 'Online', bad: 'Offline', forced: 'Forced Offline' }
 */
interface StateLabels {
  good: string;
  bad: string;
  forced: string;
}

interface StatusCardMoleculeProps {
  label: string;
  status: StatusType;
  stateLabels: StateLabels;
}

const StatusCardMolecule: React.FC<StatusCardMoleculeProps> = ({
  label,
  status,
  stateLabels,
}) => {

  // Determine which status text to display
  const statusText =
    status === 'good'
      ? stateLabels.good
      : status === 'bad'
      ? stateLabels.bad
      : stateLabels.forced;

  return (
    <StatusIndicator
      label={label}
      status={status}
      statusText={statusText.toUpperCase()}
    />
  );
};

export default StatusCardMolecule;
