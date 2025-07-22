import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/api";

const AvailableRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const [publishedRes, quotesRes] = await Promise.all([
          axios.get("/requests/vendor-requests"),
          axios.get("/quotes/mine"),
        ]);

        const quotedIds = new Set(quotesRes.data.map(q => q.request));
        const available = publishedRes.data.filter(req => !quotedIds.has(req._id));

        setRequests(available);
      } catch (err) {
        console.error("❌ Failed to fetch available requests:", err);
        setError("Failed to load available requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const renderSkeleton = () =>
    Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="p-4 mb-4 border rounded shadow bg-white animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-300 rounded w-2/3 mb-1" />
        <div className="h-3 bg-gray-300 rounded w-1/2 mb-3" />
        <div className="h-4 bg-gray-300 rounded w-24" />
      </div>
    ));

  return (
    <div className="p-6 max-w-4xl mx-auto text-black">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800">Available Requests</h2>

      {loading ? (
        renderSkeleton()
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">No new requests at the moment.</p>
      ) : (
        requests.map((req) => (
          <div
            key={req._id}
            className="mb-4 p-4 border rounded shadow-sm bg-white"
          >
            <p className="mb-2">
              <strong>Request ID:</strong>{" "}
              <span className="text-blue-600">{req._id}</span>
            </p>
            <p className="font-medium text-gray-700">Items:</p>
            <ul className="ml-5 list-disc text-sm text-gray-600">
              {req.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} — Qty: {item.quantity}
                </li>
              ))}
            </ul>
            <Link
              to={`/vendor/submit-quote/${req._id}`}
              className="mt-3 inline-block text-blue-600 hover:underline font-medium"
            >
              📤 Submit Quote →
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default AvailableRequests;
