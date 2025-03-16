// src/components/molecules/text/RightEyeImageDataTextMolecule.tsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../../../store';
import { setRightEye } from '../../../slices/configSlice';
import TextInputWithLabel from '../../atoms/TextInputWithLabel';

const RightEyeMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const rightEye = useSelector((state: RootState) => state.config.rightEye);
  const [error, setError] = React.useState('');

  const validateIPPort = (value: string): string => {
    const regex = /^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;
    if (!regex.test(value)) {
      return t('ConfigurationSection.errorInvalidFormat');
    }
    const [ip, portStr] = value.split(':');
    const segments = ip.split('.');
    for (let seg of segments) {
      const num = parseInt(seg, 10);
      if (num < 0 || num > 255) {
        return t('ConfigurationSection.errorInvalidIP');
      }
    }
    const port = parseInt(portStr, 10);
    if (port < 1 || port > 65535) {
      return t('ConfigurationSection.errorPortRange');
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRightEye(e.target.value));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const errorMsg = validateIPPort(e.target.value);
    setError(errorMsg);
  };

  return (
    <div className="form-group">
      <div className="space-between mb-p5">
        <label htmlFor="rightEye">
          {t('ConfigurationSection.rightEyeLabel')}
        </label>
        {error && (
          <span className="text-danger-color text-small text-right">{error}</span>
        )}
      </div>
      <TextInputWithLabel
        label=""
        value={rightEye}
        placeholder={t('ConfigurationSection.ipPortLeftPlaceholder')}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default RightEyeMolecule;
