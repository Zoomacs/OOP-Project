import { useState } from "react";
import Home from "./Home";
import Contact from "./Contact";
import "./main.css";
import { ThemeContext } from "./App";
import { useContext } from "react";
import Restaurant from "./Restaurant";
import { House, Moon, Sun, Utensils, Headset } from "lucide-react";
import { ReactComponent as Icon } from "./assets/icon.svg";


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
<Icon/>
            <div
              className={home}
              onClick={() => {
                navigate("home");
              }}
            >
              <House />
              <p>Home</p>
            </div>
            <div
              className={restaurant}
              onClick={() => {
                navigate("restaurant");
              }}
            >
              <Utensils />
              <p>Restaurants</p>
            </div>
            <div
              className={contact}
              onClick={() => {
                navigate("contact");
              }}
            >
              <Headset /> <p>Contact</p>
            </div>
            <button
              className={`theme-button ${theme == "light" ? "light" : ""}`}
              onClick={ToggleTheme}
            >
              {theme == "light" ? <Moon /> : <Sun />}
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
