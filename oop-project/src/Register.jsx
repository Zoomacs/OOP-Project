import { useState } from "react";
import "./Register.css";

function Register({ page }) {
  if (page) {
    page("register");
  }

  const [tab, settab] = useState("Student");
  const [showpassword, setshowPassword] = useState("false");
  const [showconfirmPassword, setshowConfirmPassword] = useState("false");

  const [studentform, setstudentForm] = useState({
    fullName: "",
    ID: "",
    universityEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [staffform, setstaffForm] = useState({
    fullName: "",
    ID: "",
    universityEmail: "",
    Faculty: "",
    password: "",
    confirmPassword: "",
  });

  const handleStudentChange = (event) => {
    setstudentForm({
      ...studentform,
      [event.target.name]: event.target.value,
    });
  };

  const handleStaffChange = (event) => {
    setstaffForm({
      ...staffform,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = () => {
    if (tab === "Student") {
      if (studentform.password !== studentform.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      alert("Student registered successfully!");
    } else {
      if (staffform.password !== staffform.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      alert("Staff registered successfully!");
    }
  };

  return (
    <div className="reg-wrapper">
      <div className="reg-left">
        <div className="reg-brand">Q-LESS UNIVERSITY</div>
        <div className="reg-hero">
          <h2 className="reg-hero-title">
            Join the <span className="reg-hero-accent">Campus</span> Dining
            Revolution.
          </h2>
          <p className="reg-hero-sub">
            Skip the lines and fuel your focus. Create an account to manage your
            university dining experience with precision and ease.
          </p>
        </div>

        <div className="reg-cards">
          <div className="reg-card">
            <span className="reg-card-icon">⏱</span>
            <h4 className="reg-card-title">Zero Wait Time</h4>
            <p className="reg-card-text">
              Schedule your meals around your classes and never wait in a queue
              again.
            </p>
          </div>
          <div className="reg-card">
            <span className="reg-card-icon">🍴</span>
            <h4 className="reg-card-title">Fresh Updates</h4>
            <p className="reg-card-text">
              Get real-time daily menu notifications and exclusive campus dining
              offers.
            </p>
          </div>
        </div>

        <div className="reg-social-proof">
          <p className="reg-social-text">
            Joined by 12,000+ students and staff members.
          </p>
        </div>
      </div>

      <div className="reg-right">
        <div className="reg-form-card">
          <div className="reg-form-header">
            <h2 className="reg-form-title">Create Account</h2>
            <div className="reg-dots">
              <span className="reg-dot reg-dot-active"></span>
              <span className="reg-dot"></span>
              <span className="reg-dot"></span>
            </div>
          </div>

          <div className="reg-tabs">
            {["Student", "Staff"].map((t) => (
              <button
                key={t}
                className={`reg-tab ${tab === t ? "reg-tab-active" : ""}`}
                onClick={() => {
                  settab(t);
                  setshowPassword(false);
                  setshowConfirmPassword(false);
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="reg-fields">
            {tab === "Student" ? (
              <>
                <div className="reg-field">
                  <label className="reg-field-label">FULL NAME</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">👤</span>
                    <input
                      className="reg-input"
                      type="text"
                      name="fullName"
                      placeholder="Alex Johnson"
                      value={studentform.fullName}
                      onChange={handleStudentChange}
                    />
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-field-label">UNIVERSITY ID</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">🪪</span>
                    <input
                      className="reg-input"
                      type="text"
                      name="universityID"
                      placeholder="U-12345678"
                      value={studentform.universityID}
                      onChange={handleStudentChange}
                    />
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-field-label">EMAIL</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">✉️</span>
                    <input
                      className="reg-input"
                      type="email"
                      name="email"
                      placeholder="alex@email.com"
                      value={studentform.email}
                      onChange={handleStudentChange}
                    />
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-field-label">PASSWORD</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">🔒</span>
                    <input
                      className="reg-input"
                      type={showpassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••••••"
                      value={studentform.password}
                      onChange={handleStudentChange}
                    />
                    <button
                      className="reg-eye"
                      onClick={() => setshowPassword(!showpassword)}
                    >
                      {showpassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-field-label">CONFIRM PASSWORD</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">🔒</span>
                    <input
                      className="reg-input"
                      type={showconfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••••••"
                      value={studentform.confirmPassword}
                      onChange={handleStudentChange}
                    />
                    <button
                      className="reg-eye"
                      onClick={() =>
                        setshowConfirmPassword(!showconfirmPassword)
                      }
                    >
                      {showconfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="reg-field">
                  <label className="reg-field-label">FULL NAME</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">👤</span>
                    <input
                      className="reg-input"
                      type="text"
                      name="fullName"
                      placeholder="Dr. Smith"
                      value={staffform.fullName}
                      onChange={handleStaffChange}
                    />
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-field-label">STAFF ID</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">🪪</span>
                    <input
                      className="reg-input"
                      type="text"
                      name="staffID"
                      placeholder="S-98765432"
                      value={staffform.staffID}
                      onChange={handleStaffChange}
                    />
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-field-label">UNIVERSITY EMAIL</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">✉️</span>
                    <input
                      className="reg-input"
                      type="email"
                      name="universityEmail"
                      placeholder="smith@university.edu"
                      value={staffform.universityEmail}
                      onChange={handleStaffChange}
                    />
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-field-label">DEPARTMENT</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">🏛️</span>
                    <input
                      className="reg-input"
                      type="text"
                      name="department"
                      placeholder="Computer Science"
                      value={staffform.department}
                      onChange={handleStaffChange}
                    />
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-field-label">PASSWORD</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">🔒</span>
                    <input
                      className="reg-input"
                      type={showpassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••••••"
                      value={staffform.password}
                      onChange={handleStaffChange}
                    />
                    <button
                      className="reg-eye"
                      onClick={() => setshowPassword(!showpassword)}
                    >
                      {showpassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-field-label">CONFIRM PASSWORD</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">🔒</span>
                    <input
                      className="reg-input"
                      type={showpassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••••••"
                      value={staffform.confirmPassword}
                      onChange={handleStaffChange}
                    />
                    <button
                      className="reg-eye"
                      onClick={() => setshowPassword(!showconfirmPassword)}
                    >
                      {showconfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button className="reg-submit" onClick={handleSubmit}>
            Create My Account →
          </button>

          <p className="reg-login-link">
            Already have an account?{" "}
            <a href="/" className="reg-login-a">
              Log in
            </a>
          </p>

          <p className="reg-secure">🔒 SECURE UNIVERSITY AUTHENTICATION</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
