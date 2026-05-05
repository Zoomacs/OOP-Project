import "./Contact.css";
import "./main.css";
import { useEffect } from "react";
function Contact({ page }) {
  useEffect(() => {
    page("contact");
  }, [page]);
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
            Our dedicated team is ready to ensure your campus dining
            experience is seamless. From order inquiries to technical
            support, we're here for you.
          </p>
          <div className="action-buttons">
            <button className="view-tickets">View Tickets</button>
          </div>
        </div>
        <div className="contact-right">
          <div className="contact-card">
            <h1 id="contact">Contact Us</h1>
            <div className="form-row">
              <label htmlFor="title"></label>
              <input id="title" placeholder="Title"></input>
            </div>
            <div className="form-row">
              <label></label>
              <textarea id="message" placeholder="Description"></textarea>
            </div>
            <div className="submit">Send Message</div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Contact;
