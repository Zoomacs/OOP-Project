import "./Restaurant_card.css";
import qedraLogo from "./assets/Qedra_logo.jpg";
import pizzaImage from "./assets/pizza.jpg";
import burgerImage from "./assets/burger.jpg";

export default function RestaurantList() {
  const restaurants = [
    {
      id: 1,
      name: "Qedra",
      description: "Fool , Taameya, btaaaaaats",
      rating: 4,
      image: qedraLogo,
    },
    {
      id: 2,
      name: "Pizza King",
      description: "Pizza, Italian, Fast Food",
      rating: 5,
      image: pizzaImage,
    },
    {
      id: 3,
      name: "Burger House",
      description: "Burgers, Sandwiches, Drinks",
      rating: 3,
      image: burgerImage,
    },
  ];

  function RestaurantCard({ restaurant }) {
    const roundedRating = Math.round(restaurant.rating);
    const stars = "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);

    return (
      <div className="restaurant-card">
        <img src={restaurant.image} alt={restaurant.name} />
        <div className="restaurant-info">
          <h2>{restaurant.name}</h2>
          <p className="description">{restaurant.description}</p>
          <p className="rating">{stars}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-list">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}