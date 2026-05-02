import { useState, useEffect } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import foulimg from "./assets/foul.jpg";
import ta3meya from "./assets/ta3meya.jpg";
import { X } from "lucide-react";
function Cart({ page, display }) {
  const navigate = useNavigate();
  const [quantity, setquantity] = useState(0);
  const [items, setItem] = useState([
    {
      image: foulimg,
      title: "Foul",

      quantity: 0,
      price: 12,
    },
    {
      image: ta3meya,
      title: "Second item",

      quantity: 0,
      price: 10,
    },
    { title: "Third item", quantity: 0, price: 15 },
    { title: "Fourth item", quantity: 0, price: 13 },
  ]);

  const list = items.map((item) => (
    <div className="cart-list" key={item.title}>
      <button
        className="delete-item"
        onClick={() => {
          const updatedUsers = items.filter(
            (item2) => item.title != item2.title,
          );
          setItem(updatedUsers);
        }}
      >
        <X />
      </button>
      <div className="cart-item">
        <img src={item.image} alt="image" className="item-img" />
        <div className="item-info">
          <h3>{item.title}</h3>
          <div className="item-price">
            <p>{item.price} EGP</p>
            <div className="quantity">
              <button className="quantity-btn">-</button>
              <p>{item.quantity}</p>
              <button className="quantity-btn">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  let total = 0;
  items.forEach((item) => (total += item.price));
  return (
    <>
      <div className={display}>
        <h1>Cart</h1>
        {list}
        <p>
          Total: {total} EGP
          <br />
          Discount 0%
        </p>
        <h2>Total: {total} EGP</h2>
        <button className="checkout" onClick={() => navigate("/checkout")}>
          Checkout
        </button>
      </div>
    </>
  );
}

export default Cart;
