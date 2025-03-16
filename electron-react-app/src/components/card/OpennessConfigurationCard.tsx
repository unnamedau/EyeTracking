// src/components/card/OpennessConfigurationCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import OpennessConfigurationMolecule from '../molecules/OpennessConfigurationMolecule';

const OpennessConfigurationCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="card">
      <div className="card-header text-header-color text-header">
        {t('OpennessConfigurationCard.header')}
      </div>
      <div className="text-normal text-standard-color mb-p5">
        <OpennessConfigurationMolecule />
      </div>
    </div>
  );
};

export default OpennessConfigurationCard;
