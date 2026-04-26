import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Home from "./Home";
import Contact from "./Contact";
import Restaurant from "./Restaurant";
import Notification from "./Notification";
import Navbar from "./Navbar";
import "./main.css";
import Cart from "./Cart";
import { useState } from "react";

function App() {
  const [currentpage, setcurrentpage] = useState("login");

  return (
    <BrowserRouter>
      <Navbar page={currentpage} />

      <Routes>
        <Route path="/" element={<Login page={setcurrentpage} />} />
        <Route path="/home" element={<Home page={setcurrentpage} />} />
        <Route
          path="/restaurant"
          element={<Restaurant page={setcurrentpage} />}
        />
        <Route path="/contact" element={<Contact page={setcurrentpage} />} />
        <Route path="/cart" element={<Cart page={setcurrentpage} />} />
        <Route
          path="/notification"
          element={<Notification page={setcurrentpage} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
