import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChefHat, Utensils, CheckCircle2 } from "lucide-react";
import "./OrderTrack.css";
import { api } from "./api";

function OrderTrack({ page }) {
  const location = useLocation();
  const navigate = useNavigate();
  const saved = JSON.parse(sessionStorage.getItem("lastOrder") || "null");
  const baseOrderData = location.state?.orderData || saved;
  const [liveStatus, setLiveStatus] = useState("pending");

  useEffect(() => {
    if (page) page("ordertrack");
    if (!baseOrderData?.id) return;
    const fetchTracking = async () => {
      try {
        const result = await api(`order-track&order_id=${baseOrderData.id}`);
        setLiveStatus(result.order.status);
      } catch (error) { console.error("Failed to fetch live tracking:", error); }
    };
    fetchTracking();
    const interval = setInterval(fetchTracking, 5000);
    return () => clearInterval(interval);
  }, [page, baseOrderData?.id]);

  if (!baseOrderData) return <div className="ot-page-container"><button className="details-btn back-nav" onClick={() => navigate("/orderhistory")}>&larr; Back to Orders</button><h2>No order selected</h2></div>;
  const isPreparing = liveStatus === "pending" || liveStatus === "preparing";
  const isReady = liveStatus === "ready";
  const isDelivered = liveStatus === "delivered" || liveStatus === "received";

  return <div className="ot-page-container"><div className="track-wrapper"><button className="details-btn back-nav" onClick={() => navigate("/orderhistory")}>&larr; Back to Orders</button><div className="track-hero"><div className="head-text"><h1>Your feast is<br />being prepared!</h1></div><div className="estimated-card"><p>ORDER TIME</p><h2>{String(baseOrderData.time || new Date().toLocaleTimeString()).split(",").pop()}</h2></div></div><div className="status-container"><div className={`status-step ${isPreparing || isReady || isDelivered ? "completed" : "active"}`}><div className="step-icon"><ChefHat size={28} /></div><h3 className="step-title">Preparing</h3><p className="step-desc">In the kitchen</p></div><div className={`status-line ${isReady || isDelivered ? "filled" : ""}`}></div><div className={`status-step ${isReady ? "active" : isDelivered ? "completed" : ""}`}><div className="step-icon"><Utensils size={28} /></div><h3 className="step-title">Ready</h3><p className="step-desc">Waiting for pickup</p></div><div className={`status-line ${isDelivered ? "filled" : ""}`}></div><div className={`status-step ${isDelivered ? "completed" : ""}`}><div className="step-icon"><CheckCircle2 size={28} /></div><h3 className="step-title">Received</h3><p className="step-desc">Order completed</p></div></div><div className="summary-container"><div className="summary-header"><h3>Order Summary</h3></div><div className="summary-items"><div className="summary-item-row"><div className="item-info"><h4>Order #{baseOrderData.id}</h4><p>Status: {liveStatus}</p><p className="unit-price">Total: {baseOrderData.total || ""} EGP</p></div></div></div></div></div></div>;
}
export default OrderTrack;
