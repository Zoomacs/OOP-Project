import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  ClipboardList,
  CreditCard,
  ChartNoAxesCombined,
  Ticket,
  Store,
  UserRoundSearch,
  ReceiptText,
  Home,
  Bell,
  Phone,
  LogOut,
  MessagesSquare
} from "lucide-react";
import "./Layout.css";

const adminPages = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users-management", label: "Users CRUD", icon: Users },
  { to: "/admin/restaurants-management", label: "Restaurants CRUD", icon: Store },
  { to: "/admin/orders-monitoring", label: "Orders CRUD", icon: ClipboardList },
  { to: "/admin/payment-monitoring", label: "Payments CRUD", icon: CreditCard },
  { to: "/admin/tickets", label: "Tickets CRUD", icon: Ticket },
  { to: "/admin/system-analytics", label: "System Analytics", icon: ChartNoAxesCombined },
  { to: "/admin/view-customers", label: "Customers", icon: UserRoundSearch },
  { to: "/admin/view-transactions", label: "Transactions", icon: ReceiptText },
  { to: "/admin/view-contact-tickets", label: "Contact Messages", icon: MessagesSquare }
];

const websitePages = [
  { to: "/home", label: "Website Home", icon: Home },
  { to: "/restaurant", label: "Website Restaurants", icon: Store },
  { to: "/contact", label: "Website Contact", icon: Phone },
  { to: "/notification", label: "Website Notifications", icon: Bell }
];

function SideLink({ item, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink to={item.to} end={item.to === "/admin"} onClick={onClick} className={({ isActive }) => isActive ? "side-link active" : "side-link"}>
      <Icon size={17} />
      {item.label}
    </NavLink>
  );
}

function WebsiteLink({ item, onClick }) {
  const Icon = item.icon;
  return (
    <Link to={item.to} onClick={onClick} className="side-link website-link">
      <Icon size={17} />
      {item.label}
    </Link>
  );
}

export default function Layout({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={isSidebarOpen ? "layout sidebar-open" : "layout"}>
      <button className="admin-menu-button" onClick={() => setIsSidebarOpen(true)}>
        <Menu size={20} />
        Admin Pages
      </button>

      {isSidebarOpen && <button className="sidebar-backdrop" onClick={closeSidebar} aria-label="Close admin menu" />}

      <aside className="sidebar">
        <div className="sidebar-header">
          <div>
            <div className="admin-name">Q-Less Admin</div>
            <div className="admin-small-title">Control Panel</div>
          </div>
          <button className="close-sidebar" onClick={closeSidebar} aria-label="Close admin menu">
            <X size={20} />
          </button>
        </div>

        <div className="nav-title">Admin Pages</div>
        {adminPages.map((item) => <SideLink key={item.to} item={item} onClick={closeSidebar} />)}

        <div className="nav-title">Go To Website</div>
        {websitePages.map((item) => <WebsiteLink key={item.to} item={item} onClick={closeSidebar} />)}

        <button className="admin-logout-btn" onClick={onLogout}>
          <LogOut size={17} />
          Logout
        </button>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
