import { PageHeader, Card, notify } from "../components/UI";

import "./AddAdmin.css";
export default function AddAdmin() {
  return (
    <>
      <PageHeader title="Add Admin" subtitle="Add a new admin with permissions." />

      <Card>
        <form className="form" onSubmit={(e) => { e.preventDefault(); notify("Admin added"); }}>
          <input className="input" placeholder="Full Name" />
          <input className="input" placeholder="Email" />
          <input className="input" placeholder="Password" type="password" />
          <select><option>Role</option><option>Super Admin</option><option>Support Admin</option><option>Payment Admin</option></select>
          <label><input type="checkbox" /> Manage Users</label>
          <label><input type="checkbox" /> Manage Restaurants</label>
          <label><input type="checkbox" /> Manage Payments</label>
          <label><input type="checkbox" /> Reply Tickets</label>
          <button className="btn full">Add Admin</button>
        </form>
      </Card>
    </>
  );
}
