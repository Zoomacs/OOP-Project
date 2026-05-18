import { useEffect, useMemo, useState } from "react";
import { PageHeader, Card, Badge, notify } from "../components/UI";
import { api } from "../../api";
import "./UsersManagement.css";

const emptyUser = {
  id: "",
  name: "",
  email: "",
  university_id: "",
  password: "",
  role: "student",
  department: "",
  status: "Active",
  restaurant_id: "",
};

export default function UsersManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyUser);
  const [loading, setLoading] = useState(false);

  async function loadUsers() {
    const data = await api("users");
    setUsers(data.users || []);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(
    () =>
      users.filter((u) =>
        `${u.name} ${u.email} ${u.university_id} ${u.type} ${u.status}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [users, search],
  );
  const editing = Boolean(form.id);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function edit(user) {
    setForm({
      ...emptyUser,
      ...user,
      password: "",
      restaurant_id: user.restaurant_id || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        restaurant_id: form.restaurant_id ? Number(form.restaurant_id) : null,
      };
      await api("users", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      notify(editing ? "User updated" : "User created");
      setForm(emptyUser);
      await loadUsers();
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(user, status) {
    await api("users", {
      method: "PUT",
      body: JSON.stringify({
        ...user,
        status,
        restaurant_id: user.restaurant_id || null,
      }),
    });
    await loadUsers();
  }

  async function remove(user) {
    if (!confirm(`Delete ${user.name}?`)) return;
    await api(`users&id=${user.id}`, { method: "DELETE" });
    notify("User deleted");
    await loadUsers();
  }

  return (
    <>
      <PageHeader
        title="Users CRUD"
        subtitle="Create, read, update, ban/unban, and delete admin, owner, staff, and student accounts."
      >
        <input
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
        />
      </PageHeader>

      <Card className="crud-form-card">
        <form className="form admin-form" onSubmit={submit}>
          <input
            name="name"
            value={form.name}
            onChange={change}
            className="input"
            placeholder="Full name"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={change}
            className="input"
            placeholder="Email"
            required
          />
          <input
            name="university_id"
            value={form.university_id}
            onChange={change}
            className="input"
            placeholder="Login ID / University ID"
            required
          />
          <input
            name="password"
            value={form.password}
            onChange={change}
            className="input"
            placeholder={editing ? "New password optional" : "Password"}
            type="password"
          />
          <select name="role" value={form.role} onChange={change}>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <select name="status" value={form.status} onChange={change}>
            <option>Active</option>
            <option>Banned</option>
            <option>Review</option>
          </select>
          <input
            name="department"
            value={form.department || ""}
            onChange={change}
            className="input"
            placeholder="Department"
          />
          <input
            name="restaurant_id"
            value={form.restaurant_id || ""}
            onChange={change}
            className="input"
            placeholder="Restaurant ID for owner/staff"
          />
          <div className="crud-actions full">
            <button className="btn" disabled={loading}>
              {editing ? "Update User" : "Create User"}
            </button>
            {editing && (
              <button
                type="button"
                className="btn ghost"
                onClick={() => setForm(emptyUser)}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </Card>

      <Card className="table-wrap crud-table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Login ID</th>
              <th>Role</th>
              <th>Restaurant</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.university_id}</td>
                <td>{user.type}</td>
                <td>{user.restaurant_name || user.restaurant_id || "-"}</td>
                <td>
                  <Badge
                    type={
                      user.status === "Banned"
                        ? "red"
                        : user.status === "Review"
                          ? "gold"
                          : "green"
                    }
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="row-actions">
                  <button className="btn small" onClick={() => edit(user)}>
                    Edit
                  </button>
                  {user.status === "Banned" ? (
                    <button
                      className="btn small green"
                      onClick={() => updateStatus(user, "Active")}
                    >
                      Unban
                    </button>
                  ) : (
                    <button
                      className="btn small red"
                      onClick={() => updateStatus(user, "Banned")}
                    >
                      Ban
                    </button>
                  )}
                  <button
                    className="btn small dark"
                    onClick={() => remove(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
