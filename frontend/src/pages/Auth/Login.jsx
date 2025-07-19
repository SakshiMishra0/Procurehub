import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import ReCAPTCHA from "react-google-recaptcha";
import successAnimation from "../../assets/success1.json";
import bgImage from "../../assets/registering.jpg";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    if (!captchaToken) {
      setError("Please verify the captcha first.");
      return;
    }
    setLoading(true);
    const user = await login(form.email, form.password);
    setLoading(false);

    if (user) {
      setSuccess(true);
      setTimeout(() => {
        if (user.role === "cooperative") navigate("/admin/dashboard");
        else if (user.role === "vendor") navigate("/vendor/dashboard");
        else navigate("/customer/dashboard");
      }, 2000);
    } else {
      setError("Invalid login credentials.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <Player autoplay loop src={successAnimation} style={{ height: 300 }} />
        <h2 className="text-2xl font-bold text-green-600 mt-4">
          Login Successful!
        </h2>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="z-10 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="w-full border px-3 py-2 rounded text-black"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              className="w-full border px-3 py-2 rounded text-black"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LdFzYcrAAAAAOtiKUtQSAoji9cRI26_QxMNYEPu" // 👈 Replace with your site key
              onChange={(token) => setCaptchaToken(token)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition-all flex justify-center"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
