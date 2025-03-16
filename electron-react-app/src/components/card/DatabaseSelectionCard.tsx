// src/components/card/DatabaseSelectionCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import SelectedDatabaseMolecule from '../molecules/SelectedDatabaseMolecule';
import DatabaseActionButtonsMolecule from '../molecules/buttons/DatabaseActionButtonsMolecule';
import DatabaseEntryCountMolecule from '../molecules/DatabaseEntryCountMolecule';

interface DatabaseSelectionCardProps {
  onCreate: () => void;
  onSelect: () => void;
  onDelete: () => void;
  disableDelete: boolean;
}

const DatabaseSelectionCard: React.FC<DatabaseSelectionCardProps> = ({
  onCreate,
  onSelect,
  onDelete,
  disableDelete,
}) => {
  const { t } = useTranslation();

  return (
    <div className="card mb-1">
      <div className="card-header text-header-color text-header">
        <span className="status-title">{t("DatabasePage.databaseSelectionTitle")}</span>
      </div>
      <div className="text-normal text-standard-color">
        <SelectedDatabaseMolecule />
        <div className='mb-1' />
        <DatabaseEntryCountMolecule />
        <DatabaseActionButtonsMolecule
          onCreate={onCreate}
          onSelect={onSelect}
          onDelete={onDelete}
          disableDelete={disableDelete}
        />
      </div>
    </div>
  );
};

export default DatabaseSelectionCard;
