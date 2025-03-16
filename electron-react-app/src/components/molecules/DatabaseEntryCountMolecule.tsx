// src/components/molecules/DatabaseEntryCountMolecule.tsx
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useTranslation } from "react-i18next";

const DatabaseEntryCountMolecule: React.FC = () => {
  const { t } = useTranslation();
  const entryCount = useSelector((state: RootState) => state.database.entryCount);

  return (
    <p>
      {t("DatabasePage.numberOfEntriesLabel")}{" "}
      <strong>{entryCount !== null ? entryCount : "N/A"}</strong>
    </p>
  );
};

export default DatabaseEntryCountMolecule;
