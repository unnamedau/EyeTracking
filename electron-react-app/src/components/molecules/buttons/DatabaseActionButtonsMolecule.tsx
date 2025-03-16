// src/components/molecules/buttons/DatabaseActionButtonsMolecule.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import ButtonAtom from '../../atoms/ButtonAtom';

interface DatabaseActionButtonsMoleculeProps {
  onCreate: () => void;
  onSelect: () => void;
  onDelete: () => void;
  disableDelete: boolean;
}

const DatabaseActionButtonsMolecule: React.FC<DatabaseActionButtonsMoleculeProps> = ({
  onCreate,
  onSelect,
  onDelete,
  disableDelete,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mt-1">
      <ButtonAtom
        text={t("DatabasePage.createNewDatabase")}
        onClick={onCreate}
        className="text-button-color background-color-accent-good mr-1"
      />
      <ButtonAtom
        text={t("DatabasePage.selectDatabase")}
        onClick={onSelect}
        className="text-button-color background-color-accent-neutral mr-1"
      />
      <ButtonAtom
        text={t("DatabasePage.deleteDatabase")}
        onClick={onDelete}
        className={
          disableDelete
            ? "text-button-color background-color-accent-disabled btn--disabled"
            : "text-button-color background-color-accent-bad"
        }
        disabled={disableDelete}
      />
    </div>
  );
};

export default DatabaseActionButtonsMolecule;
