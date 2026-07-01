import React from "react";
import "../styles/Term.css";

const Terms = () => {
  return (
    <section className="terms">

      <div className="terms-container">

        <div className="terms-header">
          <h1>Terms & Conditions</h1>

          <p>
            Welcome to ShopNest. By accessing or using our website, you agree
            to comply with and be bound by the following Terms and Conditions.
            Please read them carefully before using our services.
          </p>
        </div>

        <div className="terms-card">

          <h2>1. Acceptance of Terms</h2>

          <p>
            By creating an account, browsing our website, or placing an order,
            you acknowledge that you have read, understood, and agreed to these
            Terms & Conditions.
          </p>

          <h2>2. User Accounts</h2>

          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. Please notify us immediately if you suspect unauthorized
            access.
          </p>

          <h2>3. Products & Pricing</h2>

          <p>
            ShopNest strives to provide accurate product descriptions, pricing,
            and availability. However, errors may occasionally occur. We reserve
            the right to correct such errors and cancel orders if necessary.
          </p>

          <h2>4. Orders & Payments</h2>

          <p>
            Orders are confirmed only after successful payment verification.
            ShopNest reserves the right to refuse or cancel any order suspected
            of fraudulent activity.
          </p>

          <h2>5. Shipping & Delivery</h2>

          <p>
            Estimated delivery dates are provided for convenience. Delays may
            occur due to weather conditions, logistics, or unforeseen
            circumstances beyond our control.
          </p>

          <h2>6. Returns & Refunds</h2>

          <p>
            Returns and refunds are governed by our Return Policy. Products must
            meet the eligibility criteria before refunds or exchanges are
            approved.
          </p>

          <h2>7. Intellectual Property</h2>

          <p>
            All content available on ShopNest, including logos, images, product
            descriptions, graphics, and software, is protected by intellectual
            property laws and may not be copied or distributed without written
            permission.
          </p>

          <h2>8. Prohibited Activities</h2>

          <ul>
            <li>Using the website for unlawful purposes.</li>
            <li>Attempting to hack or disrupt website services.</li>
            <li>Uploading malicious software or harmful code.</li>
            <li>Providing false or misleading account information.</li>
            <li>Violating any applicable laws or regulations.</li>
          </ul>

          <h2>9. Limitation of Liability</h2>

          <p>
            ShopNest shall not be liable for indirect, incidental, or
            consequential damages resulting from the use or inability to use our
            website or services.
          </p>

          <h2>10. Privacy</h2>

          <p>
            Your personal information is handled according to our Privacy
            Policy. By using ShopNest, you consent to the collection and use of
            your information as described therein.
          </p>

          <h2>11. Changes to Terms</h2>

          <p>
            We reserve the right to update these Terms & Conditions at any time.
            Changes become effective immediately upon posting on this page.
          </p>

          <h2>12. Contact Information</h2>

          <div className="terms-contact">

            <p><strong>Email:</strong> support@shopnest.com</p>

            <p><strong>Phone:</strong> +91 9876543210</p>

            <p><strong>Address:</strong> Agra, Uttar Pradesh, India</p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Terms;