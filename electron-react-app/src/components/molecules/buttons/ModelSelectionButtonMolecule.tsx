// src/components/molecules/buttons/ModelSelectionButtonMolecule.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import ButtonAtom from '../../atoms/ButtonAtom';

interface ModelSelectionButtonMoleculeProps {
  onSelectModel: () => void;
}

const ModelSelectionButtonMolecule: React.FC<ModelSelectionButtonMoleculeProps> = ({ onSelectModel }) => {
  const { t } = useTranslation();

  return (
    <ButtonAtom
      text={t('ModelSelectionCard.selectButton')}
      onClick={onSelectModel}
      className="text-button-color background-color-accent-neutral mb-1"
    />
  );
};

export default ModelSelectionButtonMolecule;
