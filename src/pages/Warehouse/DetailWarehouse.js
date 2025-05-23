import React from "react";
import { Button } from "../../components/ui";

const DetailWarehouseModal = ({ warehouse, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">
          Chi tiết kho
        </h2>
        
        <div className="space-y-4">
          <div className="border-b pb-2">
            <label className="text-gray-600 text-sm">Tên kho:</label>
            <p className="text-gray-900 font-medium">{warehouse.wareName}</p>
          </div>
          
          <div className="border-b pb-2">
            <label className="text-gray-600 text-sm">Địa chỉ:</label>
            <p className="text-gray-900 font-medium">{warehouse.address}</p>
          </div>
          
          <div className="border-b pb-2">
            <label className="text-gray-600 text-sm">Số điện thoại:</label>
            <p className="text-gray-900 font-medium">{warehouse.tel}</p>
          </div>
          
          <div className="border-b pb-2">
            <label className="text-gray-600 text-sm">Email:</label>
            <p className="text-gray-900 font-medium">{warehouse.email}</p>
          </div>

          <div className="border-b pb-2">
            <label className="text-gray-600 text-sm">Trạng thái:</label>
            <p className={`font-medium ${warehouse.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {warehouse.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={onClose}
            className="bg-gray-300 text-black hover:bg-gray-400"
          >
            Đóng
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

export default DetailWarehouseModal;
