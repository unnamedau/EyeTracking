// src\components\molecules\checkboxes\VrcNativeCheckboxMolecule.tsx
/**
 * VrcNativeMolecule component
 *
 * A molecule for controlling the VRC Native toggle.
 * It reads the `vrcNative` value from Redux and dispatches updates using the
 * `setVrcNative` action, rendering the CheckboxWithLabel atom.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setVrcNative } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import CheckboxWithLabel from '../../atoms/CheckboxWithLabel';

const VrcNativeMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const vrcNative = useSelector((state: RootState) => state.config.vrcNative);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setVrcNative(e.target.checked));
  };

  return (
    <CheckboxWithLabel
      label={t('StartTrackingCard.vrcNative')}
      checked={vrcNative}
      onChange={handleChange}
    />
  );
};

export default VrcNativeMolecule;