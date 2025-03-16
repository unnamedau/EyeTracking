// src/components/card/ThetaFlagsCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import ThetaFlagsMolecule from '../molecules/ThetaFlagsMolecule';

const ThetaFlagsCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="card">
      <div className="card-header text-header-color text-header">
        <span className="status-title">{t('ThetaFlagsCard.header')}</span>
      </div>
      <ThetaFlagsMolecule />
    </div>
  );
};

export default ThetaFlagsCard;
