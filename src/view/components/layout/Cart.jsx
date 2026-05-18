import { useState, useEffect } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";

function Cart({ display, setCart }) {
  const navigate = useNavigate();
  const [items, setItem] = useState(() => {
    const saved = sessionStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    function handleAddToCart(event) {
      const newItem = event.detail;
      setItem((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === newItem.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }
        return [...prevItems, { ...newItem, quantity: 1 }];
      });
    }

    window.addEventListener("addToCart", handleAddToCart);
    return () => window.removeEventListener("addToCart", handleAddToCart);
  }, []);

  function closeCart() {
    if (setCart) setCart("hidden cart-bar");
  }

  function setItemQuantity(targetId, sign) {
    setItem((previous) =>
      previous
        .map((item) => {
          if (item.id !== targetId) return item;
          if (sign === "+") return { ...item, quantity: item.quantity + 1 };
          return { ...item, quantity: item.quantity - 1 };
        })
        .filter((item) => item.quantity > 0),
    );
  }

  function deleteItem(targetId) {
    setItem((previous) => previous.filter((item) => item.id !== targetId));
  }

  function clearCart() {
    setItem([]);
  }

  function goCheckout() {
    closeCart();
    navigate("/checkout");
  }

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`cart-bar ${display || ""}`}>
      <div className="cart-header">
        <div>
          <h1 className="cart-title">Cart</h1>
          <p>{count} item{count === 1 ? "" : "s"}</p>
        </div>
        <button className="cart-close" onClick={closeCart} aria-label="Close cart">
          <X size={20} />
        </button>
      </div>

      <div className="cart-items-container">
        {items.length > 0 ? (
          items.map((item) => (
            <div className="cart-list" key={item.id}>
              <button className="delete-item" onClick={() => deleteItem(item.id)} title="Remove item">
                <X size={16} />
              </button>
              <div className="cart-item">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="item-img" />
                ) : (
                  <div className="item-img-placeholder"><ShoppingBag size={24} /></div>
                )}
                <div className="item-info">
                  <h3>{item.title}</h3>
                  <div className="item-price">
                    <p>{Number(item.price).toFixed(2)} EGP</p>
                    <div className="quantity">
                      <button className="quantity-btn" onClick={() => setItemQuantity(item.id, "-")}><Minus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button className="quantity-btn" onClick={() => setItemQuantity(item.id, "+")}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="cart-empty">
            <ShoppingBag size={46} />
            <h3>Your cart is empty</h3>
            <p>Add meals from the menu to checkout.</p>
          </div>
        )}
      </div>

      <div className="cart-summary">
        {items.length > 0 && (
          <button className="clear-cart" onClick={clearCart}>
            <Trash2 size={16} /> Clear cart
          </button>
        )}
        <div className="total-row">
          <span>Total</span>
          <b>{total.toFixed(2)} EGP</b>
        </div>
        <button className="checkout-btn" disabled={items.length === 0} onClick={goCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
