import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaBoxOpen,
  FaShippingFast,
  FaReceipt,
  FaArrowRight,
} from "react-icons/fa";

import "../styles/OrderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    orderId = `ORD-${Date.now()}`,
    paymentId = "N/A",
    total = 0,
    customerName = "Customer",
    paymentMethod = "Razorpay",
    deliveryMethod = "Standard Delivery",
    address = {},
  } = state || {};

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const deliveryDate = estimatedDelivery.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="order-success-page">

      {/* =========================
            SUCCESS HERO
      ========================== */}

      <section className="success-hero">

        <div className="success-circle">
          <FaCheckCircle />
        </div>

        <h1>Order Placed Successfully!</h1>

        <p>
          Thank you for shopping with
          <span> ShopNest.</span>
          <br />
          Your payment has been received and your order is now being processed.
        </p>

      </section>

      {/* =========================
          MAIN CONTAINER
      ========================== */}

      <div className="success-container">

        {/* =========================
              LEFT SECTION
        ========================== */}

        <div className="success-left">

          {/* Order Details */}

          <div className="success-card">

            <div className="card-title">
              <FaReceipt />
              <h2>Order Information</h2>
            </div>

            <div className="info-grid">

              <div className="info-item">
                <span>Order ID</span>
                <strong>{orderId}</strong>
              </div>

              <div className="info-item">
                <span>Payment ID</span>
                <strong>{paymentId}</strong>
              </div>

              <div className="info-item">
                <span>Payment Method</span>
                <strong>{paymentMethod}</strong>
              </div>

              <div className="info-item">
                <span>Delivery</span>
                <strong>{deliveryMethod}</strong>
              </div>

              <div className="info-item">
                <span>Total Paid</span>
                <strong>₹{Number(total).toLocaleString()}</strong>
              </div>

              <div className="info-item">
                <span>Status</span>

                <div className="paid-badge">
                  Paid Successfully
                </div>

              </div>

            </div>

          </div>

          {/* Delivery */}

          <div className="success-card">

            <div className="card-title">
              <FaShippingFast />
              <h2>Estimated Delivery</h2>
            </div>

            <div className="delivery-box">

              <FaBoxOpen className="delivery-icon" />

              <div>

                <h3>{deliveryDate}</h3>

                <p>
                  Your package is currently being prepared.
                  You'll receive tracking information once it ships.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =========================
              RIGHT SECTION
        ========================== */}

        <div className="success-right">

          <div className="summary-card">

            <h2>Customer</h2>

            <div className="customer-box">

              <h3>{customerName}</h3>

              <p>{address.street || "Street Address"}</p>

              <p>
                {address.city || "City"}
                {", "}
                {address.state || "State"}
              </p>

              <p>{address.country || "India"}</p>

              <p>{address.postalCode || "000000"}</p>

            </div>

            <div className="payment-status">

              <FaCheckCircle />

              <span>
                Payment Verified Successfully
              </span>

            </div>

          </div>

        </div>

      </div>

                {/* =========================
              ORDER SUMMARY
          ========================= */}

          <div className="summary-card">

            <h2>Payment Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{Number(total).toLocaleString()}</strong>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <strong className="free-text">FREE</strong>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <strong>Included</strong>
            </div>

            <hr />

            <div className="summary-row total-row">
              <span>Total Paid</span>
              <strong>₹{Number(total).toLocaleString()}</strong>
            </div>

          </div>

          {/* =========================
              TRUST BADGES
          ========================= */}

          <div className="summary-card">

            <h2>Why ShopNest?</h2>

            <div className="trust-item">
              ✅ 100% Secure Payment
            </div>

            <div className="trust-item">
              🚚 Fast Delivery Across India
            </div>

            <div className="trust-item">
              🔄 Easy 7-Day Returns
            </div>

            <div className="trust-item">
              🛡 Genuine Products Only
            </div>

          </div>

      <section className="success-actions">

        <button
          className="primary-btn"
          onClick={() => navigate("/orders")}
        >
          <FaBoxOpen />
          My Orders
        </button>

        <button
          className="secondary-btn"
          onClick={() => navigate("/shop")}
        >
          Continue Shopping
          <FaArrowRight />
        </button>

        <button
          className="outline-btn"
          onClick={() => window.print()}
        >
          Download Invoice
        </button>

      </section>

      {/* =========================
            HELP SECTION
      ========================= */}

      <section className="help-section">

        <h2>Need Help?</h2>

        <p>
          Our customer support team is available 24×7 to assist you with
          your order, payment, shipping or returns.
        </p>

        <div className="help-buttons">

          <Link to="/contact" className="help-btn">
            Contact Support
          </Link>

          <Link to="/shop" className="help-btn">
            Continue Shopping
          </Link>

        </div>

      </section>

    </div>
  );
};

export default OrderSuccess;