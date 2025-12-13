import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Banner from './Banner';

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
          <Banner></Banner>
          <div className="post-body">
            <br></br>
            <p>This blog is all about getting into the guts of technology. We’ll explore <strong>reverse engineering embedded systems</strong>, break down firmware, and learn how to bypass software protections. It’s not about shortcuts, but understanding how things really work and how to make them work for you.</p>
            <br></br>
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
