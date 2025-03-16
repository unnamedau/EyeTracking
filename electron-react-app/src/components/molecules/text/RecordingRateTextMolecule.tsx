// src/components/molecules/text/RecordingRateTextMolecule.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setRecordingRate } from "../../../slices/configSlice";
import { useTranslation } from "react-i18next";
import TextInputWithLabel from "../../atoms/TextInputWithLabel";

const RecordingRateMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const recordingRate = useSelector((state: RootState) => state.config.recordingRate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      dispatch(setRecordingRate(value));
    }
  };

  return (
    <TextInputWithLabel
      label={t("DatabasePage.recordingRateTitle")}
      tooltip={t("DatabasePage.recordingRateTooltip")}
      value={recordingRate.toString()}
      placeholder={t("DatabasePage.recordingRateSubtitle")}
      onChange={handleChange}
    />
  );
};

export default RecordingRateMolecule;
