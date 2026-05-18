import { Link, useNavigate } from "react-router-dom";
import { Home, UtensilsIcon, Headset, History, Moon, Sun, LogOut, X, Coins, User, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { getUser } from "../../api";
import "./Sidebar.css";

function Sidebar({ page, display, setSideBar }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const navigate = useNavigate();
  const user = getUser();
  const userRole = user?.role || sessionStorage.getItem("userRole") || "";
  const userName = user?.name || "";
  const userPoints = Number(sessionStorage.getItem("userPoints") || 0);
  const isStudent = userRole === "student";
  const isAdmin = sessionStorage.getItem("adminLoggedIn") === "true";

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  function closeSidebar() {
    if (setSideBar) setSideBar("hidden side-bar");
  }

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  function handleLogout() {
    closeSidebar();
    sessionStorage.clear();
    navigate("/", { replace: true });
  }

  const links = [
    { to: "/home", label: "Home", key: "home", icon: <Home /> },
    { to: "/restaurant", label: "Restaurants", key: "restaurant", icon: <UtensilsIcon /> },
    { to: "/contact", label: "Contact", key: "contact", icon: <Headset /> },
    { to: "/orderhistory", label: "Orders History", key: "orderhistory", icon: <History /> },
  ];

  return (
    <div className={`side-bar ${display || ""}`}>
      <div className="side-header">
        <div>
          <h1 className="side-title">Q-Less</h1>
          <p className="side-subtitle">Food court menu</p>
        </div>
        <button className="side-close" onClick={closeSidebar} aria-label="Close sidebar">
          <X size={20} />
        </button>
      </div>

      {userName && (
        <div className="side-user-info">
          <div className="side-user-avatar">
            <User size={20} />
          </div>
          <div className="side-user-details">
            <span className="side-user-name">{userName}</span>
            <span className="side-user-role">{userRole}</span>
          </div>
        </div>
      )}
      {isStudent && (
        <div className="side-points-bar">
          <Coins size={18} />
          <span className="side-points-label">Points</span>
          <span className="side-points-value">{userPoints}</span>
        </div>
      )}
      <div className="side-nav">
        {links.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={closeSidebar}
            className={`side-icon ${page === item.key ? "curr" : ""}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="side-footer">
        {isAdmin && (
          <button className="admin-return-btn side-icon" onClick={() => { closeSidebar(); navigate("/admin"); }}>
            <LayoutDashboard size={20} />
            <span>Back to Dashboard</span>
          </button>
        )}
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
