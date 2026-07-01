import React from "react";
import "../styles/Disclaimer.css";

const Disclaimer = () => {
  return (
    <section className="disclaimer">
      <div className="disclaimer-container">

        <div className="disclaimer-header">
          <h1>Disclaimer</h1>
          <p>
            Please read this disclaimer carefully before using ShopNest.
          </p>
        </div>

        <div className="disclaimer-card">

          <h2>General Information</h2>
          <p>
            The information provided on ShopNest is for general informational
            and shopping purposes only. While we strive to ensure that all
            product descriptions, pricing, images, and specifications are
            accurate, occasional errors may occur.
          </p>

          <h2>Product Availability</h2>
          <p>
            Products displayed on ShopNest are subject to availability. We
            reserve the right to discontinue, modify, or update products and
            prices without prior notice.
          </p>

          <h2>Pricing Disclaimer</h2>
          <p>
            Prices displayed on the website may change without notice due to
            market fluctuations, promotional offers, or technical issues. We
            reserve the right to cancel orders placed with incorrect pricing.
          </p>

          <h2>External Links</h2>
          <p>
            ShopNest may contain links to third-party websites for payment,
            shipping, or other services. We are not responsible for the
            accuracy, privacy practices, or content of those websites.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            ShopNest shall not be liable for any direct, indirect, incidental,
            or consequential damages arising from the use of this website,
            delayed deliveries, payment failures, or product availability.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All trademarks, logos, images, content, and designs displayed on
            ShopNest are the property of their respective owners and may not be
            copied, reproduced, or distributed without permission.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions regarding this disclaimer, please contact
            our support team at <strong>support@shopnest.com</strong>.
          </p>

        </div>

      </div>
    </section>
  );
};

export default Disclaimer;