import { PageHeader, Card, notify } from "../components/UI";

import "./BanStudent.css";
export default function BanStudent() {
  return (
    <>
      <PageHeader title="Ban Student" subtitle="Block a student account from using the platform." />

      <Card>
        <form className="form" onSubmit={(e) => { e.preventDefault(); notify("Student banned successfully"); }}>
          <input className="input" placeholder="Student ID" />
          <input className="input" placeholder="Student Email" />
          <select><option>Reason</option><option>Fake orders</option><option>Abuse</option><option>Payment issue</option></select>
          <input className="input" placeholder="Ban duration, example: 7 days" />
          <textarea className="full" placeholder="Admin note" />
          <button className="btn red full">Ban Student</button>
        </form>
      </Card>
    </>
  );
}
