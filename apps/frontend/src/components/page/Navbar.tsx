import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link to="/">Home</Link>
      <Link to="/blog">Blog</Link>
      {isLoggedIn ? (
        <>
          <button onClick={logout}>Log Out</button>
        </>
      ) : (
        <>
          <Link to="/login">Log In</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
