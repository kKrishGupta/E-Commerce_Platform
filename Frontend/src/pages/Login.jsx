import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import "../styles/Auth.css";

const getRedirectPath = (user, requestedPath) => {
  if (user?.role === "admin") {
    return requestedPath || "/admin";
  }

  if (requestedPath && !requestedPath.startsWith("/admin")) {
    return requestedPath;
  }

  return "/";
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const requestedPath = location.state?.from;

  const [mode, setMode] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");

  const completeLogin = (data) => {
    login(data.user, data.token);
    setEmail("");
    setPassword("");
    setOtp("");
    navigate(getRedirectPath(data.user, requestedPath), { replace: true });
  };

  const submitPasswordLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      completeLogin(data);
    } catch (loginError) {
      console.error(loginError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendLoginOtp = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/login/send-otp", {
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

      setOtpSent(true);
      setMessage(data.message || "OTP sent successfully.");
    } catch (otpError) {
      console.error(otpError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyLoginOtp = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/login/verify-otp", {
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

      completeLogin(data);
    } catch (otpError) {
      console.error(otpError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setMessage("");
    setOtp("");
    setOtpSent(false);
  };

  return (
    <div className="auth-container">
      <form
        onSubmit={
          mode === "password" ? submitPasswordLogin : otpSent ? verifyLoginOtp : sendLoginOtp
        }
        className="auth-form auth-form-wide"
      >
        <span className="auth-kicker">Welcome back</span>
        <h1>Login To ShopNest</h1>

        <div className="auth-toggle" role="tablist" aria-label="Login method">
          <button
            type="button"
            className={mode === "password" ? "active" : ""}
            onClick={() => switchMode("password")}
          >
            Password
          </button>
          <button
            type="button"
            className={mode === "otp" ? "active" : ""}
            onClick={() => switchMode("otp")}
          >
            OTP
          </button>
        </div>

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
            disabled={isLoading || (mode === "otp" && otpSent)}
          />
        </label>

        {mode === "password" ? (
          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isLoading}
            />
          </label>
        ) : (
          otpSent && (
            <label className="auth-field">
              <span>Login OTP</span>
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
          )
        )}

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading
            ? "Please wait..."
            : mode === "password"
              ? "Login"
              : otpSent
                ? "Verify OTP"
                : "Send Login OTP"}
        </button>

        {mode === "otp" && otpSent && (
          <button
            type="button"
            className="auth-link-button"
            onClick={() => {
              setOtpSent(false);
              setOtp("");
              setMessage("");
            }}
            disabled={isLoading}
          >
            Change email address
          </button>
        )}

        <p>
          Do not have an account? <Link to="/register">Register</Link>
        </p>

        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
