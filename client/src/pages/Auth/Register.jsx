import { useState } from "react";
import axios from "../../utils/api";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import successAnimation from "../../assets/success.json";
import bgImage from "../../assets/registering.jpg";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    phone: "",
    gstin: "",
    shippingAddress: "",
    permanentAddress: "",
    organization: "",
    vendorItems: [{ name: "", description: "" }],
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleItemChange = (i, field, value) => {
    const items = [...form.vendorItems];
    items[i][field] = value;
    setForm({ ...form, vendorItems: items });
  };

  const addItem = () =>
    setForm({
      ...form,
      vendorItems: [...form.vendorItems, { name: "", description: "" }],
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build nested address
      const payload = {
        ...form,
        address: {
          permanent: form.permanentAddress,
          shipping: form.shippingAddress,
        },
      };

      // Remove vendor-only fields for customers
      if (form.role !== "vendor") {
        delete payload.organization;
        delete payload.gstin;
        delete payload.vendorItems;
      }

      // Clean flat address props
      delete payload.permanentAddress;
      delete payload.shippingAddress;

      console.log("Submitting payload:", payload);
      await axios.post("/auth/register", payload);
      setSuccess(true);
    } catch (err) {
      // Show backend’s error message
      const msg =
        err.response?.data?.message || err.message || "Unknown error";
      console.error("Registration error:", msg);
      alert("Registration failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Player autoplay loop src={successAnimation} style={{ height: 300 }} />
        <h2 className="text-2xl font-bold text-green-600 mt-4">
          Registration Successful!
        </h2>
        <p className="text-gray-600 text-center mt-2 px-4">
          Please wait for cooperative approval.
        </p>
      </div>
    );

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="GSTIN"
            value={form.gstin}
            onChange={(e) => setForm({ ...form, gstin: e.target.value })}
          />
          <Input
            label="Shipping Address"
            value={form.shippingAddress}
            onChange={(e) =>
              setForm({ ...form, shippingAddress: e.target.value })
            }
          />
          <Input
            label="Permanent Address"
            value={form.permanentAddress}
            onChange={(e) =>
              setForm({ ...form, permanentAddress: e.target.value })
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="w-full border px-3 py-2 rounded text-black"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          {form.role === "vendor" && (
            <>
              <Input
                label="Organization Name"
                value={form.organization}
                onChange={(e) =>
                  setForm({ ...form, organization: e.target.value })
                }
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Items
                </label>
                {form.vendorItems.map((itm, i) => (
                  <div key={i} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Item Name"
                      className="w-1/2 border px-2 py-1 rounded text-black"
                      value={itm.name}
                      onChange={(e) =>
                        handleItemChange(i, "name", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      className="w-1/2 border px-2 py-1 rounded text-black"
                      value={itm.description}
                      onChange={(e) =>
                        handleItemChange(i, "description", e.target.value)
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-2 text-blue-600 text-sm hover:underline"
                >
                  + Add More Items
                </button>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note (optional)
            </label>
            <textarea
              rows={3}
              className="w-full border px-3 py-2 rounded text-black"
              placeholder="Any notes for the admin..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold flex items-center justify-center gap-2 transition"
          >
            {loading && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
            )}
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={label}
      className="w-full border px-3 py-2 rounded text-black"
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default Register;
