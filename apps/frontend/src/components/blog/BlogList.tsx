import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types/post';
import PostAPI from '../../api/posts.api';
import { useAuth } from '../../context/AuthContext';
import styles from './BlogList.module.css';

function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isLoggedIn } = useAuth();

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
    <div className={styles['page-container']}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        {isLoggedIn && (
          <Link to="/blog/new" className={styles['new-post-button']}>
            New post
          </Link>
        )}
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <ul className={styles['post-list']}>
          {posts.map((p) => (
            <li key={p._id} className={styles['post-item']}>
              <Link to={`/blog/${p._id}`} className={styles['post-title']}>
                {p.title}
              </Link>
              <div className={styles['post-summary']}>{p.summary}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BlogList;

