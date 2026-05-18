import { useEffect } from "react";
import RestaurantList from "./Restaurant_card";
import "./Restaurant.css";
import AdminReturnButton from "./AdminReturnButton";

function Restaurant({ page }) {
  useEffect(() => {
    page("restaurant");
  }, [page]);

  return (
    <div className="restaurant-page">
      <h1>Choose a Restaurant</h1>
      <p>Order from the university food court</p>

      <RestaurantList />
      <AdminReturnButton />
    </div>
  );
}

export default Restaurant;
