import React from "react";
import "../styles/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <section className="privacy">

      <div className="privacy-container">

        <div className="privacy-header">
          <h1>Privacy Policy</h1>

          <p>
            Your privacy is important to us. This Privacy Policy explains how
            ShopNest collects, uses, stores, and protects your personal
            information when you use our website.
          </p>
        </div>

        <div className="privacy-card">

          <h2>1. Information We Collect</h2>

          <p>
            We may collect personal information such as your name, email
            address, phone number, shipping address, payment information, and
            account credentials when you create an account or place an order.
          </p>

          <h2>2. How We Use Your Information</h2>

          <p>
            Your information is used to process orders, provide customer
            support, improve our services, personalize your shopping
            experience, send important updates, and prevent fraudulent
            activities.
          </p>

          <h2>3. Payment Security</h2>

          <p>
            All online payments are processed through trusted payment gateways.
            ShopNest does not store your debit card, credit card, or banking
            credentials on our servers.
          </p>

          <h2>4. Cookies</h2>

          <p>
            We use cookies to improve website performance, remember user
            preferences, analyze website traffic, and provide a better shopping
            experience.
          </p>

          <h2>5. Sharing of Information</h2>

          <p>
            We never sell your personal information. Your data may only be
            shared with trusted partners such as payment providers, shipping
            companies, or legal authorities when required by law.
          </p>

          <h2>6. Data Security</h2>

          <p>
            We implement industry-standard security practices including secure
            authentication, encrypted communication, and protected databases to
            safeguard your personal information.
          </p>

          <h2>7. Your Rights</h2>

          <p>
            You have the right to access, update, or request deletion of your
            personal information. You may also unsubscribe from promotional
            emails at any time.
          </p>

          <h2>8. Third-Party Services</h2>

          <p>
            ShopNest may contain links to third-party websites or services. We
            are not responsible for the privacy practices or content of those
            external websites.
          </p>

          <h2>9. Changes to this Policy</h2>

          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be published on this page along with the updated effective
            date.
          </p>

          <h2>10. Contact Us</h2>

          <p>
            If you have any questions regarding this Privacy Policy, please
            contact us at:
          </p>

          <div className="privacy-contact">

            <p><strong>Email:</strong> support@shopnest.com</p>

            <p><strong>Phone:</strong> +91 9876543210</p>

            <p><strong>Address:</strong> Agra, Uttar Pradesh, India</p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default PrivacyPolicy;