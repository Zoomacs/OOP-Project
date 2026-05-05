import { orders } from "../data";
import { PageHeader, Card, StatCard, Badge } from "../components/UI";

import "./OrdersMonitoring.css";
export default function OrdersMonitoring() {
  return (
    <>
      <PageHeader title="Orders Monitoring" subtitle="Track restaurant orders in real time.">
        <button className="btn">Export</button>
      </PageHeader>

      <div className="grid">
        <StatCard title="Preparing" value="84" badge="Kitchen" badgeClass="gold" />
        <StatCard title="On Delivery" value="46" badge="Riders" badgeClass="blue" />
        <StatCard title="Delivered" value="912" badge="Done" badgeClass="green" />
        <StatCard title="Cancelled" value="12" badge="Review" badgeClass="red" />
      </div>

      <div style={{ marginTop: 20 }}>
        <Card className="table-wrap">
          <table>
            <thead>
              <tr><th>Order ID</th><th>Restaurant</th><th>Customer</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.restaurant}</td>
                  <td>{order.customer}</td>
                  <td>{order.total}</td>
                  <td><Badge type={order.status === "Cancelled" ? "red" : order.status === "Delivered" ? "green" : order.status === "Delivery" ? "blue" : "gold"}>{order.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
