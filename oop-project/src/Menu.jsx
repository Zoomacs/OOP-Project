import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Menu.css";

function Menu({ page }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Smoked Beef Ribs",
      desc: "Good food is always an experience",
      price: 20,
      rating: 5,
      image: "https://images.unsplash.com/photo-1544025162-811114b73330?auto=format&fit=crop&w=200&q=80",
      quantity: 1,
    },
    {
      id: 2,
      name: "Seafood Cuttlefish",
      desc: "For a better menu experience",
      price: 16,
      rating: 5,
      image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=200&q=80",
      quantity: 1,
    },
    {
      id: 3,
      name: "Garden Vegetable Salad",
      desc: "Crisp and refreshing fresh garden",
      price: 12,
      rating: 5,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80",
      quantity: 0,
    },
    {
      id: 4,
      name: "Roasted Duck With Honey",
      desc: "It's finger licking good",
      price: 18,
      rating: 4,
      image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=200&q=80",
      quantity: 0,
    },
  ]);

  useEffect(() => {
    page("menu");
  }, [page, id]);

  const updateQuantity = (itemId, delta) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="menu-page">
      <div className="menu-header-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          &larr;
        </button>
        <div className="menu-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <div className="menu-list">
        {filteredItems.map((item) => (
          <div className="menu-item-card" key={item.id}>
            <img src={item.image} alt={item.name} className="menu-item-image" />
            
            <div className="menu-item-details">
              <h3>{item.name}</h3>
              <p className="item-desc">{item.desc}</p>
              <div className="item-price-row">
                <span className="price">$ {item.price}</span>
              </div>
              <div className="item-footer-row">
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className={index < item.rating ? "star active" : "star"}>
                      ★
                    </span>
                  ))}
                </div>
                
                <div className="quantity-controls">
                  {item.quantity > 0 ? (
                    <>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span className="qty-count">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </>
                  ) : (
                    <button className="qty-btn add-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;