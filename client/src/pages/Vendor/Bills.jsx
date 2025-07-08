import { useEffect, useState } from "react";
import axios from "../../utils/api";

const VendorBills = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    axios.get("/bills/vendor").then((res) => setBills(res.data));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto text-black">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800 text-black">
        Bills Generated for Me
      </h2>
      {bills.length === 0 ? (
        <p>No bills yet.</p>
      ) : (
        bills.map((bill, idx) => (
          <div key={idx} className="p-4 border rounded mb-4 bg-white shadow-sm text-black">
            <p>
              <strong>Request ID:</strong> {bill.requestId}
            </p>
            <p>
              <strong>Amount:</strong> ₹{bill.amount}
            </p>
            <a
              href={bill.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Bill PDF
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default VendorBills;
