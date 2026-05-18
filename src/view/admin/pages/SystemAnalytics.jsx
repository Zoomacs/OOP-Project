import { useEffect, useState } from "react";
import { PageHeader, Card, StatCard } from "../components/UI";
import { api } from "../../api";
import "./SystemAnalytics.css";

export default function SystemAnalytics() {
  const [stats, setStats] = useState({ users: 0, restaurants: 0, orders: 0, revenue: 0 });
  useEffect(() => { api("admin-stats").then((d) => setStats(d.stats || stats)); }, []);
  const max = Math.max(Number(stats.users), Number(stats.restaurants), Number(stats.orders), Number(stats.revenue), 1);
  const bars = [stats.users, stats.restaurants, stats.orders, stats.revenue].map((v) => `${Math.max(12, (Number(v) / max) * 100)}%`);

  return (
    <>
      <PageHeader title="System Analytics" subtitle="Live analytics from the database instead of static numbers." />
      <div className="grid">
        <StatCard title="Users" value={stats.users} badge="Accounts" badgeClass="green" />
        <StatCard title="Restaurants" value={stats.restaurants} badge="Partners" badgeClass="blue" />
        <StatCard title="Orders" value={stats.orders} badge="Requests" badgeClass="gold" />
        <StatCard title="Revenue" value={`${stats.revenue} EGP`} badge="Sales" badgeClass="green" />
      </div>
      <div className="space-top">
        <Card>
          <h3>Database Summary</h3>
          <div className="chart">
            {bars.map((height, index) => <div key={index} className="bar" style={{ height }}><span>{["Users", "Restaurants", "Orders", "Revenue"][index]}</span></div>)}
          </div>
        </Card>
      </div>
    </>
  );
}
