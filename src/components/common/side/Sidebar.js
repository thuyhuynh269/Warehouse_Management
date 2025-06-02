import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  const navItems = [
    { 
      label: "Trang chủ", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ), 
      path: "/" ,
      roles: ["admin", "manager","employee"]
    },
    { 
      label: "Kho hàng", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
        </svg>
      ), 
      path: "/warehouse",
      roles: ["admin", "manager", "employee"]
    },
     { 
      label: "Kho Chuyển", 
      icon: (
        <div className="text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        </div>
      ), 
      path: "/transfer-warehouse",
      roles: ["admin", "manager", "employee"] 
    },
    
    { 
      label: "Phiếu nhập", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <path d="M19 3H5"></path>
          <path d="M12 21V7"></path>
          <path d="m6 15 6 6 6-6"></path>
        </svg>
      ), 
      path: "/import",
      roles: ["admin", "manager", "employee"]
    },
    { 
      label: "Phiếu xuất", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <path d="m18 9-6-6-6 6"></path>
          <path d="M12 3v14"></path>
          <path d="M5 21h14"></path>
        </svg>
      ), 
      path: "/export",
      roles: ["admin", "manager", "employee"]
    },
   { 
      label: "Sản phẩm", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
          <path d="m3.3 7 8.7 5 8.7-5"></path>
          <path d="M12 22V12"></path>
        </svg>
      ), 
      path: "/product",
      roles: ["admin", "manager"]
    },
    { 
      label: "Danh mục", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      ), 
      path: "/category",
      roles: ["admin", "manager"] 
    },
    { 
      label: "Nhà sản xuất", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <path d="M2 20h20" />
          <path d="M5 20V8h4v12" />
          <path d="M13 20v-8l6-4v12" />
          <path d="M9 12h4" />
          <path d="M9 16h4" />
        </svg>
      ), 
      path: "/manufacturers",
      roles: ["admin", "manager"]  
    },
    { 
      label: "Nhân viên", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ), 
      path: "/employee",
      roles: ["admin"] 
    },
    { 
      label: "Thống kê", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <path d="M3 3v18h18" />
          <path d="M7 16h4" />
          <path d="M7 12h4" />
          <path d="M7 8h4" />
          <path d="M13 16h4" />
          <path d="M13 12h4" />
          <path d="M13 8h4" />
        </svg>
      ), 
      path: "/statistics",
      roles: ["admin", "manager", "employee"] 
    },
  ].map(item => ({
  ...item,
  isActive: item.roles.includes(role),
}));

  return (
    <section className="flex">
      <aside className="bg-white min-h-screen w-40 text-blue-700 px-2 py-6 flex flex-col">
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
            {navItems.filter(item => item.isActive).map((item, index) => (
              <li key={index}>
                {item.isLogout ? (
                  <button
                    className="flex items-center gap-2 py-2 px-4 w-full text-left text-red-600 hover:bg-red-100 rounded"
                    onClick={() => {
                      // Add logout logic here
                      console.log("Logging out...");
                    }}
                  >
                    <span className="w-5 h-5 text-red-600 text-lg">{item.icon}</span>
                    {item.label}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 py-2 px-4 hover:bg-blue-100 rounded text-blue-700 ${
                      item.path === "/account" ? "bg-blue-100" : ""
                    }`}
                  >
                    {typeof item.icon === 'string' ? (
                      <span className="w-5 h-5 text-blue-400 text-lg">{item.icon}</span>
                    ) : (
                      <div className="text-blue-400">{item.icon}</div>
                    )}
                    {item.label}
                  </Link>
                )}
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