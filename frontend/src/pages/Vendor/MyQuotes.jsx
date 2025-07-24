import React, { useEffect, useState } from "react";
import axios from "../../utils/api";

const MyQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      const res = await axios.get("/quotes/mine");
      setQuotes(res.data);
    } catch (error) {
      console.error("❌ Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!quotes || quotes.length === 0) return <p>No quotes found</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Submitted Quotes</h2>
      {quotes.map((quote) => (
        <div key={quote._id} className="border p-4 rounded-lg shadow mb-4">
          <p><strong>Request ID:</strong> {quote.requestId}</p>
          <p><strong>Status:</strong> {quote.status}</p>
          <div className="mt-2">
            <p className="font-semibold">Quoted Items:</p>
            {Array.isArray(quote.items) ? (
              quote.items.map((item, index) => (
                <p key={index}>
                  - {item.name} (₹{item.price}) {item.remark && `(Remark: ${item.remark})`}
                </p>
              ))
            ) : (
              <p>No items found in this quote.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyQuotes;
