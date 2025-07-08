import { useAuth } from "../../context/AuthContext.jsx";

const VendorProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <p className="text-gray-500">🔄 Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700">👤 Vendor Profile</h2>

      <div className="text-gray-800 space-y-2">
        <p>
          <strong>Name:</strong> {user.name || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user.email || "N/A"}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          <span className="capitalize">{user.role || "vendor"}</span>
        </p>
        <p>
          <strong>Registered On:</strong>{" "}
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default VendorProfile;
