import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./OrderHistory.css";
import kfclogo from "./assets/kfc-logo.png";
import { api, getUser } from "./api";

function OrderHistory({ page, isOwner = false }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("date");
  const [orders, setOrders] = useState([]);

  useEffect(() => { if (page) page(isOwner ? "dashboard" : "orderhistory"); }, [page, isOwner]);
  useEffect(() => {
    const user = getUser();
    const restaurantId = Number(user?.restaurant_id || sessionStorage.getItem("restaurantId") || 1);
    const route = isOwner ? `orders&restaurant_id=${restaurantId}` : `orders&user_id=${user?.id || 6}`;
    api(route).then((data) => setOrders(data.orders || [])).catch((err) => console.log(err.message));
  }, [isOwner]);

  const sortedData = [...orders].sort((a, b) => sortBy === "date" ? new Date(b.time) - new Date(a.time) : 0);
  async function advanceStatus(orderId, currentStatus) {
    const next = currentStatus === "preparing" ? "ready" : "delivered";
    await api("update-status", { method: "POST", body: JSON.stringify({ order_id: orderId, status: next }) });
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: next, state: next } : o));
  }

  return (
    <div className="oh-page-container"><div className="order-place"><div className="order-head"><div className="order-head-title"><h1>{isOwner ? "Restaurant Orders" : "Your Past Orders"}</h1><span className="total-badge">{orders.length} TOTAL ORDERS</span></div><p className="order-head-desc">{isOwner ? "Monitor, track, and update status logs." : "Manage and track your recent campus dining activities."}</p></div><div className="order-filters"><button className={sortBy === "date" ? "active" : ""} onClick={() => setSortBy("date")}>Sort by Date</button></div>
      <div className="Order-history">{sortedData.map((order) => <div className="Order-card" key={order.id}><div className="card-img"><img src={kfclogo} alt="logo" /></div><div className="card-content"><div className="card-header"><h2 className="card-title">{isOwner ? `Order #${order.id}` : order.restaurant}</h2>{isOwner && <span className={`status-badge ${order.status}`}>{order.status}</span>}</div><div className="card-details"><p className="card-description">{order.customer ? `Customer: ${order.customer}` : `Total: ${order.total}`}</p><p className="card-time">{order.time}</p><div className="card-actions">{isOwner ? <button className="details-btn" onClick={() => advanceStatus(order.id, order.status)}>{order.status === "preparing" ? "Mark as Ready" : "Advance Status"}</button> : <button className="details-btn" onClick={() => { sessionStorage.setItem("lastOrder", JSON.stringify({ id: order.id, time: order.time })); navigate("/ordertrack"); }}>Details</button>}</div></div></div>{!isOwner && <div className="card-points"><p className="card-points">+10 Points</p></div>}</div>)}</div></div></div>
  );
}
export default OrderHistory;
