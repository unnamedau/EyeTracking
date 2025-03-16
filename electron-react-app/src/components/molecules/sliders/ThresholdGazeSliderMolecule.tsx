// src/components/molecules/sliders/ThresholdGazeSliderMolecule.tsx

/**
 * ThresholdGazeMolecule component
 *
 * A molecule component for the Threshold Gaze slider.
 * It retrieves the `kalmanThreshold` value from Redux and dispatches updates using the
 * `setKalmanThreshold` action. It renders the `SliderWithLabel` atom.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setKalmanThreshold } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import SliderWithLabel from '../../atoms/SliderWithLabel';

const ThresholdGazeMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const kalmanThreshold = useSelector((state: RootState) => state.config.kalmanThreshold);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setKalmanThreshold(Number(e.target.value)));
  };

  return (
    <SliderWithLabel
      label={`${t('KalmanFilterConfigCard.thresholdGazeLabel')} ${kalmanThreshold}`}
      tooltip={t('KalmanFilterConfigCard.thresholdGazeTooltip')}
      value={kalmanThreshold}
      min={1}
      max={4}
      step={0.1}
      onChange={handleChange}
    />
  );
};

export default ThresholdGazeMolecule;
