import { useEffect, useMemo, useState } from "react";
import { PageHeader, Card, Badge, notify } from "../components/UI";
import { api } from "../../api";
import "./RestaurantsManagement.css";

const emptyRestaurant = { id: "", name: "", owner_user_id: "", owner_name: "", owner_email: "", phone: "", category: "", description: "", address: "", opening_hours: "", image_url: "", is_open: 1, staff_delivery: 0 };

export default function RestaurantsManagement() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyRestaurant);

  async function loadRestaurants() {
    const data = await api("restaurants");
    setRestaurants(data.restaurants || []);
  }

  useEffect(() => { loadRestaurants(); }, []);

  const filtered = useMemo(() => restaurants.filter((r) => `${r.name} ${r.owner_name} ${r.owner_email} ${r.category}`.toLowerCase().includes(search.toLowerCase())), [restaurants, search]);
  const editing = Boolean(form.id);

  function change(e) {
    const value = e.target.type === "checkbox" ? (e.target.checked ? 1 : 0) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  }

  function edit(restaurant) {
    setForm({
      ...emptyRestaurant,
      ...restaurant,
      image_url: restaurant.imageUrl || restaurant.image_url || "",
      is_open: restaurant.isOpen ? 1 : 0,
      staff_delivery: restaurant.staffDelivery ? 1 : 0,
      owner_user_id: restaurant.owner_user_id || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e) {
    e.preventDefault();
    const payload = { ...form, owner_user_id: form.owner_user_id ? Number(form.owner_user_id) : null };
    await api("restaurants", { method: editing ? "PUT" : "POST", body: JSON.stringify(payload) });
    notify(editing ? "Restaurant updated" : "Restaurant created");
    setForm(emptyRestaurant);
    await loadRestaurants();
  }

  async function remove(restaurant) {
    if (!confirm(`Delete ${restaurant.name}?`)) return;
    await api(`restaurants&id=${restaurant.id}`, { method: "DELETE" });
    notify("Restaurant deleted");
    await loadRestaurants();
  }

  return (
    <>
      <PageHeader title="Restaurants CRUD" subtitle="Create, read, update, delete, open/close, and assign restaurants to owners.">
        <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search restaurants..." />
      </PageHeader>

      <Card className="crud-form-card">
        <form className="form admin-form" onSubmit={submit}>
          <input name="name" value={form.name} onChange={change} className="input" placeholder="Restaurant name" required />
          <input name="owner_user_id" value={form.owner_user_id || ""} onChange={change} className="input" placeholder="Owner user ID" />
          <input name="owner_name" value={form.owner_name || ""} onChange={change} className="input" placeholder="Owner name" />
          <input name="owner_email" value={form.owner_email || ""} onChange={change} className="input" placeholder="Owner email" />
          <input name="phone" value={form.phone || ""} onChange={change} className="input" placeholder="Phone" />
          <input name="category" value={form.category || ""} onChange={change} className="input" placeholder="Category" />
          <input name="opening_hours" value={form.opening_hours || ""} onChange={change} className="input" placeholder="Opening hours" />
          <input name="image_url" value={form.image_url || ""} onChange={change} className="input" placeholder="Image URL" />
          <textarea name="description" value={form.description || ""} onChange={change} className="full" placeholder="Description" />
          <textarea name="address" value={form.address || ""} onChange={change} className="full" placeholder="Address" />
          <label className="check-card"><input type="checkbox" name="is_open" checked={Number(form.is_open) === 1} onChange={change} /> Open now</label>
          <label className="check-card"><input type="checkbox" name="staff_delivery" checked={Number(form.staff_delivery) === 1} onChange={change} /> Staff delivery</label>
          <div className="crud-actions full">
            <button className="btn">{editing ? "Update Restaurant" : "Create Restaurant"}</button>
            {editing && <button type="button" className="btn ghost" onClick={() => setForm(emptyRestaurant)}>Cancel Edit</button>}
          </div>
        </form>
      </Card>

      <Card className="table-wrap crud-table-card">
        <table>
          <thead><tr><th>ID</th><th>Restaurant</th><th>Owner</th><th>Category</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.owner_name || r.owner_email || "-"}</td>
                <td>{r.category}</td>
                <td>{r.phone || "-"}</td>
                <td><Badge type={r.isOpen ? "green" : "red"}>{r.isOpen ? "Open" : "Closed"}</Badge></td>
                <td className="row-actions"><button className="btn small" onClick={() => edit(r)}>Edit</button><button className="btn small dark" onClick={() => remove(r)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
