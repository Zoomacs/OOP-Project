import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminReturnButton from "../../components/common/AdminReturnButton";
import {
  Clock,
  Zap,
  Flame,
  Gift,
  Tag,
  ArrowRight,
  Heart,
  Utensils,
  Leaf,
  Coffee,
  Pizza,
  IceCream,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import "./Home.css";

function Home({ page }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    page("home");
  }, [page]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
      showToast("Removed from favorites");
    } else {
      setFavorites([...favorites, id]);
      showToast("Saved to favorites!");
    }
  };
  const handleAddToCart = (order) => {
    const priceNumber = parseInt(order.price.replace(/\D/g, ""), 10);

    const cartItem = {
      id: order.id,
      title: order.name,
      price: priceNumber,
      image: order.image || null,
    };
    window.dispatchEvent(new CustomEvent("addToCart", { detail: cartItem }));
    showToast(`Added ${order.name} to cart!`);
  };

  const categories = [
    { id: 1, name: "Quick Bites", icon: <Utensils size={24} /> },
    { id: 2, name: "Healthy", icon: <Leaf size={24} /> },
    { id: 3, name: "Café", icon: <Coffee size={24} /> },
    { id: 4, name: "Italian", icon: <Pizza size={24} /> },
    { id: 5, name: "Desserts", icon: <IceCream size={24} /> },
  ];

  const recentOrders = [
    {
      id: 101,
      name: "Double Cheeseburger Combo",
      restaurant: "Student Union Grill",
      price: "125 EGP",
      time: "2 days ago",
    },
    {
      id: 102,
      name: "Chicken Caesar Wrap",
      restaurant: "Leafy & Green",
      price: "95 EGP",
      time: "1 week ago",
    },
    {
      id: 103,
      name: "Iced Caramel Macchiato",
      restaurant: "Campus Café",
      price: "65 EGP",
      time: "1 week ago",
    },
  ];

  const offers = [
    {
      id: 1,
      restaurant: "The Student Union Grill",
      priceTier: "$$",
      title: "Half-Price Burger Combos",
      desc: "Get 50% off all signature beef and chicken burger combo meals including fries and a drink.",
      image:
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80",
      badgeIcon: <Flame size={14} />,
      badgeText: "50% OFF",
      validity: "Valid until 2:00 PM",
    },
    {
      id: 2,
      restaurant: "Leafy & Green",
      priceTier: "$",
      title: "Free Smoothie with Wraps",
      desc: "Purchase any signature vegan wrap and receive a complimentary 16oz fruit smoothie of your choice.",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
      badgeIcon: <Gift size={14} />,
      badgeText: "FREE ITEM",
      validity: "Valid until 4:00 PM",
    },
    {
      id: 3,
      restaurant: "Zen Garden Express",
      priceTier: "$$$",
      title: "20% Off Sushi Platters",
      desc: "Enjoy our premium assorted sushi and sashimi platters at a special discounted rate today.",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80",
      badgeIcon: <Tag size={14} />,
      badgeText: "20% OFF",
      validity: "Valid until 8:00 PM",
    },
  ];

  return (
    <>
      <title>Home - Q-Less</title>

      <div className="container">
        <div style={{ paddingTop: "20px" }}>
          <AdminReturnButton />
        </div>

        <section className="hero">
          <div className="hero-content">
            <span className="hero-label">UNIVERSITY DINING REIMAGINED</span>
            <h1>
              Skip the line,
              <br />
              <span>Savor the time.</span>
            </h1>
            <p>
              Order from any campus restaurant and get notified when your meal
              is ready. No queues, no hassle, just good food.
            </p>
            <div className="hero-btns">
              <button
                onClick={() => navigate("/restaurant")}
                className="btn btn-primary"
              >
                Order Now <Zap size={18} />
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
              alt="Delicious Food"
            />
            <div className="wait-time-badge glass-effect">
              <div className="wait-icon-wrapper">
                <Clock size={20} />
              </div>
              <div className="wait-time-text">
                <span>AVG. WAIT TIME</span>
                <strong>8 Mins</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="quick-reorder-section">
          <div className="section-header">
            <div>
              <h2>Buy It Again</h2>
              <p>Quickly reorder your recent favorites</p>
            </div>
          </div>
          <div className="reorder-grid">
            {recentOrders.map((order) => (
              <div className="reorder-card" key={order.id}>
                <div className="reorder-info">
                  <h4>{order.name}</h4>
                  <p>
                    {order.restaurant} •{" "}
                    <span className="order-time">{order.time}</span>
                  </p>
                  <span className="reorder-price">{order.price}</span>
                </div>
                <button
                  className="btn-icon-round"
                  onClick={() => handleAddToCart(order)} /* <-- CHANGED HERE */
                  title="Reorder"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="categories-section">
          <div className="section-header">
            <div>
              <h2>Browse Categories</h2>
              <p>What are you in the mood for today?</p>
            </div>
            <button onClick={() => navigate("/restaurant")} className="see-all">
              See All <ChevronRight size={16} />
            </button>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <div
                className="category-card"
                key={category.id}
                onClick={() =>
                  navigate("/restaurant", { state: { filter: category.name } })
                }
              >
                <div className="category-icon">{category.icon}</div>
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="offers-section">
          <div className="section-header">
            <h2>
              Today's Hot Offers <span className="offers-badge">SAVINGS</span>
            </h2>
          </div>

          <div className="offers-grid">
            {offers.map((offer) => (
              <div className="offer-card" key={offer.id}>
                <span className="discount-tag">
                  {offer.badgeIcon}{" "}
                  <span style={{ marginLeft: "4px" }}>{offer.badgeText}</span>
                </span>
                <button
                  className="heart-btn"
                  onClick={() => toggleFavorite(offer.id)}
                >
                  <Heart
                    size={18}
                    fill={
                      favorites.includes(offer.id)
                        ? "var(--primary-color)"
                        : "transparent"
                    }
                    color="var(--primary-color)"
                  />
                </button>
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="offer-image"
                />
                <div className="offer-info">
                  <div className="restaurant-name">
                    {offer.restaurant} <span>{offer.priceTier}</span>
                  </div>
                  <h3 className="offer-title">{offer.title}</h3>
                  <p className="offer-desc">{offer.desc}</p>
                  <div className="offer-footer">
                    <div className="validity">
                      <Clock size={14} /> {offer.validity}
                    </div>
                    <button
                      className="claim-btn"
                      onClick={() =>
                        showToast(`${offer.title} applied to your account!`)
                      }
                    >
                      Claim Offer <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer>
          <div>
            <div className="footer-logo">
              <svg
                viewBox="0 0 500 150"
                style={{ width: "80px", height: "40px" }}
              >
                <text
                  x="0"
                  y="110"
                  style={{
                    fill: "var(--text-color)",
                    fontFamily: '"Playpen Sans", cursive',
                    fontWeight: 800,
                    fontSize: "110px",
                  }}
                >
                  Q-<tspan style={{ fill: "var(--primary-color)" }}>Less</tspan>
                </text>
              </svg>
            </div>
            <div className="footer-copy">
              © 2026 Q-Less University Dining. All rights reserved.
            </div>
          </div>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/support">Contact Support</a>
          </div>
        </footer>

        <div className={`home-toast ${toast ? "show" : ""}`}>{toast}</div>
      </div>
    </>
  );
}

export default Home;
