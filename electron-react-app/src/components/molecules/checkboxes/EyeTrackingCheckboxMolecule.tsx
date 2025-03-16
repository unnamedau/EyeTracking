// src\components\molecules\checkboxes\EyeTrackingCheckboxMolecule.tsx
/**
 * ActiveEyeTrackingMolecule component
 *
 * A molecule for controlling the Enable Eye Tracking toggle.
 * It reads the `activeEyeTracking` value from Redux and dispatches updates using the
 * `setActiveEyeTracking` action, rendering the CheckboxWithLabel atom.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setActiveEyeTracking } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import CheckboxWithLabel from '../../atoms/CheckboxWithLabel';

const ActiveEyeTrackingMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const activeEyeTracking = useSelector((state: RootState) => state.config.activeEyeTracking);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setActiveEyeTracking(e.target.checked));
  };

  return (
    <CheckboxWithLabel
      label={t('StartTrackingCard.eyeTracking')}
      tooltip={t('StartTrackingCard.eyeTrackingTooltip')}
      checked={activeEyeTracking}
      onChange={handleChange}
    />
  );
};

export default ActiveEyeTrackingMolecule;
