// src/components/Auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/auth";
import { LogIn, Lock, User } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (!success) {
      setError("Invalid credentials or not approved yet.");
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userRole = payload.role;

        if (userRole === "cooperative") {
          navigate("/admin/dashboard");
        } else if (userRole === "vendor") {
          navigate("/vendor/dashboard");
        } else if (userRole === "customer") {
          navigate("/customer/dashboard");
        } else {
          navigate("/");
        }
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#112D60] to-[#B8C0C5] flex items-center justify-center p-4">
      <div className="relative z-10 bg-gradient-to-br from-[#0a122a]/90 via-[#112D60]/80 to-[#0a122a]/90 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl p-10 w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1">
              <User size={18} className="mr-2 text-white/80" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent outline-none w-full text-white placeholder-white/60"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1">
              <Lock size={18} className="mr-2 text-white/80" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent outline-none w-full text-white placeholder-white/60"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 rounded-lg shadow-lg transition"
          >
            <LogIn size={18} className="inline mr-2" />
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
