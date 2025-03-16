// src\components\molecules\checkboxes\IndependentEyelidsCheckboxMolecule.tsx
/**
 * SmoothEyesMolecule component
 *
 * Molecule component for controlling the "Smooth Eyes" toggle.
 * It reads the `kalmanEnabled` value from Redux and dispatches updates using the
 * `setKalmanEnabled` action. It renders the `CheckboxWithLabel` atom.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setKalmanEnabled } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import CheckboxWithLabel from '../../atoms/CheckboxWithLabel';

const SmoothEyesMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const kalmanEnabled = useSelector((state: RootState) => state.config.kalmanEnabled);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setKalmanEnabled(e.target.checked));
  };

  return (
    <CheckboxWithLabel
      label={t('KalmanFilterConfigCard.smoothEyesLabel')}
      tooltip={t('KalmanFilterConfigCard.smoothEyesTooltip')}
      checked={kalmanEnabled}
      onChange={handleChange}
    />
  );
};

export default SmoothEyesMolecule;
