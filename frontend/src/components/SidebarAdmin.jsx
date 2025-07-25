import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/api";
import {
  Menu,
  X,
  LayoutDashboard,
  UserCheck,
  ClipboardList,
  Quote,
  FileText,
  LogOut,
  Users,
} from "lucide-react";

const SidebarAdmin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = (path) =>
    `block px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200 ${
      location.pathname === path ? "bg-gray-800 font-semibold" : ""
    }`;

  // ✅ Fetch number of pending users
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get("/auth/pending");
        setPendingCount(res.data.length);
      } catch (error) {
        console.error("Error fetching pending users:", error);
      }
    };

    fetchPending();
  }, []);

  return (
    <div className="flex">
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } min-h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          {isOpen && <h1 className="text-xl font-bold">Admin</h1>}
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link
            to="/admin/dashboard"
            className={linkClass("/admin/dashboard")}
            title={!isOpen ? "Dashboard" : ""}
          >
            <div className="flex items-center space-x-2">
              <LayoutDashboard size={18} />
              {isOpen && <span>Dashboard</span>}
            </div>
          </Link>

          <Link
            to="/admin/approve"
            className={linkClass("/admin/approve")}
            title={!isOpen ? "Approve Users" : ""}
          >
            <div className="flex items-center space-x-2 relative">
              <UserCheck size={18} />
              {isOpen && <span>Approve Users</span>}

              {/* ✅ Badge for pending users */}
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-xs rounded-full px-1.5 py-0.5 font-semibold">
                  {pendingCount}
                </span>
              )}
            </div>
          </Link>

          {/* ✅ No badge on Approved Users */}
          <Link
            to="/admin/approved-users"
            className={linkClass("/admin/approved-users")}
            title={!isOpen ? "Approved Users" : ""}
          >
            <div className="flex items-center space-x-2">
              <Users size={18} />
              {isOpen && <span>Approved Users</span>}
            </div>
          </Link>

          <Link
            to="/admin/requests"
            className={linkClass("/admin/requests")}
            title={!isOpen ? "Requests" : ""}
          >
            <div className="flex items-center space-x-2">
              <ClipboardList size={18} />
              {isOpen && <span>Requests</span>}
            </div>
          </Link>

          <Link
            to="/admin/quotes"
            className={linkClass("/admin/quotes")}
            title={!isOpen ? "Quotes" : ""}
          >
            <div className="flex items-center space-x-2">
              <Quote size={18} />
              {isOpen && <span>Quotes</span>}
            </div>
          </Link>

          <Link
            to="/admin/bills"
            className={linkClass("/admin/bills")}
            title={!isOpen ? "Bills" : ""}
          >
            <div className="flex items-center space-x-2">
              <FileText size={18} />
              {isOpen && <span>Bills</span>}
            </div>
          </Link>
        </nav>

        {/* Sidebar Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-white flex items-center justify-center space-x-2"
            title={!isOpen ? "Logout" : ""}
          >
            <LogOut size={18} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
