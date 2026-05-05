import { PageHeader, Card, notify } from "../components/UI";

import "./AddRestaurant.css";
export default function AddRestaurant() {
  return (
    <>
      <PageHeader title="Add Restaurant" subtitle="Create a new restaurant profile." />

      <Card>
        <form className="form" onSubmit={(e) => { e.preventDefault(); notify("Restaurant added"); }}>
          <input className="input" placeholder="Restaurant Name" />
          <input className="input" placeholder="Owner Name" />
          <input className="input" placeholder="Email" />
          <input className="input" placeholder="Phone" />
          <input className="input" placeholder="Cuisine Type" />
          <input className="input" placeholder="Opening Hours" />
          <textarea className="full" placeholder="Restaurant Address" />
          <button className="btn full">Add Restaurant</button>
        </form>
      </Card>
    </>
  );
}
