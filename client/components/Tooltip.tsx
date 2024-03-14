import React, { useState } from "react";
import clsx from "clsx";

interface TooltipProps {
  text: string;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  textColor?: string;
  bgColor?: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  position = "top-center",
  textColor = "white",
  bgColor = "gray-800",
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>
      {showTooltip && (
        <div
          className={clsx(
            `absolute z-10 px-4 py-2 text-${textColor} bg-${bgColor} rounded shadow-lg transition-opacity duration-300 opacity-100`,
            getPositionClass(position)
          )}
        >
          <div
            className={clsx(
              "absolute w-3 h-3 bg-gray-800 transform rotate-45",
              getTrianglePositionClass(position)
            )}
          />
          <span>{text}</span>
        </div>
      )}
    </div>
  );
};

const getPositionClass = (position: string) => {
  switch (position) {
    case "top-left":
      return "top-0 left-0";
    case "top-center":
      return "top-0 left-1/2 transform -translate-x-1/2";
    case "top-right":
      return "top-0 right-0";
    case "bottom-left":
      return "bottom-0 left-0";
    case "bottom-center":
      return "bottom-0 left-1/2 transform -translate-x-1/2";
    case "bottom-right":
      return "bottom-0 right-0";
    default:
      return "top-0 left-1/2 transform -translate-x-1/2";
  }
};

const getTrianglePositionClass = (position: string) => {
  switch (position) {
    case "top-left":
    case "top-center":
    case "top-right":
      return "-top-1 left-2";
    case "bottom-left":
    case "bottom-center":
    case "bottom-right":
      return "-bottom-1 left-2";
    default:
      return "-top-1 left-2";
  }
};

export default Tooltip;
