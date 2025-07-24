import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  FileText,
  ClipboardList,
  ReceiptText,
  UserPlus,
  Hourglass,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({
    requests: 0,
    quotes: 0,
    bills: 0,
    newRegistrations: 0,
    pendingApprovals: 0,
  });

  const [recentRequests, setRecentRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("7");

  // Fetch dashboard summary + recent requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, requestsRes] = await Promise.all([
          api.get("/dashboard/admin-summary"),
          api.get(`/dashboard/requests?days=${dateRange}`),
        ]);
        setSummary(summaryRes.data);
        setRecentRequests(requestsRes.data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };
    fetchData();
  }, [dateRange]);

  // Filter based on status
  const filteredRequests =
    filterStatus === "all"
      ? recentRequests
      : recentRequests.filter((req) => req.status === filterStatus);

  // CSV Export
  const exportCSV = () => {
    const csv = [
      ["ID", "Title", "Status", "Date"],
      ...filteredRequests.map((r) => [
        r._id,
        r.title,
        r.status,
        new Date(r.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "recent_requests.csv");
  };

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("ProcureHub - Recent Requests", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["ID", "Title", "Status", "Date"]],
      body: filteredRequests.map((r) => [
        r._id,
        r.title,
        r.status,
        new Date(r.createdAt).toLocaleDateString(),
      ]),
    });
    doc.save("recent_requests.pdf");
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Requests",
            value: summary.requests,
            icon: ClipboardList,
            color: "bg-blue-100 text-blue-600",
          },
          {
            label: "Total Quotes",
            value: summary.quotes,
            icon: FileText,
            color: "bg-green-100 text-green-600",
          },
          {
            label: "Total Bills",
            value: summary.bills,
            icon: ReceiptText,
            color: "bg-yellow-100 text-yellow-600",
          },
          {
            label: "New Registrations Today",
            value: summary.newRegistrations,
            icon: UserPlus,
            color: "bg-purple-100 text-purple-600",
          },
          {
            label: "Pending Approvals",
            value: summary.pendingApprovals,
            icon: Hourglass,
            color: "bg-red-100 text-red-600",
          },
        ].map(({ label, value, icon: Icon, color }, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-lg shadow flex items-center space-x-4"
          >
            <div className={`p-3 rounded-full ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xl font-semibold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Export */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="space-x-3">
          <label>Status:</label>
          <select
            className="border px-3 py-1 rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <label className="ml-4">Date Range:</label>
          <select
            className="border px-3 py-1 rounded"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export CSV
          </button>
          <button
            onClick={exportPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <tr key={req._id} className="border-t">
                  <td className="p-3">{req._id}</td>
                  <td className="p-3">{req.title}</td>
                  <td className="p-3 capitalize">{req.status}</td>
                  <td className="p-3">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 space-x-2">
                    {req.status === "pending" && (
                      <>
                        <button className="text-green-600 hover:underline">
                          Approve
                        </button>
                        <button className="text-red-600 hover:underline">
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
