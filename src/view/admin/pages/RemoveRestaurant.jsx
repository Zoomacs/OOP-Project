import { useState } from "react";
import { PageHeader, Card, notify } from "../components/UI";
import { api } from "../../api";
import "./RemoveRestaurant.css";
export default function RemoveRestaurant() {
  const [id, setId] = useState("");
  async function submit(e) {
    e.preventDefault();
    await api(`restaurants&id=${id}`, { method: "DELETE" });
    notify("Restaurant removed from database");
  }
  return (
    <>
      <PageHeader
        title="Remove Restaurant"
        subtitle="Remove or suspend a restaurant."
      />
      <Card>
        <form className="form" onSubmit={submit}>
          <input
            className="input"
            placeholder="Restaurant ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <select>
            <option>Remove permanently</option>
            <option>Suspend temporarily</option>
          </select>
          <input
            className="input"
            placeholder="Admin password"
            type="password"
          />
          <textarea className="full" placeholder="Reason" />
          <button className="btn red full">Remove Restaurant</button>
        </form>
      </Card>
    </>
  );
}
