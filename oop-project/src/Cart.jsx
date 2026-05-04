import { useState, useEffect } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import foulimg from "./assets/foul.jpg";
import ta3meya from "./assets/ta3meya.jpg";
import { X } from "lucide-react";
function Cart({ page, display }) {
  const navigate = useNavigate();
  const [Quantity, setQuantity] = useState(0);

  function setItemQuantity(targetId, sign) {
    setItem((prvQ) =>
      prvQ.map((item) => {
        if (item.id == targetId) {
          if (sign == "+") {
            return { ...item, quantity: item.quantity + 1 };
          } else if (sign == "-" && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      }),
    );
  }
  const [items, setItem] = useState([
    {
      id: 0,
      image: foulimg,
      title: "Foul",
      quantity: 1,
      price: 12,
    },
    {
      id: 1,
      image: ta3meya,
      title: "Second item",
      quantity: 1,
      price: 10,
    },
    { id: 2, title: "Third item", quantity: 1, price: 15 },
    { id: 3, title: "Fourth item", quantity: 1, price: 13 },
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
              <button
                className="quantity-btn"
                onClick={() => setItemQuantity(item.id, "-")}
              >
                -
              </button>
              <p>{item.quantity}</p>
              <button
                className="quantity-btn"
                onClick={() => setItemQuantity(item.id, "+")}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  let total = 0;
  items.forEach((item) => (total += item.price * item.quantity));
  return (
    <>
      <div className={display}>
        <h1 className="cart-title">Cart</h1>
        {list}
        <div className="total">
          <p> Total: {total} EGP</p>
          <p>Discount 0%</p>
          <h2>Total: {total} EGP</h2>
        </div>
        <button className="checkout" onClick={() => navigate("/checkout")}>
          Checkout
        </button>
      </div>
    </>
  );
}

export default Cart;
