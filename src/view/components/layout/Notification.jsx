import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminReturnButton from "../common/AdminReturnButton";
import { api, getUser } from "../../api";
import { Bell, CheckCircle2, X, Trash2, Check } from "lucide-react";
import "./Notification.css";

function NotificationCard({ id, image, title, description, time, is_read, order_id, onMarkRead, navigate }) {
  const handleClick = () => {
    if (order_id) {
      navigate(`/orderhistory?highlight=${order_id}`);
    } else {
      navigate("/orderhistory");
    }
  };

  const handleMarkRead = (e) => {
    e.stopPropagation();
    if (onMarkRead) onMarkRead(id);
  };

  return (
    <div
      className={`notification-card ${!is_read ? "unread" : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="notification-avatar">
        {image ? <img src={image} alt={title} /> : <Bell size={22} />}
      </div>
      <div className="notification-content">
        <div className="notification-row">
          <h3>{title}</h3>
          <span>{time}</span>
        </div>
        <p>{description}</p>
        {!is_read && (
          <button className="mark-read-btn" onClick={handleMarkRead} type="button">
            <Check size={14} /> Mark as read
          </button>
        )}
      </div>
    </div>
  );
}

function Notification({ page, display, setNotification }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (page) page("notification");
  }, [page]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api(`notifications&user_id=${user?.id || 4}`)
      .then((data) => {
        if (!ignore) setNotifications(data.notifications || []);
      })
      .catch(() => {
        if (!ignore) setNotifications([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [user?.id]);

  async function handleClearAll() {
    await api(`notifications&user_id=${user?.id || 4}`, { method: "DELETE" });
    setNotifications([]);
    window.dispatchEvent(new CustomEvent("notificationUpdated"));
  }

  async function handleClearRead() {
    await api(`notifications&user_id=${user?.id || 4}&clear_read=1`, { method: "DELETE" });
    setNotifications((prev) => prev.filter((n) => !n.is_read));
    window.dispatchEvent(new CustomEvent("notificationUpdated"));
  }

  async function handleMarkRead(id) {
    try {
      await api("notifications", {
        method: "PUT",
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
      window.dispatchEvent(new CustomEvent("notificationUpdated"));
    } catch {
      // column not available until migration.sql is run
    }
  }

  function closeNotification() {
    if (setNotification) setNotification("hidden notification");
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <>
      <div className={`notification-panel ${display || ""}`}>
        <div className="notification-place">
          <div className="notification-head">
            <div>
              <h1>Notifications</h1>
              <p>{unreadCount} unread</p>
            </div>
            {setNotification && (
              <button className="notification-close" onClick={closeNotification} aria-label="Close notifications">
                <X size={20} />
              </button>
            )}
          </div>

          <div className="notification-cards-list">
            {loading ? (
              <div className="empty-state"><p>Loading notifications...</p></div>
            ) : notifications.length > 0 ? (
              notifications.map((item) => (
                <NotificationCard
                  key={item.id}
                  id={item.id}
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  time={item.time}
                  is_read={item.is_read}
                  order_id={item.order_id}
                  onMarkRead={handleMarkRead}
                  navigate={navigate}
                />
              ))
            ) : (
              <div className="empty-state">
                <CheckCircle2 size={44} />
                <p>You are all caught up</p>
                <span>No new notifications</span>
              </div>
            )}
          </div>

          <div className="notification-bottom">
            <button className="clear-bottom-btn" onClick={handleClearRead} disabled={!notifications.some(n => n.is_read)}>
              <Trash2 size={14} /> Clear read
            </button>
            <button className="clear-bottom-btn clear-bottom-btn-danger" onClick={handleClearAll} disabled={notifications.length === 0}>
              <Trash2 size={14} /> Clear all
            </button>
          </div>
        </div>
      </div>
      <AdminReturnButton />
    </>
  );
}

export default Notification;
