import "./login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login({ page }) {
  useEffect(() => {
    page("login");
  }, [page]);

  const [ID, setID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const enteredID = ID.trim();
    const enteredPassword = password.trim();

    if (!enteredID || !enteredPassword) {
      setError("Please enter your ID and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost/OOP-Project/oop-project/backend/routes/auth.php?action=login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: enteredID, password: enteredPassword }),
        },
      );

      const data = await response.json();

      if (data.success) {
        // Save user info to sessionStorage
        sessionStorage.setItem("userRole", data.user.type);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        // Navigate based on role
        if (data.user.type === "admin") {
          navigate("/admin", { replace: true });
        } else if (data.user.type === "restaurant_owner") {
          navigate("/owner/dashboard", { replace: true });
        } else if (data.user.type === "restaurant_staff") {
          navigate("/staff/orders", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      } else {
        setError(data.message);
      }
    } catch {
      setError("Connection failed. Make sure XAMPP is running.");
    } finally {
      setLoading(false);
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

          {error && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="qless-sign-in-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
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
