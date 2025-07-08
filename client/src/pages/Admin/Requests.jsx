import { useEffect, useState } from "react";
import axios from "../../utils/api";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios.get("/requests/all").then((res) => setRequests(res.data));
  }, []);

  const publish = async (id) => {
    try {
      await axios.put(`/requests/publish/${id}`);
      alert("✅ Request published!");
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "published" } : r))
      );
    } catch (err) {
      console.error("❌ Publish error:", err);
      alert("Failed to publish request.");
    }
  };

  const approve = async (id) => {
    try {
      await axios.put(`/requests/approve/${id}`);
      alert("✅ Request approved!");
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "approved" } : r))
      );
    } catch (err) {
      console.error("❌ Approve error:", err);
      alert("Failed to approve request.");
    }
  };

  const reject = async (id) => {
    try {
      await axios.put(`/requests/reject/${id}`);
      alert("❌ Request rejected!");
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "rejected" } : r))
      );
    } catch (err) {
      console.error("❌ Reject error:", err);
      alert("Failed to reject request.");
    }
  };

  return (
    <div
      className="min-h-screen p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100"
      style={{
        backgroundSize: "400% 400%",
        animation: "gradientMove 15s ease infinite",
      }}
    >
      <h2 className="text-center text-3xl font-bold mb-8 text-indigo-800">
        Manage All Requests
      </h2>

      <div className="space-y-5 max-w-5xl mx-auto">
        {requests.map((r, i) => (
          <motion.div
            key={r._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Request ID: <span className="text-blue-600">{r.requestId}</span>
              </h3>
              <span
                className={`px-3 py-1 rounded text-sm font-semibold ${
                  r.status === "draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : r.status === "pending"
                    ? "bg-orange-100 text-orange-800"
                    : r.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : r.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {r.status.toUpperCase()}
              </span>
            </div>

            <p className="text-sm mb-2 text-gray-600">
              <strong>Customer:</strong> {r.customer?.email || "Unknown"}
            </p>

            <ul className="text-sm list-disc list-inside text-gray-700 mb-3">
              {r.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} — Qty:{" "}
                  <span className="font-medium">{item.quantity}</span>
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            {user?.role === "cooperative" && (
              <div className="mt-4 flex gap-3 flex-wrap">
                {r.status === "draft" && (
                  <button
                    onClick={() => publish(r._id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                  >
                    📢 Publish to Vendors
                  </button>
                )}
                {r.status === "pending" && (
                  <>
                    <button
                      onClick={() => approve(r._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => reject(r._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      ❌ Reject
                    </button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Animated gradient effect */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default ManageRequests;
