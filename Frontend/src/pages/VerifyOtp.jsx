import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import "../styles/Auth.css";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const savedEmail = sessionStorage.getItem("pendingRegisterEmail") || "";

  const [email, setEmail] = useState(location.state?.email || savedEmail);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/register/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "OTP verification failed.");
        return;
      }

      sessionStorage.removeItem("pendingRegisterEmail");
      login(data.user, data.token);
      setMessage(data.message || "Email verified successfully.");
      navigate(data.user?.role === "admin" ? "/admin" : "/", { replace: true });
    } catch (verifyError) {
      console.error(verifyError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form auth-form-wide">
        <span className="auth-kicker">Email verification</span>
        <h1>Verify Your OTP</h1>

        {error && <div className="auth-message auth-error">{error}</div>}
        {message && <div className="auth-message auth-success">{message}</div>}

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
          <span>Registration OTP</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength="6"
            placeholder="Enter 6 digit OTP"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            required
            disabled={isLoading}
          />
        </label>

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        <p>
          Need a new OTP? <Link to="/register">Register again</Link>
        </p>
      </form>
    </div>
  );
};

export default VerifyOtp;
