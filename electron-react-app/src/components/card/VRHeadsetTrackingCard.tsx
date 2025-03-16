// src/components/card/VRHeadsetTrackingCard.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import StatusCard from './StatusCard';
import { StatusType } from '../atoms/StatusIndicator';
import { toggleThetaForcedOffline } from '../../slices/configSlice';

const ThetaStatusCard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const thetaStatus = useSelector((state: RootState) => state.status.theta.status);
  const thetaForced = useSelector((state: RootState) => state.config.thetaForcedOffline);

  const mapStatus = (
    connStatus: 'online' | 'warning' | 'offline',
    forced: boolean = false
  ): StatusType => {
    if (forced) return 'forced';
    return connStatus === 'online' ? 'good' : 'bad';
  };

  return (
    <StatusCard
      label={t('ThetaStatusCard.label')}
      status={mapStatus(thetaStatus, thetaForced)}
      stateLabels={{
        good: t('ThetaStatusCard.stateLabels.good'),
        bad: t('ThetaStatusCard.stateLabels.bad'),
        forced: t('ThetaStatusCard.stateLabels.forced'),
      }}
      forcedOutlineColor="red"
      onForcedToggle={() => dispatch(toggleThetaForcedOffline())}
    />
  );
};

export default ThetaStatusCard;
