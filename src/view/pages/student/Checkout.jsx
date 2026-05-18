import {
  Smartphone,
  Banknote,
  UploadCloud,
  CheckCircle2,
  TicketPercent,
  Coins,
  X,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getUser } from "../../api";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const user = getUser();
  const userRole = user?.role || sessionStorage.getItem("userRole") || "student";

  const isUniversityStaff = userRole === "staff" && !user?.restaurant_id;
  const isStudent = userRole === "student";

  const [selected, setSelected] = useState("cash");
  const [message, setMessage] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [proofPreview, setProofPreview] = useState("");
  const [useDelivery, setUseDelivery] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [deliveryDetails, setDeliveryDetails] = useState("");

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  const [userPoints, setUserPoints] = useState(() => {
    const savedPoints = sessionStorage.getItem("userPoints");

    if (savedPoints) {
      return Number(savedPoints);
    }

    return 120;
  });

  const [pointsToUse, setPointsToUse] = useState(0);

  const items = JSON.parse(sessionStorage.getItem("cartItems") || "[]");

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const instapayPhone = "01000000000";
  const instapayOwnerName = "Q-Less Restaurant Payment";
  const DELIVERY_FEE = 15;
  const deliveryFee = isUniversityStaff && useDelivery ? DELIVERY_FEE : 0;

  const maxPointsCanUse = isStudent
    ? Math.min(userPoints, Math.floor(subtotal * 10))
    : 0;

  const pointsDiscount = isStudent
    ? Number((Number(pointsToUse) / 10).toFixed(2))
    : 0;

  const staffDiscountValue = isUniversityStaff
    ? Number((subtotal * 0.1).toFixed(2))
    : 0;

  const codeDiscountValue =
    isStudent && appliedDiscount
      ? Number(((subtotal - pointsDiscount) * appliedDiscount.percent).toFixed(2))
      : 0;

  const amountAfterDiscount = Math.max(
    subtotal - pointsDiscount - staffDiscountValue - codeDiscountValue,
    0
  );

  const tax = Number((amountAfterDiscount * 0.08).toFixed(2));
  const total = Number((amountAfterDiscount + tax + deliveryFee).toFixed(2));

  const earnedPoints = isStudent ? Math.floor(total / 10) : 0;

  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

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

  function applyDiscountCode() {
    if (isUniversityStaff) {
      setMessage("University staff already gets 10% discount on every order.");
      return;
    }

    const code = discountCode.trim().toUpperCase();

    if (code === "") {
      setMessage("Enter a discount code first.");
      return;
    }

    if (code === "QLESS10") {
      setAppliedDiscount({
        code: "QLESS10",
        percent: 0.1,
        label: "10% discount",
      });

      setMessage("");
      return;
    }

    if (code === "STUDENT15") {
      setAppliedDiscount({
        code: "STUDENT15",
        percent: 0.15,
        label: "15% student discount",
      });

      setMessage("");
      return;
    }

    setAppliedDiscount(null);
    setMessage("Invalid discount code.");
  }

  function removeDiscount() {
    setAppliedDiscount(null);
    setDiscountCode("");
    setMessage("");
  }

  function handlePointsChange(e) {
    if (!isStudent) {
      setPointsToUse(0);
      setMessage("Only students can use reward points.");
      return;
    }

    let value = Number(e.target.value);

    if (value < 0) {
      value = 0;
    }

    if (value > maxPointsCanUse) {
      value = maxPointsCanUse;
    }

    setPointsToUse(value);
  }

  function useAllPoints() {
    if (!isStudent) {
      setPointsToUse(0);
      setMessage("Only students can use reward points.");
      return;
    }

    setPointsToUse(maxPointsCanUse);
  }

  function clearPoints() {
    setPointsToUse(0);
  }

  async function placeOrder() {
    if (items.length === 0) {
      setMessage("Cart is empty.");
      return;
    }

    if (selected === "instapay" && paymentProof === null) {
      setMessage("Please upload the InstaPay payment screenshot first.");
      return;
    }

    const paymentProofData = paymentProof ? await readFileAsBase64(paymentProof) : "";

    try {
      const result = await api("orders", {
        method: "POST",
        body: JSON.stringify({
          user_id: user?.id || 6,
          restaurant_id: items[0].restaurant_id || 1,
          payment_method: selected,
          total_amount: total,
          subtotal: subtotal,
          tax: tax,

          user_role: userRole,
          is_university_staff: isUniversityStaff,

          staff_discount_amount: staffDiscountValue,

          use_delivery: isUniversityStaff ? useDelivery : false,
          delivery_location: isUniversityStaff && useDelivery ? deliveryLocation : "",
          delivery_details: isUniversityStaff && useDelivery ? deliveryDetails : "",

          points_used: isStudent ? Number(pointsToUse) : 0,
          points_discount: isStudent ? pointsDiscount : 0,

          discount_code: isStudent && appliedDiscount ? appliedDiscount.code : "",
          discount_amount: isStudent ? codeDiscountValue : 0,

          payment_proof_name: paymentProof ? paymentProof.name : "",
          payment_proof_data: paymentProofData,
          items: items,
        }),
      });

      if (isStudent) {
        const newPointsBalance = userPoints - Number(pointsToUse) + earnedPoints;
        sessionStorage.setItem("userPoints", String(newPointsBalance));
      }

      sessionStorage.removeItem("cartItems");
      window.dispatchEvent(new CustomEvent("cartCleared"));

      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify({
          id: result.order_id,
          time: new Date().toLocaleString(),
          total: total,
          payment_method: selected,
          user_role: userRole,
          is_university_staff: isUniversityStaff,

          use_delivery: isUniversityStaff ? useDelivery : false,
          delivery_location: isUniversityStaff && useDelivery ? deliveryLocation : "",
          delivery_details: isUniversityStaff && useDelivery ? deliveryDetails : "",

          staff_discount_amount: staffDiscountValue,

          points_used: isStudent ? Number(pointsToUse) : 0,
          points_earned: isStudent ? earnedPoints : 0,
          discount_code: isStudent && appliedDiscount ? appliedDiscount.code : "",
          discount_amount: isStudent ? codeDiscountValue : 0,
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
            {isUniversityStaff
              ? "University staff automatically receives 10% discount on every order."
              : "Choose your payment method, use points, and apply discounts."}
          </p>
        </div>

        <div
          className={`co-method ${
            selected === "instapay" ? "co-method-active" : ""
          }`}
          onClick={() => setSelected("instapay")}
        >
          <div className="co-method-top">
            <div className="co-method-icon-wrap co-icon-green">
              <Smartphone size={20} color="#27ae60" />
            </div>

            <div>
              <p className="co-method-title">InstaPay</p>
              <p className="co-method-sub">
                Transfer first, then upload payment proof
              </p>
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
              className={`co-radio ${
                selected === "cash" ? "co-radio-active" : ""
              }`}
            ></div>
          </div>
        </div>

        {isUniversityStaff && (
          <>
            <div className={`co-method ${useDelivery ? "co-method-active" : ""}`} onClick={() => setUseDelivery(!useDelivery)}>
              <div className="co-method-top">
                <div className="co-method-icon-wrap co-icon-green">
                  <MapPin size={20} color="#27ae60" />
                </div>
                <div>
                  <p className="co-method-title">Delivery</p>
                  <p className="co-method-sub">Get your order delivered on campus</p>
                </div>
                <div className={`co-radio ${useDelivery ? "co-radio-active" : ""}`}></div>
              </div>
              {useDelivery && (
                <div className="delivery-fields" onClick={(e) => e.stopPropagation()}>
                  <input type="text" className="delivery-input" placeholder="Delivery location (e.g. Building name, room number)" value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} />
                  <textarea className="delivery-textarea" placeholder="Additional details (optional)" rows={2} value={deliveryDetails} onChange={(e) => setDeliveryDetails(e.target.value)} />
                </div>
              )}
            </div>

            <div className="co-discount-card">
              <div className="co-discount-header">
                <div>
                  <p className="co-discount-title">
                    <TicketPercent size={18} /> Staff Discount
                  </p>
                  <span>
                    University staff gets <b>10%</b> discount automatically.
                  </span>
                </div>
              </div>

              <div className="applied-discount-box">
                <div>
                  <strong>STAFF10</strong>
                  <p>10% staff discount applied automatically</p>
                </div>
              </div>
            </div>
          </>
        )}

        {isStudent && (
          <>
            <div className="co-discount-card">
              <div className="co-discount-header">
                <div>
                  <p className="co-discount-title">
                    <TicketPercent size={18} /> Discount Code
                  </p>
                  <span>Try QLESS10 or STUDENT15</span>
                </div>
              </div>

              {appliedDiscount ? (
                <div className="applied-discount-box">
                  <div>
                    <strong>{appliedDiscount.code}</strong>
                    <p>{appliedDiscount.label} applied</p>
                  </div>

                  <button onClick={removeDiscount}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="discount-input-row">
                  <input
                    type="text"
                    placeholder="Enter discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />

                  <button onClick={applyDiscountCode}>Apply</button>
                </div>
              )}
            </div>

            <div className="co-discount-card">
              <div className="co-discount-header">
                <div>
                  <p className="co-discount-title">
                    <Coins size={18} /> Reward Points
                  </p>
                  <span>
                    You have <b>{userPoints}</b> points. Every 10 points = 1 EGP.
                  </span>
                </div>
              </div>

              <div className="points-input-row">
                <input
                  type="number"
                  min="0"
                  max={maxPointsCanUse}
                  value={pointsToUse}
                  onChange={handlePointsChange}
                />

                <button onClick={useAllPoints}>Use Max</button>

                <button className="points-clear-btn" onClick={clearPoints}>
                  Clear
                </button>
              </div>

              <p className="points-note">
                Maximum usable points for this order: {maxPointsCanUse} points.
              </p>
            </div>
          </>
        )}
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

          {isUniversityStaff && staffDiscountValue > 0 && (
            <div className="co-row discount-row">
              <span>Staff Discount 10%</span>
              <span>-{staffDiscountValue.toFixed(2)} EGP</span>
            </div>
          )}

          {isStudent && pointsDiscount > 0 && (
            <div className="co-row discount-row">
              <span>Points Discount</span>
              <span>-{pointsDiscount.toFixed(2)} EGP</span>
            </div>
          )}

          {isStudent && codeDiscountValue > 0 && (
            <div className="co-row discount-row">
              <span>Code Discount</span>
              <span>-{codeDiscountValue.toFixed(2)} EGP</span>
            </div>
          )}

          {deliveryFee > 0 && (
            <div className="co-row">
              <span>Delivery Fee</span>
              <span>{deliveryFee.toFixed(2)} EGP</span>
            </div>
          )}

          <div className="co-row">
            <span>Tax (8%)</span>
            <span>{tax.toFixed(2)} EGP</span>
          </div>

          <div className="co-row">
            <span>Campus Fee</span>
            <span className="co-free">FREE</span>
          </div>

          {isStudent && (
            <div className="co-row points-earned-row">
              <span>Points You Will Earn</span>
              <span>+{earnedPoints} pts</span>
            </div>
          )}
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
          {selected === "instapay"
            ? "Confirm InstaPay Order"
            : "Place Cash Order"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;