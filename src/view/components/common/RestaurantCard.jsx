import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { api } from "../../api";
import FilterSidebar from "./FilterSidebar";
import "./RestaurantCard.css";

const CATEGORIES = ["All", "Oriental", "Fast Food", "Pizza", "Healthy", "Drinks", "Desserts"];

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    rating: null,
    categories: [],
    offers: { staffDelivery: false, openNow: false }
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api("restaurants")
      .then((data) => setRestaurants(data.restaurants || []))
      .catch((error) => console.log("Error loading restaurants:", error.message))
      .finally(() => setLoading(false));
  }, []);

  const handleQuickFilter = (filter) => {
    if (filter === "All") {
      setFilters((prev) => ({ ...prev, categories: [] }));
    } else {
      setFilters((prev) => ({ ...prev, categories: [filter] }));
    }
  };

  const clearFilters = () => {
    setFilters({ rating: null, categories: [], offers: { staffDelivery: false, openNow: false } });
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const text = `${restaurant.name} ${restaurant.description} ${restaurant.category}`.toLowerCase();
      if (!text.includes(searchText.toLowerCase())) return false;
      if (filters.categories.length > 0) {
        const restaurantCats = (restaurant.category || "").split(",").map((c) => c.trim().toLowerCase());
        const matchesCategory = filters.categories.some((cat) =>
          restaurantCats.includes(cat.toLowerCase())
        );
        if (!matchesCategory) return false;
      }
      if (filters.rating !== null) {
        const r = Number(restaurant.rating);
        if (isNaN(r)) return false;
        const min = filters.rating;
        const max = min + 1;
        if (r < min || r >= max) return false;
      }
      if (filters.offers.staffDelivery && !restaurant.staffDelivery) return false;
      if (filters.offers.openNow && !restaurant.isOpen) return false;
      return true;
    });
  }, [restaurants, searchText, filters]);

  const activeFilterLabel = filters.categories.length === 1 ? filters.categories[0] : "All";

  return (
    <>
      <div className="restaurant-page-header">
        <div className="restaurant-page-header-text">
          <h1>Choose a Restaurant</h1>
          <p>Order from the university food court</p>
        </div>
        <span className="restaurant-result-count">{filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="restaurant-with-sidebar">
        <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Filter size={16} />
          <span>Filters</span>
        </button>
        <div className={`restaurant-sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
          <FilterSidebar filters={filters} onFilterChange={setFilters} onClear={clearFilters} />
        </div>
        <div className="restaurant-main">
          <div className="restaurant-tools">
            <div className="restaurant-search-box">
              <span className="search-icon"><Search size={18} /></span>
              <input type="text" placeholder="Search restaurants..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </div>
          </div>
          <div className="quick-filters">{CATEGORIES.map((filter) => <button key={filter} className={`filter-btn ${activeFilterLabel === filter ? "active" : ""}`} onClick={() => handleQuickFilter(filter)}>{filter}</button>)}</div>
          <div className="restaurant-list">
            {loading ? <p className="no-restaurants">Loading restaurants...</p> : filteredRestaurants.length > 0 ? filteredRestaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />) : <p className="no-restaurants">No restaurants found.</p>}
          </div>
        </div>
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
          <div className="restaurant-logo"><img src={restaurant.imageUrl} alt={`${restaurant.name} logo`} /></div>
          <span className={`status-badge ${restaurant.isOpen ? "open" : "closed"}`}>{restaurant.isOpen ? "Open now" : "Closed"}</span>
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
        <button className="view-menu-btn" onClick={() => navigate(`/restaurant/${restaurant.id}`, { state: { restaurantName: restaurant.name } })}>View Menu</button>
      </div>
    </div>
  );
}
export default RestaurantList;
