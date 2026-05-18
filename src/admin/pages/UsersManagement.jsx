import { useEffect, useState } from "react";
import { PageHeader, Card, Badge, notify } from "../components/UI";
import { api } from "../../api";
import "./UsersManagement.css";
export default function UsersManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => { api("users").then((d) => setUsers(d.users || [])); }, []);
  const filtered = users.filter((u) => `${u.name} ${u.email} ${u.type} ${u.status}`.toLowerCase().includes(search.toLowerCase()));
  async function ban(user) { await api("users", { method: "PUT", body: JSON.stringify({ id: user.id, status: "Banned" }) }); notify(`${user.name} banned`); setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: "Banned" } : u)); }
  return <><PageHeader title="Users Management" subtitle="View, search, ban, and manage users."><input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." /></PageHeader><Card className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.map((user) => <tr key={user.email}><td>{user.name}</td><td>{user.email}</td><td>{user.type}</td><td><Badge type={user.status === "Banned" ? "red" : user.status === "Review" ? "gold" : "green"}>{user.status}</Badge></td><td><button className="btn red" onClick={() => ban(user)}>Ban</button></td></tr>)}</tbody></table></Card></>;
}
