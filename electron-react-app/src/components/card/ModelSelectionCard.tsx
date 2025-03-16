// src/components/card/ModelSelectionCard.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setModelFile } from '../../slices/configSlice';
import ModelSelectionButtonMolecule from '../molecules/buttons/ModelSelectionButtonMolecule';
import ModelFileTextMolecule from '../molecules/ModelFileTextMolecule';

const ModelSelectionCard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSelectModel = async () => {
    try {
      const folderPath = await window.electronAPI.selectFolder();
      if (folderPath) {
        dispatch(setModelFile(''));
        dispatch(setModelFile(folderPath));
      }
    } catch (error) {
      console.error(t('ModelSelectionCard.errorSelectingModel'), error);
    }
  };

  return (
    <div className="card mb-1">
      <div className="card-header text-header-color text-header">
        <span className="status-title">{t('ModelSelectionCard.header')}</span>
      </div>
      <div className="text-normal text-standard-color text-center">
        <ModelSelectionButtonMolecule onSelectModel={handleSelectModel} />
        <ModelFileTextMolecule />
      </div>
    </div>
  );
};

export default ModelSelectionCard;
