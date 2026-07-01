import React from "react";
import "../styles/ReturnPolicy.css";

const ReturnPolicy = () => {
  return (
    <section className="return-policy">
      <div className="return-container">

        <div className="return-header">
          <h1>Return & Refund Policy</h1>
          <p>
            Your satisfaction is our priority. If you're not completely happy
            with your purchase, we're here to help.
          </p>
        </div>

        <div className="return-card">

          <h2>📦 Return Eligibility</h2>
          <p>
            Products can be returned within <strong>7 days</strong> of
            delivery if they are unused, undamaged, and returned in their
            original packaging along with all accessories and invoices.
          </p>

          <h2>❌ Non-Returnable Items</h2>
          <ul>
            <li>Perishable goods</li>
            <li>Gift cards</li>
            <li>Downloadable software</li>
            <li>Personal care products</li>
            <li>Products damaged due to misuse</li>
          </ul>

          <h2>💳 Refund Process</h2>
          <p>
            Once your returned product is received and inspected, we will
            notify you regarding the approval or rejection of your refund.
            Approved refunds are processed within <strong>5–7 business
            days</strong> to your original payment method.
          </p>

          <h2>🚚 Shipping Charges</h2>
          <p>
            Shipping charges are non-refundable unless the return is due to
            our mistake, such as receiving an incorrect or damaged item.
          </p>

          <h2>🔄 Exchanges</h2>
          <p>
            We replace items only if they are defective, damaged during
            delivery, or incorrect. Exchange requests must be submitted
            within 48 hours of delivery.
          </p>

          <h2>📧 Need Help?</h2>
          <p>
            For return requests or questions, contact our support team at
            <strong> support@shopnest.com</strong> or call
            <strong> +91-9876543210</strong>.
          </p>

        </div>

      </div>
    </section>
  );
};

export default ReturnPolicy;