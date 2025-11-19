import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/page/Navbar";
import Home from "./components/page/Home";
import SignUp from './components/auth/SignUp';
import LogIn from './components/auth/LogIn';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';
import BlogEditor from './components/blog/BlogEditor';
import UserDashboard from './components/user/UserDashboard';
import UserList from './components/user/UserList';
import { ProtectedRoute } from './components/page/ProtectedRoute';
import Footer from './components/page/Footer';

function App() {
  return (
    <Router>
      <header>
        <Navbar />
      </header>

      <main className="page-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* Protected Routes for Admin */}
          <Route
            path="/blog/new"
            element={
              <ProtectedRoute requiredRole="admin">
                <BlogEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog/edit/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <BlogEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserList />
              </ProtectedRoute>
            }
          />

          {/* Protected Route for any logged-in user */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </main>
    </Router>
  );
}

export default App;
