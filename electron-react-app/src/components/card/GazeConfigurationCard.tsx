// src/components/card/GazeConfigurationCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import VerticalExaggerationMolecule from '../molecules/sliders/VerticalExaggerationSliderMolecule';
import HorizontalExaggerationMolecule from '../molecules/sliders/HorizontalExaggerationSliderMolecule';
import PitchOffsetMolecule from '../molecules/sliders/PitchOffsetSliderMolecule';
import BlinkReleaseDelayMolecule from '../molecules/sliders/BlinkReleaseDelaySliderMolecule';
import TrackingRateMolecule from '../molecules/sliders/TrackingRateSliderMolecule';

const GazeConfigurationCard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="card flex-1">
      <div className="card-header text-header-color text-header">
        <span>{t('TrackingConfigurationCard.header')}</span>
      </div>
      <div className="text-normal text-standard-color text-left">
        <VerticalExaggerationMolecule />
        <HorizontalExaggerationMolecule />
        <PitchOffsetMolecule />
        <BlinkReleaseDelayMolecule />
        <TrackingRateMolecule />
      </div>
    </div>
  );
};

export default GazeConfigurationCard;
