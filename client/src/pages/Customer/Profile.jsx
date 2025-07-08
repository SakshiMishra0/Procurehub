import { useAuth } from "../../context/AuthContext.jsx";

const CustomerProfile = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <p>
        <strong>Name:</strong> {user?.name}
      </p>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <p>
        <strong>Role:</strong> {user?.role}
      </p>
      <p>
        <strong>Joined On:</strong>{" "}
        {new Date(user?.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default CustomerProfile;
