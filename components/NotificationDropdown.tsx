import React from 'react';
import { Notification, NotificationType } from '../types';
import { useTranslations } from '../useTranslations';
import { timeAgo } from '../utils/time';
import Avatar from './Avatar';

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const t = useTranslations();

  const getNotificationText = (notification: Notification) => {
    let actionText = '';
    switch(notification.type) {
        case NotificationType.POST_REPLY:
            actionText = t.repliedToYourPost;
            break;
        case NotificationType.REPLY_REPLY:
            actionText = t.repliedToYourReply;
            break;
        case NotificationType.MENTION:
            actionText = notification.reply_id ? t.mentionedYouInAReply : t.mentionedYouInAPost;
            break;
    }
    return (
      <span className="text-sm text-slate-700 dark:text-slate-300">
        <span className="font-bold text-slate-800 dark:text-slate-100">{notification.sender.username}</span> {actionText} <span className="font-semibold text-indigo-600 dark:text-indigo-400">"{notification.postTitle}"</span>
      </span>
    );
  };
  
  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 z-20">
      <div className="p-3 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white">{t.notifications}</h3>
        {notifications.some(n => !n.read) && (
          <button onClick={onMarkAllAsRead} className="text-xs font-semibold text-indigo-500 hover:underline">
            {t.markAllAsRead}
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map(notification => (
              <li 
                key={notification.id} 
                onClick={() => onMarkAsRead(notification.id)}
                className={`border-b border-slate-100 dark:border-slate-700/50 last:border-b-0 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 ${!notification.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
              >
                <div className="p-3 flex items-start gap-3">
                    <div className="relative flex-shrink-0 mt-1">
                      <Avatar user={notification.sender} size="sm" />
                    </div>
                    <div className="flex-grow">
                      {getNotificationText(notification)}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{timeAgo(notification.created_at, t)}</p>
                    </div>
                    {!notification.read && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0 self-center"></div>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-8 text-center text-sm text-slate-500">{t.noNotifications}</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;