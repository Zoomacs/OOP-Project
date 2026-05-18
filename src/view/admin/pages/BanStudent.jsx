import { useState } from "react";
import { PageHeader, Card, notify } from "../components/UI";
import { api } from "../../api";
import "./BanStudent.css";
export default function BanStudent() {
  const [universityId, setUniversityId] = useState("");
  const [email, setEmail] = useState("");
  async function submit(e) {
    e.preventDefault();
    await api("ban-user", {
      method: "POST",
      body: JSON.stringify({ university_id: universityId, email }),
    });
    notify("Student banned successfully");
  }
  return (
    <>
      <PageHeader
        title="Ban Student"
        subtitle="Block a student account from using the platform."
      />
      <Card>
        <form className="form" onSubmit={submit}>
          <input
            className="input"
            placeholder="Student ID"
            value={universityId}
            onChange={(e) => setUniversityId(e.target.value)}
          />
          <input
            className="input"
            placeholder="Student Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select>
            <option>Reason</option>
            <option>Fake orders</option>
            <option>Abuse</option>
            <option>Payment issue</option>
          </select>
          <input
            className="input"
            placeholder="Ban duration, example: 7 days"
          />
          <textarea className="full" placeholder="Admin note" />
          <button className="btn red full">Ban Student</button>
        </form>
      </Card>
    </>
  );
}
