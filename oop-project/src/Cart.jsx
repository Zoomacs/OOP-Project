import { useState } from "react";
import "./Cart.css";
import foulimg from "./assets/foul.jpg";
import ta3meya from "./assets/ta3meya.jpg";
function Cart({ page }) {
  page("cart");
  const [quantity, setquantity] = useState(0);
  const items = [
    {
      image: foulimg,
      title: "Foul",
      details:
        "Creamy, slow-simmered fava beans seasoned with lemon, cumin, and olive oil in a warm pita.",
      quantity: 0,
      price: 12,
    },
    {
      image: ta3meya,
      title: "Second item",
      details: "@",
      quantity: 0,
      price: 10,
    },
    { title: "Third item", details: "#", quantity: 0, price: 15 },
    { title: "Fourth item", details: "$", quantity: 0, price: 13 },
  ];

  const list = items.map((item) => (
    <div className="cart-list" key={item.title}>
      <div className="cart-item">
        <img src={item.image} alt="image" className="item-img" />
        <div className="item-info">
          <h3>{item.title}</h3>
          <p className="item-details">{item.details}</p>
          <div className="quantity">
            <p className="item-price">{item.price} EGP</p>
            <button className="quantity-btn">-</button>
            <p>{item.quantity}</p>
            <button className="quantity-btn">+</button>
          </div>
        </div>
      </div>
    </div>
  ));
  return (
    <>
      <h1>Cart</h1>
      <div>{list}</div>
      <div></div>
    </>
  );
}

export default Cart;
