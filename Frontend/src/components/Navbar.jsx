import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/logo.png";
import {AuthContext} from  "../context/AuthContext.jsx";
import {useSelector} from "react-redux";

const Navbar = () => {
  const {user,logout} = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img
          src={logo}
          // alt="ShopNest Logo"
          className="Navbar-logo"
        />
        <span>ShopNest</span>
      </Link>

      <ul className="navbar-links">
        <li>
          <Link to="/shop">Shop</Link>
        </li>

        <li>
          <Link to="/cart">Cart<span className="cart-count">{cartItems.length}</span></Link>
        </li>
        {user ? (
  <>
    <li>
      <Link to="/profile">Hi, {user.name}</Link>
    </li>

    {user.role === "admin" && (
      <li>
        <Link to="/admin">Admin</Link>
      </li>
    )}

        <li>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </li>
      </>
    ) : (
      <li>
        <Link to="/login">Login</Link>
      </li>
    )}

      </ul>
    </nav>
  );
};

export default Navbar;
