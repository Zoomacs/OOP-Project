import { useEffect, useState } from "react";
import { PageHeader, Card, StatCard, Badge } from "../components/UI";
import { api } from "../../api";
import "./PaymentMonitoring.css";
export default function PaymentMonitoring() {
  const [payments, setPayments] = useState([]);
  useEffect(() => { api("payments").then((d) => setPayments(d.payments || [])); }, []);
  const revenue = payments.reduce((sum, p) => sum + Number(String(p.amount).replace(" EGP", "")), 0);
  return <><PageHeader title="Payment Monitoring" subtitle="Monitor successful, pending, and failed payments." /><div className="grid"><StatCard title="Revenue" value={`${revenue} EGP`} badge="Live" badgeClass="green" /><StatCard title="Success" value={payments.filter(p=>p.status==='Success').length} badge="Paid" badgeClass="green" /><StatCard title="Pending" value={payments.filter(p=>p.status==='Pending').length} badge="Waiting" badgeClass="gold" /><StatCard title="Failed" value={payments.filter(p=>p.status==='Failed').length} badge="Fix" badgeClass="red" /></div><div style={{ marginTop: 20 }}><Card className="table-wrap"><table><thead><tr><th>Payment ID</th><th>Customer</th><th>Method</th><th>Amount</th><th>Status</th></tr></thead><tbody>{payments.map((p) => <tr key={p.id}><td>{p.id}</td><td>{p.user}</td><td>{p.method}</td><td>{p.amount}</td><td><Badge type={p.status === "Success" ? "green" : p.status === "Pending" ? "gold" : "red"}>{p.status}</Badge></td></tr>)}</tbody></table></Card></div></>;
}
