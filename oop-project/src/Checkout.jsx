import { CreditCard, Smartphone, Banknote } from "lucide-react";
import { useState } from "react";
import "./Checkout.css";

function Checkout() {
  const [selected, setSelected] = useState("card");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);

  const formatCard = (val) => {
    return val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (val) => {
    val = val.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 2) return val.slice(0, 2) + "/" + val.slice(2);
    return val;
  };

  const subtotal = 18.5;
  const tax = (subtotal * 0.08).toFixed(2);
  const total = (subtotal + parseFloat(tax)).toFixed(2);

  return (
    <div className="co-wrapper">
      <div className="co-left">
        <div className="co-header">
          <span className="co-label">CHECKOUT</span>
          <h1 className="co-title">Secure Payment</h1>
          <p className="co-description">
            Choose your preferred way to pay for your campus meal.
          </p>
        </div>

        <div
          className={`co-method ${selected === "card" ? "co-method-active" : ""}`}
          onClick={() => setSelected("card")}
        >
          <div className="co-method-top">
            <div className="co-method-icon-wrap co-icon-red">
              <CreditCard size={20} color="#c0392b" />
            </div>
            <div>
              <p className="co-method-title">Credit or Debit Card</p>
              <p className="co-method-sub">Visa, Mastercard</p>
            </div>
            <div
              className={`co-radio ${selected === "card" ? "co-radio-active" : ""}`}
            ></div>
          </div>
          {selected === "card" && (
            <>
              <div className="co-card-fields">
                <div className="co-field">
                  <label className="co-field-label">Cardholder Name</label>
                  <input
                    className="co-input"
                    placeholder="Name on card"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                </div>
                <div className="co-field">
                  <label className="co-field-label">Card Number</label>
                  <input
                    className="co-input"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                  />
                </div>
              </div>
              <div className="co-field-row">
                <div className="co-field">
                  <label className="co-field-label">Expiry Date</label>
                  <input
                    className="co-input"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) =>
                      setExpiryDate(formatExpiry(e.target.value))
                    }
                  />
                </div>

                <div className="co-field">
                  <label className="co-field-label">CVV</label>
                  <div className="co-input-wrap">
                    <input
                      className="co-input"
                      placeholder="•••"
                      type={showCvv ? "text" : "password"}
                      maxLength={3}
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                      }
                    />
                    <button
                      className="co-eye"
                      onClick={() => setShowCvv(!showCvv)}
                    >
                      {showCvv ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div
          className={`co-method ${selected === "instapay" ? "co-method-active" : ""}`}
          onClick={() => setSelected("instapay")}
        >
          <div className="co-method-top">
            <div className="co-method-icon-wrap co-icon-green">
              <Smartphone size={20} color="#27ae60" />
            </div>
            <div>
              <p className="co-method-title">InstaPay</p>
            </div>
            <div
              className={`co-radio ${selected === "instapay" ? "co-radio-active" : ""}`}
            ></div>
          </div>
        </div>

        <div
          className={`co-method ${selected === "cash" ? "co-method-active" : ""}`}
          onClick={() => setSelected("cash")}
        >
          <div className="co-method-top">
            <div className="co-method-icon-wrap co-icon-gold">
              <Banknote size={20} color="#f39c12" />
            </div>
            <div>
              <p className="co-method-title">Cash</p>
            </div>
            <div
              className={`co-radio ${selected === "cash" ? "co-radio-active" : ""}`}
            ></div>
          </div>
        </div>
      </div>
      <div className="co-right">
        <div className="co-summary">
          <h2 className="co-summary-title">Order Summary</h2>

          <div className="co-item">
            <div className="co-item-info">
              <p className="co-item-name">Signature Angus Burger</p>
              <p className="co-item-desc">Medium Rare • No Onions</p>
            </div>
            <p className="co-item-price">$12.50</p>
          </div>

          <div className="co-item">
            <div className="co-item-info">
              <p className="co-item-name">Fresh Mango Smoothie</p>
              <p className="co-item-desc">Large • Less Ice</p>
            </div>
            <p className="co-item-price">$6.00</p>
          </div>
        </div>
        <div className="co-breakdown">
          <div className="co-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="co-row">
            <span>Tax (8%)</span>
            <span>${tax}</span>
          </div>
          <div className="co-row">
            <span>Campus Fee</span>
            <span className="co-free">FREE</span>
          </div>
        </div>
        <div className="co-total-row">
          <span className="co-total-label">Total Amount</span>
          <span className="co-total-amount">${total}</span>
        </div>
        <button className="co-pay-btn">Pay Now</button>
      </div>
    </div>
  );
}
export default Checkout;
