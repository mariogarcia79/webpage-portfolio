import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post } from '../../types/post';
import PostAPI from '../../api/posts.api';
import { useAuth } from '../../context/AuthContext';

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
      <div className="page-container">
        <Link to="/blog" className="link">Back</Link>
        <p>No post found</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="header post">
        <Link to="/blog" className="link">Back</Link>
        {isLoggedIn && (
          <Link to={`/blog/edit/${id}`} className="button compact">
            Edit Post
          </Link>
        )}
      </div>
      <div className="post-content">
        <h1 className="title large left"> # {post.title}</h1>
        <div className="post-summary">{post.summary}</div>
        <div className="post-body">{post.content}</div>
      </div>
    </div>
  );
}

export default BlogPost;