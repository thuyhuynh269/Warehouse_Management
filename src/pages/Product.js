import { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { toast } from "react-toastify";
import { Card, CardContent, Switch, Select, MenuItem, Paper, Typography, Box } from "@mui/material";
import request from "../utils/request";
import { Button, Input } from "../components/ui";

const Product = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    productName: "",
    image: "",
    unit: "",
    expiry: "",
    selectedCategory: "",
    selectedManufacturer: "",
    isActive: true
  });

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "proName", headerName: "Tên sản phẩm", width: 200, flex: 1 },
    {
      field: "image",
      headerName: "Hình ảnh",
      width: 100,
      renderCell: (params) => (
        params.row.image ? (
          <img
            src={params.row.image}
            alt={params.row.proName}
            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
          />
        ) : (
          <span className="text-gray-400 italic">Không có ảnh</span>
        )
      )
    },
    { field: "unit", headerName: "Đơn vị", width: 100 },
    { field: "expiry", headerName: "Hạn sử dụng", width: 100 },
    { field: "categoryName", headerName: "Danh mục", width: 150 },
    { field: "manufacturerName", headerName: "Nhà sản xuất", width: 150 },
    {
      field: "isActive",
      headerName: "Trạng thái",
      width: 100,
      renderCell: (params) => {
        const handleToggle = () => {
          const newStatus = !params.row.isActive;
          request
            .put(`product/${params.row.id}`, {
              ...params.row,
              isActive: newStatus,
            })
            .then(() => {
              toast.success("Cập nhật trạng thái thành công!");
              getData();
            })
            .catch((error) => {
              toast.error(error.message);
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
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedProduct(params.row);
              setIsDetailModalOpen(true);
            }}
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
            onClick={() => {
              const category = categories.find(
                c => c.name.trim().toLowerCase() === params.row.categoryName.trim().toLowerCase()
              );
              const manufacturer = manufacturers.find(
                m => m.name.trim().toLowerCase() === params.row.manufacturerName.trim().toLowerCase()
              );

              setSelectedProduct(params.row);
              setFormData({
                productName: params.row.proName,
                image: params.row.image,
                unit: params.row.unit,
                expiry: params.row.expiry,
                selectedCategory: category ? String(category.id) : "",
                selectedManufacturer: manufacturer ? String(manufacturer.id) : "",
                isActive: params.row.isActive
              });
              setIsEditModalOpen(true);
            }}
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

  useEffect(() => {
    // Filter rows whenever searchQuery or rows change
    const filtered = rows.filter((row) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        row.proName.toLowerCase().includes(searchLower) ||
        row.categoryName.toLowerCase().includes(searchLower) ||
        row.manufacturerName.toLowerCase().includes(searchLower) ||
        row.unit.toLowerCase().includes(searchLower)
      );
    });
    setFilteredRows(filtered);
  }, [searchQuery, rows]);

  const getData = () => {
    request
      .get("product")
      .then((response) => {
        setRows(response.data);
        setFilteredRows(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const getCategories = () => {
    request
      .get("Categories?isActive=true")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const getManufacturers = () => {
    request
      .get("Manufacturers?isActive=true")
      .then((response) => {
        if (response && response.data) {
          const formattedManufacturers = response.data.map(manu => ({
            id: manu.id,
            name: manu.manuName
          }));
          setManufacturers(formattedManufacturers);
        }
      })
      .catch((error) => {
        toast.error("Lỗi khi tải danh sách nhà sản xuất");
      });
  };

  useEffect(() => {
    getData();
    getCategories();
    getManufacturers();
  }, []);

  const handleSubmit = async () => {
    if (!formData.productName || !formData.unit || !formData.expiry || !formData.selectedCategory || !formData.selectedManufacturer) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      if (!isEditModalOpen) {
        const data = {
          manuId: Number(formData.selectedManufacturer),
          cateId: Number(formData.selectedCategory),
          proName: formData.productName,
          image: formData.image,
          unit: formData.unit,
          expiry: Number(formData.expiry),
          isActive: true
        };
        const response = await request.post("product", data);
        toast.success(response.data.message || "Thêm sản phẩm thành công!");
        getData();
        handleCloseModal();
        return;
      }

      const data = {
        manuId: Number(formData.selectedManufacturer),
        cateId: Number(formData.selectedCategory),
        proName: formData.productName,
        image: formData.image,
        unit: formData.unit,
        expiry: Number(formData.expiry),
        quantity: selectedProduct?.quantity,
        createdDate: selectedProduct?.createdDate,
        isActive: isEditModalOpen ? formData.isActive : true
      };

      if (isEditModalOpen && selectedProduct) {
        const response = await request.put(`product/${selectedProduct.id}`, {
          ...data,
          id: selectedProduct.id
        });
        toast.success(response.data.message || "Cập nhật sản phẩm thành công!");
      }
      
      getData();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
    setFormData({
      productName: "",
      image: "",
      unit: "",
      expiry: "",
      selectedCategory: "",
      selectedManufacturer: "",
      isActive: true
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-3xl text-green-800">DANH SÁCH SẢN PHẨM</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            )}
          </div>
          <Button
            onClick={() => {
              setFormData({
                productName: "",
                image: "",
                unit: "",
                expiry: "",
                selectedCategory: "",
                selectedManufacturer: "",
                isActive: true
              });
              setIsModalOpen(true);
            }}
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Thêm mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-2 w-full border-solid border-2 border-green-300 rounded-lg p-4">
        <Card className="col-span-3">
          <CardContent style={{ height: "100%", width: "100%" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={5}
              className="max-h-4/5"
            />
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              {isEditModalOpen ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            <div className="space-y-4">
              <Input
                name="productName"
                placeholder="Tên sản phẩm"
                value={formData.productName}
                onChange={handleInputChange}
              />
              
              <div>
                <Select
                  name="selectedCategory"
                  value={formData.selectedCategory}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-lg"
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Chọn danh mục</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <div>
                <Select
                  name="selectedManufacturer"
                  value={formData.selectedManufacturer}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-lg"
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Chọn nhà sản xuất</em>
                  </MenuItem>
                  {manufacturers.map((manufacturer) => (
                    <MenuItem key={manufacturer.id} value={String(manufacturer.id)}>
                      {manufacturer.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <Input
                name="image"
                placeholder="Đường dẫn ảnh"
                value={formData.image}
                onChange={handleInputChange}
              />

              <Input
                name="unit"
                placeholder="Đơn vị"
                value={formData.unit}
                onChange={handleInputChange}
              />

              <Input
                name="expiry"
                placeholder="Hạn sử dụng (tháng)"
                type="number"
                value={formData.expiry}
                onChange={handleInputChange}
              />

              <Switch
                checked={formData.isActive}
                onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                color="primary"
                inputProps={{ "aria-label": "status toggle" }}
              />
              <span>{formData.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isEditModalOpen ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button
                onClick={handleCloseModal}
                className="bg-gray-300 text-black hover:bg-gray-400"
              >
                Hủy
              </Button>
            </div>

            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              Chi tiết sản phẩm
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Product details */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <label className="text-gray-600 text-sm">Tên sản phẩm:</label>
                  <p className="text-gray-900 font-medium">{selectedProduct.proName}</p>
                </div>
                
                <div className="border-b pb-2">
                  <label className="text-gray-600 text-sm">Danh mục:</label>
                  <p className="text-gray-900 font-medium">{selectedProduct.categoryName}</p>
                </div>
                
                <div className="border-b pb-2">
                  <label className="text-gray-600 text-sm">Nhà sản xuất:</label>
                  <p className="text-gray-900 font-medium">{selectedProduct.manufacturerName}</p>
                </div>
                
                <div className="border-b pb-2">
                  <label className="text-gray-600 text-sm">Đơn vị:</label>
                  <p className="text-gray-900 font-medium">{selectedProduct.unit}</p>
                </div>

                <div className="border-b pb-2">
                  <label className="text-gray-600 text-sm">Hạn sử dụng:</label>
                  <p className="text-gray-900 font-medium">{selectedProduct.expiry} Tháng</p>
                </div>

                <div className="border-b pb-2">
                  <label className="text-gray-600 text-sm">Trạng thái:</label>
                  <p className={`font-medium ${selectedProduct.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedProduct.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </p>
                </div>
              </div>

              {/* Right column - Product image */}
              <div className="flex flex-col items-center justify-center">
                <label className="text-gray-600 text-sm mb-2">Hình ảnh:</label>
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.proName}
                    className="max-w-full h-auto rounded-lg shadow-md"
                    style={{
                      maxHeight: '300px',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                    <span className="text-gray-400 italic">Không có ảnh</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleCloseModal}
                className="bg-gray-300 text-black hover:bg-gray-400"
              >
                Đóng
              </Button>
            </div>

            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;