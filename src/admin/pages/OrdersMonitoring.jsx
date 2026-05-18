import { useEffect, useState } from "react";
import { PageHeader, Card, StatCard, Badge } from "../components/UI";
import { api } from "../../api";
import "./OrdersMonitoring.css";
export default function OrdersMonitoring() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api("orders").then((d) => setOrders(d.orders || [])); }, []);
  const count = (s) => orders.filter((o) => o.status === s).length;
  return <><PageHeader title="Orders Monitoring" subtitle="Track restaurant orders in real time."><button className="btn">Export</button></PageHeader><div className="grid"><StatCard title="Preparing" value={count("preparing")} badge="Kitchen" badgeClass="gold" /><StatCard title="Ready" value={count("ready")} badge="Pickup" badgeClass="blue" /><StatCard title="Delivered" value={count("delivered") + count("received")} badge="Done" badgeClass="green" /><StatCard title="Cancelled" value={count("cancelled")} badge="Review" badgeClass="red" /></div><div style={{ marginTop: 20 }}><Card className="table-wrap"><table><thead><tr><th>Order ID</th><th>Restaurant</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>#{order.id}</td><td>{order.restaurant}</td><td>{order.customer}</td><td>{order.total}</td><td><Badge type={order.status === "cancelled" ? "red" : order.status === "delivered" || order.status === "received" ? "green" : order.status === "ready" ? "blue" : "gold"}>{order.status}</Badge></td></tr>)}</tbody></table></Card></div></>;
}
