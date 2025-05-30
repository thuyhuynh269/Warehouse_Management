import { useState, useEffect } from 'react';
import { HiOutlineUserCircle, HiOutlineChevronDown } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import request from '../../../utils/request';
import { getToken, removeToken } from '../../constants';
import { toast } from 'react-toastify'

function Header() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const navigate = useNavigate();

  const fetchWarehouses = async () => {
    try {
      const response = await request.get('warehouse');
      if (response.data) {
        setWarehouses(response.data);
        if (response.data.length > 0 && !selectedWarehouse) {
          setSelectedWarehouse(response.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const handleWarehouseSelect = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsWarehouseOpen(false);
    navigate(`/warehouse/${warehouse.id}`);
  };

  const handleLogout = () => {
    const token = getToken();
    if (token) {
      removeToken();
      toast.success('Logout successful');
    }
    window.location.href = '/login';
  }

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md border-b">
      {/* Left Section: Logo and Title */}
      <div className="flex items-center gap-4">
        <img 
          src="/warehouse-logo.svg" 
          alt="Warehouse Logo" 
          className="h-12 w-auto"
        />
        <div>
          <h1 className="font-bold text-2xl text-green-800">Warehouse Management</h1>
          <p className="text-gray-500 text-sm">@phamhien</p>
        </div>
      </div>

      {/* Right Section: Buttons aligned to the right */}
      <div className="flex items-center justify-end space-x-3">
        <div className="relative">
          <button 
            onClick={() => setIsWarehouseOpen(!isWarehouseOpen)}
            className="flex items-center px-3 py-1.5 border rounded-lg text-gray-700 text-sm"
          >
            Chọn kho: {selectedWarehouse ? selectedWarehouse.wareName : 'Chọn kho'} 
            <HiOutlineChevronDown className="ml-1 w-4 h-4" />
          </button>
          
          {/* Warehouse Dropdown */}
          {isWarehouseOpen && (
            <div className="absolute top-10 right-0 w-48 bg-white border rounded-lg shadow-lg z-50">
              {warehouses.map((warehouse) => (
                <div
                  key={warehouse.id}
                  onClick={() => handleWarehouseSelect(warehouse)}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  {warehouse.wareName}
                </div>
              ))}
            </div>
          )}
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
            <div className="absolute top-10 right-0 w-48 bg-blue-500 text-white rounded-lg shadow-lg z-50">
              <div className="p-2 flex items-center hover:bg-blue-600">
                <HiOutlineUserCircle className="mr-2 w-5 h-5" /> Thông tin tài khoản
              </div>
              <div className="p-2 flex items-center hover:bg-blue-600 cursor-pointer" onClick={handleLogout}>
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