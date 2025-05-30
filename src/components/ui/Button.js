import React from "react";

const Button = ({ children, className = "", primary, type = "button", ...props }) => {
  // Tạo base classes
  const baseClasses = "px-4 py-2 focus:outline-none rounded-lg";

  // Xác định classes dựa trên prop primary
const variantClasses = primary
  ? "bg-green-600 text-white hover:bg-green-500 disabled:bg-green-300"
  : "bg-blue-100 text-green-600 hover:bg-blue-200 disabled:bg-slate-300";

  // Kết hợp tất cả classes
  const finalClasses = `${baseClasses} ${variantClasses} ${className}`.trim();

  return React.createElement(
    "button",
    {
      className: finalClasses,
      type: type,
      ...props,
    },
    children
  );
};
export default Button;
