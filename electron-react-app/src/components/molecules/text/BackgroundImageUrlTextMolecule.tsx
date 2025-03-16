// src/components/molecules/text/BackgroundImageUrlTextMolecule.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setBackgroundImageUrl } from '../../../slices/configSlice';
import { useTranslation } from 'react-i18next';
import TextInputWithLabel from '../../atoms/TextInputWithLabel';

const BackgroundImageUrlTextMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const backgroundImageUrl = useSelector((state: RootState) => state.config.backgroundImageUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBackgroundImageUrl(e.target.value));
  };

  return (
    <TextInputWithLabel
      label={t('ConfigurationSection.backgroundImageUrlLabel')}
      value={backgroundImageUrl}
      placeholder={t('ConfigurationSection.backgroundImageUrlPlaceholder')}
      onChange={handleChange}
    />
  );
};

export default BackgroundImageUrlTextMolecule;
