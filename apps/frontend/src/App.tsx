import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from "./components/page/Navbar";
import SignUp   from './components/auth/SignUp';
import LogIn    from './components/auth/LogIn';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';
import BlogEditor from './components/blog/BlogEditor';

function App() {
  return (
    <Router>
      <header>
        <Navbar />
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
          />*/
        </Routes>
      </main>
    </Router>
  );
}

export default App;
