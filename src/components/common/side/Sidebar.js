import { Link } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { label: "Trang chủ", icon: "🏠", path: "/" },
    { label: "Kho hàng", icon: "📦", path: "/warehouse" },
    { label: "Sản phẩm", icon: "🛍️", path: "/product" },
    { label: "Phiếu nhập", icon: "📥", path: "/import" },
    { label: "Phiếu xuất", icon: "📤", path: "/export" },
    { label: "Danh mục", icon: "📋", path: "/category" },
    { label: "Nhà sản xuất", icon: "🏭", path: "/manufacturers" },
    { label: "Nhân viên", icon: "👥", path: "/employee" },
    { label: "Thống kê", icon: "📊", path: "/statistics" },
  ];

  return (
    <section className="flex">
      <aside className="bg-white min-h-screen w-56 text-blue-700 px-4 py-6 flex flex-col">
        {/* User Profile Section */}
        {/* <div className="mb-6 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-white text-lg">👤</span>
            </div>
            <div>
              <p className="font-semibold text-blue-700">Nguyễn Thị Mắm Tôm</p>
              <p className="text-sm text-blue-500">Quản lý kho</p>
            </div>
          </div>
        </div> */}

        {/* Navigation Items */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 py-2 px-4 hover:bg-blue-100 rounded text-blue-700`}
                  >
                    <span className="w-5 h-5 text-blue-400 text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="w-px bg-gray-300 min-h-screen" />
    </section>
  );
};

export default Sidebar;