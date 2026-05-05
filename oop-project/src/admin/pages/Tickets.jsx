import { tickets } from "../data";
import { PageHeader, Card, Badge } from "../components/UI";

import "./Tickets.css";
export default function Tickets() {
  return (
    <>
      <PageHeader title="Tickets" subtitle="Quick support ticket overview." />

      <Card>
        {tickets.map((ticket) => (
          <div className="ticket" key={ticket.id}>
            <div>
              <b>{ticket.title}</b>
              <p className="muted">{ticket.text}</p>
            </div>
            <Badge type={ticket.status === "Urgent" ? "red" : ticket.status === "Pending" ? "gold" : "blue"}>{ticket.status}</Badge>
          </div>
        ))}
      </Card>
    </>
  );
}
