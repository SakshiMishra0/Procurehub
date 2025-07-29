import { useEffect, useState } from "react";
import axios from "../../utils/api";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const ManageRequests = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("received");
  const { user } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const [receivedRes, publishedSplitsRes] = await Promise.all([
           axios.get("/requests/customer-requests"),
           axios.get("/requests/published-splits"),
           ]);
        setReceivedRequests(receivedRes.data);
        setSentRequests(publishedSplitsRes.data);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, action) => {
    try {
      await axios.put(`/requests/${action}/${id}`);
      alert(`✅ Request ${action}ed!`);
      setReceivedRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: action === "approve" ? "approved" : action === "reject" ? "rejected" : "published" } : r))
      );
    } catch (err) {
      console.error(`❌ ${action} error:`, err);
      alert(`Failed to ${action} request.`);
    }
  };

   const handleQuoteUpload = async (e, requestId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("quote", file);
    formData.append("requestId", requestId);

    try {
      await axios.post(`/requests/admin/upload-quote/${requestId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Quote uploaded successfully!");
      setReceivedRequests((prev) =>
        prev.map((r) =>
          r._id === requestId ? { ...r, adminQuoteFile: file.name } : r
        )
      );
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Failed to upload quote.");
    }
  };

  const currentRequests = activeTab === "received" ? receivedRequests : sentRequests;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 animate-gradientMove">
      <h2 className="text-center text-3xl font-bold mb-6 text-indigo-800">
        Manage Requests
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab("received")}
          className={`px-6 py-2 font-semibold rounded-full transition ${
            activeTab === "received"
              ? "bg-indigo-600 text-white"
              : "bg-white text-indigo-700 border border-indigo-400"
          }`}
        >
          📥 Received Requests
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-6 py-2 font-semibold rounded-full transition ${
            activeTab === "sent"
              ? "bg-green-600 text-white"
              : "bg-white text-green-700 border border-green-400"
          }`}
        >
          📤 Sent to Vendors
        </button>
      </div>

      {/* Requests */}
      <div className="space-y-5 max-w-5xl mx-auto">
        {currentRequests.length === 0 ? (
          <p className="text-center text-gray-500">
            No {activeTab === "received" ? "customer" : "vendor"} requests found.
          </p>
        ) : (
          currentRequests.map((r, i) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Request ID:{""} <span className="text-blue-600">{r.requestId}</span>
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
                <strong>Requester:</strong> {r.customer?.email || "Unknown"}
              </p>

              <ul className="text-sm list-disc list-inside text-gray-700 mb-3">
                {r.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} — Qty:{""} <span className="font-medium">{item.quantity}</span>
                  </li>
                ))}
              </ul>

              {/* Action Buttons */}
              {user?.role === "cooperative" && activeTab === "received" && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {r.status === "draft" && (
                    <button
                      onClick={() => handleStatusUpdate(r._id, "publish")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                    >
                      📢 Publish to Vendors
                    </button>
                  )}
                  {r.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(r._id, "approve")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(r._id, "reject")}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}



                 {r.status === "published" && !r.adminQuoteFile && (
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">
                        Upload Admin Quote:
                      </label>
                      <input
                        type="file"
                        // accept=".pdf,.doc,.docx,.jpg,.png"
                        onChange={(e) => handleQuoteUpload(e, r._id)}
                        className="border px-3 py-1 rounded text-sm"
                      />
                    </div>
                  )}

                 
                  {r.status === "published" && r.adminQuoteFile && (
                    <a
                      href={`http://localhost:5000/uploads/${r.adminQuoteFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm mt-2"
                    >
                      📄 Download Uploaded Quote
                    </a>
                  )}

                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradientMove {
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default ManageRequests;
