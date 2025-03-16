// src/components/molecules/text/OscInputTextMolecule.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setVrcOsc } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import TextInputWithLabel from '../../atoms/TextInputWithLabel';

/**
 * OscInputMolecule Component
 *
 * This molecule handles the OSC IP:Port input. It reads the current value from Redux,
 * dispatches updates via the setVrcOsc action, and renders the TextInputWithLabel atom.
 *
 * @returns {JSX.Element} The rendered OSC input.
 */
const OscInputMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const vrcOsc = useSelector((state: RootState) => state.config.vrcOsc);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setVrcOsc(e.target.value));
  };

  // For the OSC input, combine the left and right placeholders into one string.
  const placeholder = `${t('StartTrackingCard.oscLeftPlaceholder')} ${t(
    'StartTrackingCard.oscRightPlaceholder'
  )}`;

  return (
    <TextInputWithLabel
      label={t('StartTrackingCard.oscLabel')}
      value={vrcOsc}
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
};

export default OscInputMolecule;
