// src\components\molecules\checkboxes\OpennessBasedTrustCheckboxMolecule.tsx
/**
 * OpennessBasedTrustMolecule component
 *
 * Molecule component for controlling the "Openness Based Trust" toggle.
 * It reads the `eyelidBasedGazeTrust` value from Redux and dispatches updates using the
 * `setEyelidBasedGazeTrust` action. It renders the `CheckboxWithLabel` atom.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setEyelidBasedGazeTrust } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import CheckboxWithLabel from '../../atoms/CheckboxWithLabel';

const OpennessBasedTrustMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const eyelidBasedGazeTrust = useSelector((state: RootState) => state.config.eyelidBasedGazeTrust);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEyelidBasedGazeTrust(e.target.checked));
  };

  return (
    <CheckboxWithLabel
      label={t('KalmanFilterConfigCard.opennessBasedTrustLabel')}
      tooltip={t('KalmanFilterConfigCard.opennessBasedTrustTooltip')}
      checked={eyelidBasedGazeTrust}
      onChange={handleChange}
    />
  );
};

export default OpennessBasedTrustMolecule;
