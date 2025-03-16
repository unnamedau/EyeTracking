// src/i18n.ts

/**
 * This module configures and initializes the i18next internationalization library
 * for the application. It loads translation resources from local JSON files and sets
 * the default language based on the Redux store configuration.
 *
 * The configuration includes:
 * - A set of translations
 * - A default language read from the Redux store (fallbacks to 'English').
 * - A fallback language if the selected language is unavailable.
 *
 * The initialized i18next instance is exported for use throughout the application.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import store from './store'; // Import the Redux store

// Load translation resources from local JSON files.
import translationEN from './locales/en.json';
import translationJA from './locales/ja.json';
import translationES from './locales/es.json';
import translationFR from './locales/fr.json';
import translationDE from './locales/de.json';

// Retrieve the default language from the Redux store, falling back to 'English' if not set.
const defaultLanguage = store.getState().config.language || 'English';

// Define the translation resources.
const resources = {
  English: { translation: translationEN },
  Japanese: { translation: translationJA },
  French: { translation: translationFR },
  Spanish: { translation: translationES },
  German: { translation: translationDE },
};

// Initialize i18next with the React integration and the defined resources.
i18n
  .use(initReactI18next) // Integrates i18next with React.
  .init({
    resources,
    lng: defaultLanguage, // Set the initial language based on the Redux configuration.
    fallbackLng: 'English', // Fallback language if the selected language is unavailable.
    interpolation: {
      escapeValue: false, // React already handles escaping.
    },
  });

export default i18n;
