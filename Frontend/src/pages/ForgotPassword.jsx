import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/Auth.css";

const ForgotPassword = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const sendForgotPasswordOtp = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to send OTP.");
        return;
      }

      setMessage(data.message || "OTP sent successfully.");
      setStep("otp");
    } catch (forgotError) {
      console.error(forgotError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyForgotPasswordOtp = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password/verify-otp", {
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

      setResetToken(data.resetToken);
      setMessage(data.message || "OTP verified successfully.");
      setStep("reset");
    } catch (verifyError) {
      console.error(verifyError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify({
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to reset password.");
        return;
      }

      navigate("/login", {
        replace: true,
        state: {
          message: data.message || "Password reset successfully. Please login.",
        },
      });
    } catch (resetError) {
      console.error(resetError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formHandler =
    step === "email"
      ? sendForgotPasswordOtp
      : step === "otp"
        ? verifyForgotPasswordOtp
        : resetPassword;

  return (
    <div className="auth-container">
      <form onSubmit={formHandler} className="auth-form auth-form-wide">
        <span className="auth-kicker">Account recovery</span>
        <h1>Reset Password</h1>

        <div className="auth-progress" aria-label="Password reset progress">
          <span className={step === "email" ? "active" : ""}>Email</span>
          <span className={step === "otp" ? "active" : ""}>OTP</span>
          <span className={step === "reset" ? "active" : ""}>Password</span>
        </div>

        {error && <div className="auth-message auth-error">{error}</div>}
        {message && <div className="auth-message auth-success">{message}</div>}

        {(step === "email" || step === "otp") && (
          <label className="auth-field">
            <span>Email Address</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading || step === "otp"}
            />
          </label>
        )}

        {step === "otp" && (
          <label className="auth-field">
            <span>Forgot Password OTP</span>
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
        )}

        {step === "reset" && (
          <>
            <label className="auth-field">
              <span>New Password</span>
              <input
                type="password"
                minLength="8"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                disabled={isLoading}
              />
            </label>

            <label className="auth-field">
              <span>Confirm Password</span>
              <input
                type="password"
                minLength="8"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                disabled={isLoading}
              />
            </label>
          </>
        )}

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading
            ? "Please wait..."
            : step === "email"
              ? "Send OTP"
              : step === "otp"
                ? "Verify OTP"
                : "Reset Password"}
        </button>

        {step === "otp" && (
          <button
            type="button"
            className="auth-link-button"
            onClick={() => {
              setStep("email");
              setOtp("");
              setMessage("");
            }}
            disabled={isLoading}
          >
            Change email address
          </button>
        )}

        <p>
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
