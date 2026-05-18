import { useEffect, useState } from "react";
import { PageHeader, Card, notify } from "../components/UI";
import { api } from "../../api";
import "./ReplyContactTicket.css";

export default function ReplyContactTicket() {
  const [tickets, setTickets] = useState([]);
  const [id, setId] = useState("");
  const [reply, setReply] = useState("");

  async function loadTickets() {
    const data = await api("tickets");
    setTickets(data.tickets || []);
  }

  useEffect(() => {
    loadTickets();
  }, []);

  function selectTicket(value) {
    setId(value);
    const ticket = tickets.find((item) => String(item.raw_id) === String(value));
    setReply(ticket?.reply || "");
  }

  async function submit(e) {
    e.preventDefault();

    const ticketId = String(id).replace("#TCK-", "").trim();
    if (!ticketId) {
      notify("Choose a ticket first");
      return;
    }
    if (!reply.trim()) {
      notify("Write a reply first");
      return;
    }

    await api("tickets", {
      method: "PUT",
      body: JSON.stringify({ id: ticketId, reply: reply.trim(), status: "Answered" }),
    });

    notify("Reply saved. The user can view it in Contact > View Tickets.");
    await loadTickets();
  }

  return (
    <div className="reply-contact-ticket-page">
      <PageHeader title="Reply Contact Ticket" subtitle="Send a support reply to a customer." />
      <Card>
        <form className="form" onSubmit={submit}>
          <select className="input full" value={id} onChange={(e) => selectTicket(e.target.value)} required>
            <option value="">Choose ticket</option>
            {tickets.map((ticket) => (
              <option key={ticket.raw_id} value={ticket.raw_id}>
                {ticket.id} - {ticket.title} - {ticket.email}
              </option>
            ))}
          </select>
          <textarea
            className="full"
            placeholder="Write your reply here..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            required
          />
          <button className="btn full">Send Reply</button>
        </form>
      </Card>
    </div>
  );
}
