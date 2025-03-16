// src\components\molecules\checkboxes\VrcftV1CheckboxMolecule.tsx
/**
 * VrcftV1Molecule component
 *
 * A molecule for controlling the VRCFT (v1) toggle.
 * It reads the `vrcftV1` value from Redux and dispatches updates using the
 * `toggleVrcftV1` action, rendering the CheckboxWithLabel atom.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { toggleVrcftV1 } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import CheckboxWithLabel from '../../atoms/CheckboxWithLabel';

const VrcftV1Molecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const vrcftV1 = useSelector((state: RootState) => state.config.vrcftV1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // The toggle action doesn't require the event value.
    dispatch(toggleVrcftV1());
  };

  return (
    <CheckboxWithLabel
      label={t('StartTrackingCard.vrcftV1')}
      checked={vrcftV1}
      onChange={handleChange}
    />
  );
};

export default VrcftV1Molecule;
