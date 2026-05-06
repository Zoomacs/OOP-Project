import { useEffect, useState } from "react";
import "./Restaurant_card.css";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Fast Food", "Pizza", "Fool", "Healthy", "Drinks", "Desserts"];

  useEffect(() => {
    fetch("http://localhost/OOP-Project/oop-project/backend/getRestaurants.php")
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
      })
      .catch((error) => {
        console.log("Error loading restaurants:", error);
      });
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const name = restaurant.name.toLowerCase();
    const description = restaurant.description.toLowerCase();
    const search = searchText.toLowerCase();

    const matchesSearch =
      name.includes(search) || description.includes(search);

    const matchesFilter =
      selectedFilter === "All" ||
      description.includes(selectedFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="restaurant-tools">
        <div className="restaurant-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <div className="quick-filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${
              selectedFilter === filter ? "active" : ""
            }`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="restaurant-list">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))
        ) : (
          <p className="no-restaurants">No restaurants found.</p>
        )}
      </div>
    </>
  );
}

function RestaurantCard({ restaurant }) {
  return (
    <div className="restaurant-card">
      <div className="restaurant-content">
        <div className="restaurant-top-row">
          <div className="restaurant-logo">
            <img src={restaurant.imageUrl} alt={`${restaurant.name} logo`} />
          </div>

          <span
            className={`status-badge ${restaurant.isOpen ? "open" : "closed"}`}
          >
            {restaurant.isOpen ? "Open now" : "Closed"}
          </span>
        </div>

        <h2>{restaurant.name}</h2>

        <p className="restaurant-category">{restaurant.description}</p>

        <div className="restaurant-info">
          <span className="rating">⭐ {restaurant.rating}</span>
          <span className="reviews">({restaurant.reviews})</span>
          <span className="separator">|</span>
          <span>🕒 {restaurant.time}</span>
        </div>

        <div className="restaurant-services">
          <span>🛍 Pickup only</span>
          {restaurant.staffDelivery && <span>🚶 Staff delivery</span>}
        </div>

        <button className="view-menu-btn">View Menu</button>
      </div>
    </div>
  );
}

export default RestaurantList;