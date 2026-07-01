import React from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";

import "../styles/productCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">

      {product.stock <= 5 && (
        <span className="stock-badge">
          Only {product.stock} Left
        </span>
      )}

      <button className="wishlist-btn">
        <FaHeart />
      </button>

      <img
        src={product.imageUrl}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">

        <h3>{product.name}</h3>

        <div className="rating">

          <FaStar />

          <span>
            {product.rating || 4.5}
          </span>

        </div>

        <h2>

          ₹{product.price.toLocaleString("en-IN")}

        </h2>

        <div className="product-buttons">

          <button className="cart-btn">

            <FaShoppingCart />

            Add to Cart

          </button>

          <Link
            to={`/product/${product._id}`}
            className="details-btn"
          >
            View
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;