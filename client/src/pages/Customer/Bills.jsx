import { useEffect, useState } from "react";
import axios from "../../utils/api";

const CustomerBills = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    axios.get("/bills/customer").then((res) => setBills(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">My Bills</h2>
      {bills.map((bill, idx) => (
        <div key={idx} className="p-4 border rounded mb-4 text-black">
          <p>
            <strong>Request ID:</strong> {bill.requestId}
          </p>
          <p>
            <strong>Total Amount:</strong> ₹{bill.amount}
          </p>
          <a
            href={bill.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Bill PDF
          </a>
        </div>
      ))}
    </div>
  );
};

export default CustomerBills;
