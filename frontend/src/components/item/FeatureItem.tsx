import type { FeatureItemProps } from "@/types/global";
import { useState } from "react";

const FeatureItem = ({
  title,
  description,
  className = "",
}: FeatureItemProps) => {
  const [onHover, setOnHover] = useState(false);
  const handleHoverFeatureItem = () => setOnHover(true);

  const handleLeaveFeatureItem = () => setOnHover(false);

  return (
    <div
      onMouseEnter={handleHoverFeatureItem}
      onMouseLeave={handleLeaveFeatureItem}
      className={`border-l-2 border-gray-300 transition-all duration-300 ease-in-out cursor-default ${
        onHover ? "hover:border-l-primary" : ""
      } p-4 ${className}`}
    >
      <h3
        className={`text-lg font-semibold mb-2 transition-all duration-300 ease-in-out ${
          onHover ? "text-primary" : "text-gray-800"
        }`}
      >
        {title}
      </h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureItem;
