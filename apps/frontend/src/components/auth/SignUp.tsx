import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAPI from '../../api/auth.api';
import { validateSignup } from '../../utils/validation';

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async (): Promise<void> => {
    const clientError = validateSignup(name, email, password);
    if (clientError) {
      setError(clientError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      await AuthAPI.signUp(name.trim(), email.trim(), password);
      navigate('/login');
    } catch (err: any) {
      // show server error message if present
      const msg = err?.response?.data?.message || err?.message || 'Signup failed. Please try again.';
      setError(String(msg));
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
            onKeyDown={(e) => { if (e.key === "Enter") handleSignup() }}
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