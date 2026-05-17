import { Link, useNavigate } from "react-router-dom";
import "./main.css";
import "./Navbar.css";
import {
  House,
  UtensilsIcon,
  Headset,
  ShoppingCart,
  Bell,
  Menu,
  LayoutDashboard,
  User,
  LogOut,
} from "lucide-react";

function Navbar({
  page,
  cart,
  setCart,
  sideBar,
  setSideBar,
  notification,
  setNotification,
  isOwner, // New prop to determine the current user role
}) {
  const navigate = useNavigate();

  function toggleCart() {
    setCart(cart === "hidden cart-bar" ? "cart-bar" : "hidden cart-bar");
    setSideBar("hidden side-bar");
    setNotification("hidden notification");
  }

  function toggleSideBar() {
    setSideBar(sideBar === "hidden side-bar" ? "side-bar" : "hidden side-bar");
    setCart("hidden cart-bar");
    setNotification("hidden notification");
  }

  function toggleNotification() {
    setNotification(
      notification === "hidden notification"
        ? "notification"
        : "hidden notification",
    );
    setCart("hidden cart-bar");
    setSideBar("hidden side-bar");
  }

  function closePopups() {
    setCart("hidden cart-bar");
    setSideBar("hidden side-bar");
    setNotification("hidden notification");
  }

  function handleLogout() {
    sessionStorage.clear();
    navigate("/", { replace: true });
  }

  if (page === "login" || page === "register") {
    return null;
  }

  return (
    <div className="navbar">
      <div className="nav-left">
        {/* Hide the sidebar menu toggle for owners since they don't have a sidebar */}
        {!isOwner && (
          <button
            className={`action-btn ${sideBar === "side-bar" ? "active" : ""}`}
            onClick={toggleSideBar}
          >
            <Menu />
          </button>
        )}
        <Link
          to={isOwner ? "/owner/dashboard" : "/home"}
          className="nav-logo"
          onClick={closePopups}
        >
          <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
            <rect rx="40" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
              <tspan>Q</tspan>-Less
            </text>
          </svg>
        </Link>
      </div>

      <div className="nav-center">
        {isOwner ? (
          <>
            <Link
              to="/owner/dashboard"
              className={`nav-link ${page === "dashboard" ? "curr" : ""}`}
            >
              <LayoutDashboard />
              <p>Dashboard</p>
            </Link>

            <Link
              to="/owner/menu"
              className={`nav-link ${page === "menu" ? "curr" : ""}`}
            >
              <UtensilsIcon />
              <p>Menu</p>
            </Link>

            <Link
              to="/owner/profile"
              className={`nav-link ${page === "profile" ? "curr" : ""}`}
            >
              <User />
              <p>Profile</p>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/home"
              className={`nav-link ${page === "home" ? "curr" : ""}`}
              onClick={closePopups}
            >
              <House />
              <p>Home</p>
            </Link>

            <Link
              to="/restaurant"
              className={`nav-link ${page === "restaurant" ? "curr" : ""}`}
              onClick={closePopups}
            >
              <UtensilsIcon />
              <p>Restaurants</p>
            </Link>

            <Link
              to="/contact"
              className={`nav-link ${page === "contact" ? "curr" : ""}`}
              onClick={closePopups}
            >
              <Headset />
              <p>Contact</p>
            </Link>
          </>
        )}
      </div>

      <div className="nav-right">
        {isOwner ? (
          <button className="action-btn" onClick={handleLogout} title="Logout">
            <LogOut />
          </button>
        ) : (
          <>
            <button
              className={`action-btn ${notification === "notification" ? "active" : ""}`}
              onClick={toggleNotification}
            >
              <Bell />
            </button>
            <button
              className={`action-btn ${cart === "cart-bar" ? "active" : ""}`}
              onClick={toggleCart}
            >
              <ShoppingCart />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
