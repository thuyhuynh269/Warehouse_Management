import { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { toast } from "react-toastify";
import { Switch, Modal, Box, Typography } from "@mui/material";
import request from "../utils/request";
import { Button, Input } from "../components/ui";
import { HiOutlineSearch } from "react-icons/hi";

const Category = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    categoryName: "",
    image: "",
    isActive: true,
  });

  const handleOpenAddModal = () => {
    setFormData({
      categoryName: "",
      image: "",
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedCategory(null);
    setViewingCategory(null);
    setFormData({
      categoryName: "",
      image: "",
      isActive: true,
    });
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setFormData({
      categoryName: category.name,
      image: category.image,
      isActive: category.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleViewDetailsClick = (category) => {
    setViewingCategory(category);
    setIsDetailModalOpen(true);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50, headerClassName: 'bg-gray-100 text-base', align: 'center', headerAlign: 'center' },
    { field: "name", headerName: "Tên danh mục", width: 200, flex: 1, headerClassName: 'bg-gray-100 text-base', align: 'center', headerAlign: 'center' },
    {
      field: "image",
      headerName: "Hình ảnh",
      width: 100,
      headerClassName: 'bg-gray-100 text-base',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="flex justify-center items-center h-full w-full">
          {params.value ? (
            <img
              src={params.value}
              alt={params.row.name}
              style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 6 }}
            />
          ) : (
            <span className="text-gray-400 italic text-sm">Không có ảnh</span>
          )}
        </div>
      ),
    },
    {
      field: "isActive",
      headerName: "Trạng thái",
      width: 100,
      headerClassName: 'bg-gray-100 text-base',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const handleToggle = () => {
          const newStatus = !params.row.isActive;
          request
            .put(`categories/${params.row.id}`, {
              ...params.row,
              isActive: newStatus,
            })
            .then(() => {
              toast.success("Cập nhật trạng thái thành công!");
              getData();
            })
            .catch((error) => {
              toast.error(error.response.data || "Không thể cập nhật trạng thái.");
            });
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
        </div>
      ),
    },
  ];

  const getData = () => {
    request
      .get("Categories")
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        toast.error(error.response?.data || "Không thể tải danh mục.");
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const filtered = rows.filter((row) => {
      const searchLower = searchTerm.toLowerCase();
      return row.name.toLowerCase().includes(searchLower);
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
    if (!formData.categoryName || !formData.image) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const data = {
        name: formData.categoryName,
        image: formData.image,
        isActive: true,
      };
      const response = await request.post("categories", data);
      toast.success(response.data.message || "Thêm danh mục thành công!");
      getData();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data || "Không thể thêm danh mục.");
    }
  };

  const handleEditSubmit = async () => {
    if (!formData.categoryName || !formData.image) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const data = {
        id: selectedCategory.id,
        name: formData.categoryName,
        image: formData.image,
        isActive: formData.isActive,
      };
      const response = await request.put(`categories/${selectedCategory.id}`, data);
      toast.success(response.data.message || "Cập nhật danh mục thành công!");
      getData();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data || "Không thể cập nhật danh mục.");
    }
  };

  return (
    <div className="p-0">
      <h1 className="font-bold text-3xl text-green-800 mb-8">DANH SÁCH DANH MỤC</h1>

      <div className="flex justify-between items-center mb-3 px-4">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
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
          Thêm danh mục
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
            {isEditModalOpen ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </Typography>
          <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="categoryName">
                Tên danh mục
              </label>
              <Input
                type="text"
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="image">
                URL Hình ảnh
              </label>
              <Input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Always show isActive switch */}
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
            Chi tiết danh mục
          </Typography>
          {viewingCategory && (
            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">ID:</p>
                  <p className="text-base text-gray-900">{viewingCategory.id}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Tên danh mục:</p>
                  <p className="text-base text-gray-900">{viewingCategory.name}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Trạng thái hoạt động:</p>
                  <p className="text-base text-gray-900">{viewingCategory.isActive ? "Hoạt động" : "Không hoạt động"}</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-sm font-medium text-gray-700 mb-2">Hình ảnh:</p>
                {viewingCategory.image ? (
                  <img
                    src={viewingCategory.image}
                    alt={viewingCategory.name}
                    style={{ width: 150, height: 150, objectFit: 'contain', borderRadius: 6 }}
                    className="border border-gray-300 p-1"
                  />
                ) : (
                  <p className="text-base text-gray-400 italic">Không có ảnh</p>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end mt-4">
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

export default Category;