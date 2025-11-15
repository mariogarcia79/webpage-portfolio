import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types/post';
import PostAPI from '../../api/posts.api';
import { useAuth } from '../../context/AuthContext';

function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isLoggedIn, role } = useAuth();

  useEffect(() => {
    PostAPI.getAllPosts()
      .then((data) => {
        setPosts(data);
        if (data.length === 0) {
          setError('No available posts.');
        }
      })
      .catch(() => setError('Error loading posts.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="header">
        <Link to="/blog" className="link">Back</Link>
        {isLoggedIn && role === 'admin' && (
          <Link to="/blog/new" className="button compact">
            New post
          </Link>
        )}
      </div>
      <div className="post-content">
        <h1 className="title large left">Blog</h1>
      </div>
      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p._id} className="post-item">
              <div className="post-header">
                <Link to={`/blog/${p._id}`} className="post-title">
                  # {p.title}
                </Link>
                <div className="post-date">{p.createdAt.split("T")[0]}</div>
              </div>
              <div className="post-summary margin">{p.summary}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BlogList;