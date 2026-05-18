import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChefHat, Utensils, CheckCircle2 } from "lucide-react";
import "./OrderTrack.css";

function OrderTrack({ page }) {
  const location = useLocation();
  const navigate = useNavigate();
  const baseOrderData = location.state?.orderData;

  const [liveStatus, setLiveStatus] = useState("pending");

  useEffect(() => {
    if (page) page("ordertrack");
    if (!baseOrderData) {
      navigate("/orderhistory");
      return;
    }

    // Fetch live tracking details from the backend
    const fetchTracking = async () => {
      try {
        const response = await fetch(`http://localhost/oop-project/backend/api.php?route=order-track&order_id=${baseOrderData.id}`);
        const result = await response.json();
        
        if (result.status === "success") {
          setLiveStatus(result.data.status); // e.g., 'pending', 'out_for_delivery', 'delivered'
        }
      } catch (error) {
        console.error("Failed to fetch live tracking:", error);
      }
    };

    fetchTracking();
    
    // Poll the database every 5 seconds for live updates
    const interval = setInterval(fetchTracking, 5000);
    return () => clearInterval(interval);

  }, [page, baseOrderData, navigate]);

  if (!baseOrderData) return null;

  const calculateTotal = () => {
    if (baseOrderData.items && baseOrderData.items.length > 0) {
      return baseOrderData.items.reduce(
        (total, item) => total + item.price * item.qty,
        0
      );
    }
    return baseOrderData.points ? baseOrderData.points * 0.45 : 0;
  };

  // Determine active step based on live database status
  const isPreparing = liveStatus === 'pending' || liveStatus === 'preparing';
  const isReady = liveStatus === 'out_for_delivery';
  const isDelivered = liveStatus === 'delivered';

  return (
    <div className="ot-page-container">
      <div className="track-wrapper">
        <button
          className="details-btn back-nav"
          onClick={() => navigate("/orderhistory")}
        >
          &larr; Back to Orders
        </button>

        <div className="track-hero">
          <div className="head-text">
            <h1>
              Your feast is
              <br />
              on the way!
            </h1>
          </div>

          <div className="estimated-card">
            <p>ORDER TIME</p>
            <h2>{baseOrderData.time.split(',')[1]}</h2>
          </div>
        </div>

        <div className="status-container">
          <div className={`status-step ${isPreparing || isReady || isDelivered ? 'completed' : 'active'}`}>
            <div className="step-icon">
              <ChefHat size={28} />
            </div>
            <h3 className="step-title">Preparing</h3>
            <p className="step-desc">In the kitchen</p>
          </div>

          <div className={`status-line ${isReady || isDelivered ? 'filled' : ''}`}></div>

          <div className={`status-step ${isReady ? 'active' : (isDelivered ? 'completed' : '')}`}>
            <div className="step-icon">
              <Utensils size={28} />
            </div>
            <h3 className="step-title">Ready</h3>
            <p className="step-desc">Waiting for pickup</p>
          </div>

          <div className={`status-line ${isDelivered ? 'filled' : ''}`}></div>

          <div className={`status-step ${isDelivered ? 'completed' : ''}`}>
            <div className="step-icon">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="step-title">Received</h3>
            <p className="step-desc">Order completed</p>
          </div>
        </div>

        <div className="summary-container">
          <div className="summary-header">
            <h3>Order Summary</h3>
          </div>

          <div className="summary-items">
            {baseOrderData.items && baseOrderData.items.length > 0 ? (
              baseOrderData.items.map((item, index) => (
                <div className="summary-item-row" key={index}>
                  <div className="item-image">
                    <img src={baseOrderData.image} alt={item.name} />
                  </div>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>{item.variant}</p>
                    <p className="unit-price">${item.price?.toFixed(2)} each</p>
                  </div>
                  <div className="item-totals">
                    <div className="item-qty">x{item.qty}</div>
                    <div className="item-line-price">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="summary-item-row">
                <div className="item-image">
                  <img src={baseOrderData.image} alt={baseOrderData.title} />
                </div>
                <div className="item-info">
                  <h4>Order #{baseOrderData.title}</h4>
                  <p>{baseOrderData.description}</p>
                </div>
                <div className="item-totals">
                  <div className="item-qty">x1</div>
                </div>
              </div>
            )}
          </div>

          <div className="summary-footer">
            <span className="total-label">TOTAL AMOUNT</span>
            <span className="total-price">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTrack;