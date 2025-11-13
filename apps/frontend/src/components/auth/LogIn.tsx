import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import AuthAPI from '../../api/auth.api';
import styles from './Login.module.css';
import '../../styles/variables.css';

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
    <div className={styles['page-container']}>
      <div className={styles.container}>
        <h2 className={styles.title}>Login</h2>

        {error && <div className={styles.error}>{error}</div>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          disabled={loading}
        />
        <button
          onClick={handleLogin}
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </div>
    </div>
  );
}

export default Login;
