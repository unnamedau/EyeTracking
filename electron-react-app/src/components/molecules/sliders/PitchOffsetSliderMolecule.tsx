// src/components/molecules/sliders/PitchOffsetSliderMolecule.tsx

/**
 * PitchOffsetMolecule component
 *
 * A molecule component for controlling the pitch offset.
 * It retrieves the pitchOffset value from the Redux store and dispatches updates via
 * the setPitchOffset action. The component uses the SliderWithLabel atom.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setPitchOffset } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import SliderWithLabel from '../../atoms/SliderWithLabel';

const PitchOffsetMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const pitchOffset = useSelector((state: RootState) => state.config.pitchOffset);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPitchOffset(Number(e.target.value)));
  };

  return (
    <SliderWithLabel
      label={t('TrackingConfigurationCard.pitchOffsetLabel', { value: pitchOffset })}
      value={pitchOffset}
      min={-25}
      max={25}
      step={1}
      onChange={handleChange}
    />
  );
};

export default PitchOffsetMolecule;
