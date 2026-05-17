import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./login";
import Register from "./Register";
import Home from "./Home";
import Contact from "./Contact";
import Restaurant from "./Restaurant";
import Menu from "./Menu";
import OrderHistory from "./OrderHistory";
import OrderTrack from "./OrderTrack";
import Notification from "./Notification";
import Navbar from "./Navbar";
import Checkout from "./Checkout";
import PaymentPage from "./PaymentPage";
import Cart from "./Cart";
import Sidebar from "./Sidebar";
import RestaurantOrders from "./RestaurantOrders";
import AdminApp from "./admin/AdminApp";

import RestaurantDashboard from "./RestaurantDashboard";
import MenuManagement from "./MenuManagement";
import RestaurantProfile from "./RestaurantProfile";

import "./main.css";
import "./App.css";

const OwnerProtectedRoute = ({ children }) => {
  const role = sessionStorage.getItem("userRole");
  if (role !== "owner") {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isOwnerRoute = location.pathname.startsWith("/owner");

  const isAuthRoute =
    location.pathname === "/" || location.pathname === "/register";

  const hideStandardUI = isAdminRoute || isAuthRoute;

  const [currentpage, setcurrentpage] = useState("login");
  const [cart, setCart] = useState("hidden cart-bar");
  const [sideBar, setSideBar] = useState("hidden side-bar");
  const [notification, setNotification] = useState("hidden notification");

  useEffect(() => {
    if (isAuthRoute) {
      setSideBar("hidden side-bar");
      setCart("hidden cart-bar");
      setNotification("hidden notification");
    }
  }, [isAuthRoute]);

  let activePage = currentpage;
  if (isOwnerRoute) {
    if (location.pathname === "/owner/dashboard") activePage = "dashboard";
    if (location.pathname === "/owner/menu") activePage = "menu";
    if (location.pathname === "/owner/profile") activePage = "profile";
    if (location.pathname === "/owner/orders") activePage = "dashboard";
  }

  return (
    <>
      {!hideStandardUI && (
        <Navbar
          page={activePage}
          cart={cart}
          setCart={setCart}
          sideBar={sideBar}
          setSideBar={setSideBar}
          notification={notification}
          setNotification={setNotification}
          isOwner={isOwnerRoute}
        />
      )}

      <Routes>
        <Route path="/" element={<Login page={setcurrentpage} />} />
        <Route path="/register" element={<Register page={setcurrentpage} />} />

        <Route path="/home" element={<Home page={setcurrentpage} />} />
        <Route
          path="/restaurant"
          element={<Restaurant page={setcurrentpage} />}
        />
        <Route path="/contact" element={<Contact page={setcurrentpage} />} />
        <Route
          path="/notification"
          element={<Notification page={setcurrentpage} display="" />}
        />
        <Route
          path="/orderhistory"
          element={<OrderHistory page={setcurrentpage} />}
        />
        <Route path="/checkout" element={<Checkout page={setcurrentpage} />} />
        <Route
          path="/PaymentPage"
          element={<PaymentPage page={setcurrentpage} />}
        />
        <Route
          path="/ordertrack"
          element={<OrderTrack page={setcurrentpage} />}
        />
        <Route
          path="/restaurant/:id"
          element={<Menu page={setcurrentpage} />}
        />
        <Route
          path="/restaurantorders"
          element={<RestaurantOrders page={setcurrentpage} />}
        />

        <Route
          path="/owner/dashboard"
          element={
            <OwnerProtectedRoute>
              <RestaurantDashboard />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/owner/menu"
          element={
            <OwnerProtectedRoute>
              <MenuManagement />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/owner/profile"
          element={
            <OwnerProtectedRoute>
              <RestaurantProfile />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/owner/orders"
          element={
            <OwnerProtectedRoute>
              <OrderHistory page={setcurrentpage} isOwner={true} />
            </OwnerProtectedRoute>
          }
        />

        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>

      {!hideStandardUI && !isOwnerRoute && (
        <>
          {location.pathname !== "/notification" && (
            <Notification page={setcurrentpage} display={notification} />
          )}
          <Cart page={setcurrentpage} display={cart} />
          <Sidebar
            page={currentpage}
            display={sideBar}
            setSideBar={setSideBar}
          />
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
