import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Post } from '../../types/post';
import PostAPI from '../../api/posts.api';
import MarkdownRenderer from './MarkdownRenderer';

function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const { isLoggedIn, role } = useAuth();

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
      <div className="header">
        <Link to="/blog" className="link">Back</Link>
        {isLoggedIn && role === 'admin' && (
          <Link to={`/blog/edit/${id}`} className="button compact">
            Edit Post
          </Link>
        )}
      </div>
      <div className="post-content">
        <h1 className="title large left"> # {post.title}</h1>
        <div className="post-summary">{post.summary}</div>
        <div className="post-body">
          <MarkdownRenderer content={post.content}/>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;