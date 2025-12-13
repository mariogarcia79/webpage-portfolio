import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from 'react';

const Navbar = () => {
  const { role, isLoggedIn, logout } = useAuth();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef<number>(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const current = window.scrollY;

      if (current > lastY.current && current > 80) {
        setHidden(true);
      } else if (current < lastY.current) {
        setHidden(false);
      }

      lastY.current = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${hidden ? 'hidden' : ''}`}>
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? "active" : undefined}
      >
        Home
      </NavLink>

      <NavLink 
        to="/blog"
        className={({ isActive }) => isActive ? "active" : undefined}
      >
        Blog
      </NavLink>

      {isLoggedIn && role === "admin" && (
        <NavLink
          to="/users"
          className={({ isActive }) => isActive ? "active" : undefined}
        >
          Users
        </NavLink>
      )}

      {isLoggedIn ? (
        <>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => isActive ? "active" : undefined}
          >
            Dashboard
          </NavLink>
          <button onClick={logout}>Log Out</button>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            className={({ isActive }) => isActive ? "active" : undefined}
          >
            Log In
          </NavLink>

          <NavLink
            to="/signup"
            className={({ isActive }) => isActive ? "active" : undefined}
          >
            Sign Up
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default Navbar;
