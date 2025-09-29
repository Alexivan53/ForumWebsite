import React, { useState } from 'react';
import { Post, UserRole, User } from '../../types';
import { AcademicCapIcon, PencilIcon, TrashIcon, ChatBubbleOvalLeftIcon, BookmarkIcon, BookmarkSlashIcon, LockClosedIcon, LockOpenIcon } from './index';
import { useTranslations } from '../../useTranslations';
import { timeAgo } from '../../utils/time';
import ReplyForm from '../ReplyForm';
import ReplyList from '../ReplyList';
import Avatar from '../Avatar';
import { renderFormattedContent } from '../../utils/renderContent';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onUpdatePost: (postId: string, updatedData: { title: string, content: string }) => void;
  onDeletePost: (postId: string) => void;
  onCreateReply: (parentId: string, content: string) => void;
  onUpdateReply: (replyId: string, content: string) => void;
  onDeleteReply: (replyId: string) => void;
  onViewProfile: (userId: string) => void;
  onTogglePinPost: (postId: string) => void;
  onToggleLockPost: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onUpdatePost, onDeletePost, onCreateReply, onUpdateReply, onDeleteReply, onViewProfile, onTogglePinPost, onToggleLockPost }) => {
  const t = useTranslations();
  const isTeacherPost = post.author.role === UserRole.TEACHER;
  const isAuthor = currentUser?.id === post.author.id;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isReplying, setIsReplying] = useState(false);
  const [areRepliesVisible, setAreRepliesVisible] = useState(true);

  const canEdit = isAuthor;
  const canDelete = isAuthor || currentUser?.role === UserRole.TEACHER;
  const canModerate = currentUser?.role === UserRole.TEACHER;

  const handleSave = () => {
    if (editedTitle.trim() && editedContent.trim()) {
      onUpdatePost(post.id, { title: editedTitle, content: editedContent });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(post.title);
    setEditedContent(post.content);
    setIsEditing(false);
  };
  
  const handleCreateReply = (content: string) => {
    onCreateReply(post.id, content);
    setIsReplying(false);
    setAreRepliesVisible(true);
  }

  if (isEditing) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800`}>
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
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t.saveChanges}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isLockedForCurrentUser = post.locked && currentUser?.role !== UserRole.TEACHER;

  return (
    <article className={`bg-white dark:bg-slate-900 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-800`}>
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full">{t.subjectMap[post.subject]}</span>
          <div className="flex items-center gap-3">
            {post.locked && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                <LockClosedIcon className="h-4 w-4" />
                <span>{t.postLocked}</span>
              </div>
            )}
            {post.pinned && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <BookmarkIcon className="h-4 w-4" />
                <span>{t.pinned}</span>
              </div>
            )}
            {isTeacherPost && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 dark:text-indigo-400">
                <AcademicCapIcon className="h-4 w-4" />
                <span>{t.teacherPost}</span>
              </div>
            )}
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{post.title}</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-wrap">{renderFormattedContent(post.content)}</p>
      </div>
      <div className="px-5 sm:p-6 py-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar user={post.author} />
                <div>
                    <button onClick={() => onViewProfile(post.author.id)} className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:underline">{post.author.username}</button>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {timeAgo(post.createdAt, t)}
                      {post.editedAt && (
                        <span className="italic"> &middot; {t.edited}</span>
                      )}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                {currentUser && (
                    <button 
                      onClick={() => setIsReplying(!isReplying)} 
                      disabled={isLockedForCurrentUser}
                      className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title={isLockedForCurrentUser ? t.postLocked : t.reply}
                    >
                        <ChatBubbleOvalLeftIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">{t.reply}</span>
                    </button>
                )}
                {canModerate && (
                  <button onClick={() => onToggleLockPost(post.id)} aria-label={post.locked ? t.unlockPostAria : t.lockPostAria} className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-sm">
                      {post.locked ? <LockOpenIcon className="h-5 w-5" /> : <LockClosedIcon className="h-5 w-5" />}
                      <span className="hidden sm:inline">{post.locked ? t.unlockPost : t.lockPost}</span>
                  </button>
                )}
                {canModerate && (
                  <button onClick={() => onTogglePinPost(post.id)} aria-label={post.pinned ? t.unpinPostAria : t.pinPostAria} className="p-2 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-sm">
                      {post.pinned ? <BookmarkSlashIcon className="h-5 w-5" /> : <BookmarkIcon className="h-5 w-5" />}
                      <span className="hidden sm:inline">{post.pinned ? t.unpinPost : t.pinPost}</span>
                  </button>
                )}
                {canEdit && (
                  <button onClick={() => setIsEditing(true)} aria-label={t.editPostAria} className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <PencilIcon className="h-5 w-5" />
                  </button>
                )}
                {canDelete && (
                  <button onClick={() => onDeletePost(post.id)} aria-label={t.deletePostAria} className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <TrashIcon className="h-5 w-5" />
                  </button>
                )}
            </div>
        </div>
        
        {isReplying && (
          <div className="mt-4">
            <ReplyForm 
              onSubmit={handleCreateReply}
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}

        {post.replies && post.replies.length > 0 && (
          <div className="mt-4">
             <div className="flex items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                <button onClick={() => setAreRepliesVisible(!areRepliesVisible)} className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400">
                    {areRepliesVisible ? t.hideReplies : `${t.showReplies} (${post.replies.length})`}
                </button>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
             </div>

             {areRepliesVisible && (
                <div className="mt-2">
                    <ReplyList
                        replies={post.replies}
                        currentUser={currentUser}
                        onCreateReply={onCreateReply}
                        onUpdateReply={onUpdateReply}
                        onDeleteReply={onDeleteReply}
                        onViewProfile={onViewProfile}
                        postLocked={!!post.locked}
                    />
                </div>
             )}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
