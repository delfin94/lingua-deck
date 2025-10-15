
import { useState, useEffect } from 'react';
import * as Localization from 'expo-localization';
import i18n from '../utils/i18n';

export const useLanguage = () => {
  const [language, setLanguage] = useState<'sk' | 'en'>('en');

  useEffect(() => {
    const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
    if (deviceLanguage.startsWith('sk')) {
      setLanguage('sk');
      i18n.locale = 'sk';
    } else {
      setLanguage('en');
      i18n.locale = 'en';
    }
  }, []);

  const changeLanguage = (newLanguage: 'sk' | 'en') => {
    setLanguage(newLanguage);
    i18n.locale = newLanguage;
  };

  const t = (key: string) => {
    return i18n.t(key);
  };

  return {
    language,
    setLanguage: changeLanguage,
    t,
  };
};
