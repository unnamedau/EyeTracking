// src/components/card/EyeTrackingStatusCard.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import StatusCard from './StatusCard';
import { StatusType } from '../atoms/StatusIndicator';
import { toggleTrackingForcedOffline } from '../../slices/configSlice';

const EyeTrackingStatusCard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const trackingValid = useSelector((state: RootState) => state.config.trackingConfigValidity);
  const trackingForced = useSelector((state: RootState) => state.config.trackingForcedOffline);

  const mapStatus = (isValid: boolean, forced: boolean): StatusType => {
    if (forced) return 'forced';
    return isValid ? 'good' : 'bad';
  };

  return (
    <StatusCard
      label={t('EyeTrackingStatusCard.label')}
      status={mapStatus(trackingValid, trackingForced)}
      stateLabels={{
        good: t('EyeTrackingStatusCard.stateLabels.good'),
        bad: t('EyeTrackingStatusCard.stateLabels.bad'),
        forced: t('EyeTrackingStatusCard.stateLabels.forced'),
      }}
      forcedOutlineColor="red"
      onForcedToggle={() => dispatch(toggleTrackingForcedOffline())}
    />
  );
};

export default EyeTrackingStatusCard;
