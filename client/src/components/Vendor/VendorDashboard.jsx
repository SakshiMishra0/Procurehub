import React from "react";
import { Link } from "react-router-dom";
import {
  FileTextIcon,
  QuoteIcon,
  FilePlusIcon,
  SendIcon,
} from "lucide-react";

export default function VendorDashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">Vendor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/vendor/bills">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex items-center space-x-4 border-l-4 border-purple-500">
            <FileTextIcon className="text-purple-700 w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold text-purple-800">My Bills</h2>
              <p className="text-sm text-gray-500">View and track all your submitted bills</p>
            </div>
          </div>
        </Link>

        <Link to="/vendor/quotes">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex items-center space-x-4 border-l-4 border-yellow-500">
            <QuoteIcon className="text-yellow-600 w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold text-yellow-700">My Quotes</h2>
              <p className="text-sm text-gray-500">Review all the quotes you submitted</p>
            </div>
          </div>
        </Link>

        <Link to="/vendor/requests">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex items-center space-x-4 border-l-4 border-green-500">
            <FilePlusIcon className="text-green-700 w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold text-green-800">Published Requests</h2>
              <p className="text-sm text-gray-500">Browse customer product requests</p>
            </div>
          </div>
        </Link>

        <Link to="/vendor/submit-quote/sampleRequestId"> {/* Replace with actual request ID dynamically */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex items-center space-x-4 border-l-4 border-blue-500">
            <SendIcon className="text-blue-700 w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold text-blue-800">Submit Quote</h2>
              <p className="text-sm text-gray-500">Submit a quote for a published request</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
