// src/components/molecules/CameraStreamMolecule.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';

interface CameraStreamMoleculeProps {
  streamField: 'leftEye' | 'rightEye';
}

const CameraStreamMolecule: React.FC<CameraStreamMoleculeProps> = ({ streamField }) => {
  const { t } = useTranslation();
  const cameraData = useSelector((state: RootState) => state.status.imageData[streamField]);

  return (
    <div className="camera-container camera-sized">
      {cameraData.status === 'online' && cameraData.frame ? (
        <img src={cameraData.frame} alt={t('CameraStream.alt')} />
      ) : (
        <div className="camera-sized flex-center camera-stream-offline-placeholder text-faded-color">
          {t('CameraStream.offlinePlaceholder')}
        </div>
      )}
    </div>
  );
};

export default CameraStreamMolecule;
