import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types/user';
import UsersAPI from '../../api/users.api';
import { useAuth } from '../../context/AuthContext';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { _id, token, role } = useAuth();

  
  useEffect(() => {
    if (!token || role !== 'admin') {
      setLoading(false);
      setError('Unauthorized access.');
      return;
    }

    UsersAPI.getAllUsers(token)
      .then((data) => {
        setUsers(data);
        if (data.length === 0) {
          setError('No available users.');
        }
      })
      .catch(() => setError('Error loading users.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (userId: string) => {
      if (!userId || !token) return;
  
      const confirmed = window.confirm("Are you sure?");
      if (!confirmed) return;
  
      try {
        await UsersAPI.deleteUserById(userId, token);
        setUsers(prev => prev.filter(u => u._id !== userId));
      } catch {
        console.error("Failed to delete user");
      }
  };

  return (
    <>
      <div className="page-container">
        <div className="header">
          <Link to="/" className="link">$ cd ../</Link>
          <Link to="/signup" className="button compact">
            Create New Admin
          </Link>
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
              <div 
                key={u._id}
                className="user-row"
              >
                <Link to={`/dashboard/${u._id}`} className="user-name">{u.name}</Link>
                <div className="user-email">{u.email}</div>
                <div className="user-role">Role: {u.role}</div>
                <div className="user-actions">
                  {_id === u._id ? (
                    <button className="button delete compact" disabled onClick={() => handleDeleteUser(u._id)}>
                      Delete
                    </button> 
                  ) : (
                  <button className="button delete compact" onClick={() => handleDeleteUser(u._id)}>
                    Delete
                  </button>
                  )}
                </div>
              </div>
              
            ))}
            
          </ul>
        )}
      </div>
    </>
  );
}

export default UserList;