import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChefHat, Utensils, CheckCircle2 } from "lucide-react";
import "./OrderTrack.css";

function OrderTrack({ page }) {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state?.orderData;

  useEffect(() => {
    page("ordertrack");
    if (!orderData) {
      navigate("/orderhistory");
    }
  }, [page, orderData, navigate]);

  if (!orderData) return null;

  const calculateTotal = () => {
    if (orderData.items && orderData.items.length > 0) {
      return orderData.items.reduce(
        (total, item) => total + item.price * item.qty,
        0,
      );
    }
    return orderData.points * 0.45;
  };

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
            <p>ESTIMATED ARRIVAL</p>
            <h2>12:45 PM</h2>
          </div>
        </div>

        <div className="status-container">
          <div className="status-step completed">
            <div className="step-icon">
              <ChefHat size={28} />
            </div>
            <h3 className="step-title">Preparing</h3>
            <p className="step-desc">Started at 12:15 PM</p>
          </div>

          <div className="status-line filled"></div>

          <div className="status-step active">
            <div className="step-icon">
              <Utensils size={28} />
            </div>
            <h3 className="step-title">Ready</h3>
            <p className="step-desc">Waiting for pickup</p>
          </div>

          <div className="status-line"></div>

          <div className="status-step">
            <div className="step-icon">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="step-title">Received</h3>
            <p className="step-desc">The order has been Recived</p>
          </div>
        </div>

        <div className="summary-container">
          <div className="summary-header">
            <h3>Order Summary</h3>
          </div>

          <div className="summary-items">
            {orderData.items && orderData.items.length > 0 ? (
              orderData.items.map((item, index) => (
                <div className="summary-item-row" key={index}>
                  <div className="item-image">
                    <img src={orderData.image} alt={item.name} />
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
                  <img src={orderData.image} alt={orderData.title} />
                </div>
                <div className="item-info">
                  <h4>{orderData.title} Order</h4>
                  <p>{orderData.description}</p>
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
