import React from 'react';
import TeacherIdForm from './TeacherIdForm';
import AdminPostForm from './AdminPostForm';

const AdminPanel: React.FC = () => {
  return (
    <div>
      <h1>Admin Panel</h1>
      <TeacherIdForm />
      <AdminPostForm />
    </div>
  );
};

export default AdminPanel;
