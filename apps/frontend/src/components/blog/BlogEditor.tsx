import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostAPI from '../../api/posts.api';
import { useAuth } from '../../context/AuthContext';
import { validatePost } from '../../utils/validation';
import UploadAPI from '../../api/uploads.api';

function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token, isLoggedIn } = useAuth();

  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const isEditing = !!id;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Redirect if not logged
  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  // Load post if editing
  useEffect(() => {
    if (id && token) {
      setLoading(true);
      PostAPI.getPostById(id)
        .then(post => {
          setTitle(post.title);
          setSummary(post.summary);
          setContent(post.content);
        })
        .catch(() => setError('Failed to load post'))
        .finally(() => setLoading(false));
    }
  }, [id, token]);

  // Upload logic
  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await UploadAPI.uploadFile(file, token || "");
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => handleFileUpload(file));
  };

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
        await PostAPI.updatePost(id, { title, summary, content }, token);
      } else {
        await PostAPI.createPost(title, summary, content, token);
      }

      navigate('/blog');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || `Failed to ${isEditing ? 'update' : 'create'} post.`;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2 className="title">{isEditing ? 'Edit Post' : 'Create New Post'}</h2>

      {error && <div className="error block">{error}</div>}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="input wide"
        disabled={loading}
      />

      <textarea
        placeholder="Summary"
        value={summary}
        onChange={e => setSummary(e.target.value)}
        className="textarea post-summary"
        disabled={loading}
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        className="textarea post-content"
        disabled={loading}
      />

      <div
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        Drag files here or <strong>click to upload</strong>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={e => {
            const files = e.target.files ? Array.from(e.target.files) : [];
            files.forEach(file => handleFileUpload(file));
            e.target.value = '';
          }}
          disabled={loading}
        />
      </div>

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
