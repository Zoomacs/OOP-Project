import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { api } from "../../api";
import SizeModal from "../../components/common/SizeModal";
import "./Menu.css";

const SIZE_SUFFIX = /\s+[SLM]$/;

function extractBaseName(name) {
  return name.replace(SIZE_SUFFIX, "");
}

function groupItemsBySize(items) {
  const groups = {};
  items.forEach((item) => {
    const base = extractBaseName(item.name);
    if (!groups[base]) groups[base] = [];
    groups[base].push(item);
  });
  return Object.values(groups).map((group) => {
    const sizes = group
      .map((item) => ({
        id: item.id,
        size_name: item.name.match(SIZE_SUFFIX)?.[0]?.trim() || "Regular",
        price: Number(item.price),
        item,
      }))
      .sort((a, b) => a.price - b.price);

    const first = group[0];
    return {
      ...first,
      baseName: extractBaseName(first.name),
      sizes: sizes.length > 1 ? sizes : null,
      priceRange:
        sizes.length > 1
          ? `${Math.min(...sizes.map((s) => s.price))} - ${Math.max(...sizes.map((s) => s.price))} EGP`
          : `${first.price} EGP`,
    };
  });
}

function Menu({ page }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuItems, setMenuItems] = useState([]);
  const [modalItem, setModalItem] = useState(null);
  const restaurantName = location.state?.restaurantName;

  useEffect(() => {
    page("menu");
    api(`menu&restaurant_id=${id || 1}&available_only=1`)
      .then((data) => setMenuItems(data.menu || []))
      .catch((error) => console.log(error.message));
  }, [page, id]);

  const groupedItems = useMemo(() => groupItemsBySize(menuItems), [menuItems]);

  const categories = ["All", ...new Set(groupedItems.map((item) => item.tag || item.category).filter(Boolean))];

  const filteredItems = groupedItems.filter((item) => {
    const text = `${item.name} ${item.desc || item.description || ""}`.toLowerCase();
    if (!text.includes(searchText.toLowerCase())) return false;
    if (selectedCategory !== "All" && (item.tag || item.category) !== selectedCategory) return false;
    return true;
  });

  const addToCart = (item) => {
    const itemName = item.item?.name || item.name;
    window.dispatchEvent(new CustomEvent("addToCart", {
      detail: {
        id: item.id,
        restaurant_id: item.item?.restaurant_id || item.restaurant_id,
        image: item.item?.image || item.image,
        title: itemName,
        name: itemName,
        price: Number(item.price),
        quantity: 1,
      }
    }));
    setModalItem(null);
  };

  const handleAddToCart = (item) => {
    if (item.sizes) {
      setModalItem(item);
      return;
    }
    window.dispatchEvent(new CustomEvent("addToCart", {
      detail: {
        id: item.id,
        restaurant_id: item.restaurant_id,
        image: item.image,
        title: item.name,
        name: item.name,
        price: Number(item.price),
        quantity: 1,
      }
    }));
  };

  return (
    <div className="menu-page">
      <div className="menu-page-header">
        <button className="menu-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="menu-page-header-text">
          <h1>{restaurantName || "Menu"}</h1>
          <p>{filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} available</p>
        </div>
      </div>

      <div className="menu-tools">
        <div className="menu-search-box">
          <span className="search-icon"><Search size={18} /></span>
          <input type="text" placeholder="Search menu items..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </div>
      </div>

      {categories.length > 1 && (
        <div className="menu-category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`menu-cat-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >{cat}</button>
          ))}
        </div>
      )}

      <div className="menu-list">
        {filteredItems.map((item) => (
          <div className={`menu-item-card ${item.sizes ? "has-sizes" : ""}`} key={item.id}>
            <img src={item.image} alt={item.baseName || item.name} className="menu-item-image" />
            <div className="menu-item-details">
              <div className="menu-item-header-row">
                <h3>{item.baseName || item.name}</h3>
                <span className="price">{item.priceRange}</span>
              </div>
              <p className="item-desc">{item.desc || item.description}</p>
              {item.sizes && (
                <span className="size-badge">Available in {item.sizes.length} sizes</span>
              )}
              <div className="item-footer-row">
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className={index < item.rating ? "star active" : "star"}>★</span>
                  ))}
                </div>
                <button
                  className={`qty-btn add-btn ${item.sizes ? "choose-size-btn" : ""}`}
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.is_available}
                >
                  {item.sizes ? "Choose Size" : "+"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SizeModal
        item={modalItem}
        onClose={() => setModalItem(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
}
export default Menu;
