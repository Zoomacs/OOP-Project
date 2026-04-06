import { useState } from "react";
import Home from "./Home";
import Contact from "./Contact";
import "./main.css";
import { ThemeContext } from "./App";
import { useContext } from "react";
import Restaurant from "./Restaurant";
import { SunMoon } from 'lucide-react';

function Navbar() {
  const [curPage, setpage] = useState("home");
  const [home, sethome] = useState("curr nav-icon");
  const [restaurant, setrestaurant] = useState("nav-icon");
  const [contact, setcontact] = useState("nav-icon");

  const { theme, settheme } = useContext(ThemeContext);
  function ToggleTheme() {
    theme === "light" ? settheme("dark") : settheme("light");
    document.body.classList.toggle("dark");
  }
  function navigate(page) {
    setpage(page);
    if (page === "home") {
      sethome("curr nav-icon");
      setrestaurant("nav-icon");
      setcontact("nav-icon");
    } else if (page === "contact") {
      sethome("nav-icon");
      setrestaurant("nav-icon");
      setcontact("curr nav-icon");
    } else if (page === "test") {
      sethome("nav-icon");
      setrestaurant("nav-icon");
      setcontact("nav-icon");
    } else if (page === "restaurant") {
      sethome("nav-icon");
      setrestaurant("curr nav-icon");
      setcontact("nav-icon");
    }
  }

  return (
    <>
      <header>
        <nav>
          <div className="navbar">
            <div
              className={home}
              onClick={() => {
                navigate("home");
              }}
            >
              <p>Home</p>
            </div>
            <div
              className={restaurant}
              onClick={() => {
                navigate("restaurant");
              }}
            >
              <p>Restaurants</p>
            </div>
            <div
              className={contact}
              onClick={() => {
                navigate("contact");
              }}
            >
              <p>Contact</p>
            </div>
            <button className="nav-icon" onClick={ToggleTheme}>
              Theme
            </button>
          </div>

          {curPage == "home" && <Home />}
          {curPage == "contact" && <Contact />}
          {curPage == "restaurant" && <Restaurant />}
        </nav>
      </header>
    </>
  );
}

export default Navbar;
