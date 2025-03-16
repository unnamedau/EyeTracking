// src/components/molecules/SelectedDatabaseMolecule.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useTranslation } from 'react-i18next';

const SelectedDatabaseMolecule: React.FC = () => {
  const { t } = useTranslation();
  const selectedDb = useSelector((state: RootState) => state.database.selectedDb);

  return (
    <p>
      {t("DatabasePage.selectedDatabaseLabel")}{" "}
      <strong>{selectedDb || t("DatabasePage.none")}</strong>
    </p>
  );
};

export default SelectedDatabaseMolecule;
