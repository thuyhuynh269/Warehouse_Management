import { useState, useEffect } from 'react';
import { HiOutlineUserCircle, HiOutlineChevronDown } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import request from '../../../utils/request';
import { getToken, removeToken } from '../../constants';
import { toast } from 'react-toastify'
import { Input, Button } from '../../ui';

function Header({ name, role, id }) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const navigate = useNavigate();

  const fetchWarehouses = async () => {
    // try {
    //   const response = await request.get('warehouse');
    //   if (response.data) {
    //     setWarehouses(response.data);
    //     if (response.data.length > 0 && !selectedWarehouse) {
    //       setSelectedWarehouse(response.data[0]);
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error fetching warehouses:', error);
    // }
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  useEffect(() => {
    if (role != null && role !== "employee") fetchWarehouses();
  }, []);

  const handleChangePassword = () => {
    request.put(`employee/ChangePassword/${id}`, {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmPassword
    })
    .then((response) => {
      handleLogout();
    })
    .catch((error) => {
      console.error("Error changing password:", error);
      toast.error(error.response?.data || "Đổi mật khẩu thất bại");
    });
  }
  return (
    <div className="flex items-center justify-between p-2 bg-white shadow-md border-b">
      {/* Left Section: Logo and Title */}
      <div className="flex items-center gap-2">
        <img
          src="/warehouse-logo.svg"
          alt="Warehouse Logo"
          className="h-8 w-auto"
        />
        <div>
          <h1 className="font-bold text-xl text-green-800">Warehouse Management</h1>
        </div>
      </div>

      {/* Right Section: Buttons aligned to the right */}
      <div className="flex items-center justify-end space-x-3">
        <div className="relative">
          {role !== "employee" ? <button
            onClick={() => setIsWarehouseOpen(!isWarehouseOpen)}
            className="flex items-center px-3 py-1.5 border rounded-lg text-gray-700 text-sm"
          >
            Chọn kho: {selectedWarehouse ? selectedWarehouse.wareName : 'Chọn kho'}
            <HiOutlineChevronDown className="ml-1 w-4 h-4" />
          </button> : <></>}

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
            {name} - {role} <HiOutlineChevronDown className="ml-1 w-4 h-4" />
          </button>
          {/* Account Dropdown */}
          {isAccountOpen && (
            <div className="absolute top-10 right-0 w-48 bg-blue-500 text-white rounded-lg shadow-lg z-50">
              <div className="p-2 flex items-center hover:bg-blue-600" onClick={() => setIsModalOpen(true)}>
                <HiOutlineUserCircle className="mr-2 w-5 h-5" /> Đổi mật khẩu
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

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white rounded-xl shadow-2xl p-2 sm:p-6 md:p-10 w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                  aria-label="Đóng"
                  type="button"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold text-green-800 mb-6">
                  ĐỔI MẬT KHẨU
                </h2>
                <form className="space-y-5">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Mật khẩu củ</label>
                      <Input
                        name="oldPassword"
                        placeholder="Nhập mật khẩu cũ"
                        value={oldPassword}
                        type="password"
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="h-12 text-base w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Mật khẩu mới</label>
                      <Input
                        name="newPassword"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-12 text-base w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Xác nhận mật khẩu</label>
                      <Input
                        name="confirmPassword"
                        placeholder="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 text-base w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                    <Button
                      onClick={handleCloseModal}
                      className="bg-gray-300 text-black hover:bg-gray-400 rounded-lg px-6 py-2 font-semibold"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-2 font-semibold shadow"
                      disabled={!oldPassword || !newPassword || !confirmPassword}
                    >
                      Lưu
                    </Button>
                  </div>
                </form>
              </div>
            </div>

          )}
        </div>
      </div>
    </div>
  );
}

export default Header;