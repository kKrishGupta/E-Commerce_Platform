import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaPlus, FaSearch, FaSpinner, FaTrash } from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import AdminLayout from "./AdminLayout";
import {
  adminRequest,
  formatAdminCurrency,
  getProductStockStatus,
  sortByText,
} from "./adminApi";

const PAGE_SIZE = 8;

const AdminProduct = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const data = await adminRequest("/api/products", {}, user);
      setProducts(data?.products || []);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Unable to load products.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = useMemo(() => {
    return ["all", ...new Set(products.map((product) => product?.category).filter(Boolean))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let nextProducts = products.filter((product) => {
      const searchText = `${product?.name || ""} ${product?.category || ""}`.toLowerCase();
      const stock = Number(product?.stock || 0);
      const price = Number(product?.price || 0);
      const matchesQuery = searchText.includes(query.trim().toLowerCase());
      const matchesCategory = category === "all" || product?.category === category;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" && stock > 0 && stock <= 5) ||
        (stockFilter === "out" && stock <= 0) ||
        (stockFilter === "available" && stock > 5);
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "budget" && price < 5000) ||
        (priceFilter === "mid" && price >= 5000 && price <= 50000) ||
        (priceFilter === "premium" && price > 50000);
      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && product?.featured) ||
        (featuredFilter === "standard" && !product?.featured);

      return matchesQuery && matchesCategory && matchesStock && matchesPrice && matchesFeatured;
    });

    nextProducts = sortByText(nextProducts, "name", sortDirection);
    return nextProducts;
  }, [category, featuredFilter, priceFilter, products, query, sortDirection, stockFilter]);

  const pageCount = Math.max(Math.ceil(filteredProducts.length / PAGE_SIZE), 1);
  const paginatedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleProduct = (productId) => {
    setSelectedProducts((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await adminRequest(`/api/products/${productId}`, { method: "DELETE" }, user);
      setMessage("Product deleted successfully.");
      setProducts((current) => current.filter((product) => product?._id !== productId));
      setSelectedProducts((current) => current.filter((id) => id !== productId));
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Unable to delete product.");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedProducts.length || !window.confirm("Delete selected products?")) {
      return;
    }

    try {
      await Promise.all(
        selectedProducts.map((productId) =>
          adminRequest(`/api/products/${productId}`, { method: "DELETE" }, user)
        )
      );
      setProducts((current) => current.filter((product) => !selectedProducts.includes(product?._id)));
      setSelectedProducts([]);
      setMessage("Selected products deleted successfully.");
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Bulk delete failed.");
    }
  };

  const handleBulkRestock = async () => {
    if (!selectedProducts.length) {
      setMessage("Select products before bulk update.");
      return;
    }

    try {
      await Promise.all(
        selectedProducts.map((productId) => {
          const formData = new FormData();
          formData.append("stock", "10");
          return adminRequest(`/api/products/${productId}`, {
            method: "PUT",
            body: formData,
          }, user);
        })
      );
      setMessage("Selected products restocked to 10 units.");
      loadProducts();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Bulk stock update failed.");
    }
  };

  return (
    <AdminLayout
      title="Product Management"
      subtitle="Search, filter, preview, edit, and manage ShopNest inventory."
      actions={
        <Link to="/admin/add-product" className="admin-primary-btn">
          <FaPlus /> Add Product
        </Link>
      }
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
              placeholder="Search products..."
            />
          </label>

          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option value={item} key={item}>
                {item === "all" ? "All categories" : item}
              </option>
            ))}
          </select>

          <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}>
            <option value="all">All stock</option>
            <option value="available">Available</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>

          <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}>
            <option value="all">All prices</option>
            <option value="budget">Under Rs.5K</option>
            <option value="mid">Rs.5K - Rs.50K</option>
            <option value="premium">Above Rs.50K</option>
          </select>

          <select value={featuredFilter} onChange={(event) => setFeaturedFilter(event.target.value)}>
            <option value="all">Featured + standard</option>
            <option value="featured">Featured only</option>
            <option value="standard">Standard only</option>
          </select>

          <button
            className="admin-secondary-btn"
            type="button"
            onClick={() => setSortDirection((current) => (current === "asc" ? "desc" : "asc"))}
          >
            Sort {sortDirection === "asc" ? "A-Z" : "Z-A"}
          </button>
        </div>

        <div className="admin-bulk-actions">
          <span>{selectedProducts.length} selected</span>
          <button className="admin-secondary-btn" type="button" onClick={handleBulkRestock}>
            Bulk Update Stock
          </button>
          <button className="admin-danger-btn" type="button" onClick={handleBulkDelete}>
            Bulk Delete
          </button>
        </div>

        {isLoading ? (
          <div className="admin-empty-state">
            <FaSpinner className="admin-spin" />
            Loading products...
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product?._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product?._id)}
                        onChange={() => toggleProduct(product?._id)}
                      />
                    </td>
                    <td>
                      <div className="admin-product-cell">
                        <img src={product?.imageUrl || "/image.png"} alt={product?.name || "Product"} />
                        <div>
                          <strong>{product?.name}</strong>
                          <small>{product?.description}</small>
                        </div>
                      </div>
                    </td>
                    <td>{product?.category}</td>
                    <td>{formatAdminCurrency(product?.price)}</td>
                    <td>
                      <span className={`admin-status ${Number(product?.stock || 0) <= 0 ? "cancelled" : Number(product?.stock || 0) <= 5 ? "pending" : "delivered"}`}>
                        {getProductStockStatus(product?.stock)}
                      </span>
                    </td>
                    <td>{product?.rating || 0}</td>
                    <td>
                      <div className="admin-row-actions">
                        <Link to={`/product/${product?._id}`} className="admin-icon-btn" title="Preview">
                          <FaEye />
                        </Link>
                        <Link to={`/admin/edit-product/${product?._id}`} className="admin-icon-btn" title="Edit">
                          <FaEdit />
                        </Link>
                        <button
                          className="admin-icon-btn danger"
                          type="button"
                          onClick={() => handleDelete(product?._id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!paginatedProducts.length && (
              <div className="admin-empty-state">No products match your filters.</div>
            )}
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

export default AdminProduct;
