import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { XMarkIcon } from './icons';
import { useTranslations } from '../useTranslations';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { email: string; password: string; role: UserRole }) => void;
  onRegister: (registrationData: { email: string; username: string; password: string; role: UserRole }) => void;
}

type AuthMode = 'login' | 'register';
type RoleMode = 'student' | 'teacher';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [registerMode, setRegisterMode] = useState<RoleMode>('student');
  const [loginMode, setLoginMode] = useState<RoleMode>('student');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const t = useTranslations();

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setAuthMode('login');
        setRegisterMode('student');
        setLoginMode('student');
        setEmail('');
        setUsername('');
        setPassword('');
        setTeacherId('');
      }, 300);
    }
  }, [isOpen]);

  const handleRegisterSubmit = () => {
    if (!email.trim() || !username.trim() || !password.trim()) {
      alert(t.fieldsCannotBeEmpty);
      return;
    }
    if (registerMode === 'teacher' && teacherId !== 'TEACHER123') {
        alert(t.invalidTeacherId);
        return;
    }
    onRegister({
      email,
      username,
      password,
      role: registerMode === 'student' ? UserRole.STUDENT : UserRole.TEACHER,
    });
  };

  const handleLoginSubmit = () => {
    if (email.trim() === 'Admin' && password.trim() === 'Plamens555') {
      onLogin({
        email: 'admin',
        password: 'adminpassword',
        role: UserRole.ADMIN,
      });
      return;
    }
    if (!email.trim() || !password.trim()) {
      alert(t.fieldsCannotBeEmpty);
      return;
    }
    onLogin({
      email,
      password,
      role: loginMode === 'student' ? UserRole.STUDENT : UserRole.TEACHER,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <div className="mb-6">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-center font-semibold transition-colors ${authMode === 'login' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 dark:text-slate-400'}`}
            >
              {t.loginButton}
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-center font-semibold transition-colors ${authMode === 'register' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 dark:text-slate-400'}`}
            >
              {t.registerTitle}
            </button>
          </div>
        </div>
        
        {authMode === 'login' && (
          <>
            <div className="mb-6">
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setLoginMode('student')}
                  className={`flex-1 py-2 text-center font-semibold transition-colors ${loginMode === 'student' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  {t.student}
                </button>
                <button
                  onClick={() => setLoginMode('teacher')}
                  className={`flex-1 py-2 text-center font-semibold transition-colors ${loginMode === 'teacher' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  {t.teacher}
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">
              {loginMode === 'student' ? t.loginAsStudent : t.loginAsTeacher}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">{t.emailLabel}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">{t.passwordLabel}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleLoginSubmit}
                className="w-full mt-4 px-6 py-2.5 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t.loginButton}
              </button>
            </div>
          </>
        )}
        
        {authMode === 'register' && (
          <>
            <div className="mb-6">
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setRegisterMode('student')}
                  className={`flex-1 py-2 text-center font-semibold transition-colors ${registerMode === 'student' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  {t.student}
                </button>
                <button
                  onClick={() => setRegisterMode('teacher')}
                  className={`flex-1 py-2 text-center font-semibold transition-colors ${registerMode === 'teacher' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  {t.teacher}
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">
              {registerMode === 'student' ? t.registerAsStudent : t.registerAsTeacher}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">{t.emailLabel}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">{t.usernameLabel}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">{t.passwordLabel}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {registerMode === 'teacher' && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">{t.teacherIdLabel}</label>
                  <input
                    type="text"
                    placeholder={t.teacherIdPlaceholder}
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
              <button
                onClick={handleRegisterSubmit}
                className="w-full mt-4 px-6 py-2.5 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t.registerTitle}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
