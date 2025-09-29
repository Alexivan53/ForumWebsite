import React, { useState } from 'react';
import { Post } from '../types';
import { PencilIcon, TrashIcon, PaperAirplaneIcon } from './icons';
import { useTranslations } from '../useTranslations';
import { timeAgo } from '../utils/time';

interface DraftCardProps {
  post: Post;
  onUpdate: (postId: string, updatedData: { title: string; content: string }) => void;
  onDelete: (postId: string) => void;
  onPublish: (postId: string) => void;
}

const DraftCard: React.FC<DraftCardProps> = ({ post, onUpdate, onDelete, onPublish }) => {
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleSave = () => {
    if (editedTitle.trim() && editedContent.trim()) {
      onUpdate(post.id, { title: editedTitle, content: editedContent });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(post.title);
    setEditedContent(post.content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <article className="bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800">
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.titleLabel}</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.contentLabel}</label>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={4}
              className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {t.saveChanges}
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800">
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full">{t.subjectMap[post.subject]}</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">DRAFT</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{post.title}</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-300 text-base leading-relaxed line-clamp-2">{post.content}</p>
      </div>
      <div className="px-5 sm:p-6 py-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last saved: {timeAgo(post.createdAt, t)}
                </p>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={() => onPublish(post.id)} aria-label={t.publishPostAria} className="p-2 text-slate-500 dark:text-slate-400 hover:text-green-500 dark:hover:text-green-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-sm">
                    <PaperAirplaneIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">{t.publish}</span>
                </button>
                <button onClick={() => setIsEditing(true)} aria-label={t.editDraftAria} className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <PencilIcon className="h-5 w-5" />
                </button>
                <button onClick={() => onDelete(post.id)} aria-label={t.deleteDraftAria} className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
      </div>
    </article>
  );
};

export default DraftCard;