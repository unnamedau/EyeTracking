// src/components/card/LeftEyeCameraCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import CameraStream from '../molecules/CameraStreamMolecule';

const LeftEyeCameraCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="card">
      <div className="card-header text-header-color text-header">
        <span>{t('StatusPage.leftEyeCamera')}</span>
      </div>
      <div className="text-normal text-standard-color">
        <CameraStream streamField="leftEye" />
      </div>
    </div>
  );
};

export default LeftEyeCameraCard;
