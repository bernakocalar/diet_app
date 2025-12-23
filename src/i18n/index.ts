import * as Localization from 'expo-localization';
import i18n from 'i18next';
import 'intl-pluralrules';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import tr from './locales/tr.json';

const resources = {
    en: { translation: en },
    tr: { translation: tr },
};

const initI18n = async () => {
    let savedLanguage = 'en'; // default

    // Check device language
    // expo-localization returns list of preferences, e.g. ["tr-TR", "en-US"]
    const deviceLocales = Localization.getLocales();
    if (deviceLocales && deviceLocales.length > 0) {
        const primaryCode = deviceLocales[0].languageCode;
        if (primaryCode === 'tr') {
            savedLanguage = 'tr';
        }
    }

    try {
        await i18n
            .use(initReactI18next)
            .init({
                resources,
                lng: savedLanguage,
                fallbackLng: 'en',
                interpolation: {
                    escapeValue: false, // react already safes from xss
                },
                react: {
                    useSuspense: false, // simpler for now
                }
            });
    } catch (e) {
        console.error("Failed to init i18n", e);
    }
};

initI18n();

export default i18n;
