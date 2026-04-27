import { useEffect } from "react";
import RestaurantList from "./Restaurant_card";

function Restaurant({ page }) {
  useEffect(() => {
    page("restaurant");
  }, [page]);

  return (
    <div className="restaurant-page">
      <h1>Choose a Restaurant</h1>
      <p>Order from the university food court</p>

      <RestaurantList />
    </div>
  );
}

export default Restaurant;