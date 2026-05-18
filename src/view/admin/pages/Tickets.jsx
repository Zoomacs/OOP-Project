import { useEffect, useMemo, useState } from "react";
import { PageHeader, Card, Badge, notify } from "../components/UI";
import { api } from "../../api";
import "./Tickets.css";

const emptyTicket = {
  id: "",
  title: "",
  email: "",
  message: "",
  reply: "",
  status: "Open",
};

function getRawId(ticket) {
  return ticket.raw_id || String(ticket.id || "").replace("#TCK-", "");
}

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyTicket);
  const [loading, setLoading] = useState(false);

  async function loadTickets() {
    const data = await api("tickets");
    setTickets(data.tickets || []);
  }

  useEffect(() => {
    loadTickets();
  }, []);

  const filtered = useMemo(
    () =>
      tickets.filter((t) =>
        `${t.id} ${t.title} ${t.email} ${t.message} ${t.reply} ${t.status}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [tickets, search],
  );

  const editing = Boolean(form.id);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function edit(ticket) {
    setForm({
      id: getRawId(ticket),
      title: ticket.title || "",
      email: ticket.email || "",
      message: ticket.message || ticket.text || "",
      reply: ticket.reply || "",
      status: ticket.status || "Open",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        await api("tickets", { method: "PUT", body: JSON.stringify(form) });
        notify("Ticket updated");
      } else {
        await api("tickets", { method: "POST", body: JSON.stringify(form) });
        notify("Ticket created");
      }

      setForm(emptyTicket);
      await loadTickets();
    } catch (err) {
      notify(err.message || "Ticket action failed");
    } finally {
      setLoading(false);
    }
  }

  async function reply(ticket) {
    const text = prompt("Write admin reply", ticket.reply || "");
    if (text === null) return;

    try {
      await api("tickets", {
        method: "PUT",
        body: JSON.stringify({
          id: getRawId(ticket),
          reply: text.trim(),
          status: text.trim() ? "Answered" : ticket.status,
        }),
      });
      notify(
        "Reply saved. The user can now view it in Contact > View Tickets.",
      );
      await loadTickets();
    } catch (err) {
      notify(err.message || "Reply failed");
    }
  }

  async function remove(ticket) {
    if (!confirm(`Delete ${ticket.id}?`)) return;

    try {
      await api("tickets", {
        method: "DELETE",
        body: JSON.stringify({ id: getRawId(ticket) }),
      });
      notify("Ticket deleted");
      await loadTickets();
    } catch (err) {
      notify(err.message || "Delete failed");
    }
  }

  return (
    <>
      <PageHeader
        title="Tickets CRUD"
        subtitle="Create, read, reply, update status, and delete support tickets."
      >
        <input
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tickets..."
        />
      </PageHeader>

      <Card className="crud-form-card">
        <form className="form admin-form" onSubmit={submit}>
          <input
            name="title"
            value={form.title}
            onChange={change}
            className="input"
            placeholder="Ticket title"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={change}
            className="input"
            placeholder="Customer email"
          />
          <select name="status" value={form.status} onChange={change}>
            <option>Open</option>
            <option>Pending</option>
            <option>Urgent</option>
            <option>Answered</option>
            <option>Closed</option>
          </select>
          <textarea
            name="message"
            value={form.message}
            onChange={change}
            className="full"
            placeholder="Ticket message"
            required
          />
          <textarea
            name="reply"
            value={form.reply}
            onChange={change}
            className="full"
            placeholder="Admin reply shown to the user"
          />
          <div className="crud-actions full">
            <button className="btn" disabled={loading}>
              {editing ? "Update Ticket" : "Create Ticket"}
            </button>
            {editing && (
              <button
                type="button"
                className="btn ghost"
                onClick={() => setForm(emptyTicket)}
              >
                Cancel
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
              <th>Title</th>
              <th>Email</th>
              <th>Message</th>
              <th>Status</th>
              <th>Reply</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ticket) => (
              <tr key={ticket.raw_id || ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.email}</td>
                <td className="text-cell">{ticket.message || ticket.text}</td>
                <td>
                  <Badge
                    type={
                      ticket.status === "Urgent"
                        ? "red"
                        : ticket.status === "Pending"
                          ? "gold"
                          : ticket.status === "Answered"
                            ? "green"
                            : "blue"
                    }
                  >
                    {ticket.status}
                  </Badge>
                </td>
                <td className="text-cell">{ticket.reply || "No reply yet"}</td>
                <td className="row-actions">
                  <button className="btn small" onClick={() => edit(ticket)}>
                    Edit
                  </button>
                  <button
                    className="btn small green"
                    onClick={() => reply(ticket)}
                  >
                    Reply
                  </button>
                  <button
                    className="btn small dark"
                    onClick={() => remove(ticket)}
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
