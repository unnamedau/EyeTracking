// src/components/card/StatusCard.tsx

/**
 * This card is also sort of a molecule at the same time. It is in cards because
 * it felt better placing it there, but note it is still a generic.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import StatusCardMolecule from '../molecules/StatusCardMolecule';
import { StatusType } from '../atoms/StatusIndicator';

/**
 * Object with text labels for each status state.
 * e.g., { good: 'Online', bad: 'Offline', forced: 'Forced Offline' }
 */
interface StateLabels {
  good: string;
  bad: string;
  forced: string;
}

interface StatusCardProps {
  label: string;
  status: StatusType;
  stateLabels: StateLabels;
  /**
   * Optional outline color when in forced state.
   * Defaults to blue if not provided.
   */
  forcedOutlineColor?: string;
  /**
   * Optional click callback to toggle the forced state.
   * If provided, the entire card becomes clickable.
   */
  onForcedToggle?: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
  label,
  status,
  stateLabels,
  forcedOutlineColor = 'blue',
  onForcedToggle,
}) => {
  const { t } = useTranslation();

  // If the status is forced, we set a forced class for styling.
  const forcedClass = status === 'forced' ? 'card--forced' : '';
  // If onForcedToggle exists, the card is clickable.
  const clickableClass = onForcedToggle ? 'card--clickable' : '';

  // CSS variables for dynamic forced color
  const cssVars = {
    '--forced-outline-color': forcedOutlineColor,
  } as React.CSSProperties;

  // Add a hover title if the card is clickable
  const titleText = onForcedToggle
    ? status === 'forced'
      ? t('StatusCard.clickToRemoveForcedOffline')
      : t('StatusCard.clickToForceOffline')
    : undefined;

  return (
    <div
      className={`card ${forcedClass} ${clickableClass}`}
      style={cssVars}
      onClick={onForcedToggle}
      title={titleText}
    >
      <div className="text-header-color text-header">
        <StatusCardMolecule
          label={label}
          status={status}
          stateLabels={stateLabels}
        />
      </div>
    </div>
  );
};

export default StatusCard;
