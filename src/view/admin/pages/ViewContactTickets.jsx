import { useEffect, useState } from "react";
import { PageHeader, Card, Badge, notify } from "../components/UI";
import { api } from "../../api";
import "./ViewContactTickets.css";

function rawId(ticket) {
  return ticket.raw_id || String(ticket.id || "").replace("#TCK-", "");
}

export default function ViewContactTickets() {
  const [tickets, setTickets] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loadingId, setLoadingId] = useState("");

  async function loadTickets() {
    const data = await api("tickets");
    const rows = data.tickets || [];
    setTickets(rows);

    const replies = {};
    rows.forEach((ticket) => {
      replies[rawId(ticket)] = ticket.reply || "";
    });
    setReplyText(replies);
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function saveReply(ticket) {
    const id = rawId(ticket);
    const reply = (replyText[id] || "").trim();

    if (!reply) {
      notify("Write a reply first");
      return;
    }

    try {
      setLoadingId(id);
      await api("tickets", {
        method: "PUT",
        body: JSON.stringify({ id, reply, status: "Answered" }),
      });
      notify("Reply saved. The user can view it in Contact > View Tickets.");
      await loadTickets();
    } catch (err) {
      notify(err.message || "Reply failed");
    } finally {
      setLoadingId("");
    }
  }

  return (
    <>
      <PageHeader
        title="View Contact Tickets"
        subtitle="Read customer messages and reply directly from this page."
      >
        <button className="btn" onClick={loadTickets}>Refresh</button>
      </PageHeader>

      <Card>
        {tickets.length === 0 && <p className="muted">No contact tickets found.</p>}

        {tickets.map((ticket) => {
          const id = rawId(ticket);

          return (
            <div className="ticket" key={id}>
              <div className="ticket-main">
                <div className="ticket-topline">
                  <b>{ticket.id} - {ticket.title}</b>
                  <Badge type={ticket.status === "Answered" ? "green" : ticket.status === "Urgent" ? "red" : "blue"}>
                    {ticket.status}
                  </Badge>
                </div>

                <p className="muted">From: {ticket.email || "No email"}</p>
                <p><b>User Message:</b> {ticket.message || ticket.text}</p>

                <div className="current-reply">
                  <b>Current Admin Reply:</b>
                  <p>{ticket.reply || "No reply yet"}</p>
                </div>

                <textarea
                  className="reply-box"
                  value={replyText[id] || ""}
                  onChange={(e) => setReplyText({ ...replyText, [id]: e.target.value })}
                  placeholder="Write admin reply that will appear to the user..."
                />

                <button className="btn dark" onClick={() => saveReply(ticket)} disabled={loadingId === id}>
                  {loadingId === id ? "Saving..." : "Save Reply"}
                </button>
              </div>
            </div>
          );
        })}
      </Card>
    </>
  );
}
