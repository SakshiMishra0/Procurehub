import { useEffect, useState } from "react";
import axios from "../../utils/api";

const ApprovedUsers = () => {
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedTab, setSelectedTab] = useState("customers");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchApproved = async () => {
    try {
      const res = await axios.get("/auth/approved");
      const all = res.data || [];

      // Categorize based on role
      const customersList = all.filter((u) => u.role === "customer");
      const vendorsList = all.filter((u) => u.role === "vendor");

      setCustomers(customersList);
      setVendors(vendorsList);
    } catch (error) {
      console.error("❌ Failed to fetch approved users:", error);
    }
  };

  useEffect(() => {
    fetchApproved();
  }, []);

  const getFilteredUsers = () => {
    const users = selectedTab === "customers" ? customers : vendors;
    return users.filter((u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.organization?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="p-6">
      <h2 className="text-black font-bold text-2xl mb-6">Approved Users</h2>

      {/* Tabs */}
      <div className="mb-4 flex gap-4">
        {["customers", "vendors"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setSelectedTab(tab);
              setSearchQuery("");
            }}
            className={`px-4 py-2 rounded ${
              selectedTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder={`Search ${selectedTab} by name, email or organization...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 px-4 py-2 w-full md:w-1/2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* No users */}
      {filteredUsers.length === 0 ? (
        <p className="text-gray-600">No matching {selectedTab} found.</p>
      ) : (
        filteredUsers.map((u) => (
          <div
            key={u._id}
            className="mb-6 p-4 border rounded shadow-sm bg-white text-black flex flex-col lg:flex-row lg:items-start gap-6"
          >
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
          </div>
        ))
      )}
    </div>
  );
};

export default ApprovedUsers;
