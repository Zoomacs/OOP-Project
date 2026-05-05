import { useState } from "react";
import { users } from "../data";
import { PageHeader, Card, Badge } from "../components/UI";

import "./ViewCustomers.css";
export default function ViewCustomers() {
  const [search, setSearch] = useState("");
  const filtered = users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeader title="View Customers" subtitle="Customer list and activity.">
        <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." />
      </PageHeader>

      <Card className="table-wrap">
        <table>
          <thead>
            <tr><th>Customer</th><th>Email</th><th>Orders</th><th>Spent</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.email}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.orders}</td>
                <td>{user.spent}</td>
                <td><Badge type={user.status === "Review" ? "gold" : "green"}>{user.status === "Review" ? "New" : user.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
