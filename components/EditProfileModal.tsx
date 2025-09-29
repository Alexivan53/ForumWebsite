import React, { useState, useEffect } from 'react';
import { User, UserRole, Subject } from '../types';
import { XMarkIcon } from './icons';
import { useTranslations } from '../useTranslations';
import { SUBJECTS } from '../constants';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<User>) => void;
  currentUser: User;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSave, currentUser }) => {
  const t = useTranslations();
  const [bio, setBio] = useState(currentUser.bio || '');
  const [grade, setGrade] = useState(currentUser.grade || '');
  const [teachingSubject, setTeachingSubject] = useState(currentUser.teachingSubject || Subject.MATH);

  useEffect(() => {
    if (isOpen) {
      setBio(currentUser.bio || '');
      setGrade(currentUser.grade || '');
      setTeachingSubject(currentUser.teachingSubject || Subject.MATH);
    }
  }, [isOpen, currentUser]);

  const handleSubmit = () => {
    const updatedData: Partial<User> = { bio: bio.trim() };
    if (currentUser.role === UserRole.STUDENT) {
      // Students cannot change their own grade.
    }
    if (currentUser.role === UserRole.TEACHER) {
      updatedData.teachingSubject = teachingSubject;
    }
    onSave(updatedData);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-lg m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">{t.editProfileTitle}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.bioLabel}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder={t.bioPlaceholder}
              className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          {currentUser.role === UserRole.STUDENT && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.gradeLabel}</label>
              <p className="mt-1 w-full px-3 py-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md">
                {currentUser.grade || 'N/A'}
              </p>
            </div>
          )}
          {currentUser.role === UserRole.TEACHER && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.teachingSubjectLabel}</label>
              <select
                value={teachingSubject}
                onChange={(e) => setTeachingSubject(e.target.value as Subject)}
                className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {SUBJECTS.filter(s => s !== Subject.ALL).map(s => (
                  <option key={s} value={s}>{t.subjectMap[s]}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t.saveChanges}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
