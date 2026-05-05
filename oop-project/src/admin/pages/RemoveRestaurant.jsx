import { PageHeader, Card, notify } from "../components/UI";

import "./RemoveRestaurant.css";
export default function RemoveRestaurant() {
  return (
    <>
      <PageHeader title="Remove Restaurant" subtitle="Remove or suspend a restaurant." />

      <Card>
        <form className="form" onSubmit={(e) => { e.preventDefault(); notify("Restaurant removed"); }}>
          <input className="input" placeholder="Restaurant ID" />
          <input className="input" placeholder="Restaurant Name" />
          <select><option>Action</option><option>Suspend temporarily</option><option>Remove permanently</option></select>
          <input className="input" placeholder="Admin password" />
          <textarea className="full" placeholder="Reason" />
          <button className="btn red full">Remove Restaurant</button>
        </form>
      </Card>
    </>
  );
}
