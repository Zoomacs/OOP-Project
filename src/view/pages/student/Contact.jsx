import { useEffect, useState } from "react";
import { Mail, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { api, getUser } from "../../api";
import "./Contact.css";

function Contact({ page }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = getUser();

  useEffect(() => {
    if (page) {
      page("contact");
    }
  }, [page]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (title.trim() === "" || message.trim() === "") {
      setSuccess(false);
      setStatusMessage("Please write the ticket title and message.");
      return;
    }

    setLoading(true);
    setStatusMessage("");

    try {
      await api("tickets", {
        method: "POST",
        body: JSON.stringify({
          user_id: user?.id || null,
          title: title,
          email: user?.email || "",
          message: message,
        }),
      });

      setTitle("");
      setMessage("");
      setSuccess(true);
      setStatusMessage("Your support ticket has been sent successfully.");
    } catch (err) {
      setSuccess(false);
      setStatusMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <span className="contact-label">SUPPORT CENTER</span>

        <h1>Contact Us</h1>

        <p>
          Send a support ticket and check the admin reply from the same page.
        </p>
      </div>

      <div className="contact-content">
        <div className="contact-info-card">
          <div className="contact-info-icon">
            <MessageCircle size={28} />
          </div>

          <h2>Need Help?</h2>

          <p>
            Write your issue clearly and the admin will review your ticket as
            soon as possible.
          </p>

          <div className="contact-mini-row">
            <Mail size={18} />
            <span>Support tickets are connected to your account.</span>
          </div>
        </div>

        <form className="contact-form-card" onSubmit={handleSubmit}>
          <h2>Send Ticket</h2>

          <div className="contact-input-group">
            <label>Ticket Title</label>
            <input
              type="text"
              placeholder="Example: Payment problem"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="contact-input-group">
            <label>Your Message</label>
            <textarea
              placeholder="Describe your issue..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          {statusMessage && (
            <div className={success ? "contact-success" : "contact-error"}>
              {success && <CheckCircle2 size={18} />}
              <span>{statusMessage}</span>
            </div>
          )}

          <button className="contact-submit-btn" type="submit" disabled={loading}>
            <Send size={18} />
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;