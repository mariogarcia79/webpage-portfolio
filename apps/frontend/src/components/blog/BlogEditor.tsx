import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostAPI from '../../api/posts.api';
import { useAuth } from '../../context/AuthContext';
import styles from './BlogEditor.module.css';

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

    try {
      setLoading(true);
      setError('');

      if (isEditing && id) {
        await PostAPI.updatePost(id, { title, summary, content }, token);
      } else {
        await PostAPI.createPost(title, summary, content, token);
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
    <div className={styles['page-container']}>
      <h2 className={styles.title}>
        {isEditing ? 'Edit Post' : 'Create New Post'}
      </h2>

      {error && <div className={styles.error}>{error}</div>}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
        disabled={loading}
      />

      <textarea
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className={styles.textarea}
        disabled={loading}
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={styles.textarea}
        disabled={loading}
      />

      <button
        onClick={handleSubmit}
        className={styles.button}
        disabled={loading || !title || !summary || !content}
      >
        {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
      </button>
    </div>
  );
}

export default BlogEditor;
