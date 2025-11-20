import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, UserUpdate } from "../../types/user";
import { Link, useNavigate, useParams } from "react-router-dom";
import UsersAPI from "../../api/users.api";

const UserDashboard = () => {
  const { token, _id: contextUserId, logout, role } = useAuth();
  const { userId: routeUserId } = useParams();
  const navigate = useNavigate();
  const _id = routeUserId ?? contextUserId;

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [_, setPasswordMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    if (routeUserId && routeUserId !== contextUserId && role !== "admin") {
      navigate("/dashboard");
    } else if (routeUserId && routeUserId === contextUserId) {
      navigate("/dashboard");
    } 
  }, [routeUserId, contextUserId, role, navigate]);

  useEffect(() => {
    if (!_id || !token) {
      setLoading(false);
      return;
    }

    UsersAPI.getUserById(_id, token)
      .then((user) => {
        setUserData(user);
        setName(user.name);
        setEmail(user.email);
      })
      .finally(() => setLoading(false));
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

    const confirmed = window.confirm("Are you sure?");
    if (!confirmed) return;

    try {
      await UsersAPI.deleteUserById(_id, token);
      if (_id === contextUserId) {
        logout();
        navigate("/");
      } else {
        navigate("/users");
      }
    } catch {
      setDeleteMessage("Failed to delete user");
    }
  };

  if (!token || !contextUserId) {
    return (
      <div className="page-container">
        <p>You must <Link to="/login" className="link">log in</Link>.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="page-container">
        <Link to="/" className="link">$ cd ../</Link>
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ gap: "1.5rem" }}>
      {role === "admin"? (
        <div className="header" style={{ marginBottom: "1rem" }}>
          <Link to="/users" className="link">$ cd ../</Link>
        </div>
      ) : (
        <div className="header" style={{ marginBottom: "1rem" }}>
          <Link to="/" className="link">$ cd ../</Link>
        </div>
      )}
      

      <h1 className="title large left" style={{ maxWidth: "900px", width: "100%" }}>
        # User Dashboard
      </h1>

      <div className="user-list" style={{ maxWidth: "900px", marginTop: "1rem" }}>
        <div className="user-row" style={{ gridTemplateColumns: "1fr" }}>
          <div className="user-name"><strong>Name:</strong> {userData.name}</div>
          <div className="user-email"><strong>Email:</strong> {userData.email}</div>
          <div className="user-role"><strong>Role:</strong> {userData.role}</div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: "900px", padding: "1.2rem", gap: "1rem" }}>
        <h1 className="title left" style={{ marginBottom: "-1rem", fontSize: "1.4rem" }}>&gt; Edit Profile</h1>

        <form onSubmit={handleProfileSave} style={{ justifyContent: "right" }}>
          <div className="user-list">
            <div className="user-row" style={{  gridTemplateColumns: "1fr 4fr" }}>
              <div className="user-name">Name</div>
              <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="user-row" style={{  gridTemplateColumns: "1fr 4fr" }}>
              <div className="user-email">Email</div>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <button className="button compact" style={{ marginTop: "1rem" }}>Save Profile</button>
        </form>

        {profileMessage && <p className="error block">{profileMessage}</p>}
      </div>

      {routeUserId ? null : (
        <div className="container" style={{ maxWidth: "900px", padding: "1.2rem", gap: "1rem" }}>
          <h1 className="title left" style={{ marginBottom: "-1rem", fontSize: "1.4rem" }}>&gt; Change Password</h1>

          <form onSubmit={handlePasswordChange} style={{ justifyContent: "right" }}>
            <div className="user-list">
              <div className="user-row" style={{  gridTemplateColumns: "1fr 4fr" }}>
                <div className="user-password">Current Password</div>
                <input type="password" className="input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="user-row" style={{  gridTemplateColumns: "1fr 4fr" }}>
                <div className="user-password">New Password</div>
                <input type="password" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="user-row" style={{  gridTemplateColumns: "1fr 4fr" }}>
                <div className="user-password">Confirm Password</div>
                <input type="password" className="input" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} />
              </div>
            </div>
            <button className="button compact" style={{ marginTop: "1rem" }}>Update Password</button>
          </form>

          {profileMessage && <p className="error">{profileMessage}</p>}
        </div>
      )}
      
      {!routeUserId && role === "admin" ? (
        <div className="container" style={{ maxWidth: "900px", padding: "1.2rem" }}>
          <h1 className="title left" style={{ marginBottom: "0.5rem", fontSize: "1.4rem" }}>&gt; Danger Zone</h1>

          <button disabled style={{ marginTop: "1rem" }} className="button delete compact" onClick={handleDeleteUser}>
            Delete account
          </button>
          {deleteMessage && <p className="error">{deleteMessage}</p>}
        </div>
      ) : (
        <div className="container" style={{ maxWidth: "900px", padding: "1.2rem" }}>
          <h1 className="title left" style={{ marginBottom: "0.5rem", fontSize: "1.4rem" }}>&gt; Danger Zone</h1>

          <button style={{ marginTop: "1rem" }} className="button delete compact" onClick={handleDeleteUser}>
            Delete account
          </button>
          {deleteMessage && <p className="error">{deleteMessage}</p>}
        </div>
      )}
      </div>
  );
};

export default UserDashboard;
