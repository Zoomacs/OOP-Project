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
    <div classname="qlesslogin">
      <div className="qless-logo">
        <span className="qless-logo-text">Q-Less</span>
        <p className="qless-welcome">Welcome back, Academic</p>
      </div>

      <div className="qless-form">
        <div className="qless-field-group">
          <label classname="ID">ID:</label>
          <div className="qless-input-wrapper">
            <span className="qless-input-icon">@</span>
            <input
              type="id"
              placeholder="24587"
              value={ID}
              onChange={(event) => setID(event.target.value)}
              classname="qless-input"
            />
          </div>
        </div>

        <div className="qless-field-group">
          <div className="qless-password-header">
            <label classname="password">Password</label>
          </div>
          <div className="qless-input-wrapper">
            <span className="qless-input-icon">🔒</span>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              classname="qless-input"
            />
          </div>
        </div>

        <button onClick={handleSubmit} className="qless-sign-in-button">
          Sign In
        </button>

        <a href="#" className="qless-forgot-password">
          Forgot password?
        </a>

        <div className="qless-sign-up">
          <p className="qless-sign-up-text">New to campus dining?</p>
          <button className="qless-sign-up-button">Register Account</button>
        </div>

        <div classname="qless-footer">
          <span> @2026 Q-LESS UNIVERSITY</span>
          <a href="#" className="qless-privacy-policy">
            Privacy Policy
          </a>
          <a href="#" className="qless-terms-of-service">
            Terms of Service
          </a>
        </div>
      </div>

      <div className="qless-right-side">
        <div classname="qless-badge">CAMPUS NEWS</div>
        <p className="qless-tagline">
          skip the line ,<br /> stay in the flow !
        </p>

        <div className="qless-big-title">
          <span className="qless-big-word">CAM</span>
          <span className="qless-big-word-alt">PUS</span>
          <br />
          <span className="qless-big-word">LI</span>
          <span className="qless-big-word-cursive">FE</span>
        </div>

        <div>
          <p className="qless-social-bold"> Join 1,000 students</p>
          <p className="qless-social-sub">
            order lunch now at the central hall.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
