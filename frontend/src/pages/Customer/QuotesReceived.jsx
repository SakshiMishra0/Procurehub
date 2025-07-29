import { useEffect, useState } from "react";
import axios from "../../utils/api";

const QuotesReceived = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios
      .get("/quotes/received")
      .then((res) => setRequests(res.data))
      .catch((err) => console.error("Failed to fetch quotes", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Quotes Received</h2>
      {requests.length === 0 ? (
        <p className="text-gray-600">No quotes received yet.</p>
      ) : (
        requests.map((request, idx) => (
          <div
            key={idx}
            className="border p-4 rounded mb-4 text-black bg-white shadow"
          >
            <p>
              <strong>Request ID:</strong> {request.requestId}
            </p>

            <div className="mb-2">
              <strong>Items:</strong>
              <ul className="list-disc list-inside">
                {request.items?.map((item, i) => (
                  <li key={i}>
                    {item.name} — Qty: {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            {/* ✅ Admin Uploaded Quote File */}
            {request.adminQuoteFile ? (
              <div className="mt-3">
                <p className="text-green-700 font-medium mb-1">Admin Uploaded Quote:</p>
                <a
                  href={`http://localhost:5000/uploads/${request.adminQuoteFile.replace(/^uploads\//, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  📄 Download Quote File
                </a>
              </div>
            ) : (
              <p className="text-gray-500">Admin quote not uploaded yet.</p>
            )}

            {/* Optional: Show Vendor Quotes (if any) */}
            {request.quotes && request.quotes.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Vendor Quotes:</p>
                {request.quotes.map((quote, i) => (
                  <div key={i} className="ml-2 mb-2 text-sm">
                    <p>
                      <strong>Vendor:</strong> {quote.vendor?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Item:</strong> {quote.item?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Price:</strong> ₹{quote.price}
                    </p>
                    <p>
                      <strong>Remark:</strong> {quote.remark}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default QuotesReceived;
