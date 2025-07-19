import { useState, useEffect } from "react";
import axios from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    axios.get("/requests/mine").then((res) => setRequests(res.data));
  }, []);

  const toggleCard = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-center text-black font-bold mb-6">My Requests</h2>
      <div className="space-y-4 max-w-4xl mx-auto">
        {requests.map((req) => (
          <motion.div
            key={req._id}
            layout
            className="bg-white rounded shadow border p-4 cursor-pointer text-black"
            onClick={() => toggleCard(req._id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-black">
                Request ID:{" "}
                <span className="text-blue-600">{req.requestId}</span>
              </h3>
              <p className="text-sm text-gray-500">Status: {req.status}</p>
            </div>

            <AnimatePresence>
              {openId === req._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-3"
                >
                  <p className="mb-2 text-sm">
                    <strong>Remarks:</strong> {req.remarks || "None"}
                  </p>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {req.items.map((item, i) => (
                      <li key={i}>
                        {item.name} —{" "}
                        <span className="text-gray-600">
                          Qty: {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;
