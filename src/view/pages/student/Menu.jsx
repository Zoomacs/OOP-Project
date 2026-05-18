import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { api } from "../../api";
import SizeModal from "../../components/common/SizeModal";
import "./Menu.css";

const SIZE_SUFFIX = /\s+[SLM]$/;
const OPTION_SUFFIX = /\s+(Carry Out|Sandwich)$/;

function stripSuffix(name, regex) {
  return name.replace(regex, "");
}

function groupItemsBySize(items) {
  const optionCandidates = {};
  const regularItems = [];

  items.forEach((item) => {
    if (OPTION_SUFFIX.test(item.name)) {
      const base = stripSuffix(item.name, OPTION_SUFFIX);
      if (!optionCandidates[base]) optionCandidates[base] = [];
      optionCandidates[base].push(item);
    } else {
      regularItems.push(item);
    }
  });

  const result = [];

  Object.entries(optionCandidates).forEach(([base, group]) => {
    if (group.length >= 2) {
      const options = group
        .map((item) => ({
          id: item.id,
          size_name: item.name.match(OPTION_SUFFIX)?.[0]?.trim() || "Option",
          price: Number(item.price),
          item,
        }))
        .sort((a, b) => a.price - b.price);

      result.push({
        ...group[0],
        baseName: base,
        sizes: options,
        priceRange: `${Math.min(...options.map((s) => s.price))} - ${Math.max(...options.map((s) => s.price))} EGP`,
        groupType: "option",
      });
    } else {
      regularItems.push(group[0]);
    }
  });

  const sizeGroups = {};
  regularItems.forEach((item) => {
    const base = SIZE_SUFFIX.test(item.name) ? stripSuffix(item.name, SIZE_SUFFIX) : item.name;
    if (!sizeGroups[base]) sizeGroups[base] = [];
    sizeGroups[base].push(item);
  });

  Object.values(sizeGroups).forEach((group) => {
    const sizes = group
      .map((item) => ({
        id: item.id,
        size_name: item.name.match(SIZE_SUFFIX)?.[0]?.trim() || "Regular",
        price: Number(item.price),
        item,
      }))
      .sort((a, b) => a.price - b.price);

    if (sizes.length > 1) {
      result.push({
        ...group[0],
        baseName: stripSuffix(group[0].name, SIZE_SUFFIX),
        sizes,
        priceRange: `${Math.min(...sizes.map((s) => s.price))} - ${Math.max(...sizes.map((s) => s.price))} EGP`,
      });
    } else {
      result.push({
        ...group[0],
        baseName: group[0].name,
        sizes: null,
        priceRange: `${group[0].price} EGP`,
      });
    }
  });

  return result;
}

function getCartQuantities() {
  const cart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
  const map = {};
  cart.forEach((item) => { map[item.id] = (map[item.id] || 0) + (item.quantity || 1); });
  return map;
}

function Menu({ page }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuItems, setMenuItems] = useState([]);
  const [modalItem, setModalItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restaurantLockMsg, setRestaurantLockMsg] = useState("");
  const [quantities, setQuantities] = useState(getCartQuantities);
  const restaurantName = location.state?.restaurantName;

  useEffect(() => {
    function syncCart() {
      setQuantities(getCartQuantities());
    }
    window.addEventListener("cartUpdated", syncCart);
    window.addEventListener("cartCleared", syncCart);
    return () => {
      window.removeEventListener("cartUpdated", syncCart);
      window.removeEventListener("cartCleared", syncCart);
    };
  }, []);

  function checkCartLock(restaurantId) {
    const cart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
    if (cart.length > 0 && cart[0].restaurant_id !== Number(restaurantId)) {
      setRestaurantLockMsg("You have items from another restaurant in your cart. Complete or clear that order first.");
      return true;
    }
    setRestaurantLockMsg("");
    return false;
  }

  useEffect(() => {
    page("menu");
    setLoading(true);
    api(`menu&restaurant_id=${id || 1}&available_only=1`)
      .then((data) => setMenuItems(groupItemsBySize(data.menu || [])))
      .catch((error) => console.log(error.message))
      .finally(() => setLoading(false));
  }, [page, id]);

  const categories = ["All", ...new Set(menuItems.map((item) => item.tag || item.category).filter(Boolean))];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const text = `${item.name} ${item.desc || item.description || ""}`.toLowerCase();
      if (!text.includes(searchText.toLowerCase())) return false;
      if (selectedCategory !== "All" && (item.tag || item.category) !== selectedCategory) return false;
      return true;
    });
  }, [menuItems, searchText, selectedCategory]);

  const addToCart = (sizeItem) => {
    const item = sizeItem.item || sizeItem;
    if (checkCartLock(item.restaurant_id)) return;
    window.dispatchEvent(new CustomEvent("addToCart", {
      detail: {
        id: sizeItem.id,
        restaurant_id: item.restaurant_id,
        image: item.image,
        title: sizeItem.size_name ? `${item.name} (${sizeItem.size_name})` : item.name,
        name: item.name,
        price: Number(sizeItem.price),
        quantity: 1,
      }
    }));
    setModalItem(null);
  };

  const handleAddToCart = (item) => {
    if (checkCartLock(item.restaurant_id)) return;
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

      {restaurantLockMsg && <div className="menu-lock-msg">{restaurantLockMsg}</div>}

      {loading ? (
        <p className="no-restaurants">Loading menu...</p>
      ) : (
        <div className="menu-list">
          {filteredItems.length > 0 ? filteredItems.map((item) => (
            <div className={`menu-item-card ${item.sizes ? "has-sizes" : ""}`} key={item.id}>
              <img src={item.image} alt={item.baseName || item.name} className="menu-item-image" />
              <div className="menu-item-details">
                <div className="menu-item-header-row">
                  <h3>{item.baseName || item.name}</h3>
                  <span className="price">{item.priceRange}</span>
                </div>
                {(!item.sizes || item.groupType !== "option") && <p className="item-desc">{item.desc || item.description}</p>}
                {item.sizes && item.groupType !== "option" && (
                  <span className="size-badge">Available in {item.sizes.length} sizes</span>
                )}
                <div className="item-footer-row">
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className={index < item.rating ? "star active" : "star"}>★</span>
                    ))}
                  </div>
                  {item.sizes ? (
                    <button
                      className="qty-btn choose-size-btn"
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.is_available}
                    >
                      {item.groupType === "option" ? "Choose" : "Choose Size"}
                    </button>
                  ) : (
                    <div className="inline-qty">
                      {(quantities[item.id] || 0) > 0 ? (
                        <>
                          <button
                            className="qty-btn qty-minus"
                            onClick={() => {
                              if (checkCartLock(item.restaurant_id)) return;
                              const cart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
                              const idx = cart.findIndex((ci) => ci.id === item.id);
                              if (idx === -1) return;
                              if (cart[idx].quantity <= 1) cart.splice(idx, 1);
                              else cart[idx].quantity -= 1;
                              sessionStorage.setItem("cartItems", JSON.stringify(cart));
                              setQuantities(getCartQuantities());
                              window.dispatchEvent(new CustomEvent("cartForceSync"));
                            }}
                          >−</button>
                          <span className="qty-num">{quantities[item.id]}</span>
                        </>
                      ) : null}
                      <button
                        className="qty-btn add-btn"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.is_available}
                      >+</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <p className="no-restaurants">No items found.</p>
          )}
        </div>
      )}

      <SizeModal
        item={modalItem}
        onClose={() => setModalItem(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
}
export default Menu;
