import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostAPI from '../../api/posts.api';
import { useAuth } from '../../context/AuthContext';
import { validatePost } from '../../utils/validation';

function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token, isLoggedIn } = useAuth();
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const isEditing = !!id;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (id && token) {
      setLoading(true);
      PostAPI.getPostById(id)
        .then((post) => {
          setTitle(post.title);
          setSummary(post.summary);
          setContent(post.content);
        })
        .catch(() => setError('Failed to load post'))
        .finally(() => setLoading(false));
    }
  }, [id, token]);

  const handleSubmit = async (): Promise<void> => {
    if (!token) {
      setError('You must be logged in');
      return;
    }
    const clientError = validatePost(title, summary, content);
    if (clientError) {
      setError(clientError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      if (isEditing && id) {
        await PostAPI.updatePost(id, { title: title.trim(), summary: summary.trim(), content }, token);
      } else {
        await PostAPI.createPost(title.trim(), summary.trim(), content, token);
      }
      navigate('/blog');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || `Failed to ${isEditing ? 'update' : 'create'} post. Please try again.`;
      setError(String(msg));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2 className="title">
        {isEditing ? 'Edit Post' : 'Create New Post'}
      </h2>
      {error && <div className="error block">{error}</div>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input wide"
        disabled={loading}
      />
      <textarea
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="textarea post-summary"
        disabled={loading}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="textarea post-content"
        disabled={loading}
      />
      <button
        onClick={handleSubmit}
        className="button wide"
        disabled={loading || !title || !summary || !content}
      >
        {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
      </button>
    </div>
  );
}

export default BlogEditor;