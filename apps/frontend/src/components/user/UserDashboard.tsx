import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, getUserById, patchUserById } from "../../api/users.api";
import { Link } from "react-router-dom";

// Utility to parse JWT safely
const parseJwt = (token: string) => {
  try {
    const base64Payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64Payload)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const UserDashboard = () => {
  const { token, userId: contextUserId } = useAuth();

  // Fallback: parse userId from token if missing
  const userId = contextUserId || (token ? parseJwt(token)?.userId : null);

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const user = await getUserById(userId, token);
        setUserData(user);
      } catch {
        setMessage("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !token) return;

    if (password !== passwordConfirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await patchUserById(userId, { password }, token);
      setMessage("Password changed successfully");
      setPassword("");
      setPasswordConfirm("");
    } catch {
      setMessage("Failed to change password");
    }
  };

  if (!token || !userId) {
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

      <div className="page-content centered">
        <h1 className="title large left"># User Dashboard</h1>
      </div>

      <div
        className="page-content"
        style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "1rem" }}
      >
        {/* Left column: User Info */}
        <div style={{ flex: "0 0 200px" }}>
          <h2 className="title left">User Info</h2>
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Role:</strong> {userData.role || "user"}
          </p>
        </div>

        {/* Right column: Account Settings */}
        <div style={{ flex: "1 1 600px" }}>
          <h2 className="title left">Account Settings</h2>
          <form className="form" onSubmit={handleChangePassword}>
            <label>
              New Password:
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label>
              Confirm Password:
              <input
                type="password"
                className="input"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="button wide">
              Change Password
            </button>
          </form>
          {message && <p className="error">{message}</p>}

          <div style={{ marginTop: "2rem" }}>
            <h3 className="title left">Recent Activity</h3>
            <p>Comments and other user activity will appear here (to be implemented).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
