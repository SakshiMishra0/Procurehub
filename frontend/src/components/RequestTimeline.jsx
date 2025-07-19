const RequestTimeline = ({ status }) => {
  const steps = ["Draft", "Published", "Approved", "Billed"];
  return (
    <div className="flex space-x-4 items-center my-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-5 h-5 rounded-full ${
              steps.indexOf(status) >= index ? "bg-green-500" : "bg-gray-300"
            }`}
          ></div>
          {index < steps.length - 1 && (
            <div className="w-8 h-1 bg-gray-300 mx-2"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RequestTimeline;
