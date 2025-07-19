import { Link } from "react-router-dom";

const VendorDashboard = () => {
  const cards = [
    {
      to: "/vendor/requests",
      label: "📥 Available Requests",
      bg: "bg-blue-100",
    },
    {
      to: "/vendor/quotes",
      label: "📄 My Submitted Quotes",
      bg: "bg-green-100",
    },
    {
      to: "/vendor/bills",
      label: "🧾 Approved Bills",
      bg: "bg-purple-100",
    },
    {
      to: "/vendor/profile",
      label: "👤 My Profile",
      bg: "bg-gray-200",
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-white via-slate-50 to-slate-100 text-black">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-10 text-black">
        Vendor Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto text-black">
        {cards.map((card, idx) => (
          <Link
            key={idx}
            to={card.to}
            className={`block p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 ${card.bg}`}
          >
            <span className="text-lg font-medium">{card.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VendorDashboard;
