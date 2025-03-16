// src/components/card/GazeDataCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import TrackingDataMolecule from '../molecules/TrackingDataMolecule';

const TrackingDataCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="card flex-1">
      <div className="card-header text-header-color text-header">
        <span>{t('TrackingDataCard.header')}</span>
      </div>
      <div className="text-normal text-standard-color">
        <TrackingDataMolecule />
      </div>
    </div>
  );
};

export default TrackingDataCard;
