import { useState } from "react";
import { PageHeader, Card, notify } from "../components/UI";
import { api } from "../../api";
import "./ReplyContactTicket.css";
export default function ReplyContactTicket() {
  const [id, setId] = useState("");
  const [reply, setReply] = useState("");
  async function submit(e) { e.preventDefault(); await api("tickets", { method: "PUT", body: JSON.stringify({ id: id.replace("#TCK-", ""), reply }) }); notify("Reply saved in database"); }
  return <><PageHeader title="Reply Contact Ticket" subtitle="Send a support reply to a customer." /><Card><form className="form" onSubmit={submit}><input className="input" placeholder="Ticket ID" value={id} onChange={(e) => setId(e.target.value)} /><input className="input full" placeholder="Subject" /><textarea className="full" placeholder="Write your reply here..." value={reply} onChange={(e) => setReply(e.target.value)} /><button className="btn full">Send Reply</button></form></Card></>;
}
