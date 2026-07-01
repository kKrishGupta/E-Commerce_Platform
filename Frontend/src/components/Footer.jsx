import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-section">
          <h2 className="footer-logo">🛒 ShopNest</h2>

          <p>
            ShopNest is your trusted online shopping destination offering
            premium quality products with secure payments and fast delivery.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3>Support</h3>

          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>

          <p>
            <FaEnvelope /> support@shopnest.com
          </p>

          <p>
            <FaPhoneAlt /> +91 98765 43210
          </p>

          <p>
            <FaMapMarkerAlt /> Agra, Uttar Pradesh, India
          </p>

          <div className="social-icons">
            <a href="#">
              <FaFacebook />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaLinkedin />
            </a>

            <a href="#">
              <FaGithub />
            </a>
          </div>
        </div>

      </div>

      <hr />

      <div className="footer-bottom">
        © {new Date().getFullYear()} <strong>ShopNest</strong>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;