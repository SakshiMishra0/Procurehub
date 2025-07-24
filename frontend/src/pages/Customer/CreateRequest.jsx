import { useState, useEffect } from "react";
import axios from "../../utils/api";
import { motion } from "framer-motion";

const CreateRequest = () => {
  const [items, setItems] = useState([{ name: "", quantity: 1 }]);
  const [suggestions, setSuggestions] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔽 Fetch vendor items for datalist suggestions
  useEffect(() => {
    const fetchVendorItems = async () => {
      try {
        const res = await axios.get("/requests/vendor-items");

        if (Array.isArray(res.data)) {
          // ✅ Extract only the 'name' property for suggestions
          const itemNames = res.data.map((item) => item.name);
          setSuggestions(itemNames);
        } else {
          console.error("Expected array but got:", res.data);
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Error fetching vendor items", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorItems();
  }, []);

  // 🔽 Handle item input
  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // 🔽 Add new row for item
  const addItem = () => {
    setItems([...items, { name: "", quantity: 1 }]);
  };

  // 🔽 Submit the request
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/requests", {
        items,
        remarks,
        isDraft: false,
      });

      alert("✅ Request submitted successfully!");
      setItems([{ name: "", quantity: 1 }]);
      setRemarks("");
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Failed to submit request.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <motion.div
        className="bg-white rounded shadow-lg p-6 w-full max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4 text-center text-black">
          Create Purchase Request
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="overflow-auto">
            <table className="w-full mb-4 text-sm border text-black">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">Item Name</th>
                  <th className="p-2 border">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td className="border p-2">
                      <input
                        list="vendorItems"
                        className="w-full border rounded p-1 text-black"
                        value={item.name}
                        onChange={(e) =>
                          handleChange(i, "name", e.target.value)
                        }
                        required
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        min={1}
                        className="w-full border rounded p-1 text-black"
                        value={item.quantity}
                        onChange={(e) =>
                          handleChange(i, "quantity", e.target.value)
                        }
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Datalist suggestions */}
          <datalist id="vendorItems">
            {suggestions.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>

          <button
            type="button"
            onClick={addItem}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-1 rounded mb-4"
          >
            + Add Row
          </button>

          <textarea
            className="w-full border rounded p-2 mb-4 text-black"
            placeholder="Additional remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Loading items..." : "Submit Request"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateRequest;
