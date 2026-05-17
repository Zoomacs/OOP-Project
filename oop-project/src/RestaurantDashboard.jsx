import { Link } from "react-router-dom";
import { ShoppingBag, DollarSign, Layers, Utensils, User, ArrowRight } from "lucide-react";
import "./RestaurantDashboard.css";

function RestaurantDashboard() {
  return (
    <div className="owner-page-container">
      <div className="owner-header">
        <div>
          <h1>Dashboard</h1>
          <p className="owner-welcome">Welcome back! Here is an overview of your restaurant today.</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <Link to="/owner/orders" className="stat-card clickable">
          <div className="stat-icon-wrapper orders">
            <ShoppingBag size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Orders Today</h3>
            <p>42</p>
          </div>
        </Link>

        <div className="stat-card">
          <div className="stat-icon-wrapper revenue">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>Revenue</h3>
            <p>3,450 EGP</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper items">
            <Layers size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Menu Items</h3>
            <p>18</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section-title">
        <h2>Quick Actions</h2>
      </div>

      <div className="owner-nav-grid">
        <Link to="/owner/menu" className="owner-nav-card">
          <div className="nav-card-content">
            <div className="nav-card-icon">
              <Utensils size={32} />
            </div>
            <div className="nav-card-text">
              <h3>Menu Management</h3>
              <p>Add, edit, or remove items from your live campus menu.</p>
            </div>
          </div>
          <div className="nav-card-arrow">
            <ArrowRight size={20} />
          </div>
        </Link>

        <Link to="/owner/profile" className="owner-nav-card">
          <div className="nav-card-content">
            <div className="nav-card-icon">
              <User size={32} />
            </div>
            <div className="nav-card-text">
              <h3>Restaurant Profile</h3>
              <p>Update your restaurant info or submit a technical support ticket.</p>
            </div>
          </div>
          <div className="nav-card-arrow">
            <ArrowRight size={20} />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default RestaurantDashboard;