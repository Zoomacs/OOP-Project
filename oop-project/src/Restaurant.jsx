import RestaurantList from "./Restaurant_card";
function Restaurant({ page }) {
  page("restaurant");
  return (
    <>
      <title>Restaurant</title>
      <h1>Restaurant</h1>
      <RestaurantList />
    </>
  );
}

export default Restaurant;
