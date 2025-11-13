import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostAPI from '../api/posts.api';

function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams(); // Si hay id, estamos editando
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const isEditing = !!id;

  // Cargar el post si estamos editando
  useEffect(() => {
    if (id) {
      PostAPI.getPostById(id)
        .then((post) => {
          setTitle(post.title);
          setSummary(post.summary);
          setContent(post.content);
        })
        .catch(() => setError('Failed to load post'));
    }
  }, [id]);

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token') || '';
      
      if (!token) {
        setError('You must be logged in');
        return;
      }
      
      if (isEditing && id) {
        // Actualizar post existente
        await PostAPI.updatePost(id, { title, summary, content }, token);
        console.log('Post updated');
      } else {
        // Crear nuevo post
        await PostAPI.createPost(title, summary, content, token);
        console.log('Post created');
      }
      
      navigate('/blog');
      
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} post. Please try again.`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? 'Edit Post' : 'Create New Post'}
      </h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
          {error}
        </div>
      )}
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        disabled={loading}
      />
      
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        disabled={loading}
      />
      
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 mb-3 border rounded h-64"
        disabled={loading}
      />
      
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-blue-300"
        disabled={loading || !title || !summary || !content}
      >
        {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
      </button>
    </div>
  );
}

export default BlogEditor;