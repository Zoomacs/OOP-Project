import React, { useState } from "react";
import Navbar from "./Navbar";
import "./main.css";


export const ThemeContext = React.createContext();

function App() {
  const [theme, settheme] = useState("light");

  return (
    <>  
      <div className={theme}>
        <ThemeContext value={{ theme, settheme }}>
          <Navbar />
        </ThemeContext>
      </div>
      </>
  );
}

export default App;
