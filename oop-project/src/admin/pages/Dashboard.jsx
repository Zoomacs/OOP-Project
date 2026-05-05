import { Card, StatCard, Badge } from "../components/UI";

import "./Dashboard.css";
export default function Dashboard() {
  return (
    <>
      <section className="hero">
        <h1>Admin Control Center</h1>
        <p className="subtitle">
          Powerful Q-Less restaurant dashboard for users, restaurants, orders, payments and support.
        </p>
      </section>

      <div className="grid">
        <StatCard title="Total Users" value="12,840" badge="+18%" type="green" />
        <StatCard title="Active Restaurants" value="326" badge="Live" badgeClass="gold" />
        <StatCard title="Orders Today" value="1,492" badge="Tracking" badgeClass="blue" />
        <StatCard title="Open Tickets" value="37" badge="Need reply" badgeClass="red" />
      </div>

      <div style={{ marginTop: 20 }}><Card className="table-wrap">
        <h3>Recent Activity</h3>
        <table>
          <thead>
            <tr><th>Action</th><th>User</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>New restaurant added</td><td>Admin Omar</td><td><Badge type="green">Done</Badge></td></tr>
            <tr><td>Payment reviewed</td><td>Admin Sara</td><td><Badge type="gold">Pending</Badge></td></tr>
            <tr><td>Customer ticket replied</td><td>Admin Ali</td><td><Badge type="green">Done</Badge></td></tr>
          </tbody>
        </table>
      </Card></div>
    </>
  );
}
