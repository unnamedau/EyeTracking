// src/components/molecules/sliders/HorizontalExaggerationSliderMolecule.tsx

/**
 * HorizontalExaggerationMolecule component
 *
 * A molecule component for controlling horizontal exaggeration.
 * It reads the horizontalExaggeration value from Redux and dispatches updates using
 * the setHorizontalExaggeration action. It renders the SliderWithLabel atom.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setHorizontalExaggeration } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import SliderWithLabel from '../../atoms/SliderWithLabel';

const HorizontalExaggerationMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const horizontalExaggeration = useSelector((state: RootState) => state.config.horizontalExaggeration);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setHorizontalExaggeration(Number(e.target.value)));
  };

  return (
    <SliderWithLabel
      label={t('TrackingConfigurationCard.horizontalExaggerationLabel', { value: horizontalExaggeration })}
      value={horizontalExaggeration}
      min={0}
      max={2}
      step={0.01}
      onChange={handleChange}
    />
  );
};

export default HorizontalExaggerationMolecule;
