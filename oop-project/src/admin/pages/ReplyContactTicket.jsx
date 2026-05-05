import { PageHeader, Card, notify } from "../components/UI";

import "./ReplyContactTicket.css";
export default function ReplyContactTicket() {
  return (
    <>
      <PageHeader title="Reply Contact Ticket" subtitle="Send a support reply to a customer." />

      <Card>
        <form className="form" onSubmit={(e) => { e.preventDefault(); notify("Reply sent"); }}>
          <input className="input" placeholder="Ticket ID" />
          <input className="input" placeholder="Customer Email" />
          <input className="input full" placeholder="Subject" />
          <textarea className="full" placeholder="Write your reply here..." />
          <button className="btn full">Send Reply</button>
        </form>
      </Card>
    </>
  );
}
