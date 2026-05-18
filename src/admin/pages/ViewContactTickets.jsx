import { useEffect, useState } from "react";
import { PageHeader, Card } from "../components/UI";
import { api } from "../../api";
import "./ViewContactTickets.css";
export default function ViewContactTickets() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => { api("tickets").then((d) => setTickets(d.tickets || [])); }, []);
  return <><PageHeader title="View Contact Tickets" subtitle="Read customer contact messages." /><Card>{tickets.map((ticket) => <div className="ticket" key={ticket.id}><div><b>{ticket.id} - {ticket.title}</b><p className="muted">From: {ticket.email}</p><p>{ticket.text}</p></div><button className="btn dark">View</button></div>)}</Card></>;
}
