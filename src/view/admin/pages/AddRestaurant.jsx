import { useState } from "react";
import { PageHeader, Card, notify } from "../components/UI";
import { api } from "../../api";
import "./AddRestaurant.css";
export default function AddRestaurant() {
  const [form, setForm] = useState({
    name: "",
    owner_name: "",
    owner_email: "",
    phone: "",
    category: "",
    opening_hours: "",
    address: "",
  });
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    await api("restaurants", {
      method: "POST",
      body: JSON.stringify({ ...form, description: form.category }),
    });
    notify("Restaurant added to database");
  }
  return (
    <>
      <PageHeader
        title="Add Restaurant"
        subtitle="Create a new restaurant profile."
      />
      <Card>
        <form className="form" onSubmit={submit}>
          <input
            name="name"
            value={form.name}
            onChange={change}
            className="input"
            placeholder="Restaurant Name"
          />
          <input
            name="owner_name"
            value={form.owner_name}
            onChange={change}
            className="input"
            placeholder="Owner Name"
          />
          <input
            name="owner_email"
            value={form.owner_email}
            onChange={change}
            className="input"
            placeholder="Email"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={change}
            className="input"
            placeholder="Phone"
          />
          <input
            name="category"
            value={form.category}
            onChange={change}
            className="input"
            placeholder="Cuisine Type"
          />
          <input
            name="opening_hours"
            value={form.opening_hours}
            onChange={change}
            className="input"
            placeholder="Opening Hours"
          />
          <textarea
            name="address"
            value={form.address}
            onChange={change}
            className="full"
            placeholder="Restaurant Address"
          />
          <button className="btn full">Add Restaurant</button>
        </form>
      </Card>
    </>
  );
}
