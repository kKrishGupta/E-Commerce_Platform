import { useContext } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import { isAdminUser } from "./adminApi";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdminUser(user)) {
    return (
      <main className="admin-access-denied">
        <div>
          <FaShieldAlt />
          <h1>Admin Access Required</h1>
          <p>Your current account is signed in, but it does not have admin privileges.</p>
          <Link to="/" className="admin-secondary-btn">
            Back To Store
          </Link>
        </div>
      </main>
    );
  }

  return children;
};

export default AdminProtectedRoute;
