import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaImage, FaSave, FaSpinner } from "react-icons/fa";

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

const EditProduct = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await adminRequest(`/api/products/${id}`, {}, user);

        if (!isMounted) {
          return;
        }

        const product = data?.product || {};
        setForm({
          name: product?.name || "",
          description: product?.description || "",
          price: product?.price || "",
          category: product?.category || "",
          stock: product?.stock ?? "",
        });
        setPreview(product?.imageUrl || "");
      } catch (loadError) {
        console.error(loadError);
        setError(loadError.message || "Unable to load product.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    setImage(file || null);
    setPreview(file ? URL.createObjectURL(file) : preview);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    if (image) {
      formData.append("image", image);
    }

    try {
      await adminRequest(
        `/api/products/${id}`,
        {
          method: "PUT",
          body: formData,
        },
        user
      );

      navigate("/admin/products");
    } catch (submitError) {
      console.error(submitError);
      setError(submitError.message || "Unable to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Edit Product"
      subtitle="Update product details, stock, pricing, and media."
    >
      <section className="admin-panel">
        {isLoading ? (
          <div className="admin-empty-state">
            <FaSpinner className="admin-spin" />
            Loading product...
          </div>
        ) : (
          <form className="admin-product-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <label className="admin-form-field">
                <span>Product Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                />
              </label>

              <label className="admin-form-field">
                <span>Category</span>
                <input
                  type="text"
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
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
                  required
                />
              </label>

              <label className="admin-form-field admin-form-field-wide">
                <span>Description</span>
                <textarea
                  rows="5"
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  required
                ></textarea>
              </label>
            </div>

            <label className="admin-upload-card">
              <input type="file" accept="image/*" onChange={handleImage} />
              {preview ? (
                <img src={preview} alt="Product preview" />
              ) : (
                <div>
                  <FaImage />
                  <strong>Upload New Image</strong>
                  <span>Optional for updates</span>
                </div>
              )}
            </label>

            {error && <div className="admin-alert admin-alert-error">{error}</div>}

            <button className="admin-primary-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <FaSpinner className="admin-spin" /> : <FaSave />}
              {isSubmitting ? "Saving Product" : "Save Changes"}
            </button>
          </form>
        )}
      </section>
    </AdminLayout>
  );
};

export default EditProduct;
