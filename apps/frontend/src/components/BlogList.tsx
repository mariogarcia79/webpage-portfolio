import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types/post';
import PostAPI from '../api/posts.api';

function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    PostAPI.getAllPosts()
      .then((data) => setPosts(data))
      .catch(() => setPosts([]));
  }, []);

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((p) => (
          <li key={p._id}>
            <Link to={`/blog/${p._id}`}>{p.title}</Link>
            <div>{p.summary}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;