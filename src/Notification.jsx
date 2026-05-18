import { useState, useEffect } from "react";
import "./Notification.css";
import AdminReturnButton from "./AdminReturnButton";
import { api, getUser } from "./api";

const NotificationCard = ({ image, title, description, time }) => <div className="notification-card"><div className="card-img">{image ? <img src={image} alt={`${title} logo`} /> : <div className="img-placeholder"></div>}</div><div className="card-components"><p className="card-text"><span className="card-title">{title}</span><span className="card-description">{description}</span></p><span className="card-time">{time}</span></div></div>;
function Notification({ page, display }) {
  const [notifications, setNotifications] = useState([]);
  const user = getUser();
  useEffect(() => { page("notification"); }, [page]);
  useEffect(() => { api(`notifications&user_id=${user?.id || 4}`).then((d) => setNotifications(d.notifications || [])).catch(()=>{}); }, []);
  const handleClearAll = async () => { await api(`notifications&user_id=${user?.id || 4}`, { method: "DELETE" }); setNotifications([]); };
  return <><div className={`${display} page-container`}><div className="notification-place"><div className="notification-head"><h1>Notifications</h1></div><div className="notification-cards-list">{notifications.length > 0 ? notifications.map((item) => <NotificationCard key={item.id} image={item.image} title={item.title} description={item.description} time={item.time} />) : <div className="empty-state"><p>🍔 You're all caught up!</p><span>No new notifications</span></div>}</div><div className="bottom"><button className="clearall-button" onClick={handleClearAll} disabled={notifications.length === 0}>Clear All</button></div></div></div><AdminReturnButton /></>;
}
export default Notification;
