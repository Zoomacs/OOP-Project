import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/student/Home";
import Contact from "./pages/student/Contact";
import Restaurant from "./pages/student/Restaurant";
import Menu from "./pages/student/Menu";
import OrderHistory from "./pages/student/OrderHistory";
import OrderTrack from "./pages/student/OrderTrack";
import Notification from "./components/layout/Notification";
import Navbar from "./components/layout/Navbar";
import Checkout from "./pages/student/Checkout";
import PaymentPage from "./pages/student/PaymentPage";
import Cart from "./components/layout/Cart";
import Sidebar from "./components/layout/Sidebar";
import RestaurantOrders from "./pages/owner/RestaurantOrders";
import AdminApp from "./admin/AdminApp";

import RestaurantDashboard from "./pages/owner/RestaurantDashboard";
import MenuManagement from "./pages/owner/MenuManagement";
import RestaurantProfile from "./pages/owner/RestaurantProfile";
import "./App.css";

const OwnerProtectedRoute = ({ children }) => {
  const role = sessionStorage.getItem("userRole");
  if (role !== "owner") {
    return <Navigate to="/" replace />;
  }
  return children;
};

const StaffProtectedRoute = ({ children }) => {
  const role = sessionStorage.getItem("userRole");
  if (role !== "staff" && role !== "owner") {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isOwnerRoute = location.pathname.startsWith("/owner");
  const isStaffRoute = location.pathname.startsWith("/staff");

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
  if (isStaffRoute) {
    if (location.pathname === "/staff/orders") activePage = "orders";
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
          isStaff={isStaffRoute}
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
          path="/staff/orders"
          element={
            <StaffProtectedRoute>
              <RestaurantOrders page={setcurrentpage} />
            </StaffProtectedRoute>
          }
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

      {!hideStandardUI && !isOwnerRoute && !isStaffRoute && (
        <>
          {location.pathname !== "/notification" && (
            <Notification
              page={setcurrentpage}
              display={notification}
              setNotification={setNotification}
            />
          )}
          <Cart display={cart} setCart={setCart} />
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
