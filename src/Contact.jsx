import "./Contact.css";
import "./main.css";
import { useEffect, useState } from "react";
import AdminReturnButton from "./AdminReturnButton";
import { api, getUser } from "./api";
function Contact({ page }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => { page("contact"); }, [page]);
  async function sendTicket() {
    const user = getUser();
    try {
      await api("tickets", { method: "POST", body: JSON.stringify({ user_id: user?.id || 4, title, email: user?.email || "", message }) });
      setTitle(""); setMessage(""); setStatus("Message sent to backend");
    } catch (err) { setStatus(err.message); }
  }
  return <><title>Contact</title><div className="contact-container"><div className="contact-left"><div className="support-badge">Support Center</div><h1 className="main-heading">How can we <span className="highlight">help you</span> today?</h1><p className="support-description">Our dedicated team is ready to ensure your campus dining experience is seamless.</p><div className="action-buttons"><button className="view-tickets">View Tickets</button></div></div><div className="contact-right"><div className="contact-card"><h1 id="contact">Contact Us</h1><div className="form-row"><input id="title" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} /></div><div className="form-row"><textarea id="message" placeholder="Description" value={message} onChange={(e)=>setMessage(e.target.value)} /></div><button className="submit" onClick={sendTicket}>Send Message</button>{status && <p>{status}</p>}</div></div></div><AdminReturnButton /></>;
}
export default Contact;
