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
import Sidebar from "./Sidebar";

function App() {
  const [currentpage, setcurrentpage] = useState("login");
  const [cart, setCart] = useState("hidden cart-bar");
  const [sideBar, setSideBar] = useState("hidden side-bar");
  return (
    <>
      <BrowserRouter>
        <Navbar
          page={currentpage}
          cart={cart}
          setCart={setCart}
          sideBar={sideBar}
          setSideBar={setSideBar}
        />
        <Routes>
          <Route path="/" element={<Login page={setcurrentpage} />} />
          <Route
            path="/register"
            element={<Register page={setcurrentpage} />}
          />
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
          <Route
            path="/register"
            element={<Register page={setcurrentpage} />}
          />
        </Routes>
        <Sidebar page={currentpage} display={sideBar} />
      </BrowserRouter>
      <Cart page={setcurrentpage} display={cart} />
    </>
  );
}

export default App;
