import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  decreaseQuantity,
  getTotals,
  increaseQuantity,
  removeFromCart,
} from "../redux/cartSlice";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCheckCircle,
  FaCreditCard,
  FaGift,
  FaLock,
  FaMinus,
  FaPlus,
  FaShieldAlt,
  FaShoppingBag,
  FaShoppingCart,
  FaTrash,
  FaTruck,
  FaUndoAlt,
} from "react-icons/fa";
import "../styles/Cart.css";

const couponRules = {
  SHOPNEST10: {
    type: "percent",
    value: 10,
    label: "SHOPNEST10 applied. You saved 10%.",
  },
  SAVE15: {
    type: "percent",
    value: 15,
    label: "SAVE15 applied. You saved 15%.",
  },
  FREESHIP: {
    type: "shipping",
    value: 0,
    label: "FREESHIP applied. Shipping is free.",
  },
};

const getSafeNumber = (value) => {
  const numberValue = Number(value || 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const formatCurrency = (amount) =>
  getSafeNumber(amount).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const getDeliveryText = () => {
  const startDate = new Date();
  const endDate = new Date();

  startDate.setDate(startDate.getDate() + 3);
  endDate.setDate(endDate.getDate() + 5);

  const dateOptions = {
    day: "numeric",
    month: "short",
  };

  return `${startDate.toLocaleDateString(
    "en-IN",
    dateOptions
  )} - ${endDate.toLocaleDateString("en-IN", dateOptions)}`;
};

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, cartTotalAmount, cartTotalQuantity } = useSelector(
    (state) => state.cart
  );
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    dispatch(getTotals());
  }, [cartItems, dispatch]);

  const cartSummary = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce((total, item) => {
      return total + getSafeNumber(item?.price) * getSafeNumber(item?.quantity);
    }, 0);

    const calculatedQuantity = cartItems.reduce((total, item) => {
      return total + getSafeNumber(item?.quantity);
    }, 0);

    const subtotal = cartTotalAmount || calculatedSubtotal;
    const totalQuantity = cartTotalQuantity || calculatedQuantity;
    const coupon = couponRules[appliedCoupon];
    const discount =
      coupon?.type === "percent" ? subtotal * (coupon.value / 100) : 0;
    const discountedSubtotal = Math.max(subtotal - discount, 0);
    const shipping =
      discountedSubtotal === 0 ||
      discountedSubtotal >= 4999 ||
      coupon?.type === "shipping"
        ? 0
        : 99;
    const tax = discountedSubtotal * 0.18;
    const grandTotal = discountedSubtotal + shipping + tax;

    return {
      discount,
      grandTotal,
      shipping,
      subtotal,
      tax,
      totalQuantity,
    };
  }, [appliedCoupon, cartItems, cartTotalAmount, cartTotalQuantity]);

  const handleApplyCoupon = () => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      setAppliedCoupon("");
      setCouponMessage("Enter a coupon code to apply savings.");
      return;
    }

    if (!couponRules[normalizedCode]) {
      setAppliedCoupon("");
      setCouponMessage("Invalid coupon code. Try SHOPNEST10, SAVE15, or FREESHIP.");
      return;
    }

    setAppliedCoupon(normalizedCode);
    setCouponMessage(couponRules[normalizedCode].label);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setAppliedCoupon("");
    setCouponCode("");
    setCouponMessage("");
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <main className="cart-page cart-empty-page">
        <section className="empty-cart-card" aria-labelledby="empty-cart-title">
          <div className="empty-cart-illustration" aria-hidden="true">
            <div className="empty-cart-basket">
              <FaShoppingCart />
            </div>
            <div className="empty-cart-shadow"></div>
          </div>

          <span className="cart-mini-label">ShopNest Cart</span>
          <h1 id="empty-cart-title">Your Cart is Empty</h1>
          <p>
            Discover premium products and add your favorites here for a faster
            checkout.
          </p>

          <Link to="/" className="cart-primary-link">
            <FaArrowLeft />
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section className="cart-hero" aria-labelledby="cart-title">
        <div className="cart-hero-content">
          <span className="cart-mini-label">Secure Shopping Cart</span>
          <h1 id="cart-title">Review Your Bag</h1>
          <p>
            Confirm your products, apply savings, and finish your ShopNest order
            with confidence.
          </p>
        </div>

        <div className="cart-count-badge" aria-label="Cart item count">
          <FaShoppingBag />
          <span>{cartSummary.totalQuantity}</span>
          <small>{cartSummary.totalQuantity === 1 ? "Item" : "Items"}</small>
        </div>
      </section>

      <section className="cart-layout" aria-label="Shopping cart details">
        <div className="cart-items-panel">
          <div className="cart-panel-header">
            <div>
              <span className="cart-mini-label">Selected Products</span>
              <h2>Cart Items</h2>
            </div>

            <button
              type="button"
              className="cart-clear-btn"
              onClick={handleClearCart}
            >
              <FaTrash />
              Clear Cart
            </button>
          </div>

          <div className="cart-items-list">
            {cartItems.map((item) => {
              const price = getSafeNumber(item?.price);
              const quantity = Math.max(1, getSafeNumber(item?.quantity));
              const itemSubtotal = price * quantity;

              return (
                <article className="cart-item-card" key={item?._id}>
                  <Link
                    to={`/product/${item?._id}`}
                    className="cart-item-image-wrap"
                    aria-label={`View ${item?.name || "product"}`}
                  >
                    <img
                      src={item?.imageUrl || "/image.png"}
                      alt={item?.name || "Cart product"}
                      className="cart-item-image"
                    />
                  </Link>

                  <div className="cart-item-content">
                    <div className="cart-item-top">
                      <div>
                        <span className="discount-badge">
                          <FaGift />
                          Member Deal
                        </span>
                        <h3>{item?.name || "Product"}</h3>
                        <p className="cart-item-delivery">
                          <FaTruck />
                          Estimated delivery {getDeliveryText()}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => dispatch(removeFromCart(item?._id))}
                        aria-label={`Remove ${item?.name || "product"} from cart`}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="cart-price-block">
                        <span>Price</span>
                        <strong>{formatCurrency(price)}</strong>
                      </div>

                      <div
                        className="cart-quantity-control"
                        aria-label={`Quantity for ${item?.name || "product"}`}
                      >
                        <button
                          type="button"
                          onClick={() => dispatch(decreaseQuantity(item?._id))}
                          aria-label="Decrease quantity"
                        >
                          <FaMinus />
                        </button>
                        <span>{quantity}</span>
                        <button
                          type="button"
                          onClick={() => dispatch(increaseQuantity(item?._id))}
                          aria-label="Increase quantity"
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <div className="cart-price-block cart-subtotal-block">
                        <span>Subtotal</span>
                        <strong>{formatCurrency(itemSubtotal)}</strong>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="cart-summary-column" aria-label="Order summary">
          <div className="cart-summary-card">
            <div className="summary-header">
              <span className="cart-mini-label">Order Summary</span>
              <h2>{formatCurrency(cartSummary.grandTotal)}</h2>
              <p>Includes estimated tax and shipping.</p>
            </div>

            <div className="summary-benefits">
              <div>
                <FaTruck />
                <span>Free shipping above {formatCurrency(4999)}</span>
              </div>
              <div>
                <FaLock />
                <span>Secure payment protected</span>
              </div>
            </div>

            <div className="coupon-box">
              <label htmlFor="coupon-code">Coupon Code</label>
              <div className="coupon-input-row">
                <input
                  id="coupon-code"
                  type="text"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="SHOPNEST10"
                  autoComplete="off"
                />
                <button type="button" onClick={handleApplyCoupon}>
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p
                  className={
                    appliedCoupon ? "coupon-message success" : "coupon-message"
                  }
                >
                  {couponMessage}
                </p>
              )}
            </div>

            <div className="summary-lines">
              <div>
                <span>Total Quantity</span>
                <strong>{cartSummary.totalQuantity}</strong>
              </div>
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(cartSummary.subtotal)}</strong>
              </div>
              <div>
                <span>Discount</span>
                <strong className="summary-discount">
                  -{formatCurrency(cartSummary.discount)}
                </strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>
                  {cartSummary.shipping === 0
                    ? "Free"
                    : formatCurrency(cartSummary.shipping)}
                </strong>
              </div>
              <div>
                <span>Tax</span>
                <strong>{formatCurrency(cartSummary.tax)}</strong>
              </div>
            </div>

            <div className="summary-total">
              <span>Grand Total</span>
              <strong>{formatCurrency(cartSummary.grandTotal)}</strong>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
              <FaCheckCircle />
            </button>

            <Link to="/" className="continue-shopping-link">
              <FaArrowLeft />
              Continue Shopping
            </Link>
          </div>

          <div className="cart-trust-grid">
            <div className="cart-trust-card">
              <FaShieldAlt />
              <strong>Order Protection</strong>
              <span>Tracked packing and delivery support.</span>
            </div>
            <div className="cart-trust-card">
              <FaUndoAlt />
              <strong>Easy Returns</strong>
              <span>Return support for eligible products.</span>
            </div>
            <div className="cart-trust-card">
              <FaCreditCard />
              <strong>Secure Payment</strong>
              <span>Encrypted checkout experience.</span>
            </div>
            <div className="cart-trust-card">
              <FaBoxOpen />
              <strong>Careful Delivery</strong>
              <span>Premium packaging for every order.</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Cart;
