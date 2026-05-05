import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./login";
import Home from "./Home";
import Contact from "./Contact";
import Restaurant from "./Restaurant";
import OrderHistory from "./OrderHistory";
import OrderTrack from "./OrderTrack";
import Notification from "./Notification";
import Register from "./Register";
import Navbar from "./Navbar";
import Checkout from "./Checkout";
import PaymentPage from "./PaymentPage";
import "./main.css";
import Cart from "./Cart";
import { useState } from "react";
import Sidebar from "./Sidebar";
import RestaurantOrders from "./RestaurantOrders";
import AdminApp from "./admin/AdminApp";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [currentpage, setcurrentpage] = useState("login");
  const [cart, setCart] = useState("hidden cart-bar");
  const [sideBar, setSideBar] = useState("hidden side-bar");
  const [notification, setNotification] = useState("hidden notification");

  return (
    <>
      {!isAdminRoute && (
        <Navbar
          page={currentpage}
          cart={cart}
          setCart={setCart}
          sideBar={sideBar}
          setSideBar={setSideBar}
          notification={notification}
          setNotification={setNotification}
        />
      )}

      <Routes>
        <Route path="/" element={<Login page={setcurrentpage} />} />
        <Route path="/register" element={<Register page={setcurrentpage} />} />
        <Route path="/home" element={<Home page={setcurrentpage} />} />
        <Route path="/restaurant" element={<Restaurant page={setcurrentpage} />} />
        <Route path="/contact" element={<Contact page={setcurrentpage} />} />
        <Route path="/notification" element={<Notification page={setcurrentpage} display="" />} />
        <Route path="/orderhistory" element={<OrderHistory page={setcurrentpage} />} />
        <Route path="/checkout" element={<Checkout page={setcurrentpage} />} />
        <Route path="/PaymentPage" element={<PaymentPage page={setcurrentpage} />} />
        <Route path="/ordertrack" element={<OrderTrack page={setcurrentpage} />} />
        <Route path="/restaurantorders" element={<RestaurantOrders page={setcurrentpage} />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>

      {!isAdminRoute && (
        <>
          {location.pathname !== "/notification" && (
            <Notification page={setcurrentpage} display={notification} />
          )}
          <Cart page={setcurrentpage} display={cart} />
          <Sidebar page={currentpage} display={sideBar} />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
