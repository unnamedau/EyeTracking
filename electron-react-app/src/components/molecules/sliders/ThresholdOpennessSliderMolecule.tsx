// src/components/molecules/sliders/ThresholdOpennessSliderMolecule.tsx

/**
 * ThresholdOpennessMolecule component
 *
 * A molecule component for the Threshold Openness slider.
 * It retrieves the `kalmanThresholdOpenness` value from Redux and dispatches updates using the
 * `setKalmanThresholdOpenness` action. It renders the `SliderWithLabel` atom.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setKalmanThresholdOpenness } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import SliderWithLabel from '../../atoms/SliderWithLabel';

const ThresholdOpennessMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const kalmanThresholdOpenness = useSelector((state: RootState) => state.config.kalmanThresholdOpenness);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setKalmanThresholdOpenness(Number(e.target.value)));
  };

  return (
    <SliderWithLabel
      label={`${t('KalmanFilterConfigCard.thresholdOpennessLabel')} ${kalmanThresholdOpenness}`}
      tooltip={t('KalmanFilterConfigCard.thresholdOpennessTooltip')}
      value={kalmanThresholdOpenness}
      min={0.01}
      max={0.1}
      step={0.01}
      onChange={handleChange}
    />
  );
};

export default ThresholdOpennessMolecule;
