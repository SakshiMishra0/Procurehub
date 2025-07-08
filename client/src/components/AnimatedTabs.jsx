import { useState } from "react";

const AnimatedTabs = ({ tabs }) => {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex space-x-4 border-b">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-4 py-2 ${
              active === i ? "border-b-2 border-blue-600" : ""
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="p-4">{tabs[active].content}</div>
    </div>
  );
};

export default AnimatedTabs;
