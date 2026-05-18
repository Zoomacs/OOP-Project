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

  const updateQuantity = (itemId, delta) => {
    setMenuItems((prevItems) => prevItems.map((item) => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        if (delta > 0) {
          window.dispatchEvent(new CustomEvent("addToCart", { detail: { id: item.id, restaurant_id: item.restaurant_id, image: item.image, title: item.name, name: item.name, price: Number(item.price), quantity: 1 } }));
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const filteredItems = menuItems.filter((item) => `${item.name} ${item.desc}`.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className="menu-page">
      <div className="menu-header-bar"><button className="back-btn" onClick={() => navigate(-1)}>&larr;</button><div className="menu-search-box"><span className="search-icon"><Search /></span><input type="text" placeholder="Search menu items..." value={searchText} onChange={(e) => setSearchText(e.target.value)} /></div></div>
      <div className="menu-list">
        {filteredItems.map((item) => (
          <div className="menu-item-card" key={item.id}>
            <img src={item.image} alt={item.name} className="menu-item-image" />
            <div className="menu-item-details"><h3>{item.name}</h3><p className="item-desc">{item.desc}</p><div className="item-price-row"><span className="price">{item.price} EGP</span></div><div className="item-footer-row"><div className="stars">{Array.from({ length: 5 }).map((_, index) => <span key={index} className={index < item.rating ? "star active" : "star"}>★</span>)}</div><div className="quantity-controls">{item.quantity > 0 ? <><button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button><span className="qty-count">{item.quantity}</span><button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button></> : <button className="qty-btn add-btn" onClick={() => updateQuantity(item.id, 1)} disabled={!item.is_available}>+</button>}</div></div></div>
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
