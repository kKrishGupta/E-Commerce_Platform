import { useState } from "react";

import AdminProtectedRoute from "./AdminProtectedRoute";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Admin.css";

const AdminLayout = ({ title, subtitle, children, actions }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminProtectedRoute>
      <div className="admin-shell">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="admin-main">
          <Topbar
            title={title}
            subtitle={subtitle}
            onMenuClick={() => setSidebarOpen((current) => !current)}
          />

          {actions && <div className="admin-page-actions">{actions}</div>}

          <div className="admin-content">{children}</div>
        </div>

        {sidebarOpen && (
          <button
            type="button"
            className="admin-sidebar-backdrop"
            aria-label="Close admin menu"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </AdminProtectedRoute>
  );
};

export default AdminLayout;
