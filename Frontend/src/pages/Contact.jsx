import React from "react";
import "../styles/Contact.css";

const Contact = () => {
  return (
    <section className="contact">

      <div className="contact-container">

        <div className="contact-header">
          <h1>Contact Us</h1>

          <p>
            We'd love to hear from you. Whether you have a question about an
            order, products, payments, or anything else, our team is ready to
            help.
          </p>
        </div>

        <div className="contact-content">

          {/* Contact Info */}

          <div className="contact-info">

            <div className="info-card">
              <div className="icon">📍</div>
              <h3>Our Office</h3>
              <p>
                ShopNest Headquarters
                <br />
                Agra, Uttar Pradesh
                <br />
                India
              </p>
            </div>

            <div className="info-card">
              <div className="icon">📧</div>
              <h3>Email</h3>
              <p>support@shopnest.com</p>
            </div>

            <div className="info-card">
              <div className="icon">📞</div>
              <h3>Phone</h3>
              <p>+91 9876543210</p>
            </div>

            <div className="info-card">
              <div className="icon">🕒</div>
              <h3>Working Hours</h3>
              <p>
                Monday - Saturday
                <br />
                9:00 AM - 7:00 PM
              </p>
            </div>

          </div>

          {/* Contact Form */}

          <div className="contact-form">

            <h2>Send us a Message</h2>

            <form>

              <input
                type="text"
                placeholder="Your Name"
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                required
              />

              <input
                type="text"
                placeholder="Subject"
                required
              />

              <textarea
                rows="6"
                placeholder="Write your message..."
                required
              ></textarea>

              <button type="submit">
                Send Message
              </button>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Contact;