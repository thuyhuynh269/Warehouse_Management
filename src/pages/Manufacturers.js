import { useState, useEffect, useRef } from "react";
import { DataGrid } from '@mui/x-data-grid';

import { toast } from "react-toastify";

import { Card, CardContent, Select, MenuItem, InputLabel, Switch, Modal, Box, Typography } from "@mui/material";
import request from "../utils/request";
import { Button, Input } from "../components/ui";
import { HiOutlineSearch } from "react-icons/hi";

const Manufacturer = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [viewingManufacturer, setViewingManufacturer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    manuName: "",
    address: "",
    tel: "",
    email: "",
    website: "",
    isActive: true,
  });

  const handleOpenAddModal = () => {
    setFormData({
      manuName: "",
      address: "",
      tel: "",
      email: "",
      website: "",
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedManufacturer(null);
    setViewingManufacturer(null);
    setFormData({
      manuName: "",
      address: "",
      tel: "",
      email: "",
      website: "",
      isActive: true,
    });
  };

  const handleEditClick = (manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setFormData({
      manuName: manufacturer.manuName,
      address: manufacturer.address,
      tel: manufacturer.tel,
      email: manufacturer.email,
      website: manufacturer.website,
      isActive: manufacturer.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleViewDetailsClick = (manufacturer) => {
    setViewingManufacturer(manufacturer);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = async (manufacturer) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhà sản xuất "${manufacturer.manuName}"?`)) {
      try {
        console.log("Attempting to delete manufacturer with ID:", manufacturer.id);
        const response = await request.delete(`manufacturers/${manufacturer.id}`);
        console.log("Delete API response:", response);
        toast.success("Xóa nhà sản xuất thành công!");
        
        // Manually update the state to remove the deleted item
        setRows(prevRows => prevRows.filter(row => row.id !== manufacturer.id));
        // The useEffect for filteredRows will handle updating filteredRows automatically
        
      } catch (error) {
        console.error("Error deleting manufacturer:", error);
        toast.error(error.response?.data?.message || "Không thể xóa nhà sản xuất.");
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50, headerClassName: 'bg-gray-100 text-base', align: 'center', headerAlign: 'center' },
    { field: "manuName", headerName: "Tên nhà sản xuất", width: 200, flex: 1, headerClassName: 'bg-gray-100 text-base', align: 'center', headerAlign: 'center' },
    { field: "address", headerName: "Địa chỉ", width: 150, headerClassName: 'bg-gray-100 text-base', align: 'center', headerAlign: 'center' },
    { field: "tel", headerName: "Điện thoại", width: 120, headerClassName: 'bg-gray-100 text-base', align: 'center', headerAlign: 'center' },
    { field: "email", headerName: "Email", width: 180, headerClassName: 'bg-gray-100 text-base', align: 'center', headerAlign: 'center' },
    { field: "website", headerName: "Website", width: 150, headerClassName: 'bg-gray-100 text-base', align: 'center', headerAlign: 'center' },
    {
      field: "isActive",
      headerName: "Trạng thái",
      width: 100,
      headerClassName: 'bg-gray-100 text-base',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const handleToggle = async () => {
          try {
            const newStatus = !params.row.isActive;
            const updatedData = {
              id: params.row.id,
              manuName: params.row.manuName,
              address: params.row.address,
              tel: params.row.tel,
              email: params.row.email,
              website: params.row.website,
              isActive: newStatus
            };

            await request.put(`manufacturers/${params.row.id}`, updatedData);
            toast.success("Cập nhật trạng thái thành công!");
            getData(); // Refresh data after successful update
          } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Không thể cập nhật trạng thái.");
          }
        };

        return (
          <Switch
            checked={params.row.isActive}
            onChange={handleToggle}
            color="primary"
            inputProps={{ "aria-label": "status toggle" }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      headerClassName: 'bg-gray-100 text-base',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="flex gap-2 justify-center w-full">
          <button
            onClick={() => handleViewDetailsClick(params.row)}
            className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          <button
            onClick={() => handleEditClick(params.row)}
            className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center hover:bg-cyan-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteClick(params.row)}
            className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const getData = () => {
    request
      .get("Manufacturers")
      .then((response) => {
        console.log("Data fetched by getData:", response.data);
        setRows(response.data);
        setFilteredRows(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const filtered = rows.filter((row) => {
      const searchLower = searchTerm.toLowerCase();
      return row.manuName.toLowerCase().includes(searchLower) ||
             row.address.toLowerCase().includes(searchLower) ||
             row.tel.toLowerCase().includes(searchLower) ||
             row.email.toLowerCase().includes(searchLower) ||
             row.website.toLowerCase().includes(searchLower);
    });
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSubmit = async () => {
    if (!formData.manuName || !formData.address || !formData.tel) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc (Tên, Địa chỉ, Điện thoại).");
      return;
    }

    try {
      const data = {
        manuName: formData.manuName,
        address: formData.address,
        tel: formData.tel,
        email: formData.email,
        website: formData.website,
        isActive: true,
      };
      const response = await request.post("manufacturers", data);
      toast.success(response.data.message || "Thêm nhà sản xuất thành công!");
      getData();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể thêm nhà sản xuất.");
    }
  };

  const handleEditSubmit = async () => {
    if (!formData.manuName || !formData.address || !formData.tel) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc (Tên, Địa chỉ, Điện thoại).");
      return;
    }

    try {
      const data = {
        id: selectedManufacturer.id,
        manuName: formData.manuName,
        address: formData.address,
        tel: formData.tel,
        email: formData.email,
        website: formData.website,
        isActive: formData.isActive,
      };
      const response = await request.put(`manufacturers/${selectedManufacturer.id}`, data);
      toast.success(response.data.message || "Cập nhật nhà sản xuất thành công!");
      getData();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể cập nhật nhà sản xuất.");
    }
  };

  return (
    <div className="p-0">
      <h1 className="font-bold text-3xl text-green-800 mb-8">Danh sách nhà sản xuất</h1>

      <div className="flex justify-between items-center mb-3 px-4">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhà sản xuất..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-64"
          />
        </div>
        <Button
          onClick={handleOpenAddModal}
          className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Thêm nhà sản xuất
        </Button>
      </div>

      <div className="grid grid-cols-1 w-full border-solid border-2 border-green-300 rounded-lg p-4">
        <div style={{ height: 750, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell': {
                borderColor: '#f0f0f0',
                fontSize: '1rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                minHeight: '60px',
              },
              '& .MuiDataGrid-row': {
                minHeight: '60px',
              },
              '& .MuiDataGrid-root': {
                border: 'none',
              },
            }}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={isAddModalOpen || isEditModalOpen}
        onClose={handleCloseModal}
        className="flex items-center justify-center"
      >
        <Box className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md m-4">
          <Typography variant="h6" component="h2" className="text-xl font-semibold mb-4 text-green-800">
            {isEditModalOpen ? "Chỉnh sửa nhà sản xuất" : "Thêm nhà sản xuất mới"}
          </Typography>
          <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="manuName">
                Tên nhà sản xuất
              </label>
              <Input
                type="text"
                id="manuName"
                name="manuName"
                value={formData.manuName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address">
                Địa chỉ
              </label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="tel">
                Điện thoại
              </label>
              <Input
                type="text"
                id="tel"
                name="tel"
                value={formData.tel}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <Input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="website">
                Website
              </label>
              <Input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-sm font-medium text-gray-700 mr-2" htmlFor="isActive">
                Trạng thái hoạt động:
              </label>
              <Switch
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                color="primary"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={handleCloseModal}
                className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded-lg"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg"
              >
                {isEditModalOpen ? "Cập nhật" : "Thêm"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={isDetailModalOpen}
        onClose={handleCloseModal}
        className="flex items-center justify-center"
      >
        <Box className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md m-4">
          <Typography variant="h6" component="h2" className="text-xl font-semibold mb-4 text-green-800">
            Chi tiết nhà sản xuất
          </Typography>
          {viewingManufacturer && (
            <div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">ID:</p>
                <p className="text-base text-gray-900">{viewingManufacturer.id}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Tên nhà sản xuất:</p>
                <p className="text-base text-gray-900">{viewingManufacturer.manuName}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Địa chỉ:</p>
                <p className="text-base text-gray-900">{viewingManufacturer.address}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Điện thoại:</p>
                <p className="text-base text-gray-900">{viewingManufacturer.tel}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Email:</p>
                <p className="text-base text-gray-900">{viewingManufacturer.email}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Website:</p>
                <p className="text-base text-gray-900">{viewingManufacturer.website}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Trạng thái hoạt động:</p>
                <p className="text-base text-gray-900">{viewingManufacturer.isActive ? "Hoạt động" : "Không hoạt động"}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              onClick={handleCloseModal}
              className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded-lg"
            >
              Đóng
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Manufacturer;