import { useContext, useEffect, useMemo, useState } from "react";
import {
  FaBell,
  FaBoxOpen,
  FaChartLine,
  FaClipboardList,
  FaCog,
  FaComments,
  FaCreditCard,
  FaExclamationTriangle,
  FaFileAlt,
  FaLayerGroup,
  FaRupeeSign,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaTruck,
  FaUsers,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import AdminLayout from "./AdminLayout";
import {
  adminRequest,
  formatAdminCurrency,
  formatAdminDate,
  getOrderCustomer,
  getOrderItems,
  getOrderTotal,
} from "./adminApi";

const emptyData = {
  analytics: null,
  products: [],
  orders: [],
  users: [],
};

const getOrderStatus = (order) => String(order?.status || "pending").toLowerCase();

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError("");

      const [analyticsResult, productsResult, ordersResult, usersResult] =
        await Promise.allSettled([
          adminRequest("/api/analytics", {}, user),
          adminRequest("/api/products", {}, user),
          adminRequest("/api/orders", {}, user),
          adminRequest("/api/auth/users", {}, user),
        ]);

      if (!isMounted) {
        return;
      }

      const nextData = {
        analytics:
          analyticsResult.status === "fulfilled" ? analyticsResult.value : null,
        products:
          productsResult.status === "fulfilled"
            ? productsResult.value?.products || []
            : [],
        orders:
          ordersResult.status === "fulfilled" ? ordersResult.value?.orders || [] : [],
        users: usersResult.status === "fulfilled" ? usersResult.value?.users || [] : [],
      };

      const failed = [analyticsResult, ordersResult, usersResult].find(
        (result) => result.status === "rejected"
      );

      setData(nextData);
      setError(failed?.reason?.message || "");
      setIsLoading(false);
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const derived = useMemo(() => {
    const products = data.products;
    const orders = data.orders.length ? data.orders : data.analytics?.recentOrders || [];
    const users = data.users;
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const revenue = orders
      .filter((order) => getOrderStatus(order) !== "cancelled")
      .reduce((total, order) => total + getOrderTotal(order), 0);

    const todayRevenue = orders
      .filter((order) => {
        const date = new Date(order?.createdAt);
        return date.toDateString() === today.toDateString();
      })
      .reduce((total, order) => total + getOrderTotal(order), 0);

    const monthlyRevenue = orders
      .filter((order) => {
        const date = new Date(order?.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((total, order) => total + getOrderTotal(order), 0);

    const pendingOrders = orders.filter((order) => getOrderStatus(order) === "pending");
    const completedOrders = orders.filter((order) => getOrderStatus(order) === "delivered");
    const cancelledOrders = orders.filter((order) => getOrderStatus(order) === "cancelled");
    const lowStockProducts = products.filter(
      (product) => Number(product?.stock || 0) > 0 && Number(product?.stock || 0) <= 5
    );
    const outOfStockProducts = products.filter(
      (product) => Number(product?.stock || 0) <= 0
    );

    const categoryMap = products.reduce((map, product) => {
      const category = product?.category || "Uncategorized";
      map[category] = (map[category] || 0) + 1;
      return map;
    }, {});

    const paymentMap = orders.reduce((map, order) => {
      const method = order?.paymentId?.startsWith("COD-") ? "COD" : "Razorpay";
      map[method] = (map[method] || 0) + 1;
      return map;
    }, {});

    const topProducts = Object.values(
      orders.reduce((map, order) => {
        getOrderItems(order).forEach((item) => {
          const product = item?.productId || {};
          const id = product?._id || product?.id || item?._id;
          const name = product?.name || item?.name || "Product";

          if (!id) {
            return;
          }

          map[id] = map[id] || {
            id,
            name,
            quantity: 0,
            revenue: 0,
          };
          map[id].quantity += Number(item?.quantity || 0);
          map[id].revenue += Number(item?.price || product?.price || 0) * Number(item?.quantity || 0);
        });

        return map;
      }, {})
    )
      .sort((first, second) => second.quantity - first.quantity)
      .slice(0, 5);

    return {
      activeUsers: users.filter((account) => account?.isVerified).length,
      cancelledOrders,
      categoryMap,
      completedOrders,
      lowStockProducts,
      monthlyRevenue,
      orders,
      outOfStockProducts,
      paymentMap,
      pendingOrders,
      products,
      recentOrders: [...orders].sort(
        (first, second) => new Date(second?.createdAt || 0) - new Date(first?.createdAt || 0)
      ),
      recentUsers: [...users].sort(
        (first, second) => new Date(second?.createdAt || 0) - new Date(first?.createdAt || 0)
      ),
      revenue,
      todayRevenue,
      topProducts,
      users,
    };
  }, [data]);

  const statCards = [
    {
      label: "Total Revenue",
      value: formatAdminCurrency(data.analytics?.stats?.totalRevenue || derived.revenue),
      icon: FaRupeeSign,
    },
    {
      label: "Today's Revenue",
      value: formatAdminCurrency(derived.todayRevenue),
      icon: FaChartLine,
    },
    {
      label: "Monthly Revenue",
      value: formatAdminCurrency(derived.monthlyRevenue),
      icon: FaLayerGroup,
    },
    {
      label: "Total Orders",
      value: data.analytics?.stats?.totalOrders || derived.orders.length,
      icon: FaClipboardList,
    },
    {
      label: "Pending Orders",
      value: derived.pendingOrders.length,
      icon: FaTruck,
    },
    {
      label: "Completed Orders",
      value: derived.completedOrders.length,
      icon: FaShoppingCart,
    },
    {
      label: "Cancelled Orders",
      value: derived.cancelledOrders.length,
      icon: FaExclamationTriangle,
    },
    {
      label: "Total Users",
      value: data.analytics?.stats?.totalUsers || derived.users.length,
      icon: FaUsers,
    },
    {
      label: "Active Users",
      value: derived.activeUsers,
      icon: FaUsers,
    },
    {
      label: "Total Products",
      value: data.analytics?.stats?.totalProducts || derived.products.length,
      icon: FaStore,
    },
    {
      label: "Low Stock",
      value: derived.lowStockProducts.length,
      icon: FaBoxOpen,
    },
    {
      label: "Out Of Stock",
      value: derived.outOfStockProducts.length,
      icon: FaExclamationTriangle,
    },
  ];

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Enterprise control center for ShopNest operations."
    >
      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {isLoading ? (
        <div className="admin-skeleton-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="admin-skeleton-card" key={`dashboard-skeleton-${index}`}></div>
          ))}
        </div>
      ) : (
        <>
          <section className="admin-stat-grid">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <article className="admin-stat-card" key={card.label}>
                  <div>
                    <span>{card.label}</span>
                    <strong>{card.value}</strong>
                  </div>
                  <Icon />
                </article>
              );
            })}
          </section>

          <section className="admin-dashboard-grid">
            <article className="admin-panel admin-panel-wide">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-kicker">Charts</span>
                  <h2>Revenue Graph</h2>
                </div>
                <FaChartLine />
              </div>
              <div className="admin-chart-bars">
                {[derived.revenue, derived.monthlyRevenue, derived.todayRevenue, derived.pendingOrders.length * 1000].map(
                  (value, index) => (
                    <span
                      className={`admin-bar admin-bar-${index + 1}`}
                      key={`revenue-${index}`}
                      title={String(value)}
                    ></span>
                  )
                )}
              </div>
            </article>

            <article className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-kicker">Orders</span>
                  <h2>Orders Graph</h2>
                </div>
                <FaClipboardList />
              </div>
              <div className="admin-mini-metrics">
                <span>Pending {derived.pendingOrders.length}</span>
                <span>Delivered {derived.completedOrders.length}</span>
                <span>Cancelled {derived.cancelledOrders.length}</span>
              </div>
            </article>

            <article className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-kicker">Distribution</span>
                  <h2>Category Distribution</h2>
                </div>
                <FaLayerGroup />
              </div>
              <div className="admin-list-compact">
                {Object.entries(derived.categoryMap).length ? (
                  Object.entries(derived.categoryMap).map(([category, count]) => (
                    <div key={category}>
                      <span>{category}</span>
                      <strong>{count}</strong>
                    </div>
                  ))
                ) : (
                  <p>No categories yet.</p>
                )}
              </div>
            </article>

            <article className="admin-panel" id="payments">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-kicker">Payments</span>
                  <h2>Payment Distribution</h2>
                </div>
                <FaCreditCard />
              </div>
              <div className="admin-list-compact">
                {Object.entries(derived.paymentMap).length ? (
                  Object.entries(derived.paymentMap).map(([method, count]) => (
                    <div key={method}>
                      <span>{method}</span>
                      <strong>{count}</strong>
                    </div>
                  ))
                ) : (
                  <p>No payments yet.</p>
                )}
              </div>
            </article>
          </section>

          <section className="admin-dashboard-grid">
            <article className="admin-panel admin-panel-wide">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-kicker">Recent</span>
                  <h2>Recent Orders</h2>
                </div>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {derived.recentOrders.slice(0, 6).map((order) => {
                      const customer = getOrderCustomer(order);
                      return (
                        <tr key={order?._id}>
                          <td>#{order?._id}</td>
                          <td>{customer.name}</td>
                          <td>
                            <span className={`admin-status ${getOrderStatus(order)}`}>
                              {getOrderStatus(order)}
                            </span>
                          </td>
                          <td>{formatAdminCurrency(getOrderTotal(order))}</td>
                          <td>{formatAdminDate(order?.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-kicker">Recent</span>
                  <h2>Recent Users</h2>
                </div>
                <FaUsers />
              </div>
              <div className="admin-list-compact">
                {derived.recentUsers.slice(0, 6).map((account) => (
                  <div key={account?._id || account?.id}>
                    <span>{account?.name}</span>
                    <strong>{account?.role}</strong>
                  </div>
                ))}
                {!derived.recentUsers.length && <p>No users found.</p>}
              </div>
            </article>
          </section>

          <section className="admin-dashboard-grid">
            <article className="admin-panel" id="inventory">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-kicker">Inventory</span>
                  <h2>Restock Alerts</h2>
                </div>
                <FaBoxOpen />
              </div>
              <div className="admin-list-compact">
                {[...derived.lowStockProducts, ...derived.outOfStockProducts].slice(0, 8).map((product) => (
                  <div key={product?._id}>
                    <span>{product?.name}</span>
                    <strong>{Number(product?.stock || 0)} left</strong>
                  </div>
                ))}
                {!derived.lowStockProducts.length && !derived.outOfStockProducts.length && (
                  <p>Inventory looks healthy.</p>
                )}
              </div>
            </article>

            <article className="admin-panel" id="reviews">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-kicker">Reviews</span>
                  <h2>Latest Reviews</h2>
                </div>
                <FaComments />
              </div>
              <div className="admin-list-compact">
                {derived.products
                  .filter((product) => Number(product?.numReviews || 0) > 0)
                  .slice(0, 6)
                  .map((product) => (
                    <div key={product?._id}>
                      <span>{product?.name}</span>
                      <strong>
                        <FaStar /> {product?.rating || 0} ({product?.numReviews})
                      </strong>
                    </div>
                  ))}
                {!derived.products.some((product) => Number(product?.numReviews || 0) > 0) && (
                  <p>No product reviews yet.</p>
                )}
              </div>
            </article>

            <article className="admin-panel" id="reports">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-kicker">Reports</span>
                  <h2>Top Selling Products</h2>
                </div>
                <FaFileAlt />
              </div>
              <div className="admin-list-compact">
                {derived.topProducts.map((product) => (
                  <div key={product.id}>
                    <span>{product.name}</span>
                    <strong>{product.quantity} sold</strong>
                  </div>
                ))}
                {!derived.topProducts.length && <p>No sales report yet.</p>}
              </div>
            </article>

            <article className="admin-panel" id="settings">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-kicker">Settings</span>
                  <h2>Notifications</h2>
                </div>
                <FaBell />
              </div>
              <div className="admin-list-compact">
                <div>
                  <span>Low stock alerts</span>
                  <strong>Enabled</strong>
                </div>
                <div>
                  <span>Order status alerts</span>
                  <strong>Enabled</strong>
                </div>
                <div>
                  <span>Admin profile</span>
                  <strong>{user?.name || "Admin"}</strong>
                </div>
                <div>
                  <span>Store settings</span>
                  <strong>ShopNest</strong>
                </div>
                <div>
                  <span>Coupons</span>
                  <strong>Frontend module ready</strong>
                </div>
                <div>
                  <span>Configuration</span>
                  <strong>
                    <FaCog /> Current APIs
                  </strong>
                </div>
              </div>
            </article>
          </section>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
