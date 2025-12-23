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
  const { isLoggedIn } = useAuth();

  const TITLE_MAX = 300;
  const SUMMARY_MAX = 1000;
  const CONTENT_MAX = 20000;

  const [title, setTitle] = useState('');
  const [titleCount, setTitleCount] = useState(0);

  const [summary, setSummary] = useState('');
  const [summaryCount, setSummaryCount] = useState(0);

  const [content, setContent] = useState('');
  const [contentCount, setContentCount] = useState(0);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const isEditing = !!id;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  // Load post if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      PostAPI.getPostById(id)
        .then(post => {
          setTitle(post.title);
          setTitleCount(post.title.length);

          setSummary(post.summary);
          setSummaryCount(post.summary.length);

          setContent(post.content);
          setContentCount(post.content.length);
        })
        .catch(() => setError('Failed to load post'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Uploads
  const handleFileUpload = async (file: File) => {
    try {
      const uploadUrl = await UploadAPI.uploadFile(file);
      const url = `${API_BASE_URL}/${uploadUrl}`;
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

  // Submit
  const handleSubmit = async () => {
    const clientError = validatePost(title, summary, content);
    if (clientError) return setError(clientError);

    try {
      setLoading(true);
      setError('');

      if (isEditing && id) {
        await PostAPI.updatePost(id, { title, summary, content });
      } else {
        await PostAPI.createPost(title, summary, content);
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

      {/* LEFT COLUMN */}
      <div className="editor-main">
        <h1 style={{ marginBottom: "1rem" }} className="title">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>

        {error && <div className="error block">{error}</div>}

        {/* TITLE + COUNTER */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          maxLength={TITLE_MAX}
          onChange={e => {
            const value = e.target.value;
            setTitle(value);
            setTitleCount(value.length);
          }}
          className="input wide"
          disabled={loading}
        />
        <div className="char-counter">
          {titleCount} / {TITLE_MAX}
        </div>

        {/* SUMMARY + COUNTER */}
        <textarea
          placeholder="Summary"
          value={summary}
          maxLength={SUMMARY_MAX}
          onChange={e => {
            const value = e.target.value;
            setSummary(value);
            setSummaryCount(value.length);
          }}
          className="textarea post-summary"
          disabled={loading}
        />
        <div className="char-counter">
          {summaryCount} / {SUMMARY_MAX}
        </div>

        {/* CONTENT + COUNTER */}
        <textarea
          placeholder="Content"
          value={content}
          maxLength={CONTENT_MAX}
          onChange={e => {
            const value = e.target.value;
            setContent(value);
            setContentCount(value.length);
          }}
          className="textarea post-content"
          disabled={loading}
        />
        <div className="char-counter">
          {contentCount} / {CONTENT_MAX}
        </div>

        {/* FILE UPLOAD */}
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

      {/* RIGHT SIDEBAR */}
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