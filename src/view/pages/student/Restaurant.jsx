import { useEffect } from "react";
import RestaurantList from "../../components/common/RestaurantCard";
import AdminReturnButton from "../../components/common/AdminReturnButton";
import "./Restaurant.css";

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
