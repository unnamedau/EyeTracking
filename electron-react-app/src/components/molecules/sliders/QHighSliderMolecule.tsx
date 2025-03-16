// src/components/molecules/sliders/QHighSliderMolecule.tsx

/**
 * QHighMolecule component
 *
 * A molecule component for the Q_high slider.
 * It selects the `kalmanQHigh` value from Redux and dispatches updates using the
 * `setKalmanQHigh` action. It renders the `SliderWithLabel` atom.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setKalmanQHigh } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import SliderWithLabel from '../../atoms/SliderWithLabel';

const QHighMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const kalmanQHigh = useSelector((state: RootState) => state.config.kalmanQHigh);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setKalmanQHigh(Number(e.target.value)));
  };

  return (
    <SliderWithLabel
      label={`${t('KalmanFilterConfigCard.qHighLabel')} ${kalmanQHigh}`}
      tooltip={t('KalmanFilterConfigCard.qHighTooltip')}
      value={kalmanQHigh}
      min={1}
      max={100}
      step={1}
      onChange={handleChange}
    />
  );
};

export default QHighMolecule;
