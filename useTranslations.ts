import { useLanguage } from './LanguageContext';
import { translations } from './translations';

export const useTranslations = () => {
  const { language } = useLanguage();
  return translations[language];
};
