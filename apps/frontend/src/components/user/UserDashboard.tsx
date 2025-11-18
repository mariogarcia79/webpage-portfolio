import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, UserUpdate } from "../../types/user";
import { Link, useNavigate } from "react-router-dom";
import UsersAPI from "../../api/users.api";

const UserDashboard = () => {
  const { token, _id: contextUserId, logout } = useAuth();
  const navigate = useNavigate();
  const _id = contextUserId;

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    if (!_id || !token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const user = await UsersAPI.getUserById(_id, token);
        setUserData(user);
        setName(user.name);
        setEmail(user.email);
      } catch {
        setProfileMessage("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [_id, token]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!_id || !token) return;

    const data: UserUpdate = { _id, name, email };

    try {
      const updated = await UsersAPI.updateUserById(data, token);
      setUserData(updated);
      setProfileMessage("Profile updated!");
    } catch {
      setProfileMessage("Failed to update profile");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!_id || !token) return;

    if (newPassword !== newPasswordConfirm) {
      setPasswordMessage("New passwords do not match");
      return;
    }

    const data: UserUpdate = { _id, currentPassword, newPassword };
    try {
      await UsersAPI.updateUserPassword(data, token);
      setPasswordMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch {
      setPasswordMessage("Failed to change password");
    }
  };

  const handleDeleteUser = async () => {
    if (!_id || !token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await UsersAPI.deactivateUserById(_id, token);
      logout();
      navigate("/");
    } catch {
      setDeleteMessage("Failed to delete user");
    }
  };

  if (!token || !_id) {
    return (
      <div className="page-container">
        <p>
          You must <Link to="/login">log in</Link> to view your dashboard.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="page-container">
        <Link to="/" className="link">
          $ cd ../
        </Link>
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="header">
        <Link to="/" className="link">
          $ cd ../
        </Link>
      </div>

      <div className="post-content">
        <h1 className="title large left"># User Dashboard</h1>
      </div>

      <div className="post-content post-body" style={{ marginTop: "2rem" }}>
        <div className="post-body">
          <h1 className="title left" style={{ marginBottom: "1rem" }}>
            &gt; Account Settings
          </h1>

          <form className="form" onSubmit={handleProfileSave}>
            <label>
              Name:
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="button wide">
              Save Profile
            </button>
          </form>
          {profileMessage && <p className="success">{profileMessage}</p>}

          <h1
            className="title left"
            style={{ marginTop: "2rem", marginBottom: "1rem" }}
          >
            &gt; Change Password
          </h1>
          <form className="form" onSubmit={handlePasswordChange}>
            <label>
              Current Password:
              <input
                type="password"
                className="input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </label>

            <label>
              New Password:
              <input
                type="password"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </label>

            <label>
              Confirm New Password:
              <input
                type="password"
                className="input"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="button wide">
              Update Password
            </button>
          </form>
          {passwordMessage && <p className="error">{passwordMessage}</p>}

          <h1
            className="title left"
            style={{ marginTop: "2rem", marginBottom: "1rem" }}
          >
            &gt; Danger zone
          </h1>
          <div style={{ marginTop: "1rem" }}>
            <button className="button delete" onClick={handleDeleteUser}>
              Deactivate account
            </button>
            {deleteMessage && <p className="error">{deleteMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
