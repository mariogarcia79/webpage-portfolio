import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post } from '../types/post';
import PostAPI from '../api/posts.api';

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (!id) return;
    
    PostAPI.getPostById(id as string)
      .then((p) => setPost(p))
      .catch(() => setPost(null));
  }, [id]);

  if (!post) {
    return (
      <div className="p-8">
        <Link to="/blog" className="text-blue-500">Back</Link>
        <p>No post</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-600 mb-4">{post.summary}</div>
      <div className="mb-6">{post.content}</div>
      
      <div className="flex gap-4">
        <Link to="/blog" className="text-blue-500">Back</Link>
        
        {isLoggedIn && (
          <Link 
            to={`/blog/edit/${id}`} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Post
          </Link>
        )}
      </div>
    </div>
  );
}

export default BlogPost;