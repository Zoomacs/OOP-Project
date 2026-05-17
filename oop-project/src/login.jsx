import "./login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login({ page }) {
  useEffect(() => {
    page("login");
  }, [page]);

  const [ID, setID] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const enteredID = ID.trim();
    const enteredPassword = password.trim();

    if (enteredID === "admin" && enteredPassword === "123") {
      sessionStorage.setItem("userRole", "admin");
      navigate("/admin", { replace: true });
      return;
    }

    if (enteredID === "owner" && enteredPassword === "123") {
      sessionStorage.setItem("userRole", "owner");
      navigate("/owner/dashboard", { replace: true });
      return;
    }

    // New Staff Role
    if (enteredID === "staff" && enteredPassword === "123") {
      sessionStorage.setItem("userRole", "staff");
      navigate("/staff/orders", { replace: true });
      return;
    }

    if (enteredID === "123" && enteredPassword === "123") {
      sessionStorage.setItem("userRole", "student");
      navigate("/home", { replace: true });
      return;
    }
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
                placeholder="123, staff, owner, or admin"
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
            <button
              className="qless-sign-up-button"
              onClick={() => navigate("/register")}
            >
              Register Account
            </button>
          </div>
        </div>

        <div className="qless-footer">
          <span>© 2026 Q-LESS UNIVERSITY</span>
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
