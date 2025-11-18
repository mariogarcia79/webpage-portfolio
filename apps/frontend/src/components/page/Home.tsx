import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Home() {
  const { isLoggedIn, role } = useAuth();

  return (
    <>
      <div className="page-container">
        <div className="header">
          <div className="post-summary">root@localhost:~# cat WELCOME.md</div>
        </div>
        <div className="post-content">
          <h1 className="title large left"># Welcome</h1>
          <div className="post-summary">
            <p>Hi! This is my personal blog where I share thoughts, projects, and ideas about web development and technology.</p>
          </div>
          <div className="post-body">
            <p>Feel free to explore my blog posts and learn more about the topics that interest you. If you have any questions or feedback, don't hesitate to reach out.</p>
            {isLoggedIn && role === 'admin' && (
              <p>
                As an admin, you can <Link to="/blog/new" className="link">create new posts</Link> or <Link to="/blog" className="link">manage existing posts</Link>.
              </p>
            )}
            <p>
              <Link to="/blog" className="link">Start reading the blog →</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
