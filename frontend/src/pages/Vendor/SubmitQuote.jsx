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
            description: "",
            uom: "",
            quantity: item.quantity || 1,
            rate: "",
            gst: "",
            remark: "",
            amount: 0,
            gstAmount: 0,
            netAmount: 0, 
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

    const qty = Number(updated[index].quantity);
    const rate = Number(updated[index].rate);
    const gst = Number(updated[index].gst);

    const amount = qty * rate;
    const gstAmount = (amount * gst) / 100;
    const netAmount = amount + gstAmount;

    updated[index].amount = amount;
    updated[index].gstAmount = gstAmount;
    updated[index].netAmount = netAmount;

    setQuotes(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure prices are numbers
      const preparedItems = quotes.map((q) => ({
        name: q.name,
        description: q.description,
        uom: q.uom,
        quantity: q.quantity,
        rate: Number(q.rate),
        amount: q.amount,
        gstPercentage: Number(q.gst),
        gstAmount: q.gstAmount,
        netAmount: q.netAmount,
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
      if (err.response && err.response.data && err.response.data.message) {
  console.error("❌ Backend error:", err.response.data.message);
} else {
  console.error("❌ Unknown backend error:", err.response?.data || err.message);
}

      alert("Error submitting quotes. Please check your input or try again later.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-full overflow-x-auto text-black">
      <h2 className="text-2xl font-bold mb-6 text-indigo-800">Submit Quote</h2>
      <form onSubmit={handleSubmit}>
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Item Name</th>
              <th className="border px-2 py-1">Item Description</th>
              <th className="border px-2 py-1">UOM</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Rate (₹)</th>
              <th className="border px-2 py-1">Amount (₹)</th>
              <th className="border px-2 py-1">GST %</th>
              <th className="border px-2 py-1">GST (₹)</th>
              <th className="border px-2 py-1">Net Amount (₹)</th>
              <th className="border px-2 py-1">Remark</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((item, index) => (
              <tr key={index}>
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                <td className="border px-2 py-1">
                   <input
                     type="text"
                      value={item.name}
                       disabled
                       className="bg-gray-100"
                    />
                    </td>
                <td className="border px-2 py-1">
                  <textarea
                    value={item.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                    className="w-full resize-none"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    value={item.uom}
                    onChange={(e) => handleChange(index, "uom", e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="border px-2 py-1 text-center">{item.quantity}</td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleChange(index, "rate", e.target.value)}
                    className="w-full"
                    required
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleChange(index, "amount", e.target.value)}
                    className="w-full"
                    required
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    value={item.gst}
                    onChange={(e) => handleChange(index, "gst", e.target.value)}
                    className="w-full"
                    required
                  />
                </td>
                <td className="border px-2 py-1 text-right">{item.gstAmount.toFixed(2)}</td>
                <td className="border px-2 py-1 text-right">{item.netAmount.toFixed(2)}</td>
                <td className="border px-2 py-1">
                  <textarea
                    value={item.remark}
                    onChange={(e) => handleChange(index, "remark", e.target.value)}
                    className="w-full resize-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          📤 Submit All Quotes
        </button>
      </form>
    </div>
  );
};

export default SubmitQuote;
