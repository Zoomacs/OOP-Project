import { SlidersHorizontal, X } from "lucide-react";
import "./FilterSidebar.css";

const CATEGORIES = ["Fast Food", "Pizza", "Fool", "Healthy", "Drinks", "Desserts", "Asian"];
const RATINGS = [4, 3, 2, 1];

function FilterSidebar({ filters, onFilterChange, onClear }) {
  const toggleCategory = (cat) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: next });
  };

  const setRating = (rating) => {
    onFilterChange({ ...filters, rating: filters.rating === rating ? null : rating });
  };

  const toggleOffer = (key) => {
    onFilterChange({ ...filters, offers: { ...filters.offers, [key]: !filters.offers[key] } });
  };

  const hasActiveFilters = filters.rating !== null || filters.categories.length > 0 || Object.values(filters.offers).some(Boolean);

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar-header">
        <SlidersHorizontal size={18} />
        <span>Filters</span>
        {hasActiveFilters && (
          <button className="filter-clear-btn" onClick={onClear}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      <div className="filter-section">
        <h3 className="filter-section-title">Rating</h3>
        <div className="filter-options">
          {RATINGS.map((star) => (
            <button
              key={star}
              className={`filter-option-btn ${filters.rating === star ? "active" : ""}`}
              onClick={() => setRating(star)}
            >
              {star}+ ⭐
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-section-title">Categories</h3>
        <div className="filter-options filter-options-vertical">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-section-title">Offers</h3>
        <div className="filter-options filter-options-vertical">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.offers.staffDelivery}
              onChange={() => toggleOffer("staffDelivery")}
            />
            <span> Staff Delivery</span>
          </label>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.offers.openNow}
              onChange={() => toggleOffer("openNow")}
            />
            <span> Open Now</span>
          </label>
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
