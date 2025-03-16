// src/components/molecules/sliders/VerticalExaggerationSliderMolecule.tsx

/**
 * VerticalExaggerationMolecule component
 *
 * A molecule component for controlling vertical exaggeration.
 * It fetches the current value from the Redux store and dispatches updates using the
 * setVerticalExaggeration action. It renders the reusable SliderWithLabel atom.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setVerticalExaggeration } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import SliderWithLabel from '../../atoms/SliderWithLabel';

const VerticalExaggerationMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const verticalExaggeration = useSelector((state: RootState) => state.config.verticalExaggeration);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setVerticalExaggeration(Number(e.target.value)));
  };

  return (
    <SliderWithLabel
      label={t('TrackingConfigurationCard.verticalExaggerationLabel', { value: verticalExaggeration })}
      value={verticalExaggeration}
      min={0}
      max={2}
      step={0.01}
      onChange={handleChange}
    />
  );
};

export default VerticalExaggerationMolecule;
