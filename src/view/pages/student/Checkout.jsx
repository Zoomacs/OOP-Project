import { Smartphone, Banknote, UploadCloud, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getUser } from "../../api";
import "./Checkout.css";

function Checkout() {
  const [selected, setSelected] = useState("cash");
  const [message, setMessage] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [proofPreview, setProofPreview] = useState("");

  const navigate = useNavigate();

  const items = JSON.parse(sessionStorage.getItem("cartItems") || "[]");

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const instapayPhone = "01000000000";
  const instapayOwnerName = "Q-Less Restaurant Payment";

  function handlePaymentProofChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please upload an image only.");
      setPaymentProof(null);
      setProofPreview("");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB.");
      setPaymentProof(null);
      setProofPreview("");
      return;
    }

    setMessage("");
    setPaymentProof(file);
    setProofPreview(URL.createObjectURL(file));
  }

  async function placeOrder() {
    if (items.length === 0) {
      setMessage("Cart is empty");
      return;
    }

    if (selected === "instapay" && paymentProof === null) {
      setMessage("Please upload the InstaPay payment screenshot first.");
      return;
    }

    const user = getUser();

    try {
      const result = await api("orders", {
        method: "POST",
        body: JSON.stringify({
          user_id: user?.id || 6,
          restaurant_id: items[0].restaurant_id || 1,
          payment_method: selected,
          total_amount: total,
          payment_proof_name: paymentProof ? paymentProof.name : "",
          items: items,
        }),
      });

      sessionStorage.removeItem("cartItems");

      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify({
          id: result.order_id,
          time: new Date().toLocaleString(),
          total: total,
          payment_method: selected,
          payment_proof_name: paymentProof ? paymentProof.name : "",
        })
      );

      navigate("/ordertrack");
    } catch (err) {
      setMessage(err.message);
    }
  }

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
          className={`co-method ${selected === "instapay" ? "co-method-active" : ""}`}
          onClick={() => setSelected("instapay")}
        >
          <div className="co-method-top">
            <div className="co-method-icon-wrap co-icon-green">
              <Smartphone size={20} color="#27ae60" />
            </div>

            <div>
              <p className="co-method-title">InstaPay</p>
              <p className="co-method-sub">Transfer first, then upload proof</p>
            </div>

            <div
              className={`co-radio ${
                selected === "instapay" ? "co-radio-active" : ""
              }`}
            ></div>
          </div>

          {selected === "instapay" && (
            <div className="instapay-box" onClick={(e) => e.stopPropagation()}>
              <div className="instapay-info-card">
                <p className="instapay-label">Send payment to</p>

                <div className="instapay-data-row">
                  <span>Phone number</span>
                  <b>{instapayPhone}</b>
                </div>

                <div className="instapay-data-row">
                  <span>Account owner</span>
                  <b>{instapayOwnerName}</b>
                </div>

                <div className="instapay-note">
                  After sending the money, upload the payment screenshot below.
                </div>
              </div>

              <label className="proof-upload-box">
                <UploadCloud size={30} />

                <div>
                  <strong>Upload payment proof</strong>
                  <p>JPG, PNG, or JPEG - Max 5MB</p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePaymentProofChange}
                  hidden
                />
              </label>

              {paymentProof && (
                <div className="proof-preview-card">
                  <div className="proof-preview-left">
                    <CheckCircle2 size={20} />
                    <div>
                      <strong>Proof uploaded</strong>
                      <p>{paymentProof.name}</p>
                    </div>
                  </div>

                  {proofPreview && (
                    <img
                      src={proofPreview}
                      alt="Payment proof preview"
                      className="proof-preview-img"
                    />
                  )}
                </div>
              )}
            </div>
          )}
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
              <p className="co-method-sub">Pay when you receive your order</p>
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

          {items.length ? (
            items.map((item) => (
              <div className="co-item" key={item.id}>
                <div className="co-item-info">
                  <p className="co-item-name">{item.title}</p>
                  <p className="co-item-desc">Qty: {item.quantity}</p>
                </div>

                <p className="co-item-price">
                  {(Number(item.price) * item.quantity).toFixed(2)} EGP
                </p>
              </div>
            ))
          ) : (
            <p>No items in cart.</p>
          )}
        </div>

        <div className="co-breakdown">
          <div className="co-row">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)} EGP</span>
          </div>

          <div className="co-row">
            <span>Tax (8%)</span>
            <span>{tax.toFixed(2)} EGP</span>
          </div>

          <div className="co-row">
            <span>Campus Fee</span>
            <span className="co-free">FREE</span>
          </div>
        </div>

        <div className="co-total-row">
          <span className="co-total-label">Total Amount</span>
          <span className="co-total-amount">{total.toFixed(2)} EGP</span>
        </div>

        {selected === "instapay" && (
          <div className="co-payment-reminder">
            <b>InstaPay selected</b>
            <p>
              Pay to <strong>{instapayPhone}</strong> under{" "}
              <strong>{instapayOwnerName}</strong>, then upload screenshot.
            </p>
          </div>
        )}

        {message && <p className="co-error">{message}</p>}

        <button className="co-pay-btn" onClick={placeOrder}>
          {selected === "instapay" ? "Confirm InstaPay Order" : "Place Cash Order"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;