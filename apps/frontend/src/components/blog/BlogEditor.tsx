import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostAPI from '../../api/posts.api';
import { useAuth } from '../../context/AuthContext';
import { validatePost } from '../../utils/validation';
import UploadAPI from '../../api/uploads.api';
import { API_BASE_URL } from '../../constants/constants';

function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token, isLoggedIn } = useAuth();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const isEditing = !!id;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

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

  const handleFileUpload = async (file: File) => {
    try {
      await UploadAPI.uploadFile(file, token || "");
      const url = `${API_BASE_URL}/uploads/${file.name}`;
      setUploadedFiles(prev => [...prev, url]);
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

  const handleSubmit = async () => {
    if (!token) return setError('You must be logged in');

    const clientError = validatePost(title, summary, content);
    if (clientError) return setError(clientError);

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
      const msg = err?.response?.data?.message || err?.message || 'Failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-wrapper">

      {/* LEFT COLUMN: EDITOR */}
      <div className="editor-main">
        <h1 style={{ marginBottom: "1rem" }} className="title">{isEditing ? 'Edit Post' : 'Create New Post'}</h1>

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

      {/* RIGHT COLUMN: FILE LIST */}
      <div className="editor-sidebar">
        <h3>Uploaded URLs</h3>
        {uploadedFiles.length === 0 && (
          <p className="sidebar-empty">No files yet</p>
        )}
        <ul className="file-list">
          {uploadedFiles.map((url, i) => (
            <li key={i}>
              <code>{url}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BlogEditor;
