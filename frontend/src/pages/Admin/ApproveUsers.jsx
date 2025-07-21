import { useEffect, useState } from "react";
import axios from "../../utils/api";

const ApproveUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState("customers");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPending = async () => {
    try {
      const res = await axios.get("/auth/pending");
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch pending users:", err);
    }
  };

  const approve = async (id) => {
    try {
      await axios.put(`/auth/approve/${id}`);
      fetchPending();
    } catch (err) {
      alert("❌ Failed to approve user.");
    }
  };

  const reject = async (id) => {
    if (window.confirm("Are you sure you want to reject this user?")) {
      try {
        await axios.delete(`/auth/reject/${id}`);
        fetchPending();
      } catch (err) {
        alert("❌ Failed to reject user.");
      }
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // Count users by role
  const customerCount = users.filter((u) => u.role === "customer").length;
  const vendorCount = users.filter((u) => u.role === "vendor").length;

  // Filtered users for selected tab and search query
  const filteredUsers = users
    .filter((u) => u.role === selectedTab.slice(0, -1)) // remove 's' to match 'customer' or 'vendor'
    .filter((u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.organization?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="p-6">
      <h2 className="text-black font-bold text-2xl mb-6">Approve New Users</h2>

      {/* Tabs */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => {
            setSelectedTab("customers");
            setSearchQuery("");
          }}
          className={`relative px-4 py-2 rounded transition ${
            selectedTab === "customers"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Customers
          {customerCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
              {customerCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setSelectedTab("vendors");
            setSearchQuery("");
          }}
          className={`relative px-4 py-2 rounded transition ${
            selectedTab === "vendors"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Vendors
          {vendorCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
              {vendorCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder={`Search ${selectedTab} by name, email or organization...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 px-4 py-2 w-full md:w-1/2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* No Users Message */}
      {filteredUsers.length === 0 && (
        <p className="text-gray-600">No matching {selectedTab} found.</p>
      )}

      {/* User Cards */}
      {filteredUsers.map((u) => (
        <div
          key={u._id}
          className="mb-6 p-4 border rounded shadow-sm bg-white text-black flex flex-col lg:flex-row lg:items-start gap-6"
        >
          {/* User Info */}
          <div className="flex-1 space-y-2">
            <p><strong>Name:</strong> {u.name}</p>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Role:</strong> {u.role}</p>
            {u.phone && <p><strong>Phone:</strong> {u.phone}</p>}
            {u.gstin && <p><strong>GSTIN:</strong> {u.gstin}</p>}
            {u.organization && <p><strong>Organization:</strong> {u.organization}</p>}
            {u.shippingAddress && <p><strong>Shipping Address:</strong> {u.shippingAddress}</p>}
            {u.permanentAddress && <p><strong>Permanent Address:</strong> {u.permanentAddress}</p>}
            {u.note && <p><strong>Note:</strong> {u.note}</p>}
          </div>

          {/* Vendor Items */}
          {u.role === "vendor" && u.vendorItems?.length > 0 && (
            <div className="flex-1">
              <strong>Vendor Items:</strong>
              <ul className="list-disc pl-5 mt-1">
                {u.vendorItems.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.name}</strong>: {item.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col justify-start gap-2">
            <button
              onClick={() => approve(u._id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => reject(u._id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApproveUsers;

