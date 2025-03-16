// src/components/card/HeadsetTrackingCard.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import HeadsetTrackingMolecule from '../molecules/HeadsetTrackingMolecule';

const HeadsetTrackingCard: React.FC = () => {
  const { t } = useTranslation();
  const theta = useSelector((state: RootState) => state.status.theta);

  return (
    <div className="card" title={t('HeadsetTrackingCard.title')}>
      <div className="card-header text-header-color text-header">
        <span className="status-title">{t('HeadsetTrackingCard.heading')}</span>
      </div>
      <HeadsetTrackingMolecule theta={theta} />
    </div>
  );
};

export default HeadsetTrackingCard;
