import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom';
import AuthAPI from '../../api/auth.api';
import { validateLogin } from '../../utils/validation';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (): Promise<void> => {
    const clientError = validateLogin(name, password);
    if (clientError) {
      setError(clientError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await AuthAPI.logIn(name.trim(), password);

      login(response.token);

      navigate('/blog');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please check your credentials.';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container centered">
      <div className="container">
        <h1 className="title">Login</h1>

        {error && ( 
          <div className="error">
            {error}
          </div>
        )}

        <form
          className="form"
          onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
        >
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
            onKeyDown={(e) => { if (e.key === "Enter") handleLogin() }}
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

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <p>
              Or{" "}
              <Link to="/signup" className="link login">sign up</Link>
              {" "}to make an account.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
