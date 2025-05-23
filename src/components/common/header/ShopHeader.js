import React, { useState } from 'react';
import { HiOutlineUserCircle, HiOutlineChevronDown } from 'react-icons/hi';

function Header() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    
    
    <div className="flex items-center justify-between p-4 bg-white shadow-md border-b">
      {/* Left Section: Empty for now */}
      <div className="flex items-center space-x-3">
        {/* Có thể thêm tiêu đề hoặc các phần tử khác ở đây nếu cần */}
      </div>

      {/* Right Section: Buttons aligned to the right */}
      <div className="flex items-center justify-end space-x-3">
        <div className="relative">
          <button className="flex items-center px-3 py-1.5 border rounded-lg text-gray-700 text-sm">
            Chọn kho: Kho C <HiOutlineChevronDown className="ml-1 w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsAccountOpen(!isAccountOpen)}
            className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Account <HiOutlineChevronDown className="ml-1 w-4 h-4" />
          </button>
          {/* Account Dropdown */}
          {isAccountOpen && (
            <div className="absolute top-10 right-0 w-48 bg-blue-500 text-white rounded-lg shadow-lg">
              <div className="p-2 flex items-center hover:bg-blue-600">
                <HiOutlineUserCircle className="mr-2 w-5 h-5" /> Thông tin tài khoản
              </div>
              <div className="p-2 flex items-center hover:bg-blue-600 cursor-pointer">
                <svg
                  className="mr-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                  />
                </svg>
                Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;