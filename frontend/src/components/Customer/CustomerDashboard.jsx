import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../services/auth";
import {
  FilePlus,
  ClipboardList,
  ReceiptText,
} from "lucide-react"; // icons

export default function CustomerDashboard() {
  const { user } = useAuth();
  const username = user?.name || "Customer";

  const actions = [
    {
      label: "Create Request",
      description: "Submit a new request",
      icon: <FilePlus size={32} className="text-blue-700 mb-2 mx-auto" />,
      link: "/customer/create-request",
    },
    {
      label: "My Requests",
      description: "View submitted requests",
      icon: <ClipboardList size={32} className="text-blue-700 mb-2 mx-auto" />,
      link: "/customer/requests",
    },
    {
      label: "My Bills",
      description: "View your bills and payment status",
      icon: <ReceiptText size={32} className="text-blue-700 mb-2 mx-auto" />,
      link: "/customer/bills",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Welcome, {username}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, idx) => (
          <Link to={action.link} key={idx}>
            <div className="bg-blue-100 hover:bg-blue-200 p-6 rounded-2xl shadow transition duration-200 cursor-pointer text-center">
              {action.icon}
              <h2 className="text-lg font-semibold text-blue-800">
                {action.label}
              </h2>
              <p className="text-sm text-blue-600">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
