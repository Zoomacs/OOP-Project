import { tickets } from "../data";
import { PageHeader, Card } from "../components/UI";

import "./ViewContactTickets.css";
export default function ViewContactTickets() {
  return (
    <>
      <PageHeader title="View Contact Tickets" subtitle="Read customer contact messages." />

      <Card>
        {tickets.map((ticket) => (
          <div className="ticket" key={ticket.id}>
            <div>
              <b>{ticket.id} - {ticket.title}</b>
              <p className="muted">From: {ticket.email}</p>
            </div>
            <button className="btn dark">View</button>
          </div>
        ))}
      </Card>
    </>
  );
}
