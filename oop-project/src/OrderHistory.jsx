import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./OrderHistory.css";
import kfclogo from "./assets/kfc-logo.png";

const OrderCard = ({
  image,
  title,
  description,
  time,
  points,
  onViewDetails,
  isOwner,
  status,
  onAdvanceStatus,
}) => (
  <div className="Order-card">
    <div className="card-img">
      <img src={image} alt="logo" />
    </div>

    <div className="card-content">
      <div className="card-header">
        <h2 className="card-title">{isOwner ? `Order #${title}` : title}</h2>
        {isOwner && (
          <span className={`status-badge ${status?.toLowerCase()}`}>
            {status}
          </span>
        )}
      </div>

      <div className="card-details">
        <p className="card-description">{description}</p>
        <p className="card-time">{time}</p>
        <div className="card-actions">
          {isOwner ? (
            status !== "Completed" && (
              <button className="details-btn" onClick={() => onAdvanceStatus(status)}>
                {status === "Preparing" ? "Mark as Ready" : "Complete Order"}
              </button>
            )
          ) : (
            <button className="details-btn" onClick={onViewDetails}>
              Details
            </button>
          )}
        </div>
      </div>
    </div>

    {!isOwner && (
      <div className="card-points">
        <p className="card-points">+{points} Points</p>
      </div>
    )}
  </div>
);

function OrderHistory({ page, isOwner = false }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("date");
  const [orders, setOrders] = useState([]);
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    if (page) page(isOwner ? "dashboard" : "orderhistory");
  }, [page, isOwner]);

  // Fetch orders from the PHP Backend
  useEffect(() => {
    const fetchOrders = async () => {
      // NOTE: Replace customer_id=1 with actual logged in user session data later
      const endpoint = isOwner 
        ? "http://localhost/oop-project/backend/api.php?route=restaurant-orders&restaurant_id=1"
        : "http://localhost/oop-project/backend/api.php?route=order-history&customer_id=1";

      try {
        const response = await fetch(endpoint);
        const result = await response.json();
        
        if (result.status === "success") {
          // Map database columns to your frontend format
          const formattedOrders = result.data.map((dbOrder) => {
            // Map DB enums to your UI text
            let uiStatus = "Preparing";
            if (dbOrder.status === "out_for_delivery") uiStatus = "Ready";
            if (dbOrder.status === "delivered") uiStatus = "Completed";

            return {
              id: dbOrder.order_id,
              title: dbOrder.order_id.toString(),
              description: dbOrder.note || "Order Details",
              time: new Date(dbOrder.created_at).toLocaleString(),
              dateStr: dbOrder.created_at,
              rating: 5.0, // Default if not in DB
              points: dbOrder.item_quantity * 10, // Example point calculation
              image: kfclogo,
              status: uiStatus,
            };
          });
          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [isOwner]);

  useEffect(() => {
    const dataToSort = [...orders];
    dataToSort.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.dateStr) - new Date(a.dateStr);
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });
    setSortedData(dataToSort);
  }, [sortBy, orders]);

  // Push status updates to the PHP Backend
  const advanceStatus = async (orderId, currentStatus) => {
    let nextUiStatus = currentStatus === "Preparing" ? "Ready" : "Completed";
    let dbStatus = nextUiStatus === "Ready" ? "out_for_delivery" : "delivered";

    try {
      const response = await fetch("http://localhost/oop-project/backend/api.php?route=update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, status: dbStatus }),
      });

      const result = await response.json();

      if (result.status === "success") {
        // Update frontend state only if database update was successful
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: nextUiStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <>
      <div className="oh-page-container">
        <div className="order-place">
          <div className="order-head">
            <div className="order-head-title">
              <h1>{isOwner ? "Restaurant Orders" : "Your Past Orders"}</h1>
              <span className="total-badge">
                {orders.length} TOTAL ORDERS
              </span>
            </div>
            <p className="order-head-desc">
              {isOwner
                ? "Monitor, track, and update status logs for live ongoing dining requests across the campus."
                : "Manage and track your recent campus dining activities. Use the compact view to scan your frequency."}
            </p>
          </div>
          <div className="order-filters">
            <button
              className={sortBy === "date" ? "active" : ""}
              onClick={() => setSortBy("date")}
            >
              Sort by Date
            </button>
            {!isOwner && (
              <button
                className={sortBy === "rating" ? "active" : ""}
                onClick={() => setSortBy("rating")}
              >
                Sort by Rating
              </button>
            )}
          </div>
          <div className="cards-list">
            {sortedData.map((item) => (
              <OrderCard
                key={item.id}
                image={item.image}
                title={item.title}
                description={item.description}
                time={item.time}
                points={item.points}
                status={item.status}
                isOwner={isOwner}
                onAdvanceStatus={(currentStatus) => advanceStatus(item.id, currentStatus)}
                onViewDetails={() =>
                  navigate("/ordertrack", { state: { orderData: item } })
                }
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderHistory;