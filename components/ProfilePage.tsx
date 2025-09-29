import React from 'react';
import { User, Post, UserRole } from '../types';
import { useTranslations } from '../useTranslations';
import Avatar from './Avatar';
import PostCard from './icons/PostCard';
import DraftCard from './DraftCard';
import { PencilIcon } from './icons';

interface ProfilePageProps {
  user: User;
  posts: Post[];
  drafts: Post[];
  currentUser: User | null;
  onEditProfile: () => void;
  onViewProfile: (userId: string) => void;
  onUpdatePost: (postId: string, updatedData: { title: string, content: string }) => void;
  onDeletePost: (postId: string) => void;
  onPublishPost: (postId: string) => void;
  onCreateReply: (parentId: string, content: string) => void;
  onUpdateReply: (replyId: string, content: string) => void;
  onDeleteReply: (replyId: string) => void;
  onTogglePinPost: (postId: string) => void;
  onToggleLockPost: (postId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = (props) => {
  const { user, posts, drafts, currentUser, onEditProfile } = props;
  const t = useTranslations();
  const isOwnProfile = currentUser?.id === user.id;

  const roleColor = user.role === UserRole.TEACHER ? 'border-indigo-500' : 'border-green-500';

  return (
    <div className="space-y-8">
      <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-lg border-t-4 ${roleColor} p-6`}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar user={user} size="xl" />
          <div className="flex-grow text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user.username}</h1>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${user.role === UserRole.TEACHER ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                {user.role === UserRole.TEACHER ? t.teacherRole : t.studentRole}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.memberSince} {new Date(user.joinDate).toLocaleDateString(t.locale, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {user.role === UserRole.STUDENT && user.grade && <span>{t.grade}: {user.grade}</span>}
                {user.role === UserRole.TEACHER && user.teachingSubject && <span>{t.teaches}: {t.subjectMap[user.teachingSubject]}</span>}
            </div>

            <p className="mt-4 text-slate-700 dark:text-slate-300">
              {user.bio || <span className="italic text-slate-500">{t.noBio}</span>}
            </p>
          </div>
          {isOwnProfile && (
            <button onClick={onEditProfile} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <PencilIcon className="h-4 w-4" />
              {t.editProfile}
            </button>
          )}
        </div>
      </div>

      {isOwnProfile && drafts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">{t.myDrafts}</h2>
          <div className="space-y-6">
            {drafts.map(draft => (
              <DraftCard
                key={draft.id}
                post={draft}
                onPublish={props.onPublishPost}
                onUpdate={props.onUpdatePost}
                onDelete={props.onDeletePost}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">{t.userPosts} {user.username}</h2>
        <div className="space-y-6">
          {posts.length > 0 ? posts.map(post => (
            <PostCard key={post.id} {...props} post={post} />
          )) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg">
                <p className="text-slate-500">{user.username} hasn't posted anything yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;