import { useState, useEffect } from "react";
import "./Notification.css";
import kfclogo from "./assets/kfc-logo.png";
import AdminReturnButton from "./AdminReturnButton";

const NotificationCard = ({ image, title, description, time }) => (
  <div className="notification-card">
    <div className="card-img">
      {/* Added fallback handling and alt text for accessibility */}
      {image ? (
        <img src={image} alt={`${title} logo`} />
      ) : (
        <div className="img-placeholder"></div>
      )}
    </div>
    <div className="card-components">
      <p className="card-text">
        <span className="card-title">{title}</span>
        <span className="card-description">{description}</span>
      </p>
      <span className="card-time">{time}</span>
    </div>
  </div>
);

function Notification({ page, display }) {
  useEffect(() => {
    page("notification");
  }, [page]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "test",
      description: "test test testtest teeafnwjenfjenfe",
      time: "test",
      image: "",
    },
    {
      id: 2,
      title: "KFC",
      description: "Your meal is ready for pickup!",
      time: "Just now",
      image: kfclogo,
    },
    {
      id: 3,
      title: "KFC",
      description: "Your meal is ready for pickup!",
      time: "Just now",
      image: kfclogo,
    },
    {
      id: 4,
      title: "KFC",
      description: "Your meal is ready for pickup!",
      time: "Just now",
      image: kfclogo,
    },
    {
      id: 5,
      title: "KFC",
      description: "Your meal is ready for pickup!",
      time: "Just now",
      image: kfclogo,
    },
    {
      id: 6,
      title: "KFC",
      description: "Your meal is ready for pickup!",
      time: "Just now",
      image: kfclogo,
    },
  ]);

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      <div className={`${display} page-container`}>
        <div className="notification-place">
          <div className="notification-head">
            <h1>Notifications</h1>
          </div>

          <div className="notification-cards-list">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <NotificationCard
                  key={item.id}
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  time={item.time}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>🍔 You're all caught up!</p>
                <span>No new notifications</span>
              </div>
            )}
          </div>

          <div className="bottom">
            <button
              className="clearall-button"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
      <AdminReturnButton />
    </>
  );
}

export default Notification;
