import { useState } from "react";
import { PageHeader, Card, notify } from "../components/UI";
import { api } from "../../api";
import "./AddAdmin.css";
export default function AddAdmin() {
  const [form, setForm] = useState({ name: "", email: "", university_id: "", password: "" });
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) { e.preventDefault(); await api("register", { method: "POST", body: JSON.stringify({ ...form, role: "admin" }) }); notify("Admin added to database"); }
  return <><PageHeader title="Add Admin" subtitle="Add a new admin with permissions." /><Card><form className="form" onSubmit={submit}><input name="name" value={form.name} onChange={change} className="input" placeholder="Full Name" /><input name="email" value={form.email} onChange={change} className="input" placeholder="Email" /><input name="university_id" value={form.university_id} onChange={change} className="input" placeholder="Admin Login ID" /><input name="password" value={form.password} onChange={change} className="input" placeholder="Password" type="password" /><select><option>Super Admin</option><option>Support Admin</option><option>Payment Admin</option></select><label><input type="checkbox" /> Manage Users</label><label><input type="checkbox" /> Manage Restaurants</label><label><input type="checkbox" /> Manage Payments</label><button className="btn full">Add Admin</button></form></Card></>;
}
