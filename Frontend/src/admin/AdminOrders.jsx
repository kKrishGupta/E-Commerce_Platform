import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  FaEye,
  FaFileInvoice,
  FaPrint,
  FaSearch,
  FaSpinner,
  FaTruck,
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

const PAGE_SIZE = 8;
const statusOptions = ["all", "pending", "shipped", "delivered", "cancelled"];
const updateOptions = ["pending", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const data = await adminRequest("/api/orders", {}, user);
      setOrders(data?.orders || []);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Unable to load orders.");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer = getOrderCustomer(order);
      const searchText = `${order?._id || ""} ${customer.name} ${customer.email}`.toLowerCase();
      const matchesSearch = searchText.includes(query.trim().toLowerCase());
      const matchesStatus = statusFilter === "all" || order?.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  const pageCount = Math.max(Math.ceil(filteredOrders.length / PAGE_SIZE), 1);
  const paginatedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = async (orderId, status) => {
    try {
      const data = await adminRequest(
        `/api/orders/${orderId}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ status }),
        },
        user
      );

      setOrders((current) =>
        current.map((order) => (order?._id === orderId ? data?.order || order : order))
      );
      setMessage("Order status updated successfully.");
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Unable to update order status.");
    }
  };

  return (
    <AdminLayout
      title="Order Management"
      subtitle="Track customer orders, fulfillment status, payment details, and invoices."
    >
      {message && <div className="admin-alert">{message}</div>}

      <section className="admin-panel">
        <div className="admin-filters">
          <label className="admin-search admin-search-large">
            <FaSearch />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search order id, customer, email..."
            />
          </label>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {statusOptions.map((status) => (
              <option value={status} key={status}>
                {status === "all" ? "All statuses" : status}
              </option>
            ))}
          </select>

          <button className="admin-secondary-btn" type="button" onClick={() => window.print()}>
            <FaPrint /> Print Orders
          </button>
        </div>

        {isLoading ? (
          <div className="admin-empty-state">
            <FaSpinner className="admin-spin" />
            Loading orders...
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  const customer = getOrderCustomer(order);

                  return (
                    <tr key={order?._id}>
                      <td>#{order?._id}</td>
                      <td>
                        <strong>{customer.name}</strong>
                        <small>{customer.email}</small>
                      </td>
                      <td>{formatAdminCurrency(getOrderTotal(order))}</td>
                      <td>
                        <select
                          value={order?.status || "pending"}
                          onChange={(event) => updateStatus(order?._id, event.target.value)}
                        >
                          {updateOptions.map((status) => (
                            <option value={status} key={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{order?.paymentId || "Not available"}</td>
                      <td>{formatAdminDate(order?.createdAt)}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="admin-icon-btn"
                            type="button"
                            onClick={() =>
                              setExpandedOrder((current) =>
                                current === order?._id ? "" : order?._id
                              )
                            }
                            title="View details"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="admin-icon-btn"
                            type="button"
                            onClick={() => window.print()}
                            title="Print invoice"
                          >
                            <FaFileInvoice />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!paginatedOrders.length && (
              <div className="admin-empty-state">No orders match your filters.</div>
            )}
          </div>
        )}

        {expandedOrder && (
          <div className="admin-order-details">
            {orders
              .filter((order) => order?._id === expandedOrder)
              .map((order) => {
                const customer = getOrderCustomer(order);
                const address = order?.address || {};

                return (
                  <article className="admin-detail-card" key={order?._id}>
                    <div className="admin-panel-heading">
                      <div>
                        <span className="admin-kicker">Order Details</span>
                        <h2>#{order?._id}</h2>
                      </div>
                      <FaTruck />
                    </div>

                    <div className="admin-detail-grid">
                      <div>
                        <h3>Customer Details</h3>
                        <p>{customer.name}</p>
                        <p>{customer.email}</p>
                      </div>
                      <div>
                        <h3>Shipping Details</h3>
                        <p>{address?.Street || address?.street || "Street not added"}</p>
                        <p>
                          {address?.city || "City"}, {address?.postalCode || "Postal code"}
                        </p>
                        <p>{address?.country || "India"}</p>
                      </div>
                      <div>
                        <h3>Payment Details</h3>
                        <p>{order?.paymentId || "Not available"}</p>
                        <p>{formatAdminCurrency(getOrderTotal(order))}</p>
                      </div>
                    </div>

                    <div className="admin-order-items">
                      {getOrderItems(order).map((item) => {
                        const product = item?.productId || {};
                        return (
                          <div key={product?._id || item?._id}>
                            <img src={product?.imageUrl || "/image.png"} alt={product?.name || "Product"} />
                            <span>{product?.name || "Product"}</span>
                            <strong>Qty {item?.quantity || 1}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
          </div>
        )}

        <div className="admin-pagination">
          <button
            type="button"
            className="admin-secondary-btn"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            className="admin-secondary-btn"
            disabled={page === pageCount}
            onClick={() => setPage((current) => Math.min(current + 1, pageCount))}
          >
            Next
          </button>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminOrders;
