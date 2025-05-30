import React from "react";

const Select = ({
  label,
  value,
  onChange,
  options = [],
  className = "",
  name = "",
  disabled = false,
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
