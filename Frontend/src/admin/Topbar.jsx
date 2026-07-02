import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaBars, FaMoon, FaSearch, FaSignOutAlt } from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";

const Topbar = ({ title, subtitle, onMenuClick }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="admin-topbar">
      <button className="admin-menu-btn" type="button" onClick={onMenuClick} aria-label="Open admin menu">
        <FaBars />
      </button>

      <div className="admin-topbar-heading">
        <span className="admin-kicker">Admin Workspace</span>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="admin-topbar-actions">
        <label className="admin-search">
          <FaSearch />
          <input type="search" placeholder="Search admin..." />
        </label>

        <button type="button" aria-label="Toggle dark mode">
          <FaMoon />
        </button>

        <button type="button" aria-label="Notifications">
          <FaBell />
        </button>

        <div className="admin-user-pill">
          <span>{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
          <div>
            <strong>{user?.name || "Admin"}</strong>
            <small>{user?.role || "admin"}</small>
          </div>
        </div>

        <button type="button" onClick={handleLogout} aria-label="Logout">
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
