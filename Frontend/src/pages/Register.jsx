import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import "../styles/Auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      sessionStorage.setItem("pendingRegisterEmail", email);
      setMessage(data.message || "OTP sent successfully. Please verify your email.");
      navigate("/register/verify-otp", {
        state: { email },
      });
    } catch (registerError) {
      console.error(registerError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form auth-form-wide">
        <span className="auth-kicker">Create account</span>
        <h1>Register With ShopNest</h1>

        {error && <div className="auth-message auth-error">{error}</div>}
        {message && <div className="auth-message auth-success">{message}</div>}

        <label className="auth-field">
          <span>Full Name</span>
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            disabled={isLoading}
          />
        </label>

        <label className="auth-field">
          <span>Email Address</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={isLoading}
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            minLength="8"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={isLoading}
          />
        </label>

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? "Sending OTP..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
