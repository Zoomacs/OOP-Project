import { useState } from "react";
import logo from "../../assets/q-less-logo.png";
import "./AdminLogin.css";

export default function AdminLogin({ onLogin }) {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (adminId === "admin" && password === "123") {
      setError("");
      onLogin();
      return;
    }

    setError("Wrong admin ID or password");
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <img src={logo} alt="Q-Less logo" className="admin-login-logo" />
        <h1>Admin Login</h1>
        <p>Use the admin account to access the dashboard.</p>

        <label>Admin ID</label>
        <input
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          placeholder="admin"
          autoComplete="username"
        />

        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="123"
          type="password"
          autoComplete="current-password"
        />

        {error && <span className="admin-login-error">{error}</span>}

        <button type="submit">Login</button>

        <div className="admin-login-hint">
          ID: <b>admin</b> &nbsp; Password: <b>123</b>
        </div>
      </form>
    </div>
  );
}
