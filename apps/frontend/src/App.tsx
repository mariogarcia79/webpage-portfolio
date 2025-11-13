import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignUp   from './components/SignUp';
import LogIn    from './components/LogIn';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import BlogEditor from './components/BlogEditor';

function App() {
  return (
    <Router>
      <header>
        <nav>
          <Link to="/">       Home    </Link> |
          <Link to="/blog">   Blog    </Link> |
          <Link to="/signup"> Sign Up </Link> |
          <Link to="/login">  Log In  </Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/signup"   element={<SignUp  />} />
          <Route path="/login"    element={<LogIn   />} />
          <Route path="/blog/:id" element={<BlogPost/>} />
          <Route path="/blog"     element={<BlogList/>} />
          <Route path="/blog/new" element={<BlogEditor />} />
          <Route path="/blog/edit/:id" element={<BlogEditor />} />
          <Route
            path="/"
            element={
              <div>
                <h1>Welcome</h1>
                <p>This is my blog.</p>
                <Link to="/blog">Go to Blog</Link>
              </div>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
