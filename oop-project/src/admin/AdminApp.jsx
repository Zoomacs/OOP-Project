import "./admin.css";
import "./AdminApp.css";
import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UsersManagement from "./pages/UsersManagement";
import OrdersMonitoring from "./pages/OrdersMonitoring";
import PaymentMonitoring from "./pages/PaymentMonitoring";
import SystemAnalytics from "./pages/SystemAnalytics";
import Tickets from "./pages/Tickets";
import BanStudent from "./pages/BanStudent";
import AddRestaurant from "./pages/AddRestaurant";
import RemoveRestaurant from "./pages/RemoveRestaurant";
import AddAdmin from "./pages/AddAdmin";
import ViewCustomers from "./pages/ViewCustomers";
import ViewTransactions from "./pages/ViewTransactions";
import ViewContactTickets from "./pages/ViewContactTickets";
import ReplyContactTicket from "./pages/ReplyContactTicket";

export default function AdminApp() {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem("userRole") === "admin";
  });

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAdminLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="admin-scope">
      <Routes>
        <Route path="login" element={<Navigate to="/" replace />} />

        <Route
          element={
            isAdminLoggedIn ? (
              <Layout onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users-management" element={<UsersManagement />} />
          <Route path="orders-monitoring" element={<OrdersMonitoring />} />
          <Route path="payment-monitoring" element={<PaymentMonitoring />} />
          <Route path="system-analytics" element={<SystemAnalytics />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="ban-student" element={<BanStudent />} />
          <Route path="add-restaurant" element={<AddRestaurant />} />
          <Route path="remove-restaurant" element={<RemoveRestaurant />} />
          <Route path="add-admin" element={<AddAdmin />} />
          <Route path="view-customers" element={<ViewCustomers />} />
          <Route path="view-transactions" element={<ViewTransactions />} />
          <Route path="view-contact-tickets" element={<ViewContactTickets />} />
          <Route path="reply-contact-ticket" element={<ReplyContactTicket />} />
        </Route>

        <Route path="*" element={<Navigate to={isAdminLoggedIn ? "/admin" : "/"} replace />} />
      </Routes>
    </div>
  );
}