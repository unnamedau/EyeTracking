// src/components/molecules/text/HeadsetPortTextMolecule.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../../../store';
import { setHeadsetPort } from '../../../slices/configSlice';
import TextInputWithLabel from '../../atoms/TextInputWithLabel';

const HeadsetPortMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const headsetPort = useSelector((state: RootState) => state.config.headsetPort);
  const [error, setError] = React.useState('');

  const validatePort = (value: string): string => {
    const port = parseInt(value, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      return t('ConfigurationSection.errorInvalidPort');
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setHeadsetPort(e.target.value));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const errorMsg = validatePort(e.target.value);
    setError(errorMsg);
  };

  return (
    <div className="form-group mb-1">
      <div className="space-between mb-p5">
        <label htmlFor="headsetPort">
          {t('ConfigurationSection.headsetTrackingLabel')}
        </label>
        {error && (
          <span className="text-danger-color text-small text-right">{error}</span>
        )}
      </div>
      <TextInputWithLabel
        label=""
        value={headsetPort}
        placeholder={t('ConfigurationSection.headsetPortLeftPlaceholder')}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default HeadsetPortMolecule;
