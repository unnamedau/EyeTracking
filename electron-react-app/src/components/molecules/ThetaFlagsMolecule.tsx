// src/components/molecules/ThetaFlagsMolecule.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useTranslation } from 'react-i18next';

const ThetaFlagsMolecule: React.FC = () => {
  const { t } = useTranslation();
  const theta = useSelector((state: RootState) => state.status.theta);

  return (
    <div className="text-header text-standard-color text-mono text-center">
      <p>
        {t('ThetaFlagsCard.recordLabel')}{' '}
        {theta.record ? t('common.true') : t('common.false')}
      </p>
      <p>
        {t('ThetaFlagsCard.deleteRecentLabel')}{' '}
        {theta.deleteRecent ? t('common.true') : t('common.false')}
      </p>
      <p>
        {t('ThetaFlagsCard.opennessLabel')}{' '}
        {theta.openness}
      </p>
      <p>
        {t('ThetaFlagsCard.modeLabel')}{' '}
        {theta.mode}
      </p>
    </div>
  );
};

export default ThetaFlagsMolecule;
