import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
      {/* Brand */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold">
          ProcureHub
        </Link>
        {!user && (
          <>
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/about" className="hover:underline">
              About
            </Link>
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
          </>
        )}
      </div>

      {/* Authenticated Links */}
      <div className="space-x-4 flex items-center">
        {!user ? (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        ) : (
          <>
            {user.role === "cooperative" && (
              <>
                <Link to="/admin/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <Link to="/admin/approve" className="hover:underline">
                  Approve
                </Link>
                <Link to="/admin/requests" className="hover:underline">
                  Requests
                </Link>
                <Link to="/admin/quotes" className="hover:underline">
                  Quotes
                </Link>
                <Link to="/admin/bills" className="hover:underline">
                  Bills
                </Link>
              </>
            )}
            {user.role === "customer" && (
              <>
                <Link to="/customer/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <Link to="/customer/create-request" className="hover:underline">
                  New Request
                </Link>
                <Link to="/customer/requests" className="hover:underline">
                  My Requests
                </Link>
                <Link to="/customer/quotes" className="hover:underline">
                  Quotes
                </Link>
                <Link to="/customer/bills" className="hover:underline">
                  Bills
                </Link>
              </>
            )}
            {user.role === "vendor" && (
              <>
                <Link to="/vendor/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <Link to="/vendor/requests" className="hover:underline">
                  Available
                </Link>
                <Link to="/vendor/quotes" className="hover:underline">
                  My Quotes
                </Link>
                <Link to="/vendor/bills" className="hover:underline">
                  Bills
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
