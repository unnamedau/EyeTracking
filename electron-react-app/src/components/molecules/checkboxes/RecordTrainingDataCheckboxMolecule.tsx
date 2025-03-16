// src/components/molecules/RecordTrainingDataCheckboxMolecule.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CheckboxWithLabel from '../../atoms/CheckboxWithLabel';
import { RootState, AppDispatch } from '../../../store';
import { setRecordTrainingData } from '../../../slices/configSlice';

/**
 * RecordTrainingDataMolecule component
 *
 * A molecule for toggling the recording of training data.
 * It uses the CheckboxWithLabel atom and updates Redux state.
 */
const RecordTrainingDataMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const recordTrainingData = useSelector((state: RootState) => state.config.recordTrainingData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRecordTrainingData(e.target.checked));
  };

  return (
    <CheckboxWithLabel
      label={t("DatabasePage.recordTrainingData")}
      checked={recordTrainingData}
      onChange={handleChange}
      tooltip={t("DatabasePage.recordTrainingDataTooltip")}
    />
  );
};

export default RecordTrainingDataMolecule;
