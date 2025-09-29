import React from 'react';
import { Subject, SortOrder } from '../types';
import { useTranslations } from '../useTranslations';
import { UsersIcon, BookOpenIcon } from './icons';

interface SidebarProps {
  subjects: Subject[];
  selectedSubject: Subject;
  onSelectSubject: (subject: Subject) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  onViewDirectory: () => void;
  currentView: 'home' | 'directory';
}

const Sidebar: React.FC<SidebarProps> = ({ subjects, selectedSubject, onSelectSubject, sortOrder, onSortChange, onViewDirectory, currentView }) => {
  const t = useTranslations();
  
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">{t.navigation}</h2>
        <ul className="space-y-2">
            <li>
              <button
                onClick={() => window.location.reload()} // Simple way to go home and reset
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3 ${
                  currentView === 'home'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpenIcon className="h-5 w-5" />
                {t.forum}
              </button>
            </li>
            <li>
              <button
                onClick={onViewDirectory}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3 ${
                  currentView === 'directory'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <UsersIcon className="h-5 w-5" />
                {t.directory}
              </button>
            </li>
        </ul>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700"></div>

      <div>
        <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">{t.subjects}</h2>
        <ul className="space-y-2">
          {subjects.map(subject => (
            <li key={subject}>
              <button
                onClick={() => onSelectSubject(subject)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedSubject === subject
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t.subjectMap[subject]}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700"></div>

      <div>
        <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">{t.sortBy}</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onSortChange('newest')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                sortOrder === 'newest'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t.newestFirst}
            </button>
          </li>
          <li>
            <button
              onClick={() => onSortChange('oldest')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                sortOrder === 'oldest'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t.oldestFirst}
            </button>
          </li>
          <li>
            <button
              onClick={() => onSortChange('mostReplied')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                sortOrder === 'mostReplied'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t.mostReplied}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;