// src/components/card/TrainingDataRecordingCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import RecordTrainingDataMolecule from '../molecules/checkboxes/RecordTrainingDataCheckboxMolecule';
import RecordingRateMolecule from '../molecules/text/RecordingRateTextMolecule';

const RecordTrainingDataCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="card flex-1">
      <div className="card-header text-header-color text-header">
        <span className="status-title">{t("DatabasePage.trainingDataRecordingTitle")}</span>
      </div>
      <div className="text-normal text-standard-color text-left">
        <RecordTrainingDataMolecule />
        <div className='mb-1' />
        <RecordingRateMolecule />
      </div>
    </div>
  );
};

export default RecordTrainingDataCard;
