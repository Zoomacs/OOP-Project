import { useState } from "react";
import { users } from "../data";
import { PageHeader, Card, Badge, notify } from "../components/UI";

import "./UsersManagement.css";
export default function UsersManagement() {
  const [search, setSearch] = useState("");
  const filtered = users.filter((u) =>
    `${u.name} ${u.email} ${u.type} ${u.status}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Users Management" subtitle="View, search, ban, and manage users.">
        <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." />
      </PageHeader>

      <Card className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Type</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.email}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.type}</td>
                <td><Badge type={user.status === "Review" ? "gold" : "green"}>{user.status}</Badge></td>
                <td>
                  <button className="btn red" onClick={() => notify(`${user.name} banned`)}>Ban</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
