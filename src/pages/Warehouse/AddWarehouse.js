import React, { useState } from "react";
import { Button, Input } from "../../components/ui";
import { toast } from "react-toastify";
import request from "../../utils/request";

const AddWarehouseModal = ({ onClose, onSuccess }) => {
  const [wareName, setWareName] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!wareName || !address || !tel || !email) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await request.post("warehouse", {
        wareName,
        address,
        tel,
        email,
        isActive: true,
      });
      toast.success(response.data.message || "Thêm kho thành công!");
      onSuccess?.(); // Gọi callback để reload bảng nếu cần
      onClose(); // Đóng modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi thêm kho.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">
          Thêm kho mới
        </h2>
        <div className="space-y-4">
          <Input
            placeholder="Tên kho"
            value={wareName}
            onChange={(e) => setWareName(e.target.value)}
          />
          <Input
            placeholder="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Input
            placeholder="Số điện thoại"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={handleSubmit} // ✅ Gọi đúng hàm thêm dữ liệu
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Lưu
          </Button>
          <Button
            onClick={onClose}
            className="bg-gray-300 text-black hover:bg-gray-400"
          >
            Hủy
          </Button>
        </div>

        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AddWarehouseModal;
