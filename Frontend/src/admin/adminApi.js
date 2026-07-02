export const formatAdminCurrency = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

export const formatAdminDate = (dateValue) => {
  if (!dateValue) {
    return "Not available";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getStoredAdminUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAdminToken = (user) => {
  const savedUser = getStoredAdminUser();

  return (
    user?.token ||
    user?.accessToken ||
    savedUser?.token ||
    savedUser?.accessToken ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
};

export const isAdminUser = (user) => {
  const savedUser = getStoredAdminUser();
  return (user?.role || savedUser?.role || "").toLowerCase() === "admin";
};

export const adminRequest = async (endpoint, options = {}, user = null) => {
  const token = getAdminToken(user);
  const isFormData = options.body instanceof FormData;

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Request failed. Please try again.");
  }

  return data;
};

export const getOrderTotal = (order) => Number(order?.totalAmount || order?.total || 0);

export const getOrderItems = (order) => (Array.isArray(order?.items) ? order.items : []);

export const getOrderCustomer = (order) => {
  const user = order?.user || {};
  const address = order?.address || {};

  return {
    name: user?.name || address?.fullName || "Customer",
    email: user?.email || address?.email || "No email",
    city: address?.city || "Unknown city",
    country: address?.country || "India",
  };
};

export const getProductStockStatus = (stock) => {
  const value = Number(stock || 0);

  if (value <= 0) {
    return "Out of stock";
  }

  if (value <= 5) {
    return "Low stock";
  }

  return "In stock";
};

export const sortByText = (items, field, direction = "asc") => {
  return [...items].sort((firstItem, secondItem) => {
    const firstValue = String(firstItem?.[field] || "").toLowerCase();
    const secondValue = String(secondItem?.[field] || "").toLowerCase();

    if (direction === "desc") {
      return secondValue.localeCompare(firstValue);
    }

    return firstValue.localeCompare(secondValue);
  });
};
