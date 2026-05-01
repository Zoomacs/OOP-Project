import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./main.css";
import "./Navbar.css";
import {
  House,
  Moon,
  Sun,
  Utensils,
  Headset,
  ShoppingCart,
  Bell,
  UtensilsIcon,
  Contact,
  ContactIcon,
  NotebookIcon,
  BellIcon,
  Menu,
} from "lucide-react";

function Navbar({ page, cart, setCart, sideBar, setSideBar }) {
  const [notification, setnotification] = useState("nav-icon");

  function toggleCart() {
    cart == "hidden cart-bar"
      ? setCart("cart-bar")
      : setCart("hidden cart-bar");
    setSideBar("hidden side-bar");
  }

  function toggleSideBar() {
    sideBar == "hidden side-bar"
      ? setSideBar("side-bar")
      : setSideBar("hidden side-bar");
    setCart("hidden cart-bar");
  }

  if (page == "login") {
    return null;
  }

  if (page == "register") {
    return null;
  }

  return (
    <>
      <header>
        <nav>
          <div className="navbar">
            <Link
              className={`${sideBar == "side-bar" ? "active side-btn" : "side-btn"}`}
              onClick={toggleSideBar}
            >
              <Menu />
            </Link>
            <Link
              to="./home"
              onClick={() => {
                setCart("hidden cart-bar");
                setSideBar("hidden side-bar");
              }}
            >
              <svg
                className="logo"
                viewBox="0 0 500 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect rx="40" />

                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                >
                  <tspan>Q</tspan>-Less
                </text>
              </svg>
            </Link>
            <Link
              to="/home"
              className={`${page == "home" ? "curr nav-icon" : "nav-icon"} home`}
              onClick={() => {
                setCart("hidden cart-bar");
                setSideBar("hidden side-bar");
              }}
            >
              <House />
              <p>Home</p>
            </Link>

            <Link
              to="/restaurant"
              className={`${page == "restaurant" ? "curr nav-icon" : "nav-icon"} restaurant`}
              onClick={() => {
                setCart("hidden cart-bar");
                setSideBar("hidden side-bar");
              }}
            >
              <UtensilsIcon />
              <p>Restaurants</p>
            </Link>

            <Link
              to="/contact"
              className={`${page == "contact" ? "curr nav-icon" : "nav-icon"}`}
              onClick={() => {
                setCart("hidden cart-bar");
                setSideBar("hidden side-bar");
              }}
            >
              <Headset />
              <p>Contact</p>
            </Link>

            <Link
              to="/notification"
              className={`${page == "notification" ? "curr nav-icon" : "nav-icon"} notification`}
              onClick={() => {
                setCart("hidden cart-bar");
                setSideBar("hidden side-bar");
              }}
            >
              <BellIcon />
              <p>Notifications</p>
            </Link>

            <Link
              className={`${cart == "cart-bar" ? "active cart-icon" : "cart-icon"}`}
              onClick={toggleCart}
            >
              <ShoppingCart />
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
