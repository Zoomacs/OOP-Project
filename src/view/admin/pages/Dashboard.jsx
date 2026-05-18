import { useEffect, useState } from "react";
import { Card, StatCard, Badge } from "../components/UI";
import { api } from "../../api";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    restaurants: 0,
    orders: 0,
    revenue: 0,
  });
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api("admin-stats").then((d) => setStats(d.stats || stats));
    api("orders").then((d) => setOrders((d.orders || []).slice(0, 5)));
    api("tickets").then((d) => setTickets((d.tickets || []).slice(0, 4)));
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Admin Control Center</h1>
        <p className="subtitle">
          All CRUD actions are now inside the main admin pages: users,
          restaurants, orders, payments, and tickets.
        </p>
      </section>

      <div className="grid">
        <StatCard
          title="Total Users"
          value={stats.users}
          badge="CRUD"
          badgeClass="green"
        />
        <StatCard
          title="Restaurants"
          value={stats.restaurants}
          badge="Managed"
          badgeClass="blue"
        />
        <StatCard
          title="Orders"
          value={stats.orders}
          badge="Live"
          badgeClass="gold"
        />
        <StatCard
          title="Revenue"
          value={`${stats.revenue} EGP`}
          badge="DB"
          badgeClass="green"
        />
      </div>

      <div className="dashboard-two-col">
        <Card className="table-wrap">
          <h3>Latest Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Restaurant</th>
                <th>Customer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.restaurant}</td>
                  <td>{order.customer}</td>
                  <td>
                    <Badge
                      type={
                        order.status === "cancelled"
                          ? "red"
                          : order.status === "ready"
                            ? "blue"
                            : "gold"
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <h3>Support Tickets</h3>
          {tickets.map((ticket) => (
            <div className="ticket" key={ticket.id}>
              <div>
                <b>{ticket.title}</b>
                <p className="muted">{ticket.email}</p>
              </div>
              <Badge
                type={
                  ticket.status === "Urgent"
                    ? "red"
                    : ticket.status === "Pending"
                      ? "gold"
                      : "green"
                }
              >
                {ticket.status}
              </Badge>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
