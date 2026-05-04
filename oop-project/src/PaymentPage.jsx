import { useState } from "react";
import "./PaymentPage.css";
export default function PaymentPage() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("Screenshot", file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Upload successful:", data);
      alert("Payment proof uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload payment proof. Please try again.");
    }
  };

  return (
    <div className="payment-page">
      <h1>Confirm Your Payment</h1>
      <p className="subtitle">
        Please finalize your transaction by providing the payment proof below.
      </p>

      <div className="payment-container">
        <div className="left">
          <div className="upload-box">
            <div className="upload-content">
              <p className="upload-title">Upload Payment Screenshot</p>
              <p className="upload-sub">
                Drag and drop your receipt image here, or click below
              </p>

              <label className="upload-btn">
                Select File
                <input type="file" onChange={handleFileChange} hidden />
              </label>

              {file && <p className="file-name">{file.name}</p>}

              <span className="formats">
                Accepted formats: JPG, PNG (Max 5MB)
              </span>
            </div>
          </div>

          <button className="submit-btn">Submit Payment Proof</button>

          <p className="support">Need Help? Contact Support</p>
        </div>

        <div className="right box">
          <h2>Order Summary</h2>

          <div className="order-item">
            <div>
              <p>Truffle Burger</p>
              <span>Single Patty, No Onions</span>
            </div>
            <b>$12.50</b>
          </div>

          <div className="order-item">
            <div>
              <p>Crispy Fries</p>
              <span>Large Size</span>
            </div>
            <b>$4.50</b>
          </div>

          <div className="order-item">
            <div>
              <p>Fresh Lemonade</p>
              <span>500ml</span>
            </div>
            <b>$3.00</b>
          </div>

          <div className="divider"></div>

          <div className="summary-line">
            <span>Subtotal</span>
            <span>$20.00</span>
          </div>

          <div className="summary-line">
            <span>Service Fee</span>
            <span>$0.50</span>
          </div>

          <div className="total">
            <span>Total</span>
            <b>$20.50</b>
          </div>

          <div className="pickup">
            <span>Estimated Pickup</span>
            <p>12:45 PM - Science Wing Court</p>
          </div>
        </div>
      </div>
    </div>
  );
}
