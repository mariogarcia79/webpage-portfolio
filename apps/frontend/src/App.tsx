import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';

function App() {
  return (
    <Router>
      <header>
        <nav>
          <Link to="/">Home</Link> | <Link to="/blog">Blog</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/blog" element={<BlogList />} />
          <Route
            path="/"
            element={
              <div>
                <h1>Welcome</h1>
                <p>Simple blog demo.</p>
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
