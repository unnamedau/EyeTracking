// src/components/card/RightEyeCameraCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import CameraStream from '../molecules/CameraStreamMolecule';

const RightEyeCameraCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="card">
      <div className="card-header text-header-color text-header">
        <span>{t('StatusPage.rightEyeCamera')}</span>
      </div>
      <div className="text-normal text-standard-color">
        <CameraStream streamField="rightEye" />
      </div>
    </div>
  );
};

export default RightEyeCameraCard;
