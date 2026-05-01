import { Link } from "react-router-dom";
import "./Sidebar.css";
import { History, Moon, Sun } from "lucide-react";
import { useState } from "react";

function Sidebar({ page, display }) {
  const [theme, settheme] = useState("light");
  function ToggleTheme() {
    theme === "light" ? settheme("dark") : settheme("light");
    document.body.classList.toggle("dark");
  }
  return (
    <>
      <div className={display}>
        <h1 className="side-title">-Title-</h1>
        <button
          className={` ${theme == "light" ? "light" : ""} theme-button side-icon`}
          onClick={ToggleTheme}
        >
          {theme == "light" ? <Moon /> : <Sun />} Theme
        </button>
        <Link
          to="/orderhistory"
          className={`${page == "orderhistory" ? "curr side-icon" : "side-icon"} orderhistory`}
          onClick={() => {}}
        >
          <History />
          <p>Orders History</p>
        </Link>
      </div>
    </>
  );
}
export default Sidebar;
