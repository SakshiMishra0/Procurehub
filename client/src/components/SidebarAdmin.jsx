import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react"; // Icon library (install: `npm install lucide-react`)

const SidebarAdmin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = (path) =>
    `block px-4 py-2 rounded hover:bg-gray-800 ${
      location.pathname === path ? "bg-gray-800 font-semibold" : ""
    }`;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } min-h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          {isOpen && <h1 className="text-xl font-bold">Admin</h1>}
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
            {isOpen ? "Dashboard" : "D"}
          </Link>
          <Link to="/admin/approve" className={linkClass("/admin/approve")}>
            {isOpen ? "Approve Users" : "A"}
          </Link>
          <Link to="/admin/requests" className={linkClass("/admin/requests")}>
            {isOpen ? "Requests" : "R"}
          </Link>
          <Link to="/admin/quotes" className={linkClass("/admin/quotes")}>
            {isOpen ? "Quotes" : "Q"}
          </Link>
          <Link to="/admin/bills" className={linkClass("/admin/bills")}>
            {isOpen ? "Bills" : "B"}
          </Link>
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-white"
          >
            {isOpen ? "Logout" : "⎋"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
