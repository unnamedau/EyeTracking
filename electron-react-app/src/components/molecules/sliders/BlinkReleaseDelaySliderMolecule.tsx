// src/components/molecules/sliders/BlinkReleaseDelaySliderMolecule.tsx

/**
 * BlinkReleaseDelayMolecule component
 *
 * A molecule component for controlling the blink release delay.
 * It obtains the blinkReleaseDelayMs value from Redux and dispatches updates using
 * the setBlinkReleaseDelayMs action. It renders a SliderWithLabel atom with an additional tooltip.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setBlinkReleaseDelayMs } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import SliderWithLabel from '../../atoms/SliderWithLabel';

const BlinkReleaseDelayMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const blinkReleaseDelayMs = useSelector((state: RootState) => state.config.blinkReleaseDelayMs);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBlinkReleaseDelayMs(Number(e.target.value)));
  };

  return (
    <SliderWithLabel
      label={`${t('KalmanFilterConfigCard.blinkReleaseDelayLabel')} ${blinkReleaseDelayMs} ms`}
      tooltip={t('KalmanFilterConfigCard.blinkReleaseDelayTooltip')}
      value={blinkReleaseDelayMs}
      min={0}
      max={100}
      step={1}
      onChange={handleChange}
    />
  );
};

export default BlinkReleaseDelayMolecule;
