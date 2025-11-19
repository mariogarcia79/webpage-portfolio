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
          {isLoggedIn && role === 'admin' && (
            <Link to="/blog/new" className="button compact">
              New user
            </Link>
          )}
        </div>
        <div className="user-content">
          <h1 className="title large left"># Blog</h1>
        </div>
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <ul className="user-list">
            {users.map((u) => (
              <div
                key={u._id}
                className="user-wrapper"
              >
                <li className="user-item row">
                  <div className="col">
                    <Link to={`/users/${u._id}`} className="user-name">
                      ./{u.name}
                    </Link>
                  </div>
                  
                  <div className="col">
                  <p className="user-email">{u.email}</p>
                  </div>

                  <div className="col">
                  <p className="user-role">Role: {u.role}</p>
                  </div>
                  
                  <div className="col">
                  <p className="user-status">
                    Status: {u.active ? 'Active' : 'Inactive'}
                  </p>
                  </div>

                  <div className="col">
                  <button className="deactivate-button">
                    {u.active ? 'Deactivate' : 'Activate'}
                  </button>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default BlogList;