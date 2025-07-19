import { useEffect, useState } from "react";
import axios from "../../utils/api";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const AdminDashboard = () => {
  const [data, setData] = useState({ requests: 0, quotes: 0, bills: 0 });

  useEffect(() => {
    axios.get("/dashboard/summary").then((res) => setData(res.data));
  }, []);

  const chartData = {
    labels: ["Requests", "Quotes", "Bills"],
    datasets: [
      {
        label: "Total Count",
        data: [data.requests, data.quotes, data.bills],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl text-black font-bold">Admin Analytics</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default AdminDashboard;
