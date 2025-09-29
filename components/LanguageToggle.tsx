import React from 'react';
import { useLanguage } from '../LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center rounded-md bg-slate-100 dark:bg-slate-700 p-0.5">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-xs font-bold rounded ${
          language === 'en'
            ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-600 dark:text-white'
            : 'text-slate-600 dark:text-slate-300'
        }`}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('bg')}
        className={`px-2 py-1 text-xs font-bold rounded ${
          language === 'bg'
            ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-600 dark:text-white'
            : 'text-slate-600 dark:text-slate-300'
        }`}
        aria-pressed={language === 'bg'}
      >
        BG
      </button>
    </div>
  );
};

export default LanguageToggle;
