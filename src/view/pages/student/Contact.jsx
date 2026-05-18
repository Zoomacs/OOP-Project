import { useEffect, useState } from "react";
import { api, getUser } from "../../api";
import "./Contact.css";

function Contact({ page }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [tickets, setTickets] = useState([]);
  const [showTickets, setShowTickets] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = getUser();

  useEffect(() => {
    if (page) {
      page("contact");
    }

    loadTickets();
  }, [page]);

  async function loadTickets() {
    try {
      const userId = user?.id || sessionStorage.getItem("userId") || "";

      if (!userId) {
        return;
      }

      const data = await api(`tickets&user_id=${userId}`);

      if (data.tickets) {
        setTickets(data.tickets);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async function sendTicket(e) {
    e.preventDefault();

    if (title.trim() === "" || message.trim() === "") {
      setStatusMessage("Please enter ticket title and message.");
      return;
    }

    setLoading(true);
    setStatusMessage("");

    try {
      await api("tickets", {
        method: "POST",
        body: JSON.stringify({
          user_id: user?.id || sessionStorage.getItem("userId") || null,
          title: title,
          email: user?.email || sessionStorage.getItem("userEmail") || "",
          message: message,
        }),
      });

      setTitle("");
      setMessage("");
      setStatusMessage("Ticket sent successfully.");
      loadTickets();
    } catch (err) {
      setStatusMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="contact-container">
      <div className="contact-left">
        <span className="support-badge">Support Center</span>

        <h1 className="main-heading">
          Contact <span className="highlight">Us</span>
        </h1>

        <p className="support-description">
          Send a support ticket and check the admin reply from the same page.
        </p>

        <div className="action-buttons">
          <button
            className="view-tickets"
            type="button"
            onClick={() => setShowTickets(!showTickets)}
          >
            {showTickets ? "Hide Tickets" : "View Tickets"}
          </button>
        </div>
      </div>

      <div className="contact-right">
        <form className="contact-card" onSubmit={sendTicket}>
          <h2 id="contact">Contact Us</h2>

          <div className="form-row">
            <input
              id="title"
              type="text"
              placeholder="Ticket Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              id="message"
              placeholder="Describe your issue"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          {statusMessage && <p className="ticket-status">{statusMessage}</p>}

          <button className="submit" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {showTickets && (
          <div className="contact-card tickets-box">
            <div className="ticket-list-title">
              <h2>Your Tickets</h2>

              <button
                className="submit small-refresh"
                type="button"
                onClick={loadTickets}
              >
                Refresh
              </button>
            </div>

            {tickets.length === 0 ? (
              <p className="empty-ticket">No tickets yet.</p>
            ) : (
              tickets.map((ticket) => (
                <div className="ticket-item" key={ticket.id}>
                  <div className="ticket-header">
                    <h3>{ticket.title}</h3>
                    <span className="ticket-badge">
                      {ticket.status || "Open"}
                    </span>
                  </div>

                  <p className="ticket-message">{ticket.message}</p>

                  {ticket.reply && (
                    <div className="ticket-reply">
                      <strong>Admin Reply</strong>
                      <p>{ticket.reply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Contact;