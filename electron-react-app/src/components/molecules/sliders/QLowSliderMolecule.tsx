// src/components/molecules/sliders/QLowSliderMolecule.tsx

/**
 * QLowMolecule component
 *
 * A molecule component for the Q_low slider.
 * It retrieves the `kalmanQLow` value from Redux and dispatches updates using the
 * `setKalmanQLow` action. It renders the `SliderWithLabel` atom.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setKalmanQLow } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import SliderWithLabel from '../../atoms/SliderWithLabel';

const QLowMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const kalmanQLow = useSelector((state: RootState) => state.config.kalmanQLow);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setKalmanQLow(Number(e.target.value)));
  };

  return (
    <SliderWithLabel
      label={`${t('KalmanFilterConfigCard.qLowLabel')} ${kalmanQLow}`}
      tooltip={t('KalmanFilterConfigCard.qLowTooltip')}
      value={kalmanQLow}
      min={0.001}
      max={0.1}
      step={0.001}
      onChange={handleChange}
    />
  );
};

export default QLowMolecule;
