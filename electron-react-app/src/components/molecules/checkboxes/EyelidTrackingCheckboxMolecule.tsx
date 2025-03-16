// src\components\molecules\checkboxes\EyelidTrackingCheckboxMolecule.tsx
/**
 * ActiveOpennessTrackingMolecule component
 *
 * A molecule for controlling the Enable Eyelid Tracking toggle.
 * It reads the `activeOpennessTracking` value from Redux and dispatches updates using the
 * `setActiveOpennessTracking` action, rendering the CheckboxWithLabel atom.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setActiveOpennessTracking } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import CheckboxWithLabel from '../../atoms/CheckboxWithLabel';

const ActiveOpennessTrackingMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const activeOpennessTracking = useSelector((state: RootState) => state.config.activeOpennessTracking);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setActiveOpennessTracking(e.target.checked));
  };

  return (
    <CheckboxWithLabel
      label={t('StartTrackingCard.eyelidTracking')}
      tooltip={t('StartTrackingCard.eyelidTrackingTooltip')}
      checked={activeOpennessTracking}
      onChange={handleChange}
    />
  );
};

export default ActiveOpennessTrackingMolecule;
