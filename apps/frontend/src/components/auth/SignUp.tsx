import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAPI from '../../api/auth.api';
import { validateSignup } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';

function SignUp() {
  const navigate = useNavigate();
  const { role } = useAuth();
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

      if (role === "admin") {
        await AuthAPI.signUpAdmin(name.trim(), email.trim(), password, role);
      } else {
        await AuthAPI.signUp(name.trim(), email.trim(), password);
      }

      navigate(role === "admin" ? '/users' : '/login');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Signup failed. Please try again.';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container centered">
      <div className="container">
        <h1 className="title" style={{ marginBottom: "1rem" }}>
          {role === "admin" ? "Create Admin" : "Sign Up"}
        </h1>

        {error && <div className="error block">{error}</div>}

        <form className="form" onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
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

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Creating...' : role === "admin" ? "Create Admin" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
