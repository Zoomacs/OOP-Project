import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./main.css";
import "./Navbar.css";
import Notification from "./Notification";
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
} from "lucide-react";
import Cart from "./Cart";

function Navbar({ page, cart, setCart }) {
  const [notification, setnotification] = useState("nav-icon");
  const [theme, settheme] = useState("light");

  function ToggleTheme() {
    theme === "light" ? settheme("dark") : settheme("light");
    document.body.classList.toggle("dark");
  }

  function toggleCart() {
    cart == "hidden cart-bar"
      ? setCart("cart-bar")
      : setCart("hidden cart-bar");
  }

  if (page == "login") {
    return null;
  }

  return (
    <>
      <header>
        <nav>
          <div className="navbar">
            <Link to="./home">
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
              }}
            >
              <UtensilsIcon />
              <p>Restaurants</p>
            </Link>

            <Link
              to="/contact"
              className={`${page == "contact" ? "curr nav-icon" : "nav-icon"} contact`}
              onClick={() => {
                setCart("hidden cart-bar");
              }}
            >
              <Headset />
              <p>Contact</p>
            </Link>

            <Link
              to="/orderhistory"
              className={`${page == "orderhistory" ? "curr nav-icon" : "nav-icon"} orderhistory`}
              onClick={() => {
                setCart("hidden cart-bar");
              }}
            >
              <Headset />
              <p>Orders</p>
            </Link>

            <Link
              to="/notification"
              className={`${page == "notification" ? "curr nav-icon" : "nav-icon"} notification`}
              onClick={() => {
                setCart("hidden cart-bar");
              }}
            >
              <BellIcon />
              <p>Notifications</p>
            </Link>

            <Link
              className={`${cart == "cart-bar" ? "curr cart-icon" : "cart-icon"} cart`}
              onClick={toggleCart}
            >
              <ShoppingCart />
            </Link>

            <button
              className={`theme-button ${theme == "light" ? "light" : ""}`}
              onClick={ToggleTheme}
            >
              {theme == "light" ? <Moon /> : <Sun />}
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
