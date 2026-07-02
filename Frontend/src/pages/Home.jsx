import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        setProducts(data.products?.slice(0, 8) || []);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container">

      {/* Hero Section */}

      <section className="hero-banner">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="hero-tag">
            ✨ Trusted by 10,000+ Happy Customers
          </span>

          <h1>
            Discover the Future of
            <span> Online Shopping</span>
          </h1>

          <p>
            Shop premium products with secure payments,
            lightning-fast delivery, and unbeatable prices.
          </p>

          <div className="hero-buttons">

            <Link
              to="/shop"
              className="hero-btn"
            >
              Shop Now
            </Link>

            <Link
              to="/about"
              className="hero-outline-btn"
            >
              Learn More
            </Link>

          </div>

        </div>

      </section>

      {/* Statistics */}

      <section className="stats-section">

        <div className="stat-card">
          <h2>10K+</h2>
          <p>Happy Customers</p>
        </div>

        <div className="stat-card">
          <h2>500+</h2>
          <p>Products</p>
        </div>

        <div className="stat-card">
          <h2>99%</h2>
          <p>Positive Reviews</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>Support</p>
        </div>

      </section>

      {/* Features */}

      <section className="features-section">

        <h2>Why Choose ShopNest?</h2>

        <p className="section-description">
          Everything you need for a premium online shopping experience.
        </p>

        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">🚚</div>

            <h3>Fast Delivery</h3>

            <p>
              Get your orders delivered quickly with trusted logistics.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">🔒</div>

            <h3>Secure Payments</h3>

            <p>
              Safe and encrypted payment gateway for every purchase.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">⭐</div>

            <h3>Premium Quality</h3>

            <p>
              Carefully selected products from trusted brands.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">💬</div>

            <h3>24/7 Support</h3>

            <p>
              Friendly customer support whenever you need help.
            </p>

          </div>

        </div>

      </section>

      {/* Featured Products */}

      <section className="featured-products">

        <div className="section-heading">

          <h2>Featured Products</h2>

          <Link
            to="/shop"
            className="view-all"
          >
            View All →
          </Link>

        </div>

        {loading ? (

          <div className="loading">

            <div className="loader"></div>

            <p>Loading Products...</p>

          </div>

        ) : (

          <div className="product-grid">

            {products.length > 0 ? (

              products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))

            ) : (

              <p className="empty-products">
                No products available.
              </p>

            )}

          </div>

        )}

      </section>

      {/* CTA */}

      <section className="cta-section">

        <h2>
          Ready to Elevate Your Shopping Experience?
        </h2>

        <p>
          Join thousands of satisfied customers and explore our latest
          collections today.
        </p>

        <Link
          to="/shop"
          className="cta-btn"
        >
          Explore Collection
        </Link>

      </section>

    </div>
  );
};

export default Home;