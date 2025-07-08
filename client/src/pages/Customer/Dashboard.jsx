import { Link } from "react-router-dom";

const CustomerDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-black font-bold">Customer Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/customer/create-request"
          className="p-4 bg-blue-100 rounded shadow text-black"
        >
          ➕ Create New Request
        </Link>
        <Link
          to="/customer/my-requests"
          className="p-4 bg-green-100 rounded shadow text-black"
        >
          📄 View My Requests
        </Link>
        <Link
          to="/customer/quotes"
          className="p-4 bg-yellow-100 rounded shadow text-black"
        >
          📬 Quotes Received
        </Link>
        <Link to="/customer/bills" className="p-4 bg-purple-100 rounded shadow text-black">
          🧾 My Bills
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;
