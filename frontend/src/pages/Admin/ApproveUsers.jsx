import { useEffect, useState } from "react";
import axios from "../../utils/api";

const ApproveUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState("customers"); // "vendors" or "customers"

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

  const filteredUsers = users.filter((u) =>
    selectedTab === "customers" ? u.role === "customer" : u.role === "vendor"
  );

  return (
    <div className="p-6">
      <h2 className="text-black font-bold text-2xl mb-6">Approve New Users</h2>

      {/* Tabs */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setSelectedTab("customers")}
          className={`px-4 py-2 rounded ${
            selectedTab === "customers"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Customers
        </button>
        <button
          onClick={() => setSelectedTab("vendors")}
          className={`px-4 py-2 rounded ${
            selectedTab === "vendors"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Vendors
        </button>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <p className="text-gray-600">No pending {selectedTab} found.</p>
      )}

      {/* User Cards */}
      {filteredUsers.map((u) => (
        <div
          key={u._id}
          className="mb-6 p-4 border rounded shadow-sm bg-white text-black flex flex-col lg:flex-row lg:items-start gap-6"
        >
          {/* LEFT: User info */}
          <div className="flex-1 space-y-2">
            <p><strong>Name:</strong> {u.name}</p>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Role:</strong> {u.role}</p>
            {u.phone && <p><strong>Phone:</strong> {u.phone}</p>}
            {u.gstin && <p><strong>GSTIN:</strong> {u.gstin}</p>}
            {u.shippingAddress && <p><strong>Shipping Address:</strong> {u.shippingAddress}</p>}
            {u.permanentAddress && <p><strong>Permanent Address:</strong> {u.permanentAddress}</p>}
            {u.organization && <p><strong>Organization:</strong> {u.organization}</p>}
            {u.note && <p><strong>Note:</strong> {u.note}</p>}
          </div>

          {/* MIDDLE: Vendor Items (only for vendor) */}
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

          {/* RIGHT: Buttons */}
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
