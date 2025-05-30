import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "../../components/ui";
import request from "../../utils/request";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from "@mui/material";
import { HiOutlineSearch } from "react-icons/hi";

const DetailWarehouse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State cho modal thêm sản phẩm
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productLoading, setProductLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");

  const columns = [
    { 
      field: "productId", 
      headerName: "Mã SP", 
      width: 60,
      headerClassName: 'bg-gray-100 text-base'
    },
    {
      field: "image",
      headerName: "Hình ảnh",
      width: 100,
      headerClassName: 'bg-gray-100 text-base',
      renderCell: (params) => (
        <img
          src={params.value || '/placeholder-image.png'}
          alt="product"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    { 
      field: "productName", 
      headerName: "Tên sản phẩm", 
      width: 250,
      headerClassName: 'bg-gray-100 text-base'
    },
    { 
      field: "quantity", 
      headerName: "Số lượng", 
      width: 100,
      headerClassName: 'bg-gray-100 text-base'
    },
    { 
      field: "unit", 
      headerName: "Đơn vị", 
      width: 100,
      headerClassName: 'bg-gray-100 text-base'
    },
{
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <div className="flex gap-2">
          {/* Nút Sửa */}
          <button
            onClick={() => handleEdit(params.row)}
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

          {/* Nút Xóa */}
          <button
            onClick={() => handleDelete(params.row)}
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

  const fetchWarehouseDetails = async () => {
    try {
      const response = await request.get(`warehouse/${id}`);
      setWarehouse(response.data);
      if (Array.isArray(response.data.details)) {
        const formatted = response.data.details.map((item, idx) => ({
          id: idx + 1,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unit: item.unit,
          image: item.image
        }));
        setFilteredProducts(formatted);
        console.log('filter:', formatted);
      } else {
        toast.error("Dữ liệu sản phẩm không hợp lệ");
      }
    } catch (error) {
      console.error('Error fetching warehouse details:', error);
      toast.error("Không thể tải thông tin kho");
      //navigate("/warehouse");
    }
    finally {
      setLoading(false);
    }
  };

  const fetchWarehouseProducts = async () => {

  };

  const fetchAvailableProducts = async () => {
    setProductLoading(true);
    request
      .get("Product?isActive=true")
      .then((response) => {
        if (response && response.data) {
          const formattedProducts = response.data.map(product => ({
            id: product.id,
            name: product.proName
          }));
          setAvailableProducts(formattedProducts);
        }
      })
      .catch((error) => {
        toast.error("Không thể tải danh sách sản phẩm");
      })
      .finally(() => {
        setProductLoading(false);
      });
  };

  useEffect(() => {
    fetchAvailableProducts();
    fetchWarehouseDetails();
    //fetchWarehouseProducts();
  }, [id]);


  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      toast.error("Số lượng phải là số nguyên dương");
      return;
    }

    // Kiểm tra giá trị selectedProduct
    if (!selectedProduct) {
      toast.error("Vui lòng chọn sản phẩm");
      return;
    }

    const data = {
      proId: selectedProduct, // Không cần parseInt vì giá trị đã là số
      wareId: parseInt(id),
      quantity: parsedQuantity
    };


    request
      .post("WarehouseDetail", data)
      .then((response) => {
        if (response && response.data) {
          toast.success("Thêm sản phẩm vào kho thành công");
          fetchWarehouseDetails();
          fetchWarehouseProducts();
          setIsAddModalOpen(false);
          setSelectedProduct("");
          setQuantity("");
        }
      })
      .catch((error) => {
        toast.error("Lỗi khi thêm sản phẩm vào kho");
      });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditQuantity(product.quantity.toString());
    setEditModalOpen(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi kho?")) {
      try {
        await request.delete(`WarehouseDetail/${product.productId}/${id}`);
        toast.success("Xóa sản phẩm thành công");
        fetchWarehouseDetails();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        const errorMessage = error.response?.data?.message || "Không thể xóa sản phẩm khỏi kho";
        toast.error(errorMessage);
      }
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    if (!editQuantity) {
      toast.error("Vui lòng nhập số lượng");
      return;
    }

    const parsedQuantity = parseInt(editQuantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      toast.error("Số lượng phải là số nguyên dương");
      return;
    }

    try {
      await request.put(`WarehouseDetail/${editingProduct.productId}/${id}`, {
        quantity: parsedQuantity
      });
      toast.success("Cập nhật số lượng thành công");
      setEditModalOpen(false);
      fetchWarehouseDetails();
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      const errorMessage = error.response?.data?.message || "Không thể cập nhật số lượng sản phẩm";
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="p-0">Đang tải...</div>;
  if (!warehouse) return <div className="p-0">Không tìm thấy thông tin kho</div>;

  return (
    <div className="p-0">
      <div className="mb-3 bg-blue-50 py-2 px-4">
        <h1 className="text-xl font-bold text-green-800 -mt-1">{warehouse?.wareName}</h1>
        <p className="text-gray-600 text-sm">Địa chỉ: {warehouse?.address}</p>
      </div>

      <div className="flex justify-between items-center mb-3 px-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/warehouse")}
            className="bg-gray-500 text-white hover:bg-gray-600 px-3 py-1.5 rounded-lg"
          >
            Quay lại
          </Button>
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Thêm sản phẩm
        </Button>
      </div>

      <div className="bg-white shadow-lg overflow-hidden">
        <div style={{ height: 750, width: "100%" }}>
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            pageSize={15}
            rowsPerPageOptions={[15, 30, 50]}
            checkboxSelection
            disableSelectionOnClick
            className="border-none text-base"
            sx={{
              '& .MuiDataGrid-cell': {
                borderColor: '#f0f0f0',
                fontSize: '1rem',
                paddingTop: '1rem',
                paddingBottom: '1rem'
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                minHeight: '60px'
              },
              '& .MuiDataGrid-row': {
                minHeight: '60px'
              }
            }}
          />
        </div>
      </div>

      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        className="flex items-center justify-center"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md m-4">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            Thêm Sản Phẩm Vào Kho
          </h2>
          {productLoading ? (
            <p>Đang tải danh sách sản phẩm...</p>
          ) : (
            <form onSubmit={handleAddProduct}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn Sản Phẩm
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setSelectedProduct(isNaN(value) ? "" : value);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {availableProducts.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded-lg"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg"
                >
                  Thêm Sản Phẩm
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Modal Chỉnh sửa số lượng */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        className="flex items-center justify-center"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md m-4">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            Chỉnh sửa số lượng sản phẩm
          </h2>
          <form onSubmit={handleUpdateProduct}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm
              </label>
              <input
                type="text"
                value={editingProduct?.productName || ""}
                disabled
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng mới
              </label>
              <input
                type="number"
                min="1"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded-lg"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg"
              >
                Cập nhật
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default DetailWarehouse;
