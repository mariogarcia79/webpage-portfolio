import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAPI from '../../api/auth.api';

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const response = await AuthAPI.signUp(name, email, password);
      console.log('Signup successful:', response);
      navigate('/login');
    } catch (err) {
      setError('Signup failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container centered">
      <div className="container">
        <h2 className="title">Sign Up</h2>
        {error && (
          <div className="error">
            {error}
          </div>
        )}
        <form
          className="form"
          onSubmit={(e) => { e.preventDefault(); handleSignup(); }}
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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            type="submit"
            className="button"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;