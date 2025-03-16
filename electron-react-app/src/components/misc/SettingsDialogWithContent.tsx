// src/components/misc/SettingsDialogWithContent.tsx

/**
 * This component allows the user to select a theme and language for the client.
 */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SettingsDialog from './SettingsDialog';
import { RootState } from '../../store';
import { setLanguage, setTheme } from '../../slices/configSlice';
import BackgroundImageUrlTextMolecule from '../molecules/text/BackgroundImageUrlTextMolecule';

interface SettingsDialogWithContentProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDialogWithContent: React.FC<SettingsDialogWithContentProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const selectedLanguage = useSelector((state: RootState) => state.config.language);
  const currentTheme = useSelector((state: RootState) => state.config.theme);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage(e.target.value));
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTheme(e.target.value));
  };

  return (
    <SettingsDialog isOpen={isOpen} onClose={onClose}>
      <div className="mb-1">
        <h2>{t('SettingsDialogWithContent.settings')}</h2>
        <p>{t('SettingsDialogWithContent.configureSettings')}</p>
      </div>
      <div className="card mb-1">
        <label htmlFor="language-select" className="card-header text-header-color text-header">
          {t('SettingsDialogWithContent.languageLabel')}
        </label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          style={{ backgroundColor: "var(--dialog-box-background)" }}
        >
          <option value="English">{t('SettingsDialogWithContent.optionEnglish')}</option>
          <option value="Japanese">{t('SettingsDialogWithContent.optionJapanese')}</option>
          <option value="German">{t('SettingsDialogWithContent.optionGerman')}</option>
          <option value="French">{t('SettingsDialogWithContent.optionFrench')}</option>
          <option value="Spanish">{t('SettingsDialogWithContent.optionSpanish')}</option>
        </select>
      </div>
      <div className="card mb-1">
        <label htmlFor="theme-select" className="card-header text-header-color text-header">
          {t('SettingsDialogWithContent.themeLabel')}
        </label>
        <select
          id="theme-select"
          value={currentTheme}
          onChange={handleThemeChange}
          style={{ backgroundColor: "var(--dialog-box-background)" }}
        >
          <option value="dark">{t('SettingsDialogWithContent.optionDark')}</option>
          <option value="ninaboo">{t('SettingsDialogWithContent.optionNinaboo')}</option>
          <option value="trans">{t('SettingsDialogWithContent.optionTrans')}</option>
        </select>
        <div className="mt-1">
        <BackgroundImageUrlTextMolecule/>
      </div>
      </div>
    </SettingsDialog>
  );
};

export default SettingsDialogWithContent;
