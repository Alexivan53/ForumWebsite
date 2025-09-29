import React from 'react';
import { useTranslations } from '../useTranslations';
import { BookOpenIcon } from './icons';

const Footer: React.FC = () => {
  const t = useTranslations();
  
  return (
    <footer className="bg-slate-900 text-slate-400 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <BookOpenIcon className="h-8 w-8 text-indigo-500" />
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-white">{t.forumName}</span>
                    <span className="text-xs">{t.forumCommunity}</span>
                </div>
            </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} PGT Mihelaki Georgiev. {t.footerCopyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;