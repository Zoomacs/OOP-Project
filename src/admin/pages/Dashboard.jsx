import { useEffect, useState } from "react";
import { Card, StatCard, Badge } from "../components/UI";
import { api } from "../../api";
import "./Dashboard.css";
export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, restaurants: 0, orders: 0, revenue: 0 });
  useEffect(() => { api("admin-stats").then((d) => setStats(d.stats || stats)); }, []);
  return <><section className="hero"><h1>Admin Control Center</h1><p className="subtitle">Powerful Q-Less restaurant dashboard for users, restaurants, orders, payments and support.</p></section><div className="grid"><StatCard title="Total Users" value={stats.users} badge="DB" badgeClass="green" /><StatCard title="Active Restaurants" value={stats.restaurants} badge="Live" badgeClass="gold" /><StatCard title="Total Orders" value={stats.orders} badge="Tracking" badgeClass="blue" /><StatCard title="Revenue" value={`${stats.revenue} EGP`} badge="Live" badgeClass="green" /></div><div style={{ marginTop: 20 }}><Card className="table-wrap"><h3>Recent Activity</h3><table><thead><tr><th>Action</th><th>User</th><th>Status</th></tr></thead><tbody><tr><td>Backend connected</td><td>System</td><td><Badge type="green">Done</Badge></td></tr><tr><td>Database schema ready</td><td>phpMyAdmin</td><td><Badge type="green">Done</Badge></td></tr></tbody></table></Card></div></>;
}
