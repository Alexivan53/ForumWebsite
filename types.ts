export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  joinDate: Date;
  bio?: string;
  avatar?: string;
  grade?: number; // For students
  teachingSubject?: Subject; // For teachers
}

export enum Subject {
  ALL = 'All Subjects',
  MATH = 'Math',
  SCIENCE = 'Science',
  BIOLOGY = 'Biology',
  HISTORY = 'History',
  ENGLISH = 'English',
  COMPUTER_SCIENCE = 'Computer Science',
  ART = 'Art',
  GEOGRAPHY = 'Geography',
  MUSIC = 'Music',
  PHYSICAL_EDUCATION = 'Physical Education',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
}

export interface Reply {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  editedAt?: Date;
  replies: Reply[];
  // DB fields, populated during fetch
  author_id?: string;
  post_id?: string;
  parent_id?: string | null;
}

export interface Post {
  id:string;
  title: string;
  content: string;
  author: User;
  subject: Subject;
  createdAt: Date;
  editedAt?: Date;
  replies: Reply[];
  replyCount: number;
  pinned?: boolean;
  locked?: boolean;
  isDraft?: boolean;
}

export type SortOrder = 'newest' | 'oldest' | 'mostReplied';

export enum NotificationType {
  POST_REPLY = 'POST_REPLY',
  REPLY_REPLY = 'REPLY_REPLY',
  MENTION = 'MENTION',
}

export interface Notification {
  id: string;
  type: NotificationType;
  recipient_id: string;
  sender: User;
  post_id: string;
  postTitle: string;
  reply_id?: string;
  created_at: Date;
  read: boolean;
}
