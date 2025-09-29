import React, { useState } from 'react';
import { useTranslations } from '../useTranslations';

interface ReplyFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  initialContent?: string;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ onSubmit, onCancel, initialContent = '' }) => {
  const [content, setContent] = useState(initialContent);
  const t = useTranslations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <textarea
        placeholder={t.replyPlaceholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        autoFocus
      ></textarea>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
        >
          {t.cancel}
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
        >
          {initialContent ? t.saveChanges : t.postReply}
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;
