import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCheckCircle,
  FaChevronRight,
  FaCreditCard,
  FaGift,
  FaHome,
  FaLock,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaShoppingBag,
  FaSpinner,
  FaStickyNote,
  FaTruck,
  FaUndoAlt,
  FaUniversity,
  FaWallet,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { clearCart, getTotals } from "../redux/cartSlice";
import "../styles/Checkout.css";

const FREE_SHIPPING_TARGET = 4999;
const GIFT_WRAP_FEE = 49;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const deliveryMethods = [
  {
    id: "standard",
    title: "Standard Delivery",
    description: "Reliable doorstep delivery",
    days: 5,
    price: 0,
  },
  {
    id: "express",
    title: "Express Delivery",
    description: "Priority packed and shipped",
    days: 2,
    price: 149,
  },
  {
    id: "same_day",
    title: "Same Day Delivery",
    description: "Fastest delivery for eligible locations",
    days: 0,
    price: 299,
  },
];

const paymentMethods = [
  {
    id: "cod",
    title: "Cash On Delivery",
    description: "Pay when your order arrives",
    icon: FaMoneyBillWave,
  },
  {
    id: "razorpay",
    title: "Razorpay",
    description: "Cards, UPI, wallets, and net banking",
    icon: FaShieldAlt,
  },
  {
    id: "upi",
    title: "UPI",
    description: "Pay securely with any UPI app",
    icon: FaMobileAlt,
  },
  {
    id: "debit_card",
    title: "Debit Card",
    description: "Visa, Mastercard, RuPay",
    icon: FaCreditCard,
  },
  {
    id: "credit_card",
    title: "Credit Card",
    description: "Credit card with secure verification",
    icon: FaCreditCard,
  },
  {
    id: "net_banking",
    title: "Net Banking",
    description: "Pay through your bank account",
    icon: FaUniversity,
  },
  {
    id: "wallet",
    title: "Wallet",
    description: "Use supported digital wallets",
    icon: FaWallet,
  },
];

const couponRules = {
  SHOPNEST10: {
    type: "percent",
    value: 10,
    message: "SHOPNEST10 applied. You saved 10%.",
  },
  SAVE15: {
    type: "percent",
    value: 15,
    message: "SAVE15 applied. You saved 15%.",
  },
  FREESHIP: {
    type: "shipping",
    value: 0,
    message: "FREESHIP applied. Shipping is free.",
  },
};

const emptyAddress = {
  fullName: "",
  email: "",
  phone: "",
  street: "",
  apartment: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

const formatCurrency = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const getSafeNumber = (value) => {
  const numberValue = Number(value || 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const getDeliveryDate = (days) => {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);

  return deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const getSavedCheckoutAddress = () => {
  try {
    const savedAddress = localStorage.getItem("checkoutAddress");
    return savedAddress ? JSON.parse(savedAddress) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getAuthToken = (user) => {
  try {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      user?.token ||
      user?.accessToken ||
      savedUser?.token ||
      savedUser?.accessToken ||
      ""
    );
  } catch (error) {
    console.error(error);
    return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
  }
};

const readApiResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Request failed. Please try again.");
  }

  return data;
};

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), {
        once: true,
      });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Unable to load Razorpay Checkout.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
    document.body.appendChild(script);
  });

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const fullNameRef = useRef(null);
  const { cartItems, cartTotalAmount, cartTotalQuantity } = useSelector(
    (state) => state.cart
  );

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState(() => ({
    ...emptyAddress,
    ...(getSavedCheckoutAddress() || {}),
  }));
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("razorpay");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [saveAddress, setSaveAddress] = useState(true);
  const [orderNotes, setOrderNotes] = useState("");

  useEffect(() => {
    dispatch(getTotals());
  }, [cartItems, dispatch]);

  useEffect(() => {
    const loaderTimer = window.setTimeout(() => {
      setIsPageLoading(false);
      window.setTimeout(() => fullNameRef.current?.focus(), 80);
    }, 450);

    return () => window.clearTimeout(loaderTimer);
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    setAddress((currentAddress) => ({
      ...currentAddress,
      fullName: currentAddress.fullName || user.name || "",
      email: currentAddress.email || user.email || "",
    }));
  }, [user]);

  const selectedDeliveryMethod = useMemo(() => {
    return (
      deliveryMethods.find((method) => method.id === selectedDelivery) ||
      deliveryMethods[0]
    );
  }, [selectedDelivery]);

  const orderSummary = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce((total, item) => {
      return total + getSafeNumber(item?.price) * getSafeNumber(item?.quantity);
    }, 0);

    const calculatedQuantity = cartItems.reduce((total, item) => {
      return total + getSafeNumber(item?.quantity);
    }, 0);

    const subtotal = cartTotalAmount || calculatedSubtotal;
    const quantity = cartTotalQuantity || calculatedQuantity;
    const coupon = couponRules[appliedCoupon];
    const discount =
      coupon?.type === "percent" ? subtotal * (coupon.value / 100) : 0;
    const discountedSubtotal = Math.max(subtotal - discount, 0);
    const shipping =
      coupon?.type === "shipping" ? 0 : selectedDeliveryMethod.price;
    const giftWrapFee = giftWrap ? GIFT_WRAP_FEE : 0;
    const tax = (discountedSubtotal + giftWrapFee) * 0.18;
    const grandTotal = discountedSubtotal + shipping + giftWrapFee + tax;
    const freeShippingProgress = Math.min(
      (subtotal / FREE_SHIPPING_TARGET) * 100,
      100
    );
    const freeShippingRemaining = Math.max(FREE_SHIPPING_TARGET - subtotal, 0);

    return {
      discount,
      freeShippingProgress,
      freeShippingRemaining,
      giftWrapFee,
      grandTotal,
      quantity,
      shipping,
      subtotal,
      tax,
    };
  }, [
    appliedCoupon,
    cartItems,
    cartTotalAmount,
    cartTotalQuantity,
    giftWrap,
    selectedDeliveryMethod,
  ]);

  const updateAddress = (field, value) => {
    setAddress((currentAddress) => ({
      ...currentAddress,
      [field]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  };

  const validateCheckout = () => {
    const nextErrors = {};
    const phoneDigits = address.phone.replace(/\D/g, "");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!address.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!address.email.trim() || !emailPattern.test(address.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (phoneDigits.length < 10 || phoneDigits.length > 12) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (!address.street.trim()) {
      nextErrors.street = "Street address is required.";
    }

    if (!address.city.trim()) {
      nextErrors.city = "City is required.";
    }

    if (!address.state.trim()) {
      nextErrors.state = "State is required.";
    }

    if (!address.postalCode.trim()) {
      nextErrors.postalCode = "Postal code is required.";
    }

    if (!address.country.trim()) {
      nextErrors.country = "Country is required.";
    }

    if (!selectedPayment) {
      nextErrors.payment = "Choose a payment method.";
    }

    return nextErrors;
  };

  const handleApplyCoupon = () => {
    const normalizedCoupon = couponCode.trim().toUpperCase();

    if (!normalizedCoupon) {
      setAppliedCoupon("");
      setCouponMessage("Enter a coupon code to apply savings.");
      return;
    }

    if (!couponRules[normalizedCoupon]) {
      setAppliedCoupon("");
      setCouponMessage("Invalid coupon code. Try SHOPNEST10, SAVE15, or FREESHIP.");
      return;
    }

    setAppliedCoupon(normalizedCoupon);
    setCouponMessage(couponRules[normalizedCoupon].message);
  };

  const buildOrderAddress = () => ({
    fullName: address.fullName.trim(),
    email: address.email.trim(),
    phone: address.phone.trim(),
    Street: address.street.trim(),
    apartment: address.apartment.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
    postalCode: address.postalCode.trim(),
    country: address.country.trim(),
    notes: orderNotes.trim(),
  });

  const buildOrderItems = () =>
    cartItems.map((item) => ({
      productId: item._id,
      quantity: getSafeNumber(item.quantity),
      price: getSafeNumber(item.price),
    }));

  const createRazorpayPayment = async () => {
    if (!RAZORPAY_KEY_ID) {
      throw new Error("Razorpay key is missing. Add VITE_RAZORPAY_KEY_ID.");
    }

    const paymentOrderResponse = await fetch("/api/payments/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(orderSummary.grandTotal),
      }),
    });

    const paymentOrderData = await readApiResponse(paymentOrderResponse);
    const razorpayOrder = paymentOrderData.order;

    if (!razorpayOrder?.id) {
      throw new Error("Unable to create Razorpay order.");
    }

    await loadRazorpayScript();

    const paymentResponse = await new Promise((resolve, reject) => {
      const checkout = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "ShopNest",
        description: "Secure ShopNest checkout",
        order_id: razorpayOrder.id,
        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.phone,
        },
        notes: {
          deliveryMethod: selectedDeliveryMethod.title,
          paymentChoice: selectedPayment,
          city: address.city,
          postalCode: address.postalCode,
        },
        theme: {
          color: "#2563eb",
        },
        handler: (response) => resolve(response),
        modal: {
          ondismiss: () =>
            reject(new Error("Payment was cancelled before completion.")),
        },
      });

      checkout.open();
    });

    const verifyResponse = await fetch("/api/payments/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentResponse),
    });

    await readApiResponse(verifyResponse);
    return paymentResponse.razorpay_payment_id;
  };

  const createShopNestOrder = async (paymentId) => {
    const token = getAuthToken(user);

    if (!token) {
      throw new Error("Please log in again before placing your order.");
    }

    const orderResponse = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: buildOrderItems(),
        totalAmount: Math.round(orderSummary.grandTotal),
        address: buildOrderAddress(),
        paymentId,
        paymentMethod: selectedPayment,
        deliveryMethod: selectedDelivery,
        couponCode: appliedCoupon,
        discount: Math.round(orderSummary.discount),
        shipping: Math.round(orderSummary.shipping),
        tax: Math.round(orderSummary.tax),
        giftWrap,
      }),
    });

    return readApiResponse(orderResponse);
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const checkoutErrors = validateCheckout();

    if (Object.keys(checkoutErrors).length > 0) {
      setFormErrors(checkoutErrors);
      setSubmitError("Please fix the highlighted fields before placing order.");
      return;
    }

    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty. Add products before checkout.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (saveAddress) {
        localStorage.setItem("checkoutAddress", JSON.stringify(address));
      } else {
        localStorage.removeItem("checkoutAddress");
      }

      const paymentId =
        selectedPayment === "cod"
          ? `COD-${Date.now()}`
          : await createRazorpayPayment();

      const orderData = await createShopNestOrder(paymentId);

      localStorage.setItem(
        "latestOrder",
        JSON.stringify({
          orderId: orderData?.order?._id,
          paymentId,
          totalAmount: orderSummary.grandTotal,
        })
      );

      dispatch(clearCart());
      navigate("/order-success", {
        state: {
          order: orderData?.order,
          paymentId,
          totalAmount: orderSummary.grandTotal,
        },
      });
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "Unable to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return (
      <main className="checkout-page">
        <section className="checkout-skeleton" aria-label="Loading checkout">
          <div className="checkout-loader">
            <FaSpinner />
          </div>
          <div className="skeleton-grid">
            <div className="skeleton-block skeleton-block-large"></div>
            <div className="skeleton-block"></div>
            <div className="skeleton-block"></div>
          </div>
        </section>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page checkout-empty-page">
        <section className="checkout-empty-card">
          <div className="checkout-empty-icon">
            <FaShoppingBag />
          </div>
          <span className="checkout-eyebrow">Checkout</span>
          <h1>Your cart is empty</h1>
          <p>Add products to your cart before starting checkout.</p>
          <Link to="/" className="checkout-primary-link">
            <FaArrowLeft />
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <nav className="checkout-breadcrumb" aria-label="Checkout breadcrumb">
        <Link to="/">
          <FaHome />
          Home
        </Link>
        <FaChevronRight />
        <Link to="/shop">Shop</Link>
        <FaChevronRight />
        <Link to="/cart">Cart</Link>
        <FaChevronRight />
        <span>Checkout</span>
      </nav>

      <section className="checkout-hero">
        <div>
          <span className="checkout-eyebrow">Secure Checkout</span>
          <h1>Complete Your Order</h1>
          <p>
            Review delivery, payment, and order details before confirming your
            ShopNest purchase.
          </p>
        </div>

        <div className="checkout-hero-badge">
          <FaLock />
          <strong>SSL Protected</strong>
          <span>{orderSummary.quantity} items ready</span>
        </div>
      </section>

      <form className="checkout-layout" onSubmit={handlePlaceOrder} noValidate>
        <div className="checkout-main">
          <section className="checkout-section" aria-labelledby="shipping-title">
            <div className="checkout-section-header">
              <div className="checkout-section-icon">
                <FaMapMarkerAlt />
              </div>
              <div>
                <span className="checkout-eyebrow">Step 1</span>
                <h2 id="shipping-title">Shipping Address</h2>
              </div>
            </div>

            <div className="checkout-form-grid">
              <label className="checkout-field">
                <span>Full Name</span>
                <input
                  ref={fullNameRef}
                  type="text"
                  value={address.fullName}
                  onChange={(event) =>
                    updateAddress("fullName", event.target.value)
                  }
                  aria-invalid={Boolean(formErrors.fullName)}
                  autoComplete="name"
                />
                {formErrors.fullName && <small>{formErrors.fullName}</small>}
              </label>

              <label className="checkout-field">
                <span>Email</span>
                <input
                  type="email"
                  value={address.email}
                  onChange={(event) => updateAddress("email", event.target.value)}
                  aria-invalid={Boolean(formErrors.email)}
                  autoComplete="email"
                />
                {formErrors.email && <small>{formErrors.email}</small>}
              </label>

              <label className="checkout-field">
                <span>Phone Number</span>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(event) => updateAddress("phone", event.target.value)}
                  aria-invalid={Boolean(formErrors.phone)}
                  autoComplete="tel"
                />
                {formErrors.phone && <small>{formErrors.phone}</small>}
              </label>

              <label className="checkout-field checkout-field-wide">
                <span>Street Address</span>
                <input
                  type="text"
                  value={address.street}
                  onChange={(event) =>
                    updateAddress("street", event.target.value)
                  }
                  aria-invalid={Boolean(formErrors.street)}
                  autoComplete="street-address"
                />
                {formErrors.street && <small>{formErrors.street}</small>}
              </label>

              <label className="checkout-field checkout-field-wide">
                <span>Apartment</span>
                <input
                  type="text"
                  value={address.apartment}
                  onChange={(event) =>
                    updateAddress("apartment", event.target.value)
                  }
                  autoComplete="address-line2"
                />
              </label>

              <label className="checkout-field">
                <span>City</span>
                <input
                  type="text"
                  value={address.city}
                  onChange={(event) => updateAddress("city", event.target.value)}
                  aria-invalid={Boolean(formErrors.city)}
                  autoComplete="address-level2"
                />
                {formErrors.city && <small>{formErrors.city}</small>}
              </label>

              <label className="checkout-field">
                <span>State</span>
                <input
                  type="text"
                  value={address.state}
                  onChange={(event) => updateAddress("state", event.target.value)}
                  aria-invalid={Boolean(formErrors.state)}
                  autoComplete="address-level1"
                />
                {formErrors.state && <small>{formErrors.state}</small>}
              </label>

              <label className="checkout-field">
                <span>Postal Code</span>
                <input
                  type="text"
                  value={address.postalCode}
                  onChange={(event) =>
                    updateAddress("postalCode", event.target.value)
                  }
                  aria-invalid={Boolean(formErrors.postalCode)}
                  autoComplete="postal-code"
                />
                {formErrors.postalCode && <small>{formErrors.postalCode}</small>}
              </label>

              <label className="checkout-field">
                <span>Country</span>
                <input
                  type="text"
                  value={address.country}
                  onChange={(event) =>
                    updateAddress("country", event.target.value)
                  }
                  aria-invalid={Boolean(formErrors.country)}
                  autoComplete="country-name"
                />
                {formErrors.country && <small>{formErrors.country}</small>}
              </label>
            </div>
          </section>

          <section className="checkout-section" aria-labelledby="delivery-title">
            <div className="checkout-section-header">
              <div className="checkout-section-icon">
                <FaTruck />
              </div>
              <div>
                <span className="checkout-eyebrow">Step 2</span>
                <h2 id="delivery-title">Delivery Method</h2>
              </div>
            </div>

            <div className="checkout-option-grid">
              {deliveryMethods.map((method) => (
                <label
                  className={
                    selectedDelivery === method.id
                      ? "checkout-choice active"
                      : "checkout-choice"
                  }
                  key={method.id}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value={method.id}
                    checked={selectedDelivery === method.id}
                    onChange={() => setSelectedDelivery(method.id)}
                  />
                  <span className="checkout-radio-dot"></span>
                  <strong>{method.title}</strong>
                  <span>{method.description}</span>
                  <small>
                    {getDeliveryDate(method.days)} |{" "}
                    {method.price === 0 ? "Free" : formatCurrency(method.price)}
                  </small>
                </label>
              ))}
            </div>

            <div className="delivery-timeline">
              <div className="timeline-step active">Cart</div>
              <div className="timeline-step active">Address</div>
              <div className="timeline-step">Packed</div>
              <div className="timeline-step">Delivered</div>
            </div>
          </section>

          <section className="checkout-section" aria-labelledby="payment-title">
            <div className="checkout-section-header">
              <div className="checkout-section-icon">
                <FaCreditCard />
              </div>
              <div>
                <span className="checkout-eyebrow">Step 3</span>
                <h2 id="payment-title">Payment Method</h2>
              </div>
            </div>

            <div className="checkout-payment-grid">
              {paymentMethods.map((method) => {
                const PaymentIcon = method.icon;

                return (
                  <label
                    className={
                      selectedPayment === method.id
                        ? "checkout-payment-choice active"
                        : "checkout-payment-choice"
                    }
                    key={method.id}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={() => {
                        setSelectedPayment(method.id);
                        setFormErrors((currentErrors) => ({
                          ...currentErrors,
                          payment: "",
                        }));
                      }}
                    />
                    <PaymentIcon />
                    <strong>{method.title}</strong>
                    <span>{method.description}</span>
                  </label>
                );
              })}
            </div>
            {formErrors.payment && (
              <p className="checkout-error-text">{formErrors.payment}</p>
            )}

            <div className="payment-logos" aria-label="Accepted payments">
              <span>UPI</span>
              <span>Visa</span>
              <span>Mastercard</span>
              <span>RuPay</span>
              <span>Wallets</span>
            </div>
          </section>

          <section className="checkout-section" aria-labelledby="extras-title">
            <div className="checkout-section-header">
              <div className="checkout-section-icon">
                <FaGift />
              </div>
              <div>
                <span className="checkout-eyebrow">Step 4</span>
                <h2 id="extras-title">Order Extras</h2>
              </div>
            </div>

            <div className="checkout-toggle-row">
              <label className="checkout-switch">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(event) => setGiftWrap(event.target.checked)}
                />
                <span></span>
                Gift wrap this order for {formatCurrency(GIFT_WRAP_FEE)}
              </label>

              <label className="checkout-switch">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(event) => setSaveAddress(event.target.checked)}
                />
                <span></span>
                Save this address
              </label>
            </div>

            <label className="checkout-field">
              <span>
                <FaStickyNote />
                Order Notes
              </span>
              <textarea
                value={orderNotes}
                onChange={(event) => setOrderNotes(event.target.value)}
                rows="4"
                placeholder="Delivery instructions, gift note, or preferred timing"
              ></textarea>
            </label>
          </section>
        </div>

        <aside className="checkout-summary-column" aria-label="Order summary">
          <section className="checkout-summary-card">
            <div className="summary-top">
              <span className="checkout-eyebrow">Order Summary</span>
              <h2>{formatCurrency(orderSummary.grandTotal)}</h2>
              <p>{orderSummary.quantity} items in your ShopNest order.</p>
            </div>

            <div className="free-shipping-box">
              <div>
                <strong>
                  {orderSummary.freeShippingRemaining === 0
                    ? "Free shipping unlocked"
                    : `${formatCurrency(
                        orderSummary.freeShippingRemaining
                      )} away from free standard shipping`}
                </strong>
                <span>{Math.round(orderSummary.freeShippingProgress)}%</span>
              </div>
              <div className="free-shipping-track">
                <span
                  style={{
                    width: `${orderSummary.freeShippingProgress}%`,
                  }}
                ></span>
              </div>
            </div>

            <div className="checkout-products">
              {cartItems.map((item) => {
                const quantity = Math.max(1, getSafeNumber(item.quantity));
                const price = getSafeNumber(item.price);

                return (
                  <div className="checkout-product-row" key={item._id}>
                    <img
                      src={item.imageUrl || "/image.png"}
                      alt={item.name || "Product"}
                    />
                    <div>
                      <strong>{item.name || "Product"}</strong>
                      <span>
                        Qty {quantity} x {formatCurrency(price)}
                      </span>
                    </div>
                    <b>{formatCurrency(price * quantity)}</b>
                  </div>
                );
              })}
            </div>

            <div className="checkout-coupon">
              <label htmlFor="checkout-coupon">Coupon Code</label>
              <div>
                <input
                  id="checkout-coupon"
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
                    appliedCoupon ? "coupon-feedback success" : "coupon-feedback"
                  }
                >
                  {couponMessage}
                </p>
              )}
            </div>

            <div className="checkout-summary-lines">
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(orderSummary.subtotal)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>
                  {orderSummary.shipping === 0
                    ? "Free"
                    : formatCurrency(orderSummary.shipping)}
                </strong>
              </div>
              <div>
                <span>Tax</span>
                <strong>{formatCurrency(orderSummary.tax)}</strong>
              </div>
              <div>
                <span>Discount</span>
                <strong className="summary-discount">
                  -{formatCurrency(orderSummary.discount)}
                </strong>
              </div>
              {giftWrap && (
                <div>
                  <span>Gift Wrap</span>
                  <strong>{formatCurrency(orderSummary.giftWrapFee)}</strong>
                </div>
              )}
            </div>

            <div className="checkout-grand-total">
              <span>Grand Total</span>
              <strong>{formatCurrency(orderSummary.grandTotal)}</strong>
            </div>

            {submitError && (
              <div className="checkout-submit-error" role="alert">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              className="place-order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner />
                  Placing Order
                </>
              ) : (
                <>
                  Place Order
                  <FaCheckCircle />
                </>
              )}
            </button>

            <div className="checkout-action-links">
              <Link to="/cart">
                <FaArrowLeft />
                Back To Cart
              </Link>
              <Link to="/">
                <FaShoppingBag />
                Continue Shopping
              </Link>
            </div>
          </section>

          <section className="checkout-trust-panel" aria-label="Security details">
            <div>
              <FaLock />
              <strong>Secure Payment</strong>
              <span>SSL protected checkout.</span>
            </div>
            <div>
              <FaShieldAlt />
              <strong>Buyer Protection</strong>
              <span>Protected order handling.</span>
            </div>
            <div>
              <FaUndoAlt />
              <strong>Easy Returns</strong>
              <span>Return support for eligible products.</span>
            </div>
            <div>
              <FaBoxOpen />
              <strong>Premium Packing</strong>
              <span>Careful shipping preparation.</span>
            </div>
          </section>
        </aside>
      </form>
    </main>
  );
};

export default Checkout;
