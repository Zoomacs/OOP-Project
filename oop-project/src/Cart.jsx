import { useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import foulimg from "./assets/foul.jpg";
import ta3meya from "./assets/ta3meya.jpg";
import { X, ShoppingBag } from "lucide-react";

function Cart({ page, display }) {
  const navigate = useNavigate();

  const [items, setItem] = useState([
    { id: 0, image: foulimg, title: "Foul", quantity: 1, price: 12 },
    { id: 1, image: ta3meya, title: "Second item", quantity: 1, price: 10 },
    { id: 2, title: "Third item", quantity: 1, price: 15 },
    { id: 3, title: "Fourth item", quantity: 1, price: 13 },
  ]);

  function setItemQuantity(targetId, sign) {
    setItem((prvQ) =>
      prvQ.map((item) => {
        if (item.id === targetId) {
          if (sign === "+") {
            return { ...item, quantity: item.quantity + 1 };
          } else if (sign === "-" && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      }),
    );
  }

  function deleteItem(targetId) {
    setItem((prv) => prv.filter((item) => item.id !== targetId));
  }

  let total = 0;
  items.forEach((item) => (total += item.price * item.quantity));

  return (
    <div className={`cart-bar ${display}`}>
      <div className="cart-header">
        <h1 className="cart-title">Cart</h1>
      </div>

      <div className="cart-items-container">
        {items.length > 0 ? (
          items.map((item) => (
            <div className="cart-list" key={item.id}>
              <button
                className="delete-item"
                onClick={() => deleteItem(item.id)}
              >
                <X />
              </button>
              <div className="cart-item">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="item-img" />
                ) : (
                  <div className="item-img-placeholder">
                    <ShoppingBag />
                  </div>
                )}
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
          ))
        ) : (
          <div className="cart-empty">
            <ShoppingBag />
            <p>Your cart is empty</p>
          </div>
        )}
      </div>

      <div className="cart-footer">
        <div className="total-row">
          <p>Subtotal</p>
          <p>{total} EGP</p>
        </div>
        <div className="total-row">
          <p>Discount</p>
          <p>0%</p>
        </div>
        <div className="total-row grand-total">
          <h2>Total</h2>
          <h2>{total} EGP</h2>
        </div>
        <button
          className="checkout"
          onClick={() => navigate("/checkout")}
          disabled={items.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;