import { useState, useEffect } from "react";
import AdminReturnButton from "../common/AdminReturnButton";
import { api, getUser } from "../../api";
import { Bell, CheckCircle2, X, Trash2 } from "lucide-react";
import "./Notification.css";

function NotificationCard({ image, title, description, time }) {
  return (
    <div className="notification-card">
      <div className="notification-avatar">
        {image ? <img src={image} alt={title} /> : <Bell size={22} />}
      </div>
      <div className="notification-content">
        <div className="notification-row">
          <h3>{title}</h3>
          <span>{time}</span>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
}

function Notification({ page, display, setNotification }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

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
  }

  function closeNotification() {
    if (setNotification) setNotification("hidden notification");
  }

  return (
    <>
      <div className={`notification-panel ${display || ""}`}>
        <div className="notification-place">
          <div className="notification-head">
            <div>
              <h1>Notifications</h1>
              <p>{notifications.length} new updates</p>
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
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  time={item.time}
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
            <button className="clearall-button" onClick={handleClearAll} disabled={notifications.length === 0}>
              <Trash2 size={17} /> Clear All
            </button>
          </div>
        </div>
      </div>
      <AdminReturnButton />
    </>
  );
}

export default Notification;
