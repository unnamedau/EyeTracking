// src\components\molecules\checkboxes\SplitYOutCheckboxMolecule.tsx
/**
 * SplitYOutMolecule component
 *
 * A molecule for controlling the Split Y Output toggle.
 * It reads the `splitOutputY` value from Redux and dispatches updates using the
 * `setSplitOutputY` action, rendering the CheckboxWithLabel atom.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setSplitOutputY } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import CheckboxWithLabel from '../../atoms/CheckboxWithLabel';

const SplitYOutMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const splitOutputY = useSelector((state: RootState) => state.config.splitOutputY);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSplitOutputY(e.target.checked));
  };

  return (
    <CheckboxWithLabel
      label={t('StartTrackingCard.splitYOut')}
      tooltip={t('StartTrackingCard.splitYOutTooltip')}
      checked={splitOutputY}
      onChange={handleChange}
    />
  );
};

export default SplitYOutMolecule;
