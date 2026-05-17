import "./Home.css";
import { useEffect, useState } from "react";
import AdminReturnButton from "./AdminReturnButton";

function Home({ page }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Keep your original page routing effect
  useEffect(() => {
    page("home");
  }, [page]);

  // Dark mode toggle effect
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  const categories = [
    { id: 1, name: "Quick Bites", icon: "fas fa-hamburger" },
    { id: 2, name: "Healthy", icon: "fas fa-leaf" },
    { id: 3, name: "Asian", icon: "fas fa-bowl-rice" },
    { id: 4, name: "Café", icon: "fas fa-coffee" },
    { id: 5, name: "Italian", icon: "fas fa-pizza-slice" },
    { id: 6, name: "Desserts", icon: "fas fa-ice-cream" },
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
      badgeIcon: "fas fa-fire",
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
      badgeIcon: "fas fa-gift",
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
      badgeIcon: "fas fa-tag",
      badgeText: "20% OFF",
      validity: "Valid until 8:00 PM",
    },
  ];

  return (
    <>
      <title>Home</title>

      <div className="container">
        {/* Render your Admin Button at the top of the container */}
        <div style={{ paddingTop: "20px" }}>
          <AdminReturnButton />
        </div>

        {/* Hero Section */}
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
              is ready. No queues, no hassle.
            </p>
            <div className="hero-btns">
              <a href="/order" className="btn btn-primary">
                Order Now <i className="fas fa-bolt"></i>
              </a>
              <a href="/menu" className="btn btn-secondary">
                View Menu
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
              alt="Delicious Food"
            />
            <div className="wait-time-badge">
              <i className="fas fa-clock"></i>
              <div className="wait-time-text">
                <span>AVG. WAIT TIME</span>
                <strong>8 Mins</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="section-header">
            <div>
              <h2>Browse Categories</h2>
              <p>What are you in the mood for today?</p>
            </div>
            <a href="/categories" className="see-all">
              See All <i className="fas fa-chevron-right"></i>
            </a>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <div className="category-card" key={category.id}>
                <i className={`${category.icon} category-icon`}></i>
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Offers Section */}
        <section>
          <div className="section-header">
            <h2>
              Today's Hot Offers <span className="offers-badge">SAVINGS</span>
            </h2>
          </div>

          <div className="offers-grid">
            {offers.map((offer) => (
              <div className="offer-card" key={offer.id}>
                <span className="discount-tag">
                  <i className={offer.badgeIcon}></i> {offer.badgeText}
                </span>
                <button className="heart-btn">
                  <i className="fas fa-heart"></i>
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
                      <i className="far fa-clock"></i> {offer.validity}
                    </div>
                    <a href={`/claim/${offer.id}`} className="claim-btn">
                      Claim Offer <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Banner Section */}
        <section className="banner">
          <div className="banner-content">
            <span className="banner-label">NAVIGATION</span>
            <h2>Find your nearest pickup point.</h2>
            <p>
              Our map shows you the quickest route from your lecture hall to the
              dining hall. Never get lost on your way to lunch again.
            </p>
            <a href="/map" className="btn btn-white">
              Open Campus Map <i className="fas fa-map-marked-alt"></i>
            </a>
          </div>
          <div className="banner-image">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
              alt="Campus Map Illustration"
            />
          </div>
        </section>

        {/* Footer */}
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
            <a href="/map">Campus Map</a>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;
