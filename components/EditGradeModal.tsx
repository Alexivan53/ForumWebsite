import React, { useState } from 'react';
import { User } from '../types';
import { XMarkIcon } from './icons';
import { useTranslations } from '../useTranslations';

interface EditGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newGrade: number) => void;
  student: User;
}

const EditGradeModal: React.FC<EditGradeModalProps> = ({ isOpen, onClose, onSave, student }) => {
  const t = useTranslations();
  const [grade, setGrade] = useState(student.grade || '');

  const handleSubmit = () => {
    onSave(Number(grade));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-6 w-full max-w-sm m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
            {t.updateGradeFor} <span className="text-indigo-600 dark:text-indigo-400">{student.username}</span>
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.gradeLabel}</label>
            <input
              type="number"
              value={grade}
              onChange={(e) => setGrade(parseInt(e.target.value, 10) || '')}
              className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGradeModal;
