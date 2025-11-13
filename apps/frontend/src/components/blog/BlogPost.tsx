import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post } from '../../types/post';
import PostAPI from '../../api/posts.api';
import { useAuth } from '../../context/AuthContext';
import styles from './BlogPost.module.css';

function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!id) return;
    PostAPI.getPostById(id)
      .then((p) => setPost(p))
      .catch(() => setPost(null));
  }, [id]);

  if (!post) {
    return (
      <div className={styles['page-container']}>
        <Link to="/blog" className={styles['back-link']}>Back</Link>
        <p>No post found</p>
      </div>
    );
  }

  return (
    <div className={styles['page-container']}>
      <div className={styles.header}>
        <Link to="/blog" className={styles['back-link']}>Back</Link>
        {isLoggedIn && (
          <Link to={`/blog/edit/${id}`} className={styles['edit-button']}>
            Edit Post
          </Link>
        )}
      </div>

      <div className={styles['post-content']}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.summary}>{post.summary}</div>
        <div className={styles.content}>{post.content}</div>
      </div>
    </div>
  );
}

export default BlogPost;
