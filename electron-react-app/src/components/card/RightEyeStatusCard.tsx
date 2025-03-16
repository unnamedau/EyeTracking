// src/components/card/RightEyeStatusCard.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import StatusCard from './StatusCard';
import { StatusType } from '../atoms/StatusIndicator';
import { toggleRightEyeForcedOffline } from '../../slices/configSlice';

const RightEyeStatusCard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rightStatus = useSelector((state: RootState) => state.status.imageData.rightEye.status);
  const rightForced = useSelector((state: RootState) => state.config.rightEyeForcedOffline);

  const mapStatus = (
    connStatus: 'online' | 'warning' | 'offline',
    forced: boolean = false
  ): StatusType => {
    if (forced) return 'forced';
    return connStatus === 'online' ? 'good' : 'bad';
  };

  return (
    <StatusCard
      label={t('RightEyeStatusCard.label')}
      status={mapStatus(rightStatus, rightForced)}
      stateLabels={{
        good: t('RightEyeStatusCard.stateLabels.good'),
        bad: t('RightEyeStatusCard.stateLabels.bad'),
        forced: t('RightEyeStatusCard.stateLabels.forced'),
      }}
      forcedOutlineColor="red"
      onForcedToggle={() => dispatch(toggleRightEyeForcedOffline())}
    />
  );
};

export default RightEyeStatusCard;
