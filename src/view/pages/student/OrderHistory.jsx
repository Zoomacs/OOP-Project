import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import kfclogo from "../../assets/kfc-logo.png";
import { api, getUser } from "../../api";
import "./OrderHistory.css";

function OrderCard({ order, isOwner, onAdvanceStatus }) {
  const navigate = useNavigate();

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    sessionStorage.setItem("lastOrder", JSON.stringify({ id: order.id, time: order.time }));
    navigate("/ordertrack");
  };

  return (
    <article className="modern-order-card">
      <div className="card-main-info">
        <div className="brand-header">
          <div className="brand-logo-container">
            <img src={kfclogo} alt="Logo" className="brand-logo" />
          </div>
          <div className="brand-text">
            <h2 className="brand-title">
              {isOwner ? `Order #${order.id}` : order.restaurant}
            </h2>
            <p className="order-date">{order.time}</p>
          </div>
        </div>
        
        {isOwner && (
          <div className={`status-pill status-${order.status}`}>
            {order.status}
          </div>
        )}
      </div>

          <div className="card-price">{order.total || (order.totalPrice ? `${order.totalPrice} EGP` : '')}</div>

          <div className="card-divider"></div>

          <div className="card-footer">
        {!isOwner ? (
          <div className="points-tag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            +10 Points
          </div>
        ) : (
          <div className="spacer"></div>
        )}
        
        {isOwner ? (
          <button 
            type="button"
            className="order-action-btn primary-btn" 
            onClick={() => onAdvanceStatus(order.id, order.status)}
          >
            {order.status === "preparing" ? "Mark as Ready" : "Advance Status"}
          </button>
        ) : (
          <button 
            type="button"
            className="order-action-btn secondary-btn" 
            onClick={handleDetailsClick}
          >
            View Details
            <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}

function OrderHistory({ page, isOwner = false }) {
  const [sortBy, setSortBy] = useState("date");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (page) page(isOwner ? "dashboard" : "orderhistory");
  }, [page, isOwner]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = getUser();
        const defaultId = isOwner ? sessionStorage.getItem("restaurantId") || 1 : 6;
        const targetId = isOwner ? user?.restaurant_id || defaultId : user?.id || defaultId;
        const route = isOwner ? `orders&restaurant_id=${targetId}` : `orders&user_id=${targetId}`;
        
        const data = await api(route);
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err.message);
      }
    };
    
    fetchOrders();
  }, [isOwner]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => 
      sortBy === "date" ? new Date(b.time) - new Date(a.time) : 0
    );
  }, [orders, sortBy]);

  const advanceStatus = async (orderId, currentStatus) => {
    const next = currentStatus === "preparing" ? "ready" : "delivered";
    try {
      await api("update-status", { 
        method: "POST", 
        body: JSON.stringify({ order_id: orderId, status: next }) 
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: next, state: next } : o));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-layout">
      <div className="content-wrapper">
        <header className="dashboard-header">
          <div className="header-text-block">
            <h1 className="main-title">
              {isOwner ? "Restaurant Orders" : "Order History"}
            </h1>
            <p className="sub-title">
              {isOwner 
                ? "Monitor and manage incoming requests." 
                : "Track and review your dining activity."}
            </p>
          </div>
          <div className="total-stat-box">
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </header>

        <div className="filter-tabs">
          <button 
            className={`tab-btn ${sortBy === "date" ? "active" : ""}`}
            onClick={() => setSortBy("date")}
          >
            Latest First
          </button>
        </div>

        <div className="orders-grid">
          {sortedOrders.map((order, index) => (
            <div 
              key={order.id} 
              className="grid-item-animate"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <OrderCard 
                order={order} 
                isOwner={isOwner} 
                onAdvanceStatus={advanceStatus} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;