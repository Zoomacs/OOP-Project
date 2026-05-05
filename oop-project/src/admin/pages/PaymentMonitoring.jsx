import { transactions } from "../data";
import { PageHeader, Card, StatCard, Badge } from "../components/UI";

import "./PaymentMonitoring.css";
export default function PaymentMonitoring() {
  return (
    <>
      <PageHeader title="Payment Monitoring" subtitle="Monitor successful, pending, and failed payments." />

      <div className="grid">
        <StatCard title="Revenue" value="58,420 EGP" badge="+12%" badgeClass="green" />
        <StatCard title="Success" value="96%" badge="Healthy" badgeClass="green" />
        <StatCard title="Pending" value="28" badge="Waiting" badgeClass="gold" />
        <StatCard title="Failed" value="9" badge="Fix" badgeClass="red" />
      </div>

      <div style={{ marginTop: 20 }}>
        <Card className="table-wrap">
          <table>
            <thead>
              <tr><th>Payment ID</th><th>Customer</th><th>Method</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td>#PAY-1001</td><td>Ahmed</td><td>Visa</td><td>245 EGP</td><td><Badge type="green">Paid</Badge></td></tr>
              <tr><td>#PAY-1002</td><td>Mona</td><td>Wallet</td><td>410 EGP</td><td><Badge type="gold">Pending</Badge></td></tr>
              <tr><td>#PAY-1003</td><td>Karim</td><td>Mastercard</td><td>182 EGP</td><td><Badge type="red">Failed</Badge></td></tr>
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
