import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, DollarSign, Layers, Utensils, User, ArrowRight } from "lucide-react";
import "./RestaurantDashboard.css";
import { api, getUser } from "./api";

function RestaurantDashboard() {
  const currentUser = getUser();
  const restaurantId = Number(currentUser?.restaurant_id || sessionStorage.getItem("restaurantId") || 1);
  const [stats, setStats] = useState({ orders: 0, revenue: 0, items: 0 });

  useEffect(() => {
    api(`owner-stats&restaurant_id=${restaurantId}`)
      .then((data) => setStats(data.stats || { orders: 0, revenue: 0, items: 0 }))
      .catch((err) => console.log(err.message));
  }, [restaurantId]);

  return (
    <div className="owner-page-container">
      <div className="owner-header">
        <div>
          <h1>Dashboard</h1>
          <p className="owner-welcome">Welcome back! You are managing restaurant #{restaurantId}.</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <Link to="/owner/orders" className="stat-card clickable">
          <div className="stat-icon-wrapper orders"><ShoppingBag size={24} /></div>
          <div className="stat-info"><h3>Total Orders</h3><p>{stats.orders}</p></div>
        </Link>
        <div className="stat-card">
          <div className="stat-icon-wrapper revenue"><DollarSign size={24} /></div>
          <div className="stat-info"><h3>Revenue</h3><p>{Number(stats.revenue || 0).toFixed(2)} EGP</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper items"><Layers size={24} /></div>
          <div className="stat-info"><h3>Active Menu Items</h3><p>{stats.items}</p></div>
        </div>
      </div>

      <div className="dashboard-section-title"><h2>Quick Actions</h2></div>
      <div className="owner-nav-grid">
        <Link to="/owner/menu" className="owner-nav-card"><div className="nav-card-content"><div className="nav-card-icon"><Utensils size={32} /></div><div className="nav-card-text"><h3>Menu Management</h3><p>Add images, edit prices, and hide out-of-stock items from students.</p></div></div><div className="nav-card-arrow"><ArrowRight size={20} /></div></Link>
        <Link to="/owner/profile" className="owner-nav-card"><div className="nav-card-content"><div className="nav-card-icon"><User size={32} /></div><div className="nav-card-text"><h3>Restaurant Profile</h3><p>Update your restaurant info or submit a technical support ticket.</p></div></div><div className="nav-card-arrow"><ArrowRight size={20} /></div></Link>
      </div>
    </div>
  );
}

export default RestaurantDashboard;
