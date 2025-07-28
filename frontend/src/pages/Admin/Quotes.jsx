import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/api";

const ManageQuotes = () => {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    axios
      .get("/quotes/all")
      .then((res) => setQuotes(res.data))
      .catch((err) => console.error("Error fetching quotes:", err));
  }, []);

  const approve = async (id) => {
    try {
      await axios.put(`/quotes/approve/${id}`);
      setQuotes((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status: "approved" } : q))
      );
    } catch (error) {
      console.error("Error approving quote:", error);
    }
  };

  const reject = async (id) => {
    try {
      await axios.put(`/quotes/reject/${id}`);
      setQuotes((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status: "rejected" } : q))
      );
    } catch (error) {
      console.error("Error rejecting quote:", error);
    }
  };

  // Group quotes by requestId
  const groupByRequest = quotes.reduce((acc, q) => {
    const rid = q?.request?.requestId || "unknown";
    if (!acc[rid]) acc[rid] = [];
    acc[rid].push(q);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-black">Manage Quotes</h2>

      {Object.entries(groupByRequest).map(([requestId, quoteGroup]) => {
        if (!quoteGroup || quoteGroup.length === 0) return null;

        const lowest = quoteGroup.reduce((min, q) =>
          q?.price < min?.price ? q : min
        );

        return (
          <div key={requestId} className="mb-6 p-4 border rounded text-black">
            <p>
              <strong>Request ID:</strong> {requestId}
            </p>

            {quoteGroup.map((q) => (
              <div
                key={q._id}
                className="p-2 border mt-2 rounded text-black bg-gray-100"
              >
                <p><strong>Vendor:</strong> {q?.vendor?.name || "N/A"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      q?.status === "approved"
                        ? "text-green-600"
                        : q?.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {q?.status || "unknown"}
                  </span>
                </p>
                <div className="mt-2">
                  <p className="font-semibold">Quoted Items:</p>
                  {Array.isArray(q.items) && q.items.length > 0 ? (
                    q.items.map((item, index) => (
                      <div key={index} className="ml-4 mb-1">
                        <p>- <strong>{item.name}</strong></p>
                        <p>  Quantity: {item.quantity} {item.unit}</p>
                        <p>  Price/Unit: ₹{item.rate}</p>
                        <p>  GST: {item.gstPercentage}%</p>
                        <p>  Net Amount: ₹{item.netAmount}</p>
                        {item.remark && <p>  Remark: {item.remark}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="ml-4 italic text-gray-500">No items provided.</p>
                  )}
                </div>
                

                {q._id === lowest?._id && q?.status === "pending" && (
                  <span className="text-green-600 font-semibold mr-2">
                    Lowest Quote ✅
                  </span>
                )}

                {q?.status === "pending" && (
                  <div className="mt-2">
                    <button
                      onClick={() => approve(q._id)}
                      className="mr-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => reject(q._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                    <Link to={`/admin/quotes/${q._id}/customize`}>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Customize Quote
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ManageQuotes;
