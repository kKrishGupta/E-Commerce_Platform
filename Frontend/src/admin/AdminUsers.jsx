import { useContext, useEffect, useMemo, useState } from "react";
import { FaEye, FaSearch, FaSpinner, FaUserSlash, FaUsers } from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import AdminLayout from "./AdminLayout";
import { adminRequest, formatAdminDate } from "./adminApi";

const PAGE_SIZE = 10;

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      setIsLoading(true);
      setMessage("");

      try {
        const data = await adminRequest("/api/auth/users", {}, user);

        if (isMounted) {
          setUsers(data?.users || []);
        }
      } catch (error) {
        console.error(error);
        setMessage(error.message || "Unable to load users.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const filteredUsers = useMemo(() => {
    return users.filter((account) => {
      const searchText = `${account?.name || ""} ${account?.email || ""}`.toLowerCase();
      const matchesQuery = searchText.includes(query.trim().toLowerCase());
      const matchesRole = roleFilter === "all" || account?.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && account?.isVerified) ||
        (statusFilter === "blocked" && !account?.isVerified);

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [query, roleFilter, statusFilter, users]);

  const pageCount = Math.max(Math.ceil(filteredUsers.length / PAGE_SIZE), 1);
  const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const unavailableAction = () => {
    setMessage("This backend currently exposes admin user listing only. No user delete/deactivate endpoint was added.");
  };

  return (
    <AdminLayout
      title="User Management"
      subtitle="Review customer and admin accounts using the existing protected user API."
    >
      {message && <div className="admin-alert">{message}</div>}

      <section className="admin-stat-grid admin-stat-grid-small">
        <article className="admin-stat-card">
          <div>
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
          <FaUsers />
        </article>
        <article className="admin-stat-card">
          <div>
            <span>Admins</span>
            <strong>{users.filter((account) => account?.role === "admin").length}</strong>
          </div>
          <FaUsers />
        </article>
        <article className="admin-stat-card">
          <div>
            <span>Customers</span>
            <strong>{users.filter((account) => account?.role !== "admin").length}</strong>
          </div>
          <FaUsers />
        </article>
      </section>

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
              placeholder="Search users..."
            />
          </label>

          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">Customer</option>
          </select>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All status</option>
            <option value="active">Verified</option>
            <option value="blocked">Unverified</option>
          </select>
        </div>

        {isLoading ? (
          <div className="admin-empty-state">
            <FaSpinner className="admin-spin" />
            Loading users...
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((account) => (
                  <tr key={account?._id || account?.id}>
                    <td>
                      <strong>{account?.name}</strong>
                    </td>
                    <td>{account?.email}</td>
                    <td>{account?.role}</td>
                    <td>
                      <span className={`admin-status ${account?.isVerified ? "delivered" : "pending"}`}>
                        {account?.isVerified ? "verified" : "unverified"}
                      </span>
                    </td>
                    <td>{formatAdminDate(account?.createdAt)}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          className="admin-icon-btn"
                          type="button"
                          onClick={() => setSelectedUser(account)}
                          title="View profile"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="admin-icon-btn"
                          type="button"
                          onClick={unavailableAction}
                          title="Deactivate user"
                        >
                          <FaUserSlash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!paginatedUsers.length && (
              <div className="admin-empty-state">No users match your filters.</div>
            )}
          </div>
        )}

        {selectedUser && (
          <article className="admin-detail-card">
            <div className="admin-panel-heading">
              <div>
                <span className="admin-kicker">User Profile</span>
                <h2>{selectedUser?.name}</h2>
              </div>
              <button
                className="admin-secondary-btn"
                type="button"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>

            <div className="admin-detail-grid">
              <div>
                <h3>Email</h3>
                <p>{selectedUser?.email}</p>
              </div>
              <div>
                <h3>Role</h3>
                <p>{selectedUser?.role}</p>
              </div>
              <div>
                <h3>Verification</h3>
                <p>{selectedUser?.isVerified ? "Verified account" : "Pending verification"}</p>
              </div>
            </div>
          </article>
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

export default AdminUsers;
