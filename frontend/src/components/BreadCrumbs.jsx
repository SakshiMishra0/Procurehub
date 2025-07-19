import { useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <div className="text-sm text-gray-600 mb-4">
      {["Home", ...paths].map((p, i) => (
        <span key={i}>
          {i > 0 && " > "}
          <span className="capitalize">{p}</span>
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
