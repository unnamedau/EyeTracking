// src\components\card\AdaptiveKalmanFilterConfigurationCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import MeasurementNoiseMolecule from '../molecules/sliders/MeasurementNoiseSliderMolecule';
import QLowMolecule from '../molecules/sliders/QLowSliderMolecule';
import QHighMolecule from '../molecules/sliders/QHighSliderMolecule';
import ThresholdGazeMolecule from '../molecules/sliders/ThresholdGazeSliderMolecule';
import ThresholdOpennessMolecule from '../molecules/sliders/ThresholdOpennessSliderMolecule';
import SmoothEyesMolecule from '../molecules/checkboxes/SmoothEyesCheckboxMolecule';
import SmoothOpennessMolecule from '../molecules/checkboxes/SmoothOpennessCheckboxMolecule';
import OpennessBasedTrustMolecule from '../molecules/checkboxes/OpennessBasedTrustCheckboxMolecule';

const KalmanFilterConfigCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="card">
      <div className="card-header text-header-color text-header">
        <span className="status-title">{t('KalmanFilterConfigCard.header')}</span>
      </div>
      <div className="text-normal text-standard-color">
        <div className="kalman-filter-grid mb-1">
          <div className="grid-column">
            <SmoothEyesMolecule />
            <SmoothOpennessMolecule />
          </div>
          <div className="grid-column">
            <OpennessBasedTrustMolecule />
          </div>
        </div>

        <MeasurementNoiseMolecule />
        <QLowMolecule />
        <QHighMolecule />
        <ThresholdGazeMolecule />
        <ThresholdOpennessMolecule />
      </div>
    </div>
  );
};

export default KalmanFilterConfigCard;
