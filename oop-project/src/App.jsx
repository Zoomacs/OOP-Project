import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Home from "./Home";
import Contact from "./Contact";
import Restaurant from "./Restaurant";
import OrderHistory from "./OrderHistory";
import Notification from "./Notification";
import Register from "./Register";
import Navbar from "./Navbar";
import "./main.css";
import Cart from "./Cart";
import { useState, useEffect } from "react";

function App() {
  const [currentpage, setcurrentpage] = useState("login");
  const [cart, setCart] = useState("hidden cart-bar");
  return (
    <>
      <BrowserRouter>
        <Navbar page={currentpage} cart={cart} setCart={setCart} />

        <Routes>
          <Route path="/" element={<Login page={setcurrentpage} />} />
          <Route path="/home" element={<Home page={setcurrentpage} />} />
          <Route
            path="/restaurant"
            element={<Restaurant page={setcurrentpage} />}
          />
          <Route path="/contact" element={<Contact page={setcurrentpage} />} />

          <Route
            path="/orderhistory"
            element={<OrderHistory page={setcurrentpage} />}
          />

          <Route
            path="/notification"
            element={<Notification page={setcurrentpage} />}
          />
        </Routes>
      </BrowserRouter>
      <Cart page={setcurrentpage} display={cart} />
    </>
  );
}

export default App;
