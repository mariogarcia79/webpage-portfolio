import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostAPI from '../api/posts.api';
import { Post } from '../types/post';

const BlogPost: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id) return;
    PostAPI.getPostById(id as string)
      .then((p) => setPost(p))
      .catch(() => setPost(null));
  }, [id]);

  if (!post) return (
    <div>
      <Link to="/blog">Back</Link>
      <p>No post</p>
    </div>
  );

  return (
    <div>
      <h1>{post.title}</h1>
      <div>{post.summary}</div>
      <div>{post.content}</div>
      <Link to="/blog">Back</Link>
    </div>
  );
};

export default BlogPost;
