// src\components\molecules\checkboxes\SyncedUpdateCheckboxMolecule.tsx
/**
 * SyncedEyeUpdatesMolecule component
 *
 * A molecule for controlling the Synced Eye Updates toggle.
 * It reads the `syncedEyeUpdates` value from Redux and dispatches updates using the
 * `setSyncedEyeUpdates` action, rendering the CheckboxWithLabel atom.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setSyncedEyeUpdates } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import CheckboxWithLabel from '../../atoms/CheckboxWithLabel';

const SyncedEyeUpdatesMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const syncedEyeUpdates = useSelector((state: RootState) => state.config.syncedEyeUpdates);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSyncedEyeUpdates(e.target.checked));
  };

  return (
    <CheckboxWithLabel
      label={t('StartTrackingCard.syncUpdate')}
      tooltip={t('StartTrackingCard.syncUpdateTooltip')}
      checked={syncedEyeUpdates}
      onChange={handleChange}
    />
  );
};

export default SyncedEyeUpdatesMolecule;
