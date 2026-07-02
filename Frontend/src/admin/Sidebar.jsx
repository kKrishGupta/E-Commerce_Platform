import { NavLink } from "react-router-dom";
import {
  FaBoxes,
  FaChartPie,
  FaClipboardList,
  FaCog,
  FaComments,
  FaFileInvoice,
  FaHome,
  FaPlusCircle,
  FaReceipt,
  FaUsers,
} from "react-icons/fa";

const links = [
  { to: "/admin", label: "Dashboard", icon: FaHome },
  { to: "/admin/products", label: "Products", icon: FaBoxes },
  { to: "/admin/add-product", label: "Add Product", icon: FaPlusCircle },
  { to: "/admin/orders", label: "Orders", icon: FaClipboardList },
  { to: "/admin/users", label: "Users", icon: FaUsers },
  { to: "/admin#payments", label: "Payments", icon: FaReceipt },
  { to: "/admin#reviews", label: "Reviews", icon: FaComments },
  { to: "/admin#reports", label: "Reports", icon: FaChartPie },
  { to: "/admin#settings", label: "Settings", icon: FaCog },
  { to: "/admin#invoices", label: "Invoices", icon: FaFileInvoice },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={isOpen ? "admin-sidebar open" : "admin-sidebar"}>
      <div className="admin-sidebar-brand">
        <span>SN</span>
        <div>
          <strong>ShopNest</strong>
          <small>Admin Console</small>
        </div>
      </div>

      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              to={link.to}
              key={link.label}
              onClick={onClose}
              className={({ isActive }) =>
                isActive && !link.to.includes("#") ? "active" : undefined
              }
            >
              <Icon />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
