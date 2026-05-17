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
          <span className={`status-badge ${status.toLowerCase()}`}>
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
              <button className="details-btn" onClick={onAdvanceStatus}>
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

  useEffect(() => {
    page(isOwner ? "dashboard" : "orderhistory");
  }, [page, isOwner]);

  const [sortBy, setSortBy] = useState("date");

  const [orders, setOrders] = useState([
    {
      id: 1,
      title: "2042",
      description: "2X Mighty Zinger",
      time: "April 29, 2026, 4:15 PM",
      dateStr: "2026-04-29T16:15:00",
      rating: 5.0,
      points: 50,
      image: kfclogo,
      status: "Preparing",
    },
    {
      id: 2,
      title: "2041",
      description: "3X Rizo (Spicy)",
      time: "April 28, 2026, 6:00 PM",
      dateStr: "2026-04-28T18:00:00",
      rating: 4.2,
      points: 30,
      image: kfclogo,
      status: "Ready",
    },
    {
      id: 3,
      title: "2040",
      description: "Family Bucket",
      time: "April 27, 2026, 7:30 PM",
      dateStr: "2026-04-27T19:30:00",
      rating: 4.9,
      points: 120,
      image: kfclogo,
      status: "Completed",
    },
    {
      id: 4,
      title: "2039",
      description: "1X Twister Combo",
      time: "April 26, 2026, 1:15 PM",
      dateStr: "2026-04-26T13:15:00",
      rating: 3.8,
      points: 25,
      image: kfclogo,
      status: "Completed",
    },
    {
      id: 5,
      title: "2038",
      description: "Spicy Fries Large",
      time: "April 25, 2026, 5:45 PM",
      dateStr: "2026-04-25T17:45:00",
      rating: 4.6,
      points: 15,
      image: kfclogo,
      status: "Completed",
    },
    {
      id: 6,
      title: "2037",
      description: "Chicken Caesar Salad",
      time: "April 24, 2026, 12:45 PM",
      dateStr: "2026-04-24T12:45:00",
      rating: 4.1,
      points: 25,
      image: kfclogo,
      status: "Completed",
    },
    {
      id: 7,
      title: "2036",
      description: "Family Bucket, 2X Fries",
      time: "April 22, 2026, 7:00 PM",
      dateStr: "2026-04-22T19:00:00",
      rating: 4.7,
      points: 120,
      image: kfclogo,
      status: "Completed",
    },
  ]);

  const [sortedData, setSortedData] = useState([]);

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

  function advanceStatus(orderId) {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          if (order.status === "Preparing")
            return { ...order, status: "Ready" };
          if (order.status === "Ready")
            return { ...order, status: "Completed" };
        }
        return order;
      }),
    );
  }

  return (
    <>
      <div className="oh-page-container">
        <div className="order-place">
          <div className="order-head">
            <div className="order-head-title">
              <h1>{isOwner ? "Restaurant Orders" : "Your Past Orders"}</h1>
              <span className="total-badge">
                {isOwner ? `${orders.length} TOTAL ORDERS` : "24 TOTAL ORDERS"}
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
                onAdvanceStatus={() => advanceStatus(item.id)}
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
