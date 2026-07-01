import React from "react";
import "../styles/About.css";

const About = () => {
  return (
    <section className="about">
      <div className="about-container">

        <div className="about-header">
          <h1>About ShopNest</h1>
          <p>
            Welcome to <span>ShopNest</span>, your trusted online shopping
            destination. We bring you premium products, secure payments, fast
            delivery, and an exceptional shopping experience.
          </p>
        </div>

        <div className="about-grid">

          <div className="about-card">
            <div className="about-icon">🛍️</div>
            <h3>Wide Product Range</h3>
            <p>
              Browse electronics, fashion, accessories, home essentials and
              much more from trusted brands.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>
              Quick shipping with real-time order tracking and reliable
              doorstep delivery across the country.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">🔒</div>
            <h3>Secure Payments</h3>
            <p>
              Multiple payment methods with industry-standard encryption for a
              safe checkout experience.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">⭐</div>
            <h3>Premium Quality</h3>
            <p>
              Every product is quality checked to ensure customer satisfaction
              and long-lasting value.
            </p>
          </div>

        </div>

        <div className="about-story">

          <h2>Our Story</h2>

          <p>
            ShopNest was created with a simple mission — to make online shopping
            easy, secure, and enjoyable for everyone. We combine modern
            technology with excellent customer service to provide a seamless
            shopping journey.
          </p>

          <p>
            Whether you're buying the latest gadgets or everyday essentials, our
            goal is to offer the best prices, authentic products, and a smooth
            shopping experience from start to finish.
          </p>

        </div>

        <div className="about-stats">

          <div className="stat">
            <h2>10K+</h2>
            <p>Happy Customers</p>
          </div>

          <div className="stat">
            <h2>500+</h2>
            <p>Premium Products</p>
          </div>

          <div className="stat">
            <h2>99%</h2>
            <p>Positive Reviews</p>
          </div>

          <div className="stat">
            <h2>24/7</h2>
            <p>Customer Support</p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;