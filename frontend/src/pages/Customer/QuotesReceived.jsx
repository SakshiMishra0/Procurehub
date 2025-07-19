import { useEffect, useState } from "react";
import axios from "../../utils/api";

const QuotesReceived = () => {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    axios.get("/quotes/received").then((res) => setQuotes(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Quotes Received</h2>
      {quotes.map((quote, idx) => (
        <div key={idx} className="border p-4 rounded mb-4 text-black">
          <p>Vendor: {quote.vendor.name}</p>
          <p>Item: {quote.item.name}</p>
          <p>Price: ₹{quote.price}</p>
          <p>Remark: {quote.remark}</p>
        </div>
      ))}
    </div>
  );
};

export default QuotesReceived;
