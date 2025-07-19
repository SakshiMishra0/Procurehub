import React from "react";
import { Link } from "react-router-dom";
import {
  UsersIcon,
  FilePlusIcon,
  FileSearchIcon,
  FileTextIcon,
} from "lucide-react"; // Make sure to install lucide-react

export default function AdminDashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/approve-users">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex items-center space-x-4 border-l-4 border-blue-500">
            <UsersIcon className="text-blue-700 w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold text-blue-800">Approve Users</h2>
              <p className="text-sm text-gray-500">Approve customer & vendor registrations</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/publish-requests">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex items-center space-x-4 border-l-4 border-green-500">
            <FilePlusIcon className="text-green-700 w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold text-green-800">Publish Requests</h2>
              <p className="text-sm text-gray-500">Make product requests visible to vendors</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/quotes">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex items-center space-x-4 border-l-4 border-yellow-500">
            <FileSearchIcon className="text-yellow-600 w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold text-yellow-700">View Quotes</h2>
              <p className="text-sm text-gray-500">Review and manage vendor quotations</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/bills">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex items-center space-x-4 border-l-4 border-purple-500">
            <FileTextIcon className="text-purple-700 w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold text-purple-800">View Bills</h2>
              <p className="text-sm text-gray-500">Approve or reject vendor bills</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
