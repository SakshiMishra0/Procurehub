import { createContext, useState, useEffect, useContext } from "react";
import axios from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Save user
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ✅ Clear user
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // ✅ Restore user
    }

    setLoading(false); // ✅ Mark auth as loaded
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
