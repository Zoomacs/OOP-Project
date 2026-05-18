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
import { api, getUser } from "../../api";
import "./Home.css";

function Home({ page }) {
  const [isDarkMode] = useState(() => document.body.classList.contains("dark"));
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const navigate = useNavigate();
  const user = getUser();

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

  useEffect(() => {
    const userId = user?.id || 6;
    api(`orders&user_id=${userId}`)
      .then((data) => {
        const orders = (data.orders || []).slice(0, 3);
        setRecentOrders(orders);
      })
      .catch(() => {});
  }, [user?.id]);

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
    const priceNumber = parseFloat(order.totalPrice || order.price || 0);

    const cartItem = {
      id: order.id,
      title: order.name || order.restaurant,
      price: priceNumber,
      image: order.image || null,
    };
    window.dispatchEvent(new CustomEvent("addToCart", { detail: cartItem }));
    showToast(`Added ${cartItem.title} to cart!`);
  };

  const categories = [
    { id: 1, name: "Quick Bites", icon: <Utensils size={24} /> },
    { id: 2, name: "Healthy", icon: <Leaf size={24} /> },
    { id: 3, name: "Café", icon: <Coffee size={24} /> },
    { id: 4, name: "Italian", icon: <Pizza size={24} /> },
    { id: 5, name: "Desserts", icon: <IceCream size={24} /> },
  ];

  const offers = [
    {
      id: 1,
      restaurant: "Qedra",
      priceTier: "$$",
      title: "Combo Offer: Foul + Fries + Ta3mya",
      desc: "Get 1 foul, 1 fries, and 1 ta3mya for only 40 EGP! A complete Egyptian breakfast at an unbeatable price.",
      image:
        "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=500&q=80",
      badgeIcon: <Flame size={14} />,
      badgeText: "COMBO",
      validity: "Valid all day",
    },
    {
      id: 2,
      restaurant: "Mix & Wrap",
      priceTier: "$$",
      title: "20% Off Orders Above 250 EGP",
      desc: "Spend 250 EGP or more at Mix & Wrap and enjoy a 20% discount on your entire order. Perfect for group dining!",
      image:
        "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=500&q=80",
      badgeIcon: <Gift size={14} />,
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
            {recentOrders.length === 0 && (
              <p className="empty-reorder">No recent orders yet.</p>
            )}
            {recentOrders.map((order) => (
              <div className="reorder-card" key={order.id}>
                <div className="reorder-info">
                  <h4>{order.restaurant}</h4>
                  <p>
                    #{order.id} •{" "}
                    <span className="order-time">{order.time}</span>
                  </p>
                  <span className="reorder-price">{order.total}</span>
                </div>
                <button
                  className="btn-icon-round"
                  onClick={() => handleAddToCart(order)}
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
                        navigate(`/restaurant/${offer.id === 1 ? 4 : 11}`)
                      }
                    >
                      View Offer <ArrowRight size={16} />
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
