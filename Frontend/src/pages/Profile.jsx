import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBoxOpen,
  FaCalendarAlt,
  FaCamera,
  FaCheckCircle,
  FaCog,
  FaEdit,
  FaEnvelope,
  FaHeart,
  FaHistory,
  FaLock,
  FaMapMarkerAlt,
  FaMedal,
  FaMobileAlt,
  FaShoppingBag,
  FaSignOutAlt,
  FaSpinner,
  FaTruck,
  FaUserCircle,
  FaUserShield,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import "../styles/profile.css";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatCurrency = (amount) => currencyFormatter.format(Number(amount || 0));

const safeParse = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(error);
    return fallback;
  }
};

const formatDate = (dateValue, fallback = "Not available") => {
  if (!dateValue) {
    return fallback;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getAuthToken = (user) => {
  try {
    const savedUser = safeParse("user", {});
    return (
      user?.token ||
      user?.accessToken ||
      savedUser?.token ||
      savedUser?.accessToken ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      ""
    );
  } catch (error) {
    console.error(error);
    return "";
  }
};

const getOrderId = (order) => order?._id || order?.id || order?.orderId || "";

const getOrderStatus = (order) =>
  String(order?.status || order?.orderStatus || "pending").toLowerCase();

const getStatusLabel = (status) => {
  const labels = {
    pending: "Processing",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return labels[status] || "Processing";
};

const getStatusClass = (status) => {
  if (status === "shipped") {
    return "status shipped";
  }

  if (status === "delivered") {
    return "status delivered";
  }

  if (status === "cancelled") {
    return "status cancelled";
  }

  return "status processing";
};

const getOrderItems = (order) => (Array.isArray(order?.items) ? order.items : []);

const getFirstProduct = (order) => {
  const firstItem = getOrderItems(order)?.[0] || {};
  const product = firstItem?.productId || firstItem?.product || {};

  return {
    imageUrl:
      product?.imageUrl ||
      firstItem?.imageUrl ||
      firstItem?.image ||
      "/image.png",
    name:
      product?.name ||
      firstItem?.name ||
      (getOrderItems(order).length > 1 ? "Multiple products" : "Product"),
    quantity: firstItem?.quantity || 1,
    price: firstItem?.price || product?.price || 0,
  };
};

const buildSavedAddresses = (user) => {
  const userAddresses = Array.isArray(user?.addresses) ? user.addresses : [];
  const checkoutAddress = safeParse("checkoutAddress", null);
  const addresses = [...userAddresses];

  if (checkoutAddress?.street || checkoutAddress?.Street) {
    addresses.push({
      ...checkoutAddress,
      type: checkoutAddress?.type || "Home",
    });
  }

  return addresses.filter(Boolean);
};

const getProfileImage = (user) =>
  user?.profilePicture ||
  user?.profileImage ||
  user?.avatar ||
  user?.imageUrl ||
  user?.image ||
  "";

const Profile = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const user = auth?.user || null;
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const wishlistItems = useMemo(() => {
    const items = safeParse("wishlistItems", []);
    return Array.isArray(items) ? items : [];
  }, []);

  const savedAddresses = useMemo(() => buildSavedAddresses(user), [user]);
  const profileImage = getProfileImage(user);
  const displayName = user?.name || "Guest User";
  const displayEmail = user?.email || "Not signed in";
  const displayRole = user?.role || "Customer";
  const memberSince = formatDate(user?.createdAt || user?.created_at, "Recently joined");
  const phoneNumber =
    user?.phone ||
    user?.phoneNumber ||
    savedAddresses?.[0]?.phone ||
    "Not added";

  useEffect(() => {
    const token = getAuthToken(user);

    if (!token) {
      setOrders([]);
      setOrdersError("");
      return undefined;
    }

    const controller = new AbortController();

    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");

      try {
        const response = await fetch("/api/orders/myorders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 404) {
          setOrders([]);
          return;
        }

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load order history.");
        }

        setOrders(Array.isArray(data?.orders) ? data.orders : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          setOrders([]);
          setOrdersError(error.message || "Unable to load order history.");
        }
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();

    return () => controller.abort();
  }, [user]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((firstOrder, secondOrder) => {
      const firstDate = new Date(firstOrder?.createdAt || 0).getTime();
      const secondDate = new Date(secondOrder?.createdAt || 0).getTime();
      return secondDate - firstDate;
    });
  }, [orders]);

  const currentOrders = useMemo(() => {
    return sortedOrders.filter((order) => {
      const status = getOrderStatus(order);
      return status !== "delivered" && status !== "cancelled";
    });
  }, [sortedOrders]);

  const previousOrders = useMemo(() => {
    return sortedOrders.filter((order) => {
      const status = getOrderStatus(order);
      return status === "delivered" || status === "cancelled";
    });
  }, [sortedOrders]);

  const totalSpent = useMemo(() => {
    return sortedOrders.reduce(
      (total, order) => total + Number(order?.totalAmount || order?.total || 0),
      0
    );
  }, [sortedOrders]);

  const completionFields = useMemo(
    () => [
      Boolean(user?.name),
      Boolean(user?.email),
      Boolean(user?.role),
      Boolean(user?.createdAt || user?.created_at),
      Boolean(profileImage),
      savedAddresses.length > 0,
      phoneNumber !== "Not added",
    ],
    [phoneNumber, profileImage, savedAddresses.length, user]
  );

  const profileCompletion = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100
  );
  const progressStep = Math.round(profileCompletion / 10) * 10;

  const achievements = useMemo(() => {
    const earnedAchievements = [];

    if (user?.isVerified || user?.email) {
      earnedAchievements.push("Verified ShopNest account");
    }

    if (sortedOrders.length > 0) {
      earnedAchievements.push("Placed first successful order");
    }

    if (sortedOrders.length >= 5) {
      earnedAchievements.push("Loyal customer with 5+ orders");
    }

    if (wishlistItems.length > 0) {
      earnedAchievements.push("Wishlist curator");
    }

    if (savedAddresses.length > 0) {
      earnedAchievements.push("Delivery-ready profile");
    }

    if (totalSpent > 0) {
      earnedAchievements.push(`${formatCurrency(totalSpent)} lifetime purchase value`);
    }

    return earnedAchievements;
  }, [savedAddresses.length, sortedOrders.length, totalSpent, user, wishlistItems.length]);

  const handleLogout = () => {
    if (user && !window.confirm("Are you sure you want to logout?")) {
      return;
    }

    auth?.logout?.();
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <section className="profile-hero" aria-labelledby="profile-title">
        <div className="profile-avatar">
          {profileImage ? (
            <img src={profileImage} alt={`${displayName} profile`} />
          ) : (
            <FaUserCircle aria-hidden="true" />
          )}

          <button className="camera-btn" type="button" aria-label="Update profile photo">
            <FaCamera />
          </button>
        </div>

        <div className="profile-user-info">
          <h1 id="profile-title">{displayName}</h1>
          <p>
            Welcome back to <span>ShopNest</span>
          </p>
        </div>
      </section>

      <div className="profile-container">
        <div className="profile-left">
          <div className="profile-card">
            <div className="card-heading">
              <FaUserCircle />
              <h2>Personal Information</h2>
            </div>

            <div className="profile-info">
              <div className="info-row">
                <FaEnvelope />
                <div>
                  <span>Email</span>
                  <strong>{displayEmail}</strong>
                </div>
              </div>

              <div className="info-row">
                <FaUserShield />
                <div>
                  <span>Role</span>
                  <strong>{displayRole}</strong>
                </div>
              </div>

              <div className="info-row">
                <FaCalendarAlt />
                <div>
                  <span>Member Since</span>
                  <strong>{memberSince}</strong>
                </div>
              </div>

              <div className="info-row">
                <FaMobileAlt />
                <div>
                  <span>Phone</span>
                  <strong>{phoneNumber}</strong>
                </div>
              </div>
            </div>

            <button className="edit-profile-btn" type="button">
              <FaEdit />
              Edit Profile
            </button>
          </div>

          <div className="profile-card">
            <div className="card-heading">
              <FaCheckCircle />
              <h2>Profile Completion</h2>
            </div>

            <div className="progress-wrapper">
              <div className="progress-bar" aria-label={`Profile ${profileCompletion}% complete`}>
                <div className={`progress-fill progress-fill-${progressStep}`}></div>
              </div>

              <p>{profileCompletion}% Complete</p>
            </div>

            <small>
              Add your address, phone number, and profile picture to complete your profile.
            </small>
          </div>
        </div>

        <div className="profile-right">
          <div className="profile-card">
            <div className="card-heading">
              <FaMedal />
              <h2>Account Overview</h2>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <FaShoppingBag />
                <h3>{sortedOrders.length}</h3>
                <p>Total Orders</p>
              </div>

              <div className="stat-card">
                <FaHeart />
                <h3>{wishlistItems.length}</h3>
                <p>Wishlist</p>
              </div>

              <div className="stat-card">
                <FaMapMarkerAlt />
                <h3>{savedAddresses.length}</h3>
                <p>Saved Addresses</p>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <div className="card-heading">
              <FaCog />
              <h2>Quick Actions</h2>
            </div>

            <div className="action-grid">
              <Link to="/profile#current-orders" className="action-card">
                <FaShoppingBag />
                <span>My Orders</span>
              </Link>

              <Link to="/profile#wishlist-preview" className="action-card">
                <FaHeart />
                <span>Wishlist</span>
              </Link>

              <Link to="/profile#saved-addresses" className="action-card">
                <FaMapMarkerAlt />
                <span>Addresses</span>
              </Link>

              <Link to="/profile#account-settings" className="action-card">
                <FaCog />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-card" id="current-orders">
        <div className="card-heading">
          <FaShoppingBag />
          <h2>Current Orders</h2>
        </div>

        {ordersLoading ? (
          <div className="empty-state">
            <FaSpinner className="spin-icon" />
            <p>Loading your latest orders...</p>
          </div>
        ) : currentOrders.length > 0 ? (
          <div className="orders-list">
            {currentOrders.map((order) => {
              const orderId = getOrderId(order);
              const status = getOrderStatus(order);
              const product = getFirstProduct(order);

              return (
                <div className="order-card" id={`order-${orderId}`} key={orderId}>
                  <div className="order-top">
                    <div>
                      <h3>#{orderId}</h3>
                      <p>Placed on {formatDate(order?.createdAt)}</p>
                    </div>

                    <span className={getStatusClass(status)}>
                      {getStatusLabel(status)}
                    </span>
                  </div>

                  <div className="order-body">
                    <img src={product.imageUrl} alt={product.name} />

                    <div className="order-details">
                      <h4>{product.name}</h4>
                      <p>Quantity : {product.quantity}</p>
                      <p>Total : {formatCurrency(order?.totalAmount || order?.total)}</p>
                      <p>Payment : {order?.paymentId ? "Paid" : "Not available"}</p>
                    </div>
                  </div>

                  <div className="order-actions">
                    <Link to={`/profile#order-${orderId}`} className="view-btn">
                      View Details
                    </Link>

                    <Link to={`/profile#timeline-${orderId}`} className="track-btn">
                      Track Order
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <FaBoxOpen />
            <p>{ordersError || "No current orders found."}</p>
          </div>
        )}
      </div>

      <div className="profile-card">
        <div className="card-heading">
          <FaTruck />
          <h2>Order Timeline</h2>
        </div>

        {currentOrders.length > 0 ? (
          <div className="timeline-list">
            {currentOrders.slice(0, 3).map((order) => {
              const orderId = getOrderId(order);
              const status = getOrderStatus(order);

              return (
                <div className="timeline-step" id={`timeline-${orderId}`} key={orderId}>
                  <span className="timeline-dot"></span>
                  <div>
                    <h4>#{orderId}</h4>
                    <p>
                      {getStatusLabel(status)} since {formatDate(order?.updatedAt || order?.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <FaHistory />
            <p>Timeline will appear here once an active order is available.</p>
          </div>
        )}
      </div>

      <div className="profile-card" id="previous-orders">
        <div className="card-heading">
          <FaCalendarAlt />
          <h2>Previous Orders</h2>
        </div>

        {previousOrders.length > 0 ? (
          <div className="history-list">
            {previousOrders.map((order) => {
              const product = getFirstProduct(order);
              const status = getOrderStatus(order);

              return (
                <div className="history-item" key={getOrderId(order)}>
                  <div>
                    <h4>{product.name}</h4>
                    <small>
                      {getStatusLabel(status)} • {formatDate(order?.updatedAt || order?.createdAt)}
                    </small>
                  </div>

                  <strong>{formatCurrency(order?.totalAmount || order?.total)}</strong>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <FaHistory />
            <p>No previous orders yet.</p>
          </div>
        )}

        <div className="history-footer">
          <Link to="/profile#current-orders" className="view-all-orders">
            View Complete Order History
          </Link>
        </div>
      </div>

      <div className="profile-card" id="saved-addresses">
        <div className="card-heading">
          <FaMapMarkerAlt />
          <h2>Saved Addresses</h2>
        </div>

        {savedAddresses.length > 0 ? (
          <div className="address-list">
            {savedAddresses.map((address, index) => (
              <div className="address-card" key={`${address?.postalCode || "address"}-${index}`}>
                <span className={index === 1 ? "address-tag office" : "address-tag"}>
                  {address?.type || address?.label || (index === 0 ? "Home" : "Office")}
                </span>

                <h4>{address?.fullName || displayName}</h4>

                <p>
                  {address?.street || address?.Street || "Street not added"}
                  {address?.apartment ? `, ${address.apartment}` : ""}
                  {address?.city ? `, ${address.city}` : ""}
                  {address?.state ? `, ${address.state}` : ""}
                  {address?.country ? `, ${address.country}` : ""}
                  {address?.postalCode ? ` - ${address.postalCode}` : ""}
                </p>

                <p>{address?.phone || phoneNumber}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaMapMarkerAlt />
            <p>No saved address found. Add one during checkout to speed up future orders.</p>
          </div>
        )}

        <button className="add-address-btn" type="button">
          + Add New Address
        </button>
      </div>

      <div className="profile-card" id="wishlist-preview">
        <div className="card-heading">
          <FaHeart />
          <h2>Wishlist Preview</h2>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="wishlist-grid">
            {wishlistItems.slice(0, 3).map((item) => (
              <div className="wishlist-item" key={item?._id || item?.id || item?.name}>
                <img src={item?.imageUrl || "/image.png"} alt={item?.name || "Wishlist product"} />
                <h4>{item?.name || "Wishlist Product"}</h4>
                <span>{formatCurrency(item?.price)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaHeart />
            <p>Your wishlist is empty.</p>
          </div>
        )}

        <Link to="/profile#wishlist-preview" className="view-all-orders">
          View Full Wishlist
        </Link>
      </div>

      <div className="profile-card" id="account-settings">
        <div className="card-heading">
          <FaCog />
          <h2>Account Settings</h2>
        </div>

        <div className="settings-list">
          <label className="setting-item">
            <span>
              <FaBell />
              Email Notifications
            </span>
            <input type="checkbox" defaultChecked />
          </label>

          <label className="setting-item">
            <span>
              <FaMobileAlt />
              SMS Notifications
            </span>
            <input type="checkbox" defaultChecked />
          </label>

          <label className="setting-item">
            <span>
              <FaLock />
              Secure Login Alerts
            </span>
            <input type="checkbox" defaultChecked={Boolean(user)} />
          </label>
        </div>
      </div>

      <div className="profile-card">
        <div className="card-heading">
          <FaUserShield />
          <h2>Security Center</h2>
        </div>

        <div className="security-actions">
          <button className="security-btn" type="button">
            Change Password
          </button>

          <button className="security-btn" type="button">
            Two-Factor Authentication
          </button>

          <button className="security-btn" type="button">
            Login Activity
          </button>
        </div>
      </div>

      <div className="profile-card achievement-card">
        <div className="card-heading">
          <FaMedal />
          <h2>Account Achievements</h2>
        </div>

        {achievements.length > 0 ? (
          <div className="achievement-list">
            {achievements.map((achievement) => (
              <div className="achievement" key={achievement}>
                <FaCheckCircle />
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaMedal />
            <p>Your achievements will unlock as you shop with ShopNest.</p>
          </div>
        )}
      </div>

      <div className="profile-card">
        <button className="logout-btn" type="button" onClick={handleLogout}>
          <FaSignOutAlt />
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
