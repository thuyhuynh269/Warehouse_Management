import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { label: "TRANG CHỦ", icon: "🏠", path: "/" },
    { label: "Nhập hàng", icon: "📥", path: "/import" },
    { label: "Xuất hàng", icon: "📤", path: "/export" },
    { label: "Kho hàng", icon: "📦", path: "/warehouse" },
    { label: "Sản phẩm", icon: "🛍️", path: "/products" },
    { label: "Danh mục", icon: "📋", path: "/category" },
    { label: "Nhà sản xuất", icon: "🏭", path: "/manufacturers" },
    { label: "Nhân viên", icon: "👥", path: "/employees" },
  ];

  return (
    <section className="flex gap-6">
      <aside className="bg-white min-h-screen w-56 text-blue-700 px-6 py-6 flex flex-col">
        <nav className="flex-1">
          <ul className="mt-4 space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 py-2 px-4 hover:bg-blue-100 rounded text-blue-700 ${item.className || ""}`}
                >
                  <span className="w-5 h-5 text-blue-400 text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
            Logout
          </button>
        </div>
      </aside>
      <div className="w-px bg-gray-300 min-h-screen" />
    </section>
  );
};

export default Sidebar;
