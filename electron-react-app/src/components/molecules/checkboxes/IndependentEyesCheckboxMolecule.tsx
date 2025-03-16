// src\components\molecules\checkboxes\IndependentEyesCheckboxMolecule.tsx
/**
 * IndependentEyesMolecule component
 *
 * A molecule for controlling the Independent Eyes toggle.
 * It reads the `independentEyes` value from Redux and dispatches updates using the
 * `setIndependentEyes` action, rendering the CheckboxWithLabel atom.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setIndependentEyes } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import CheckboxWithLabel from '../../atoms/CheckboxWithLabel';

const IndependentEyesMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const independentEyes = useSelector((state: RootState) => state.config.independentEyes);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setIndependentEyes(e.target.checked));
  };

  return (
    <CheckboxWithLabel
      label={t('StartTrackingCard.indEyes')}
      tooltip={t('StartTrackingCard.indEyesTooltip')}
      checked={independentEyes}
      onChange={handleChange}
    />
  );
};

export default IndependentEyesMolecule;
