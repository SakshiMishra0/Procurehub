import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/api";

const SubmitQuote = () => {
  const { requestId } = useParams(); // This is the MongoDB _id
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readableRequestId, setReadableRequestId] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axios.get(`/requests/${requestId}`);
        const data = res.data;

        setReadableRequestId(data.requestId);

        setQuotes(
          data.items.map((item) => ({
            name: item.name,
            price: "",
            remark: "",
          }))
        );
      } catch (err) {
        console.error("❌ Failed to fetch request:", err);
        alert("Failed to load request.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  const handleChange = (index, field, value) => {
    const updated = [...quotes];
    updated[index][field] = value;
    setQuotes(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure prices are numbers
      const preparedItems = quotes.map((q) => ({
        name: q.name,
        price: Number(q.price),
        remark: q.remark,
      }));

      const token = localStorage.getItem("token");

      await axios.post(
        `/quotes/${encodeURIComponent(readableRequestId)}`,
        { items: preparedItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Quotes submitted successfully!");
      navigate("/vendor/my-quotes");
    } catch (err) {
      console.error("❌ Error submitting quotes:", err.response?.data || err.message);
      alert("Error submitting quotes. Please check your input or try again later.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto text-black">
      <h2 className="text-2xl font-bold mb-6 text-indigo-800">Submit Quote</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {quotes.map((quote, index) => (
          <div key={index} className="border p-4 rounded shadow bg-white">
            <p className="font-semibold mb-2">
              🛒 Item: <span className="text-gray-800">{quote.name}</span>
            </p>
            <label className="block mb-1 text-sm text-gray-600">
              Price (₹)
            </label>
            <input
              type="number"
              value={quote.price}
              onChange={(e) => handleChange(index, "price", e.target.value)}
              placeholder="Enter price in INR"
              className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring"
              required
            />
            <label className="block mb-1 text-sm text-gray-600">
              Remark (optional)
            </label>
            <textarea
              value={quote.remark}
              onChange={(e) => handleChange(index, "remark", e.target.value)}
              placeholder="Any specific notes or delivery time..."
              className="w-full border rounded px-3 py-2 h-20 focus:outline-none focus:ring"
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          📤 Submit All Quotes
        </button>
      </form>
    </div>
  );
};

export default SubmitQuote;
