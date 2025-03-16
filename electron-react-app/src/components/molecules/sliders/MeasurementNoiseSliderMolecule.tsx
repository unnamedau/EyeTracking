// src/components/molecules/sliders/MeasurementNoiseSliderMolecule.tsx

/**
 * MeasurementNoiseMolecule component
 *
 * A molecule component for the Measurement Noise (R) slider.
 * It selects the `measurementNoise` value from Redux and dispatches updates using the
 * `setMeasurementNoise` action. It renders the `SliderWithLabel` atom.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setMeasurementNoise } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import SliderWithLabel from '../../atoms/SliderWithLabel';

const MeasurementNoiseMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const measurementNoise = useSelector((state: RootState) => state.config.measurementNoise);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMeasurementNoise(Number(e.target.value)));
  };

  return (
    <SliderWithLabel
      label={`${t('KalmanFilterConfigCard.measurementNoiseLabel')} ${measurementNoise}`}
      tooltip={t('KalmanFilterConfigCard.measurementNoiseTooltip')}
      value={measurementNoise}
      min={2}
      max={8}
      step={0.1}
      onChange={handleChange}
    />
  );
};

export default MeasurementNoiseMolecule;
