import "./Contact.css";
function Contact() {
  return (
    <>
      <title>Contact</title>
      <div className="card">
        <h1>Contact Us</h1>
        <div className="form-row">
          <label htmlFor="title" ></label><input id="title" placeholder="Title"></input>
        </div>
        <div className="form-row">
          <label></label><textarea id="message" placeholder="Description"></textarea>
          </div>
      </div>
    </>
  );
}
export default Contact;
