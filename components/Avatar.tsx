import React from 'react';
import { User } from '../types';
import { UserCircleIcon } from './icons';

interface AvatarProps {
  user: User | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const stringToHslColor = (str: string, s: number, l: number): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, ${s}%, ${l}%)`;
};

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md' }) => {
  if (!user) {
    return <UserCircleIcon className="h-10 w-10 text-slate-400" />;
  }

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-16 w-16 text-2xl',
    xl: 'h-24 w-24 text-4xl',
  };

  if (user.avatar) {
    return (
      <img
        className={`${sizeClasses[size]} rounded-full object-cover`}
        src={user.avatar}
        alt={user.username}
      />
    );
  }

  const initial = user.username.charAt(0).toUpperCase();
  const bgColor = stringToHslColor(user.username, 50, 85); // Light pastel background
  const textColor = stringToHslColor(user.username, 60, 30); // Darker text color

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold`}
      style={{ backgroundColor: bgColor, color: textColor }}
      title={user.username}
    >
      {initial}
    </div>
  );
};

export default Avatar;