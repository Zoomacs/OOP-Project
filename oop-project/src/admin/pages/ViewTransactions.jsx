import { transactions } from "../data";
import { PageHeader, Card, Badge } from "../components/UI";

import "./ViewTransactions.css";
export default function ViewTransactions() {
  return (
    <>
      <PageHeader title="View Transactions" subtitle="All customer and restaurant payment transactions." />

      <Card className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Date</th><th>User</th><th>Restaurant</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {transactions.map((trx) => (
              <tr key={trx.id}>
                <td>{trx.id}</td>
                <td>{trx.date}</td>
                <td>{trx.user}</td>
                <td>{trx.restaurant}</td>
                <td>{trx.amount}</td>
                <td><Badge type={trx.status === "Success" ? "green" : trx.status === "Pending" ? "gold" : "red"}>{trx.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
