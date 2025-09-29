import React, { useState } from 'react';
import { Reply, User, UserRole } from '../types';
import { useTranslations } from '../useTranslations';
import { timeAgo } from '../utils/time';
import { AcademicCapIcon, PencilIcon, TrashIcon, ChatBubbleOvalLeftIcon } from './icons';
import ReplyForm from './ReplyForm';
import ReplyList from './ReplyList';
import Avatar from './Avatar';
import { renderFormattedContent } from '../../utils/renderContent';

interface ReplyCardProps {
  reply: Reply;
  currentUser: User | null;
  onCreateReply: (parentId: string, content: string) => void;
  onUpdateReply: (replyId: string, content: string) => void;
  onDeleteReply: (replyId: string) => void;
  onViewProfile: (userId: string) => void;
  postLocked: boolean;
}

const ReplyCard: React.FC<ReplyCardProps> = ({ reply, currentUser, onCreateReply, onUpdateReply, onDeleteReply, onViewProfile, postLocked }) => {
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const isAuthor = currentUser?.id === reply.author.id;
  const canEdit = isAuthor;
  const canDelete = isAuthor || currentUser?.role === UserRole.TEACHER;
  const isLockedForCurrentUser = postLocked && currentUser?.role !== UserRole.TEACHER;

  const handleUpdate = (content: string) => {
    onUpdateReply(reply.id, content);
    setIsEditing(false);
  };

  const handleCreateReply = (content: string) => {
    onCreateReply(reply.id, content);
    setIsReplying(false);
  };

  if (isEditing) {
    return (
        <div className="pl-4 mt-4">
            <ReplyForm 
                initialContent={reply.content}
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
            />
        </div>
    );
  }

  return (
    <div className="flex gap-3 mt-4">
      <div className="flex-shrink-0 mt-1">
        <Avatar user={reply.author} size="sm" />
      </div>
      <div className="flex-grow">
        <div className="bg-slate-100 dark:bg-slate-800/70 rounded-lg p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => onViewProfile(reply.author.id)} className="text-sm font-semibold text-slate-800 dark:text-slate-100 hover:underline">{reply.author.username}</button>
            {reply.author.role === UserRole.TEACHER && (
                <AcademicCapIcon className="h-4 w-4 text-indigo-500" aria-label={t.teacherRole} />
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
                &middot; {timeAgo(reply.createdAt, t)}
                {reply.editedAt && (
                    <span className="italic"> &middot; {t.edited}</span>
                )}
            </p>
          </div>
          <p className="mt-1 text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">{renderFormattedContent(reply.content)}</p>
        </div>
        <div className="flex items-center gap-2 mt-1 px-2">
          {currentUser && (
            <button 
                onClick={() => setIsReplying(!isReplying)} 
                className="text-xs font-semibold text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLockedForCurrentUser}
                title={isLockedForCurrentUser ? t.postLocked : t.reply}
            >
              <ChatBubbleOvalLeftIcon className="h-3 w-3" />
              {t.reply}
            </button>
          )}
          {canEdit && (
             <button onClick={() => setIsEditing(true)} className="text-xs font-semibold text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 flex items-center gap-1">
               <PencilIcon className="h-3 w-3" />
               {t.edit}
             </button>
          )}
          {canDelete && (
             <button onClick={() => onDeleteReply(reply.id)} className="text-xs font-semibold text-slate-500 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1">
               <TrashIcon className="h-3 w-3" />
               {t.delete}
             </button>
          )}
        </div>

        {(isReplying || (reply.replies && reply.replies.length > 0)) && (
          <div className="mt-2 pt-2 border-l-2 border-slate-200 dark:border-slate-700">
            {isReplying && (
              <div className="pl-4 mb-4">
                <ReplyForm
                  onSubmit={handleCreateReply}
                  onCancel={() => setIsReplying(false)}
                />
              </div>
            )}
            {reply.replies && reply.replies.length > 0 && (
              <ReplyList
                replies={reply.replies}
                currentUser={currentUser}
                onCreateReply={onCreateReply}
                onUpdateReply={onUpdateReply}
                onDeleteReply={onDeleteReply}
                onViewProfile={onViewProfile}
                postLocked={postLocked}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyCard;
