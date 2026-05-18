import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { History, Moon, Sun, LogOut } from "lucide-react";
import { useState } from "react";

function Sidebar({ page, display, setSideBar }) {
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
    document.body.classList.toggle("dark");
  }

  function handleLogout() {
    // Hide the sidebar immediately
    if (setSideBar) setSideBar("hidden side-bar");

    // Clear session and navigate to login
    sessionStorage.clear();
    navigate("/", { replace: true });
  }

  return (
    <div className={`side-bar ${display || ""}`}>
      <div className="side-header">
        <h1 className="side-title">Food Court</h1>
      </div>

      <div className="side-nav">
        <Link
          to="/orderhistory"
          className={`side-icon ${page === "orderhistory" ? "curr" : ""}`}
        >
          <History />
          <span>Orders History</span>
        </Link>
      </div>

      <div className="side-footer">
        <button className="theme-button side-icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon /> : <Sun />}
          <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </button>
        <button className="logout-button side-icon" onClick={handleLogout}>
          <LogOut />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
