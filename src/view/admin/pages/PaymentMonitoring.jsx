import { useEffect, useMemo, useState } from "react";
import { PageHeader, Card, StatCard, Badge, notify } from "../components/UI";
import { api } from "../../api";
import "./PaymentMonitoring.css";

const emptyPayment = { id: "", order_id: "", user_id: "", method: "cash", amount: "", status: "Success" };

export default function PaymentMonitoring() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyPayment);

  async function loadPayments() {
    const data = await api("payments");
    setPayments(data.payments || []);
  }

  useEffect(() => { loadPayments(); }, []);

  const filtered = useMemo(() => payments.filter((p) => `${p.id} ${p.user} ${p.restaurant} ${p.method} ${p.status}`.toLowerCase().includes(search.toLowerCase())), [payments, search]);
  const revenue = payments.reduce((sum, p) => sum + Number(p.amount_value || String(p.amount).replace(" EGP", "")), 0);
  const editing = Boolean(form.id);

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function edit(payment) {
    setForm({ id: payment.raw_id || String(payment.id).replace("#TRX-", ""), order_id: payment.order_id || "", user_id: payment.user_id || "", method: payment.method || "cash", amount: payment.amount_value || "", status: payment.status || "Success" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e) {
    e.preventDefault();
    await api("payments", { method: editing ? "PUT" : "POST", body: JSON.stringify(form) });
    notify(editing ? "Payment updated" : "Payment created");
    setForm(emptyPayment);
    await loadPayments();
  }

  async function remove(payment) {
    const id = payment.raw_id || String(payment.id).replace("#TRX-", "");
    if (!confirm(`Delete payment #${id}?`)) return;
    await api(`payments&id=${id}`, { method: "DELETE" });
    notify("Payment deleted");
    await loadPayments();
  }

  return (
    <div className="payment-monitoring-page">
      <PageHeader title="Payments CRUD" subtitle="Create, read, update, and delete payment records.">
        <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search payments..." />
      </PageHeader>

      <div className="grid">
        <StatCard title="Revenue" value={`${revenue} EGP`} badge="Live" badgeClass="green" />
        <StatCard title="Success" value={payments.filter((p) => p.status === "Success").length} badge="Paid" badgeClass="green" />
        <StatCard title="Pending" value={payments.filter((p) => p.status === "Pending").length} badge="Waiting" badgeClass="gold" />
        <StatCard title="Failed" value={payments.filter((p) => p.status === "Failed").length} badge="Fix" badgeClass="red" />
      </div>

      <Card className="crud-form-card space-top">
        <form className="form admin-form" onSubmit={submit}>
          <input name="order_id" value={form.order_id} onChange={change} className="input" placeholder="Order ID" required />
          <input name="user_id" value={form.user_id} onChange={change} className="input" placeholder="User ID" />
          <select name="method" value={form.method} onChange={change}><option value="cash">cash</option><option value="instapay">instapay</option><option value="card">card</option></select>
          <input name="amount" value={form.amount} onChange={change} className="input" placeholder="Amount" type="number" step="0.01" required />
          <select name="status" value={form.status} onChange={change}><option>Success</option><option>Pending</option><option>Failed</option><option>Refunded</option></select>
          <div className="crud-actions"><button className="btn">{editing ? "Update Payment" : "Create Payment"}</button>{editing && <button type="button" className="btn ghost" onClick={() => setForm(emptyPayment)}>Cancel</button>}</div>
        </form>
      </Card>

      <Card className="table-wrap crud-table-card">
        <table>
          <thead><tr><th>Payment ID</th><th>Order</th><th>Customer</th><th>Restaurant</th><th>Method</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((p) => <tr key={p.id}><td>{p.id}</td><td>#{p.order_id}</td><td>{p.user}</td><td>{p.restaurant}</td><td>{p.method}</td><td>{p.amount}</td><td><Badge type={p.status === "Success" ? "green" : p.status === "Pending" ? "gold" : "red"}>{p.status}</Badge></td><td className="row-actions"><button className="btn small" onClick={() => edit(p)}>Edit</button><button className="btn small dark" onClick={() => remove(p)}>Delete</button></td></tr>)}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
