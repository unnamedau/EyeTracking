// src/components/molecules/text/VrcftPrefixTextMolecule.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setOscPrefix } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import TextInputWithLabel from '../../atoms/TextInputWithLabel';

/**
 * VrcftPrefixMolecule Component
 *
 * This molecule handles the VRCFT Prefix input. It selects the current prefix value from Redux,
 * dispatches updates using the setOscPrefix action, and renders the TextInputWithLabel atom.
 *
 * @returns {JSX.Element} The rendered VRCFT Prefix input.
 */
const VrcftPrefixMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const oscPrefix = useSelector((state: RootState) => state.config.oscPrefix);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setOscPrefix(e.target.value));
  };

  return (
    <TextInputWithLabel
      label={t('StartTrackingCard.vrcftPrefix')}
      value={oscPrefix}
      placeholder={t('StartTrackingCard.vrcftPrefixPlaceholder')}
      onChange={handleChange}
    />
  );
};

export default VrcftPrefixMolecule;
