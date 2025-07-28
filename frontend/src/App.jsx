import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SidebarAdmin from "./components/SidebarAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Landing
import Home from "./pages/Landing/Home";
import About from "./pages/Landing/About";
import Contact from "./pages/Landing/Contact";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Admin
import AdminDashboard from "./pages/Admin/Dashboard";
import ApproveUsers from "./pages/Admin/ApproveUsers";
import ApprovedUsers from "./pages/Admin/ApprovedUsers"; // ✅ Imported ApprovedUsers
import ManageRequests from "./pages/Admin/Requests";
import ManageQuotes from "./pages/Admin/Quotes";
import ManageBills from "./pages/Admin/Bills";


// Customer
import CustomerDashboard from "./pages/Customer/Dashboard";
import CreateRequest from "./pages/Customer/CreateRequest";
import MyRequests from "./pages/Customer/MyRequests";
import QuotesReceived from "./pages/Customer/QuotesReceived";
import CustomerBills from "./pages/Customer/Bills";

// Vendor
import VendorDashboard from "./pages/Vendor/Dashboard";
import AvailableRequests from "./pages/Vendor/AvailableRequests";
import SubmitQuote from "./pages/Vendor/SubmitQuote";
import MyQuotes from "./pages/Vendor/MyQuotes";
import VendorBills from "./pages/Vendor/Bills";

const AdminLayout = ({ children }) => (
  <div className="flex">
    <SidebarAdmin />
    <div className="flex-1 p-6">{children}</div>
  </div>
);

function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="cooperative">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />



        <Route
          path="/admin/approve"
          element={
            <ProtectedRoute role="cooperative">
              <AdminLayout>
                <ApproveUsers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/approved-users"
          element={
            <ProtectedRoute role="cooperative">
              <AdminLayout>
                <ApprovedUsers /> {/* ✅ Route added here */}
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute role="cooperative">
              <AdminLayout>
                <ManageRequests />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quotes"
          element={
            <ProtectedRoute role="cooperative">
              <AdminLayout>
                <ManageQuotes />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bills"
          element={
            <ProtectedRoute role="cooperative">
              <AdminLayout>
                <ManageBills />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Customer */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/create-request"
          element={
            <ProtectedRoute role="customer">
              <CreateRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/requests"
          element={
            <ProtectedRoute role="customer">
              <MyRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/quotes"
          element={
            <ProtectedRoute role="customer">
              <QuotesReceived />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/bills"
          element={
            <ProtectedRoute role="customer">
              <CustomerBills />
            </ProtectedRoute>
          }
        />

        {/* Vendor */}
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute role="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/requests"
          element={
            <ProtectedRoute role="vendor">
              <AvailableRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/submit-quote/:requestId"
          element={
            <ProtectedRoute role="vendor">
              <SubmitQuote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/quotes"
          element={
            <ProtectedRoute role="vendor">
              <MyQuotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/bills"
          element={
            <ProtectedRoute role="vendor">
              <VendorBills />
            </ProtectedRoute>
          }
        />
        

      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
