import { useEffect, useMemo, useState } from "react";
import { PageHeader, Card, StatCard, Badge, notify } from "../components/UI";
import { api } from "../../api";
import "./OrdersMonitoring.css";

const emptyOrder = { id: "", restaurant_id: "", status: "pending", total_amount: "", payment_method: "cash", note: "" };

export default function OrdersMonitoring() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyOrder);

  async function loadOrders() {
    const data = await api("orders");
    setOrders(data.orders || []);
  }

  useEffect(() => { loadOrders(); }, []);

  const filtered = useMemo(() => orders.filter((o) => `${o.id} ${o.restaurant} ${o.customer} ${o.status}`.toLowerCase().includes(search.toLowerCase())), [orders, search]);
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function edit(order) {
    setForm({ id: order.id, restaurant_id: order.restaurant_id || "", status: order.status || "pending", total_amount: order.totalPrice || "", payment_method: order.paymentType || "cash", note: order.note || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.id) return notify("Choose an order to edit first");
    await api("orders", { method: "PUT", body: JSON.stringify(form) });
    notify("Order updated");
    setForm(emptyOrder);
    await loadOrders();
  }

  async function quickStatus(order, status) {
    await api("update-status", { method: "POST", body: JSON.stringify({ order_id: order.id, status }) });
    await loadOrders();
  }

  async function remove(order) {
    if (!confirm(`Delete order #${order.id}?`)) return;
    await api(`orders&id=${order.id}`, { method: "DELETE" });
    notify("Order deleted");
    await loadOrders();
  }

  return (
    <div className="orders-monitoring-page">
      <PageHeader title="Orders" subtitle="Read all orders, change status, edit order values, and delete incorrect records.">
        <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." />
      </PageHeader>

      <div className="grid">
        <StatCard title="Total Orders" value={orders.length} badge="Live" badgeClass="green" />
        <StatCard title="Pending" value={orders.filter((o) => o.status === "pending").length} badge="Queue" badgeClass="gold" />
        <StatCard title="Completed" value={orders.filter((o) => ["received", "delivered"].includes(o.status)).length} badge="Done" badgeClass="blue" />
        <StatCard title="Revenue" value={`${totalRevenue} EGP`} badge="DB" badgeClass="green" />
      </div>

      <Card className="crud-form-card space-top">
        <form className="form admin-form" onSubmit={submit}>
          <input name="id" value={form.id} onChange={change} className="input" placeholder="Order ID" required />
          <input name="restaurant_id" value={form.restaurant_id} onChange={change} className="input" placeholder="Restaurant ID" required />
          <select name="status" value={form.status} onChange={change}>
            <option value="pending">pending</option>
            <option value="preparing">preparing</option>
            <option value="ready">ready</option>
            <option value="received">received</option>
            <option value="delivered">delivered</option>
            <option value="cancelled">cancelled</option>
          </select>
          <input name="total_amount" value={form.total_amount} onChange={change} className="input" placeholder="Total amount" type="number" step="0.01" />
          <input name="payment_method" value={form.payment_method} onChange={change} className="input" placeholder="Payment method" />
          <input name="note" value={form.note} onChange={change} className="input" placeholder="Order note" />
          <div className="crud-actions full"><button className="btn">Update Order</button><button type="button" className="btn ghost" onClick={() => setForm(emptyOrder)}>Clear</button></div>
        </form>
      </Card>

      <Card className="table-wrap crud-table-card">
        <table>
          <thead><tr><th>Order</th><th>Restaurant</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.restaurant}</td>
                <td>{order.customer}</td>
                <td>{order.total}</td>
                <td>{order.paymentType}</td>
                <td><Badge type={order.status === "cancelled" ? "red" : ["received", "delivered"].includes(order.status) ? "green" : order.status === "ready" ? "blue" : "gold"}>{order.status}</Badge></td>
                <td className="row-actions">
                  <button className="btn small" onClick={() => edit(order)}>Edit</button>
                  <button className="btn small green" onClick={() => quickStatus(order, "ready")}>Ready</button>
                  <button className="btn small dark" onClick={() => quickStatus(order, "cancelled")}>Cancel</button>
                  <button className="btn small red" onClick={() => remove(order)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
