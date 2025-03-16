// src\components\molecules\checkboxes\IndependentEyelidsCheckboxMolecule.tsx
/**
 * IndependentOpennessMolecule component
 *
 * A molecule for controlling the Independent Eyelids/Openness toggle.
 * It reads the `independentOpenness` value from Redux and dispatches updates using the
 * `setIndependentOpenness` action, rendering the CheckboxWithLabel atom.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setIndependentOpenness } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import CheckboxWithLabel from '../../atoms/CheckboxWithLabel';

const IndependentOpennessMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const independentOpenness = useSelector((state: RootState) => state.config.independentOpenness);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setIndependentOpenness(e.target.checked));
  };

  return (
    <CheckboxWithLabel
      label={t('StartTrackingCard.indEyelids')}
      tooltip={t('StartTrackingCard.indEyelidsTooltip')}
      checked={independentOpenness}
      onChange={handleChange}
    />
  );
};

export default IndependentOpennessMolecule;
