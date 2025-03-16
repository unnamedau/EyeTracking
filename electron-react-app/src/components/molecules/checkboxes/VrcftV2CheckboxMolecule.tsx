// src\components\molecules\checkboxes\VrcftV2CheckboxMolecule.tsx
/**
 * VrcftV2Molecule component
 *
 * A molecule for controlling the VRCFT (v2) toggle.
 * It reads the `vrcftV2` value from Redux and dispatches updates using the
 * `toggleVrcftV2` action, rendering the CheckboxWithLabel atom.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { toggleVrcftV2 } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import CheckboxWithLabel from '../../atoms/CheckboxWithLabel';

const VrcftV2Molecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const vrcftV2 = useSelector((state: RootState) => state.config.vrcftV2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleVrcftV2());
  };

  return (
    <CheckboxWithLabel
      label={t('StartTrackingCard.vrcftV2')}
      checked={vrcftV2}
      onChange={handleChange}
    />
  );
};

export default VrcftV2Molecule;
