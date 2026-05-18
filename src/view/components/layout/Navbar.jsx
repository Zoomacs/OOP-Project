import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
import "./Navbar.css";

function Navbar({
  page,
  cart,
  setCart,
  sideBar,
  setSideBar,
  notification,
  setNotification,
  isOwner,
  isStaff,
}) {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(() => {
    const saved = sessionStorage.getItem("cartItems");

    if (!saved) {
      return 0;
    }

    try {
      const items = JSON.parse(saved);
      let total = 0;

      for (let i = 0; i < items.length; i++) {
        total += Number(items[i].quantity);
      }

      return total;
    } catch {
      return 0;
    }
  });

  const [cartPulse, setCartPulse] = useState(false);

  useEffect(() => {
    function handleCartUpdated(event) {
      setCartCount(event.detail.count || 0);
      setCartPulse(true);

      setTimeout(() => {
        setCartPulse(false);
      }, 350);
    }

    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

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


  return (
    <div className="navbar">
      <div className="nav-left">
        {!isOwner && !isStaff && (
          <button
            className={`action-btn ${sideBar === "side-bar" ? "active" : ""}`}
            onClick={toggleSideBar}
            type="button"
          >
            <Menu size={22} />
          </button>
        )}

        <Link
          to={
            isOwner ? "/owner/dashboard" : isStaff ? "/staff/orders" : "/home"
          }
          className="nav-logo"
          onClick={closePopups}
        >
          <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
            <rect rx="40" fill="transparent" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
              <tspan>Q</tspan>-Less
            </text>
          </svg>
        </Link>
      </div>

      <div className="nav-center">
        {isOwner && (
          <>
            <Link
              to="/owner/dashboard"
              className={`nav-link ${page === "dashboard" ? "curr" : ""}`}
            >
              <LayoutDashboard size={20} />
              <p>Dashboard</p>
            </Link>

            <Link
              to="/owner/menu"
              className={`nav-link ${page === "menu" ? "curr" : ""}`}
            >
              <UtensilsIcon size={20} />
              <p>Menu</p>
            </Link>

            <Link
              to="/owner/profile"
              className={`nav-link ${page === "profile" ? "curr" : ""}`}
            >
              <User size={20} />
              <p>Profile</p>
            </Link>
          </>
        )}

        {!isOwner && !isStaff && (
          <>
            <Link
              to="/home"
              className={`nav-link ${page === "home" ? "curr" : ""}`}
              onClick={closePopups}
            >
              <House size={20} />
              <p>Home</p>
            </Link>

            <Link
              to="/restaurant"
              className={`nav-link ${page === "restaurant" ? "curr" : ""}`}
              onClick={closePopups}
            >
              <UtensilsIcon size={20} />
              <p>Restaurants</p>
            </Link>

            <Link
              to="/contact"
              className={`nav-link ${page === "contact" ? "curr" : ""}`}
              onClick={closePopups}
            >
              <Headset size={20} />
              <p>Contact</p>
            </Link>
          </>
        )}
      </div>

      <div className="nav-right">
        {isOwner || isStaff ? (
          <button
            className="action-btn logout-btn"
            onClick={handleLogout}
            title="Logout"
            type="button"
          >
            <LogOut size={22} />
          </button>
        ) : (
          <>
            <button
              className={`action-btn ${
                notification === "notification" ? "active" : ""
              }`}
              onClick={toggleNotification}
              type="button"
            >
              <Bell size={22} />
            </button>

           <button
  className={`action-btn cart-nav-btn ${
    cart === "cart-bar" ? "active" : ""
  }`}
  onClick={toggleCart}
  type="button"
>
  <ShoppingCart size={24} />

  {cartCount > 0 && (
    <span className={`cart-nav-badge ${cartPulse ? "pulse" : ""}`}>
      {cartCount}
    </span>
  )}
</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;