import React, { useState, useMemo } from 'react';
import { User, UserRole } from '../types';
import { useTranslations } from '../useTranslations';
import Avatar from './Avatar';
import EditGradeModal from './EditGradeModal';
import { PencilIcon } from './icons';

interface UserDirectoryProps {
  users: User[];
  currentUser: User | null;
  onUpdateUser: (userId: string, updatedData: Partial<User>) => void;
  onViewProfile: (userId: string) => void;
}

const UserCard: React.FC<{ user: User; currentUser: User | null; onEditGrade: (user: User) => void; onViewProfile: (userId: string) => void; }> = ({ user, currentUser, onEditGrade, onViewProfile }) => {
    const t = useTranslations();
    const isTeacher = user.role === UserRole.TEACHER;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
            <Avatar user={user} size="lg" />
            <h3 className="mt-3 font-bold text-lg text-slate-800 dark:text-white">{user.username}</h3>
            <p className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${isTeacher ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                {isTeacher ? t.teacherRole : t.studentRole}
            </p>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {isTeacher ? (
                    <span>{t.teaches}: {t.subjectMap[user.teachingSubject!]}</span>
                ) : (
                    <span>{t.grade}: {user.grade || 'N/A'}</span>
                )}
            </div>
             <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {t.memberSince} {new Date(user.joinDate).toLocaleDateString(t.locale, { year: 'numeric', month: 'short' })}
            </p>
            <div className="mt-4 flex gap-2 w-full">
                <button
                    onClick={() => onViewProfile(user.id)}
                    className="flex-1 px-3 py-1.5 text-sm font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                    {t.myProfile}
                </button>
                {currentUser?.role === UserRole.TEACHER && user.role === UserRole.STUDENT && (
                     <button
                        onClick={() => onEditGrade(user)}
                        className="px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     >
                        <PencilIcon className="h-4 w-4" />
                     </button>
                )}
            </div>
        </div>
    );
};


const UserDirectory: React.FC<UserDirectoryProps> = ({ users, currentUser, onUpdateUser, onViewProfile }) => {
  const t = useTranslations();
  const [editingStudent, setEditingStudent] = useState<User | null>(null);

  const { teachers, students } = useMemo(() => {
    const teachers = users
      .filter(u => u.role === UserRole.TEACHER)
      .sort((a, b) => a.username.localeCompare(b.username));
    
    const students = users
      .filter(u => u.role === UserRole.STUDENT)
      .sort((a, b) => (a.grade || 0) - (b.grade || 0) || a.username.localeCompare(b.username));
      
    return { teachers, students };
  }, [users]);

  const handleSaveGrade = (newGrade: number) => {
    if (editingStudent) {
      onUpdateUser(editingStudent.id, { grade: newGrade });
      setEditingStudent(null);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.userDirectory}</h1>
      
      <div>
        <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400">{t.teachers}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {teachers.map(user => (
            <UserCard 
                key={user.id} 
                user={user} 
                currentUser={currentUser} 
                onEditGrade={setEditingStudent}
                onViewProfile={onViewProfile}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-slate-200 dark:border-slate-700 text-green-600 dark:text-green-400">{t.students}</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {students.map(user => (
            <UserCard 
                key={user.id} 
                user={user} 
                currentUser={currentUser} 
                onEditGrade={setEditingStudent}
                onViewProfile={onViewProfile}
            />
          ))}
        </div>
      </div>
      
      {editingStudent && (
        <EditGradeModal 
            student={editingStudent}
            isOpen={!!editingStudent}
            onClose={() => setEditingStudent(null)}
            onSave={handleSaveGrade}
        />
      )}
    </div>
  );
};

export default UserDirectory;
