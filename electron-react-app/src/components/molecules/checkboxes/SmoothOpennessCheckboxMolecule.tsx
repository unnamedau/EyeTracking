// src\components\molecules\checkboxes\SmoothOpennessCheckboxMolecule.tsx
/**
 * SmoothOpennessMolecule component
 *
 * Molecule component for controlling the "Smooth Openness" toggle.
 * It reads the `kalmanEnabledOpenness` value from Redux and dispatches updates using the
 * `setKalmanEnabledOpenness` action. It renders the `CheckboxWithLabel` atom.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setKalmanEnabledOpenness } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import CheckboxWithLabel from '../../atoms/CheckboxWithLabel';

const SmoothOpennessMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const kalmanEnabledOpenness = useSelector((state: RootState) => state.config.kalmanEnabledOpenness);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setKalmanEnabledOpenness(e.target.checked));
  };

  return (
    <CheckboxWithLabel
      label={t('KalmanFilterConfigCard.smoothOpennessLabel')}
      tooltip={t('KalmanFilterConfigCard.smoothOpennessTooltip')}
      checked={kalmanEnabledOpenness}
      onChange={handleChange}
    />
  );
};

export default SmoothOpennessMolecule;
