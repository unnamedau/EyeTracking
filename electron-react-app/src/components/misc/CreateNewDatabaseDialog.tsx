// src/components/misc/CreateNewDatabaseDialog.tsx

/**
 * This dialog appears during the creation of a new database. It asks you 
 * to define the name of the database and gives you an option to continue or
 * cancel.
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CustomDialogProps {
  message: string;
  visible: boolean;
  onCancel: () => void;
  onConfirm: (value: string) => void;
  placeholder?: string;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  message,
  visible,
  onCancel,
  onConfirm,
  placeholder,
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  if (!visible) return null;

  return (
    <div className="dialog-backdrop">
      <div className="dialog-container">
        <p className="text-center text-standard-color mb-1">{message}</p>
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="mb-1"
        />
        <div className="flex-center">
          <button
            className="btn text-button-color background-color-accent-bad mr-1"
            onClick={() => {
              onCancel();
              setInputValue("");
            }}
          >
            {t('CustomDialog.cancel')}
          </button>
          <button
            className="btn text-button-color background-color-accent-good"
            onClick={() => {
              onConfirm(inputValue);
              setInputValue("");
            }}
          >
            {t('CustomDialog.ok')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
