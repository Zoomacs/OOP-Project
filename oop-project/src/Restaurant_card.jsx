import "./Restaurant_card.css";
import qedraLogo from "./assets/Qedra_logo.jpg";
import pizzaImage from "./assets/pizza.jpg";
import burgerImage from "./assets/burger.jpg";
import qedraimage from "./assets/Qedra-image.jpg";

function RestaurantList() {
  const restaurants = [
    {
      id: 1,
      name: "Qedra",
      description: "Fool , Taameya, btaaaaaats",
      rating: 4,
      image: qedraimage,
      logo: qedraLogo,
      isOpen: true,
      time: "30-40 min",
      staffDelivery: true,
    },
    {
      id: 2,
      name: "Pizza King",
      description: "Pizza, Italian, Fast Food",
      rating: 5,
      image: pizzaImage,
      coverImage:pizzaImage,
      isOpen: false,
      time: "20-30 min",
    },
    {
      id: 3,
      name: "Burger House",
      description: "Burgers, Sandwiches, Drinks",
      rating: 3,
      image: burgerImage,
      coverImage:burgerImage,
      isOpen: true,
      time: "25-35 min",
    },
  ];

  return (
    <div className="restaurant-list">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
function RestaurantCard({ restaurant }) {

    return (
      <div className="restaurant-card">
        <div className="restaurant-image-container">
          <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="restaurant-cover"
          />

          <span className={`badge status-badge ${restaurant.isOpen ? "open" : "closed"}`}>
              {restaurant.isOpen ? "Open now" : "Closed"}
          </span>
        </div>
        <div className="restaurant-content">
          <div className="restaurant-logo">
            <img src={restaurant.logo} alt={`${restaurant.name} logo`}/>
          </div>

          <h2>{restaurant.name}</h2>

          <p className="restaurant-category">
            {restaurant.description}
          </p>
          <div className="restaurant-info">
            <span className="rating">⭐ {restaurant.rating}</span>
            <span className="separator">|</span>
            <span>🕒 {restaurant.time}</span>
          </div>
          <div className="restaurant-services">
            <span>🛍 Pickup only</span>

            {restaurant.staffDelivery && (
            <span>🚶 Staff delivery</span>
            )}
          </div>
          <button className="view-menu-btn">
            View Menu
          </button>

        </div>
      </div>
    );
  }

export default RestaurantList;