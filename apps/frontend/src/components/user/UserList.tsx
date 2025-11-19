import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types/user';
import UserAPI from '../../api/users.api';
import { useAuth } from '../../context/AuthContext';

function BlogList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, isLoggedIn, role } = useAuth();

  
  useEffect(() => {
    if (!token || role !== 'admin') {
      setLoading(false);
      setError('Unauthorized access.');
      return;
    }

    UserAPI.getAllUsers(token)
      .then((data) => {
        setUsers(data);
        if (data.length === 0) {
          setError('No available users.');
        }
      })
      .catch(() => setError('Error loading users.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-container">
        <div className="header">
          <Link to="/" className="link">$ cd ../</Link>
        </div>
        <div className="user-content">
          <h1 className="title large left"># Users</h1>
        </div>
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <ul className="user-list">
            {users.map((u) => (
              <Link 
                to={`/dashboard/${u._id}`}
                key={u._id}
                className="user-row"
              >
                <div className="user-name">{u.name}</div>
                <div className="user-email">{u.email}</div>
                <div className="user-role">Role: {u.role}</div>
                <div className="user-status">
                  Status: {u.active ? 'Active' : 'Inactive'}
                </div>
                <div className="user-actions">
                  <button className="button delete compact">
                    {u.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default BlogList;