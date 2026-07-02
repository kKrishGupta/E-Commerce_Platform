import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaImage, FaPlus, FaSpinner } from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import AdminLayout from "./AdminLayout";
import { adminRequest } from "./adminApi";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    setImage(file || null);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!image) {
      setError("Product image is required.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append("image", image);

    setIsSubmitting(true);

    try {
      await adminRequest(
        "/api/products",
        {
          method: "POST",
          body: formData,
        },
        user
      );

      navigate("/admin/products");
    } catch (submitError) {
      console.error(submitError);
      setError(submitError.message || "Unable to create product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Add Product"
      subtitle="Create a polished ShopNest product listing with inventory and imagery."
    >
      <section className="admin-panel">
        <form className="admin-product-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Product Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Premium wireless headphones"
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Category</span>
              <input
                type="text"
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                placeholder="Electronics"
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Price</span>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                placeholder="24999"
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Stock</span>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) => updateField("stock", event.target.value)}
                placeholder="25"
                required
              />
            </label>

            <label className="admin-form-field admin-form-field-wide">
              <span>Description</span>
              <textarea
                rows="5"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Describe features, quality, warranty, and customer benefits."
                required
              ></textarea>
            </label>
          </div>

          <label className="admin-upload-card">
            <input type="file" accept="image/*" onChange={handleImage} required />
            {preview ? (
              <img src={preview} alt="Product preview" />
            ) : (
              <div>
                <FaImage />
                <strong>Upload Product Image</strong>
                <span>PNG, JPG, or WEBP supported</span>
              </div>
            )}
          </label>

          {error && <div className="admin-alert admin-alert-error">{error}</div>}

          <button className="admin-primary-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <FaSpinner className="admin-spin" /> : <FaPlus />}
            {isSubmitting ? "Creating Product" : "Create Product"}
          </button>
        </form>
      </section>
    </AdminLayout>
  );
};

export default AddProduct;
