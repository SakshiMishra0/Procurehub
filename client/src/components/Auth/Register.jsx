import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import {
  UserPlus,
  Mail,
  Phone,
  Building2,
  Home,
  KeyRound,
  PackageCheck,
} from "lucide-react";

export default function Register() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      phone,
      organization,
      address,
      gstNumber,
      password,
      role,
      isVendor: role === "vendor", // optional based on your schema
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful. Wait for cooperative approval.");
        navigate("/login"); // or navigate("/login", { replace: true });
      } else {
        alert("Registration failed: " + (data.message || "Unknown error."));
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed due to a network/server issue.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#112D60] to-[#B8C0C5] flex items-center justify-center p-4">
      <div className="relative z-10 bg-gradient-to-br from-[#0a122a]/90 via-[#112D60]/80 to-[#0a122a]/90 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl p-10 w-full max-w-lg text-white">
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium">Name</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1">
              <UserPlus size={18} className="mr-2 text-white/80" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="bg-transparent outline-none w-full text-white placeholder-white/60"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1">
              <Mail size={18} className="mr-2 text-white/80" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="bg-transparent outline-none w-full text-white placeholder-white/60"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1">
              <Phone size={18} className="mr-2 text-white/80" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="bg-transparent outline-none w-full text-white placeholder-white/60"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Organization</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1">
              <Building2 size={18} className="mr-2 text-white/80" />
              <input
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Org Pvt Ltd"
                className="bg-transparent outline-none w-full text-white placeholder-white/60"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1">
              <Home size={18} className="mr-2 text-white/80" />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, City"
                className="bg-transparent outline-none w-full text-white placeholder-white/60"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">GST Number</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1">
              <PackageCheck size={18} className="mr-2 text-white/80" />
              <input
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="GSTIN1234"
                className="bg-transparent outline-none w-full text-white placeholder-white/60"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1">
              <KeyRound size={18} className="mr-2 text-white/80" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="bg-transparent outline-none w-full text-white placeholder-white/60"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 backdrop-blur-md"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          {role === "vendor" && (
            <div>
              <label className="text-sm font-medium">Items Selling</label>
              <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1">
                <input
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  required
                  placeholder="Electronics, Tools..."
                  className="bg-transparent outline-none w-full text-white placeholder-white/60"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 rounded-lg shadow-lg transition"
          >
            <UserPlus size={18} className="inline mr-2" /> Register
          </button>
        </form>
      </div>
    </div>
  );
}
