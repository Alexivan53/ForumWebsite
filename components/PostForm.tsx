import React, { useState } from 'react';
import { User, Subject, UserRole } from '../types';
import { SUBJECTS } from '../constants';
import { useTranslations } from '../useTranslations';
import { AcademicCapIcon } from './icons';

interface PostFormProps {
  currentUser: User | null;
  onCreatePost: (postData: { title: string; content: string; subject: Subject }, isDraft: boolean) => void;
}

const PostForm: React.FC<PostFormProps> = ({ currentUser, onCreatePost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState<Subject>(Subject.MATH);
  const t = useTranslations();

  const handleSubmit = (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onCreatePost({ title, content, subject }, isDraft);
    setTitle('');
    setContent('');
  };

  const isFormDisabled = !currentUser;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-lg relative border border-slate-200 dark:border-slate-800">
      {isFormDisabled && (
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center rounded-lg z-10 backdrop-blur-sm">
          <p className="font-semibold text-slate-600 dark:text-slate-300">{t.loginToCreatePost}</p>
        </div>
      )}
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{t.createPostTitle}</h2>
          {currentUser?.role === UserRole.TEACHER && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 dark:text-indigo-400 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900 rounded-full">
              <AcademicCapIcon className="h-4 w-4" />
              <span>{t.postingAsTeacher}</span>
            </span>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder={t.postTitlePlaceholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isFormDisabled}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <textarea
            placeholder={t.postContentPlaceholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isFormDisabled}
            rows={4}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
        <div className="flex justify-between items-center">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
            disabled={isFormDisabled}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SUBJECTS.filter(s => s !== Subject.ALL).map(s => (
              <option key={s} value={s}>{t.subjectMap[s]}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isFormDisabled}
              className="px-6 py-2 font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-slate-700 rounded-md hover:bg-indigo-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t.saveDraft}
            </button>
            <button
              type="submit"
              disabled={isFormDisabled}
              className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t.postButton}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;