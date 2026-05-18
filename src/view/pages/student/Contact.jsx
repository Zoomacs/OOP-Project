import { useEffect, useState } from "react";
import AdminReturnButton from "../../components/common/AdminReturnButton";
import { api, getUser } from "../../api";
import "./Contact.css";

function Contact({ page }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [tickets, setTickets] = useState([]);
  const [showTickets, setShowTickets] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    page("contact");
    loadTickets();
  }, [page]);

  async function loadTickets() {
    const user = getUser();
    if (!user) {
      setTickets([]);
      return;
    }

    try {
      const query = user.role === "admin"
        ? "tickets"
        : `tickets&user_id=${encodeURIComponent(user.id)}&email=${encodeURIComponent(user.email || "")}`;
      const data = await api(query);
      setTickets(data.tickets || []);
    } catch (err) {
      console.log(err);
      setTickets([]);
    }
  }

  async function sendTicket() {
    const user = getUser();

    if (!user) {
      setStatus("Please login first");
      return;
    }

    if (!title.trim() || !message.trim()) {
      setStatus("Please fill ticket title and message");
      return;
    }

    try {
      setLoading(true);
      await api("tickets", {
        method: "POST",
        body: JSON.stringify({
          user_id: user.id,
          title: title.trim(),
          email: user.email || "",
          message: message.trim(),
        }),
      });

      setTitle("");
      setMessage("");
      setStatus("Ticket message sent successfully");
      setShowTickets(true);
      await loadTickets();
    } catch (err) {
      setStatus(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <title>Contact</title>

      <div className="contact-container">
        <div className="contact-left">
          <div className="support-badge">Support Center</div>

          <h1 className="main-heading">
            How can we <span className="highlight">help you</span> today?
          </h1>

          <p className="support-description">
            Send a support ticket and check the admin reply from the same page.
          </p>

          <div className="action-buttons">
            <button
              className="view-tickets"
              onClick={() => {
                const next = !showTickets;
                setShowTickets(next);
                if (next) loadTickets();
              }}
            >
              {showTickets ? "Hide Tickets" : "View Tickets"}
            </button>
          </div>
        </div>

        <div className="contact-right">
          <div className="contact-card">
            <h1 id="contact">Contact Us</h1>

            <div className="form-row">
              <input
                id="title"
                placeholder="Ticket Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-row">
              <textarea
                id="message"
                placeholder="Describe your issue"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button className="submit" onClick={sendTicket} disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>

            {status && <p className="ticket-status">{status}</p>}
          </div>

          {showTickets && (
            <div className="contact-card tickets-box">
              <div className="ticket-list-title">
                <h2>Your Ticket Messages</h2>
                <button className="view-tickets small-refresh" onClick={loadTickets}>Refresh</button>
              </div>

              {tickets.length === 0 && (
                <p className="empty-ticket">No tickets found</p>
              )}

              {tickets.map((ticket) => (
                <div className="ticket-item" key={ticket.raw_id || ticket.id}>
                  <div className="ticket-header">
                    <h3>{ticket.id} - {ticket.title}</h3>
                    <span className="ticket-badge">{ticket.status}</span>
                  </div>

                  <p className="ticket-message">
                    <b>Your Message:</b> {ticket.message || ticket.text}
                  </p>

                  <div className="ticket-reply">
                    <b>Admin Reply:</b>
                    {ticket.reply ? <p>{ticket.reply}</p> : <p>No reply yet</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AdminReturnButton />
    </>
  );
}

export default Contact;
