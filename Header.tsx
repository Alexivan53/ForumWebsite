import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Notification } from './types';
import { BookOpenIcon, UserCircleIcon, BellIcon, IdentificationIcon } from './components/icons';
import ThemeToggle from './components/ThemeToggle';
import LanguageToggle from './components/LanguageToggle';
import NotificationDropdown from './components/NotificationDropdown';
import Avatar from './components/Avatar';
import { useTranslations } from './useTranslations';

interface HeaderProps {
  currentUser: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onViewProfile: (userId: string) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  notifications: Notification[];
  onMarkNotificationAsRead: (notificationId: string) => void;
  onMarkAllNotificationsAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLoginClick, onLogoutClick, onViewProfile, theme, onThemeToggle, notifications, onMarkNotificationAsRead, onMarkAllNotificationsAsRead }) => {
  const t = useTranslations();
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const getRoleDisplayName = (role: UserRole) => {
    return role === UserRole.TEACHER ? t.teacherRole : t.studentRole;
  }
  
  return (
    <header className="bg-slate-900 shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <button onClick={() => onViewProfile('home')} className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 rounded-lg">
          <BookOpenIcon className="h-8 w-8 text-indigo-500" />
          <h1 className="text-xl sm:text-2xl font-bold text-white">{t.forumName}</h1>
        </button>
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageToggle />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          {currentUser ? (
            <>
               <div ref={notificationRef} className="relative">
                 <button 
                    onClick={() => {
                        setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
                        setIsUserDropdownOpen(false);
                    }}
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-700 relative"
                    aria-label={`${unreadCount} unread notifications`}
                  >
                   <BellIcon className="h-6 w-6" />
                   {unreadCount > 0 && (
                     <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-[10px]">
                       {unreadCount > 9 ? '9+' : unreadCount}
                     </span>
                   )}
                 </button>
                 {isNotificationDropdownOpen && (
                   <NotificationDropdown 
                      notifications={notifications}
                      onMarkAsRead={onMarkNotificationAsRead}
                      onMarkAllAsRead={() => {
                        onMarkAllNotificationsAsRead();
                      }}
                      onClose={() => setIsNotificationDropdownOpen(false)}
                   />
                 )}
               </div>

                <div ref={userMenuRef} className="relative">
                    <button onClick={() => {
                        setIsUserDropdownOpen(!isUserDropdownOpen)
                        setIsNotificationDropdownOpen(false);
                    }} className="flex items-center gap-2 rounded-full hover:bg-slate-800 p-1">
                        <Avatar user={currentUser} size="sm" />
                        <span className="hidden sm:inline font-semibold text-slate-200">{currentUser.username}</span>
                    </button>
                    {isUserDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-2xl border border-slate-200 dark:border-slate-700 z-20">
                            <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                                <p className="font-bold text-slate-800 dark:text-white truncate">{currentUser.username}</p>
                                <p className="text-xs text-slate-500">{getRoleDisplayName(currentUser.role)}</p>
                            </div>
                            <ul className="py-1">
                                <li>
                                    <button onClick={() => { onViewProfile(currentUser.id); setIsUserDropdownOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                        <IdentificationIcon className="h-5 w-5" />
                                        {t.myProfile}
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => { onLogoutClick(); setIsUserDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                                        {t.logout}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 text-sm sm:text-base font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t.loginRegister}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;