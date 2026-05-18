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
      <RestaurantList />
      <AdminReturnButton />
    </div>
  );
}

export default Restaurant;
