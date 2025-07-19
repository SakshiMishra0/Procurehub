import { useEffect, useState } from "react";
import axios from "../../utils/api";

const MyQuotes = () => {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    axios.get("/quotes/mine").then((res) => setQuotes(res.data));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto text-black">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800 text-black">
        My Submitted Quotes
      </h2>
      {quotes.length === 0 ? (
        <p>No quotes submitted yet.</p>
      ) : (
        quotes.map((q, idx) => (
          <div key={idx} className="p-4 border rounded mb-4 bg-white shadow-sm text-black">
            <p>
              <strong>Request ID:</strong> {q.requestId}
            </p>
            <p>
              <strong>Item:</strong> {q.item.name}
            </p>
            <p>
              <strong>Price:</strong> ₹{q.price}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">{q.status}</span>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyQuotes;
