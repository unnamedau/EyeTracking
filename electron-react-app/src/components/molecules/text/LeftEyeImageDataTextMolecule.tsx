// src/components/molecules/text/LeftEyeImageDataTextMolecule.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../../../store';
import { setLeftEye } from '../../../slices/configSlice';
import TextInputWithLabel from '../../atoms/TextInputWithLabel';

const LeftEyeMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const leftEye = useSelector((state: RootState) => state.config.leftEye);
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
    dispatch(setLeftEye(e.target.value));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const errorMsg = validateIPPort(e.target.value);
    setError(errorMsg);
  };

  return (
    <div className="form-group mb-1">
      <div className="space-between mb-p5">
        <label htmlFor="leftEye">
          {t('ConfigurationSection.leftEyeLabel')}
        </label>
        {error && (
          <span className="text-danger-color text-small text-right">{error}</span>
        )}
      </div>
      <TextInputWithLabel
        label=""
        value={leftEye}
        placeholder={t('ConfigurationSection.ipPortLeftPlaceholder')}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default LeftEyeMolecule;
