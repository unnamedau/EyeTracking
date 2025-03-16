// src/components/card/LeftEyeStatusCard.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import StatusCard from './StatusCard';
import { StatusType } from '../atoms/StatusIndicator';
import { toggleLeftEyeForcedOffline } from '../../slices/configSlice';

const LeftEyeStatusCard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const leftStatus = useSelector((state: RootState) => state.status.imageData.leftEye.status);
  const leftForced = useSelector((state: RootState) => state.config.leftEyeForcedOffline);

  const mapStatus = (
    connStatus: 'online' | 'warning' | 'offline',
    forced: boolean = false
  ): StatusType => {
    if (forced) return 'forced';
    return connStatus === 'online' ? 'good' : 'bad';
  };

  return (
    <StatusCard
      label={t('LeftEyeStatusCard.label')}
      status={mapStatus(leftStatus, leftForced)}
      stateLabels={{
        good: t('LeftEyeStatusCard.stateLabels.good'),
        bad: t('LeftEyeStatusCard.stateLabels.bad'),
        forced: t('LeftEyeStatusCard.stateLabels.forced'),
      }}
      forcedOutlineColor="red"
      onForcedToggle={() => dispatch(toggleLeftEyeForcedOffline())}
    />
  );
};

export default LeftEyeStatusCard;
