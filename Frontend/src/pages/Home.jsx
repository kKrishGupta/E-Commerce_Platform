import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

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

        // If backend returns { products: [...] }
        setProducts(data.products.slice(0, 4));

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

      <section className="hero-banner">
        <h1>Welcome to ShopNest!</h1>

        <p>
          Your one-stop destination for premium shopping experience.
        </p>

        <Link to="/shop" className="hero-btn">
          Start Shopping
        </Link>
      </section>

      <section className="featured-products">

        <h2>Featured Products</h2>

        {loading ? (
          <div className="loading">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

      </section>

    </div>
  );
};

export default Home;