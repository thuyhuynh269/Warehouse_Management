import React from "react";

const Input = ({ className = "", type, ...props }) => {
  // Tạo base classes
  const baseClasses = "px-4 py-2 border-solid border-2 w-full border-green-500 rounded-lg focus:outline-none disabled:bg-slate-200 disabled:border-green-300";

  // Kết hợp tất cả classes
  const finalClasses = `${baseClasses} ${className}`.trim();

  return React.createElement(
    "input",
    {
      className: finalClasses,
      type: type,
      ...props,
    }
  );
};

export default Input;