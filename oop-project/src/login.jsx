import { useState } from "react";
import "./login.css";
function Login({ page }) {
  page("login");

  const [ID, setID] = useState("");
  const [password, setPassword] = useState("");

  const handleIDChange = (event) => {
    setID(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`ID: ${ID}, Password: ${password}`);
  };

  return (
    <div className="qless-wrapper">
      <div className="qless-left">
        <div>
          <span className="qless-logo-text">Q-Less</span>
          <p className="qless-welcome">Welcome back, Academic</p>
        </div>

        <div className="qless-form">
          <div className="qless-field-group">
            <label className="qless-label">ID</label>
            <div className="qless-input-wrapper">
              <input
                type="text"
                placeholder="248670"
                value={ID}
                onChange={(e) => setID(e.target.value)}
                className="qless-input"
              />
            </div>
          </div>

          <div className="qless-field-group">
            <div className="qless-password-header">
              <label className="qless-label">Password</label>
              <a href="#" className="qless-forgot-password">
                Forgot Password?
              </a>
            </div>

            <div className="qless-input-wrapper">
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="qless-input"
              />
            </div>
          </div>

          <button onClick={handleSubmit} className="qless-sign-in-button">
            Sign In
          </button>

          <div className="qless-divider"></div>

          <div className="qless-sign-up">
            <p className="qless-sign-up-text">New to campus dining?</p>
            <button className="qless-sign-up-button">Register Account</button>
          </div>
        </div>

        <div className="qless-footer">
          <span>© 2024 Q-LESS UNIVERSITY</span>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>

      <div className="qless-right-side">
        <div className="qless-badge">CAMPUS NEWS</div>

        <p className="qless-tagline">
          Skip the line,
          <br /> stay in the <span>flow</span>.
        </p>

        <div className="qless-big-title">
          <span className="qless-big-word">CAMPUS</span>
          <br />
          <span className="qless-big-word-alt">LIFE</span>
        </div>

        <div className="qless-social-proof">
          <p className="qless-social-bold">Join 2,400+ students</p>
          <p className="qless-social-sub">
            ordering lunch right now at Central Hall.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
