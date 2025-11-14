import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="navbar">
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

      {isLoggedIn ? (
        <button onClick={logout}>Log Out</button>
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