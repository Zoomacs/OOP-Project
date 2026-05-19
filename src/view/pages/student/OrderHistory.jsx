import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { api, getUser } from "../../api";
import "./OrderHistory.css";

const DEFAULT_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23cc0600' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2'%3E%3C/path%3E%3Cpath d='M7 2v20'%3E%3C/path%3E%3Cpath d='M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7'%3E%3C/path%3E%3C/svg%3E";

function OrderCard({ order, isOwner, onAdvanceStatus, restaurantImages, isHighlighted }) {
  const navigate = useNavigate();

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    sessionStorage.setItem("lastOrder", JSON.stringify({ id: order.id, time: order.time }));
    navigate("/ordertrack");
  };

  const imgSrc = restaurantImages?.[order.restaurant_id] || DEFAULT_IMG;
  const totalDisplay = order.total || (order.totalPrice != null ? `${Number(order.totalPrice).toFixed(2)} EGP` : '0.00 EGP');

  let receipt = null;
  try {
    const parsed = JSON.parse(order.note);
    if (parsed && typeof parsed === 'object' && ('subtotal' in parsed || 'tax' in parsed)) {
      receipt = parsed;
    }
  } catch {}

  return (
    <article className={`modern-order-card ${isHighlighted ? "highlighted-order" : ""}`}>
      <div className="card-main-info">
        <div className="brand-header">
          <div className="brand-logo-container">
            <img src={imgSrc} alt="Logo" className="brand-logo" />
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

      <div className="card-price">{totalDisplay}</div>

      {receipt && !isOwner && (
        <div className="receipt-breakdown">
          {receipt.subtotal != null && (
            <div className="receipt-row"><span>Subtotal</span><span>{Number(receipt.subtotal).toFixed(2)} EGP</span></div>
          )}
          {receipt.staff_discount > 0 && (
            <div className="receipt-row receipt-discount"><span>Staff discount</span><span>-{Number(receipt.staff_discount).toFixed(2)} EGP</span></div>
          )}
          {receipt.points_discount > 0 && (
            <div className="receipt-row receipt-discount"><span>Points discount</span><span>-{Number(receipt.points_discount).toFixed(2)} EGP</span></div>
          )}
          {receipt.code_discount > 0 && (
            <div className="receipt-row receipt-discount"><span>Code discount</span><span>-{Number(receipt.code_discount).toFixed(2)} EGP</span></div>
          )}
          {receipt.delivery_fee > 0 && (
            <div className="receipt-row"><span>Delivery fee</span><span>{Number(receipt.delivery_fee).toFixed(2)} EGP</span></div>
          )}
          {receipt.tax != null && (
            <div className="receipt-row"><span>Tax</span><span>{Number(receipt.tax).toFixed(2)} EGP</span></div>
          )}
        </div>
      )}

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
  const [restaurantImages, setRestaurantImages] = useState({});
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const ordersRef = useRef(null);

  useEffect(() => {
    if (page) page(isOwner ? "dashboard" : "orderhistory");
  }, [page, isOwner]);

  useEffect(() => {
    api("restaurants")
      .then((data) => {
        const map = {};
        (data.restaurants || data.data?.restaurants || []).forEach((r) => {
          const img = r.image_url || r.imageUrl;
          if (r.id && img) map[r.id] = img;
        });
        setRestaurantImages(map);
      })
      .catch(() => {});
  }, []);

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

  useEffect(() => {
    if (!highlightId || orders.length === 0) return;
    const id = Number(highlightId);
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-order-id="${id}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [highlightId, orders]);

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

        <div className="orders-grid" ref={ordersRef}>
          {sortedOrders.map((order, index) => (
            <div 
              key={order.id} 
              className="grid-item-animate"
              style={{ animationDelay: `${index * 0.05}s` }}
              data-order-id={order.id}
            >
              <OrderCard 
                order={order} 
                isOwner={isOwner} 
                onAdvanceStatus={advanceStatus} 
                restaurantImages={restaurantImages}
                isHighlighted={highlightId && Number(highlightId) === order.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
