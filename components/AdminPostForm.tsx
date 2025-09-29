import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Post } from '../types';

const AdminPostForm: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postId, setPostId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*');
    if (data) {
      setPosts(data);
    }
  };

  const handleCreate = async () => {
    const { error } = await supabase.from('posts').insert([{ title, content, user_id: 'admin' }]);
    if (error) {
      setMessage(`Error creating post: ${error.message}`);
    } else {
      setMessage('Post created successfully.');
      resetForm();
      fetchPosts();
    }
  };

  const handleUpdate = async () => {
    if (!postId) return;
    const { error } = await supabase.from('posts').update({ title, content }).eq('id', postId);
    if (error) {
      setMessage(`Error updating post: ${error.message}`);
    } else {
      setMessage('Post updated successfully.');
      resetForm();
      fetchPosts();
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      setMessage(`Error deleting post: ${error.message}`);
    } else {
      setMessage('Post deleted successfully.');
      fetchPosts();
    }
  };

  const selectPost = (post: Post) => {
    setTitle(post.title);
    setContent(post.content);
    setPostId(post.id);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPostId(null);
  };

  return (
    <div>
      <h2>Manage Posts</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {postId ? (
        <button onClick={handleUpdate}>Update Post</button>
      ) : (
        <button onClick={handleCreate}>Create Post</button>
      )}
      <button onClick={resetForm}>Cancel</button>
      {message && <p>{message}</p>}
      
      <h3>Existing Posts</h3>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title}
            <button onClick={() => selectPost(post)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPostForm;
