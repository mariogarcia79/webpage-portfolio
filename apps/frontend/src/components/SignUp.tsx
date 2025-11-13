import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAPI from '../api/auth.api';

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
    <div className="p-8 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
          {error}
        </div>
      )}
      
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        disabled={loading}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        disabled={loading}
      />
      <button
        onClick={handleSignup}
        className="w-full bg-green-500 text-white p-2 rounded disabled:bg-green-300"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
    </div>
  );
}

export default SignUp;