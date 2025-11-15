import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom';
import AuthAPI from '../../api/auth.api';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const response = await AuthAPI.logIn(name, password);
      login(response.token);
      navigate('/blog');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container centered">
      <div className="container login">
        <h2 className="title">Login</h2>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          disabled={loading}
        />
        <button
          onClick={handleLogin}
          className="button"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px" }}>
          <p>
            Or{" "}
            <Link to="/signup" className="link login">sign up</Link>
            {" "}to make an account.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;