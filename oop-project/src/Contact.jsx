import "./Contact.css";
import "./main.css";
import {  useEffect } from "react";
function Contact({ page }) {
   useEffect(() => {
    page("contact"); 
  }, [page]);
  return (
    <>
      <title>Contact</title>
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
    </>
  );
}
export default Contact;
