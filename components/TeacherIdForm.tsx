import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const TeacherIdForm: React.FC = () => {
  const [teacherId, setTeacherId] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = async () => {
    const { error } = await supabase.from('teacher_ids').insert([{ id: teacherId }]);
    if (error) {
      setMessage(`Error creating teacher ID: ${error.message}`);
    } else {
      setMessage('Teacher ID created successfully.');
      setTeacherId('');
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('teacher_ids').delete().eq('id', teacherId);
    if (error) {
      setMessage(`Error deleting teacher ID: ${error.message}`);
    } else {
      setMessage('Teacher ID deleted successfully.');
      setTeacherId('');
    }
  };

  return (
    <div>
      <h2>Manage Teacher IDs</h2>
      <input
        type="text"
        placeholder="Teacher ID"
        value={teacherId}
        onChange={(e) => setTeacherId(e.target.value)}
      />
      <button onClick={handleCreate}>Create</button>
      <button onClick={handleDelete}>Delete</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TeacherIdForm;
