import { useEffect, useState } from "react";
import { PageHeader, Card, Badge } from "../components/UI";
import { api } from "../../api";
import "./Tickets.css";
export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => { api("tickets").then((d) => setTickets(d.tickets || [])); }, []);
  return <><PageHeader title="Tickets" subtitle="Quick support ticket overview." /><Card>{tickets.map((ticket) => <div className="ticket" key={ticket.id}><div><b>{ticket.title}</b><p className="muted">{ticket.text}</p></div><Badge type={ticket.status === "Urgent" ? "red" : ticket.status === "Pending" ? "gold" : "blue"}>{ticket.status}</Badge></div>)}</Card></>;
}
