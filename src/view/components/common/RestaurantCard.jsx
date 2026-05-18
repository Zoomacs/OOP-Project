import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { api } from "../../api";
import "./RestaurantCard.css";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const filters = [
    "All",
    "Fast Food",
    "Pizza",
    "Fool",
    "Healthy",
    "Drinks",
    "Desserts",
    "Asian",
  ];

  useEffect(() => {
    api("restaurants")
      .then((data) => setRestaurants(data.restaurants || []))
      .catch((error) =>
        console.log("Error loading restaurants:", error.message),
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const text =
      `${restaurant.name} ${restaurant.description} ${restaurant.category}`.toLowerCase();
    return (
      text.includes(searchText.toLowerCase()) &&
      (selectedFilter === "All" || text.includes(selectedFilter.toLowerCase()))
    );
  });

  return (
    <>
      <div className="restaurant-tools">
        <div className="restaurant-search-box">
          <span className="search-icon">
            <Search />
          </span>
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
            className={`filter-btn ${selectedFilter === filter ? "active" : ""}`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="restaurant-list">
        {loading ? (
          <p className="no-restaurants">Loading restaurants...</p>
        ) : filteredRestaurants.length > 0 ? (
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
  const navigate = useNavigate();
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
        <button
          className="view-menu-btn"
          onClick={() => navigate(`/restaurant/${restaurant.id}`)}
        >
          View Menu
        </button>
      </div>
    </div>
  );
}
export default RestaurantList;
