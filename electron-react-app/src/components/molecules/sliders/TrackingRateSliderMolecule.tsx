// src/components/molecules/sliders/TrackingRateSliderMolecule.tsx

/**
 * TrackingRateMolecule component
 *
 * A molecule component for controlling the tracking rate.
 * It selects the trackingRate value from Redux and dispatches changes using
 * the setTrackingRate action. It leverages the SliderWithLabel atom.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setTrackingRate } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import SliderWithLabel from '../../atoms/SliderWithLabel';

const TrackingRateMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const trackingRate = useSelector((state: RootState) => state.config.trackingRate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTrackingRate(Number(e.target.value)));
  };

  return (
    <SliderWithLabel
      label={t('StartTrackingCard.trackingRateLabel', { rate: trackingRate })}
      value={trackingRate}
      min={10}
      max={100}
      step={1}
      onChange={handleChange}
    />
  );
};

export default TrackingRateMolecule;
