import { useEffect, useState } from "react";
import axios from "../../utils/api";

const ManageBills = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    axios.get("/bills/all").then((res) => setBills(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-black">All Bills</h2>
      {bills.map((b, idx) => (
        <div key={idx} className="mb-4 p-4 border rounded text-black">
          <p>
            <strong>Request ID:</strong> {b.requestId}
          </p>
          <p>
            <strong>Amount:</strong> ₹{b.amount}
          </p>
          <p>
            <strong>Customer:</strong> {b.customer?.name}
          </p>
          <p>
            <strong>Vendor:</strong> {b.vendor?.name}
          </p>
          <a
            href={b.pdfUrl}
            className="text-blue-600 underline"
            target="_blank"
            rel="noreferrer"
          >
            View PDF
          </a>
        </div>
      ))}
    </div>
  );
};

export default ManageBills;
