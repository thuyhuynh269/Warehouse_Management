import React, { useState, useEffect } from "react";
import { Button, Input } from "../../components/ui";
import { toast } from "react-toastify";
import request from "../../utils/request";
import { provinces, districts, getDistricts, getWards } from "vietnam-provinces";
import { useNavigate } from "react-router-dom";

const AddWarehouse = () => {
  const navigate = useNavigate();
  const [wareName, setWareName] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  // Load districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const provinceDistricts = getDistricts(selectedProvince);
      setDistrictList(provinceDistricts);
      setSelectedDistrict("");
      setSelectedWard("");
    } else {
      setDistrictList([]);
    }
  }, [selectedProvince]);

  // Load wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const districtWards = getWards(selectedDistrict);
      setWardList(districtWards);
      setSelectedWard("");
    } else {
      setWardList([]);
    }
  }, [selectedDistrict]);

  const getFullAddress = () => {
    const parts = [];
    if (addressDetail) parts.push(addressDetail);
    if (selectedWard) {
      const ward = wardList.find(w => w.code === selectedWard);
      if (ward) parts.push(ward.name);
    }
    if (selectedDistrict) {
      const district = districtList.find(d => d.code === selectedDistrict);
      if (district) parts.push(district.name);
    }
    if (selectedProvince) {
      const province = provinces.find(p => p.code === selectedProvince);
      if (province) parts.push(province.name);
    }
    return parts.join(", ");
  };

  const handleSubmit = async () => {
    if (!wareName || !addressDetail || !tel || !email || !selectedProvince || !selectedDistrict || !selectedWard) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await request.post("warehouse", {
        wareName,
        address: getFullAddress(),
        tel,
        email,
        isActive: true,
      });
      toast.success(response.data.message || "Thêm kho thành công!");
      navigate("/warehouse"); // Chuyển về trang danh sách kho
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi thêm kho.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-green-800">
          THÊM KHO MỚI
        </h2>
        <Button
          onClick={() => navigate("/warehouse")}
          className="bg-gray-500 text-white hover:bg-gray-600"
        >
          Quay lại
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Tên kho"
              placeholder="Tên kho"
              value={wareName}
              onChange={(e) => setWareName(e.target.value)}
              required
            />
            <Input
              label="Địa chỉ nhà/số nhà"
              placeholder="Số nhà, tên đường"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              required
            />
            
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Tỉnh/Thành phố</label>
              <select 
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium">Quận/Huyện</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedProvince}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districtList.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Phường/Xã</label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedDistrict}
              >
                <option value="">Chọn Phường/Xã</option>
                {wardList.map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium">Địa chỉ đầy đủ</label>
              <div className="p-2 bg-gray-50 border border-gray-300 rounded-md min-h-[42px]">
                {getFullAddress() || "Địa chỉ sẽ hiện ở đây"}
              </div>
            </div>

            <Input
              label="Số điện thoại"
              placeholder="Số điện thoại"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              required
            />
            <Input
              label="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Thêm
          </Button>
          <Button
            onClick={() => navigate("/warehouse")}
            className="bg-gray-300 text-black hover:bg-gray-400"
          >
            Hủy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddWarehouse;
