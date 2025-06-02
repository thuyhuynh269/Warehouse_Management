import { useState, useEffect, useRef } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { toast } from "react-toastify";
import { Card, CardContent, Select, MenuItem, Paper, Typography, Box } from "@mui/material";
import request from "../utils/request";
import { Button, Input } from "../components/ui";
import ExportPrint from './ExportPrint';
import 'jspdf-autotable';

// Hàm format ngày tháng
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Add this CSS at the top of the file, after the imports
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Export = () => {
  const [rows, setRows] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedExport, setSelectedExport] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [formData, setFormData] = useState({
    quantity: "",
    totalPrice: "",
    consumerName: "",
    tel: "",
    address: "",
    exportDetails: []
  });
  const [productsInWarehouses, setProductsInWarehouses] = useState({});
  const [printData, setPrintData] = useState(null);
  const printRef = useRef();

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "consumerName", headerName: "Tên khách hàng", width: 180 },
    { field: "tel", headerName: "Số điện thoại", width: 140 },
    { field: "address", headerName: "Địa chỉ", width: 150 },
    { field: "totalPrice", headerName: "Tổng tiền", width: 120 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => {
        const status = params.row.status;
        return (
          <Select
            value={status}
            onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
            disabled={isUpdatingStatus}
            className={`w-full ${
              status === 1 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}
            sx={{
              '& .MuiSelect-select': {
                padding: '4px 8px',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 500,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
          >
            <MenuItem value={0} sx={{ 
              backgroundColor: 'rgb(254 249 195)',
              color: 'rgb(133 77 14)',
              '&:hover': { backgroundColor: 'rgb(253 224 71)' },
              '&.Mui-selected': { backgroundColor: 'rgb(254 249 195)' }
            }}>
              Chờ duyệt
            </MenuItem>
            <MenuItem value={1} sx={{ 
              backgroundColor: 'rgb(220 252 231)',
              color: 'rgb(22 101 52)',
              '&:hover': { backgroundColor: 'rgb(134 239 172)' },
              '&.Mui-selected': { backgroundColor: 'rgb(220 252 231)' }
            }}>
              Hoàn thành
            </MenuItem>
          </Select>
        );
      }
    },
    {
      field: "createDate",
      headerName: "Ngày tạo",
      width: 130,
      renderCell: (params) => {
        const value = params.row?.createDate;
        return value ? formatDate(value) : "--";
      }
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 180,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedExport(params.row);
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
              <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => handleEditClick(params)}
            disabled={params.row.status === 1}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              params.row.status === 1 
                ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
            title={params.row.status === 1 ? "Không thể chỉnh sửa phiếu đã hoàn thành" : "Chỉnh sửa"}
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
            onClick={() => {
              setPrintData(params.row);
              setTimeout(() => handlePrint(), 100);
            }}
            disabled={params.row.status !== 1}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              params.row.status !== 1
                ? 'bg-gray-300 cursor-not-allowed opacity-50'
                : 'bg-green-600 hover:bg-green-700'
            }`}
            title="In PDF"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const getData = () => {
    request
      .get("export")
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const getProducts = () => {
    request
      .get("product?isActive=true")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const getWarehouses = () => {
    request
      .get("warehouse?isActive=true")
      .then((response) => {
        setWarehouses(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    getData();
    getProducts();
    getWarehouses();
  }, []);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.consumerName || !formData.tel || !formData.address || !formData.exportDetails.length) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const invalidDetails = formData.exportDetails.some(
      detail => !detail.proId || !detail.wareId || !detail.quantity || !detail.price
    );
    if (invalidDetails) {
      toast.error("Vui lòng nhập đầy đủ thông tin chi tiết xuất hàng.");
      return;
    }

    const requestData = {
      quantity: formData.exportDetails.reduce((sum, detail) => sum + Number(detail.quantity), 0),
      totalPrice: formData.exportDetails.reduce((sum, detail) => sum + (Number(detail.quantity) * Number(detail.price)), 0),
      consumerName: formData.consumerName,
      tel: formData.tel,
      address: formData.address,
      exportDetails: formData.exportDetails.map(detail => ({
        proId: Number(detail.proId),
        wareId: Number(detail.wareId),
        quantity: Number(detail.quantity),
        price: Number(detail.price)
      }))
    };

    try {
      let response;
      if (selectedExport) {
        response = await request.put(`Export/List/${selectedExport.id}`, requestData, {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        response = await request.post("Export/List", requestData, {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (response && response.status === 200) {
        toast.success(selectedExport ? "Cập nhật phiếu xuất thành công!" : "Thêm phiếu xuất thành công!");
        getData();
        handleCloseModal();
      } else {
        throw new Error(selectedExport ? "Không thể cập nhật phiếu xuất" : "Không thể tạo phiếu xuất");
      }
    } catch (error) {
      console.log('API Error:', error.response);
      // Nếu lỗi 400 và data là string có chứa "Số lượng" hoặc "quantity"
      if (
        error.response?.status === 400 &&
        typeof error.response?.data === 'string' &&
        (
          error.response.data.toLowerCase().includes('số lượng') ||
          error.response.data.toLowerCase().includes('quantity')
        )
      ) {
        toast.error("Số lượng không đủ để xuất kho");
      } else {
        const errorMessage = error.response?.data?.message 
          || error.response?.data?.error 
          || error.message 
          || "Có lỗi xảy ra khi xử lý phiếu xuất!";
        toast.error(errorMessage);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedExport(null);
    setFormData({
      quantity: "",
      totalPrice: "",
      consumerName: "",
      tel: "",
      address: "",
      exportDetails: []
    });
  };

  const addExportDetail = () => {
    setFormData(prev => ({
      ...prev,
      exportDetails: [
        ...prev.exportDetails,
        { proId: "", wareId: "", quantity: "", price: "" }
      ]
    }));
  };

  const removeExportDetail = (index) => {
    setFormData(prev => ({
      ...prev,
      exportDetails: prev.exportDetails.filter((_, i) => i !== index)
    }));
  };

  const updateExportDetail = (index, field, value) => {
    // Prevent negative numbers for quantity and price
    if ((field === 'quantity' || field === 'price') && Number(value) < 0) {
      toast.error("Không được nhập số âm");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      exportDetails: prev.exportDetails.map((detail, i) => 
        i === index ? { ...detail, [field]: value } : detail
      )
    }));
  };

  // Hàm xử lý khi chọn kho cho từng dòng chi tiết
  const handleWarehouseChange = async (index, wareId) => {
    const proId = formData.exportDetails[index]?.proId;
    // Kiểm tra trùng kho và sản phẩm
    const isDuplicate = formData.exportDetails.some(
      (detail, i) => i !== index && detail.wareId === wareId && detail.proId === proId && wareId && proId
    );
    if (isDuplicate) {
      toast.error("Không được chọn trùng kho và sản phẩm!");
      return;
    }
    updateExportDetail(index, "wareId", wareId);
    
    if (!wareId) {
      setProductsInWarehouses(prev => ({ ...prev, [index]: [] }));
      return;
    }

    try {
      const res = await request.get(`WarehouseDetail?wareId=${wareId}`);
      const warehouseProducts = res.data.filter(item => item.wareId === Number(wareId));

      // Tính tổng số lượng cho từng sản phẩm trong kho được chọn
      const productQuantities = warehouseProducts.reduce((acc, item) => {
        if (!acc[item.proId]) {
          acc[item.proId] = {
            quantity: 0,
            warehouseDetail: item
          };
        }
        acc[item.proId].quantity += item.quantity || 0;
        return acc;
      }, {});

      // Lọc sản phẩm có số lượng > 0
      let availableProductIds = Object.entries(productQuantities)
        .filter(([_, data]) => data.quantity > 0)
        .map(([proId]) => Number(proId));

      // Lọc sản phẩm từ danh sách products và thêm thông tin số lượng
      let productList = products
        .filter(product => availableProductIds.includes(product.id))
        .map(product => ({
          ...product,
          availableQuantity: productQuantities[product.id]?.quantity || 0,
          warehouseDetail: productQuantities[product.id]?.warehouseDetail
        }));

      // --- Đảm bảo sản phẩm đã chọn luôn có trong danh sách ---
      const currentProId = formData.exportDetails[index]?.proId;
      if (
        currentProId &&
        !productList.some(product => String(product.id) === String(currentProId))
      ) {
        const currentProduct = products.find(
          product => String(product.id) === String(currentProId)
        );
        if (currentProduct) {
          productList = [
            ...productList,
            {
              ...currentProduct,
              availableQuantity: productQuantities[currentProduct.id]?.quantity || 0,
              warehouseDetail: productQuantities[currentProduct.id]?.warehouseDetail
            }
          ];
        }
      }

      setProductsInWarehouses(prev => ({
        ...prev,
        [index]: productList
      }));
    } catch (error) {
      toast.error("Không lấy được sản phẩm trong kho!");
      setProductsInWarehouses(prev => ({ ...prev, [index]: [] }));
    }
  };

  // Khi mở form sửa, load lại danh sách sản phẩm cho từng kho (chạy sau khi setFormData)
  useEffect(() => {
    if (isModalOpen && selectedExport && formData.exportDetails.length > 0) {
      formData.exportDetails.forEach((detail, idx) => {
        if (detail.wareId) {
          handleWarehouseChange(idx, detail.wareId);
        }
      });
    }
    // eslint-disable-next-line
  }, [isModalOpen, selectedExport]);

  const handleEditClick = (params) => {
    setSelectedExport(params.row);
    setFormData({
      quantity: params.row.quantity,
      totalPrice: params.row.totalPrice,
      consumerName: params.row.consumerName,
      tel: params.row.tel,
      address: params.row.address,
      exportDetails: params.row.exportDetails
        ? params.row.exportDetails.map(detail => ({
            ...detail,
            proId: detail.proId ? String(detail.proId) : '',
            wareId: detail.wareId ? String(detail.wareId) : ''
          }))
        : []
    });
    setIsModalOpen(true);
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '', 'height=900,width=1200');
    win.document.write('<html><head><title>Phiếu xuất kho</title>');
    win.document.write('</head><body >');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  };

  const handleStatusChange = async (exportId, newStatus) => {
    try {
      setIsUpdatingStatus(true);
      // Get the current export data
      const currentExport = rows.find(row => row.id === exportId);
      if (!currentExport) {
        throw new Error("Không tìm thấy phiếu xuất");
      }

      // Prepare the request body according to the API format
      const requestData = {
        quantity: currentExport.quantity,
        totalPrice: currentExport.totalPrice,
        consumerName: currentExport.consumerName,
        tel: currentExport.tel,
        address: currentExport.address,
        status: newStatus,
        exportDetails: currentExport.exportDetails.map(detail => ({
          proId: detail.proId,
          wareId: detail.wareId,
          quantity: detail.quantity,
          price: detail.price
        }))
      };

      const response = await request.put(`Export/List/${exportId}`, requestData);
      
      if (response && response.status === 200) {
        // Update the local state
        setRows(prevRows => 
          prevRows.map(row => 
            row.id === exportId ? { ...row, status: newStatus } : row
          )
        );
        toast.success("Cập nhật trạng thái thành công!");
      } else {
        throw new Error("Không thể cập nhật trạng thái");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi cập nhật trạng thái!";
      toast.error(errorMessage);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Thêm hàm xử lý khi chọn sản phẩm
  const handleProductChange = (index, proId) => {
    const wareId = formData.exportDetails[index]?.wareId;
    // Kiểm tra trùng kho và sản phẩm
    const isDuplicate = formData.exportDetails.some(
      (detail, i) => i !== index && detail.wareId === wareId && detail.proId === proId && wareId && proId
    );
    if (isDuplicate) {
      toast.error("Không được chọn trùng kho và sản phẩm!");
      return;
    }
    const product = productsInWarehouses[index]?.find(p => String(p.id) === String(proId));
    const exportPrice = product ? product.exportPrice : '';
    setFormData(prev => ({
      ...prev,
      exportDetails: prev.exportDetails.map((detail, i) =>
        i === index ? { ...detail, proId, price: exportPrice } : detail
      )
    }));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-3xl text-green-800">DANH SÁCH PHIẾU XUẤT</h1>
        <Button
          onClick={() => {
            setSelectedExport(null);
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

      <div className="grid grid-cols-3 md:grid-cols-2 w-full border-solid border-2 border-green-300 rounded-lg p-4">
        <Card className="col-span-3">
          <CardContent style={{ height: "100%", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              className="max-h-4/5"
              disableSelectionOnClick
              getRowId={(row) => row.id}
            />
          </CardContent>
        </Card>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-2xl p-2 sm:p-6 md:p-10 w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
              aria-label="Đóng"
              type="button"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-green-800 mb-6">
              {selectedExport ? 'Chỉnh sửa phiếu xuất' : 'Thêm phiếu xuất'}
            </h2>
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Tên khách hàng</label>
                  <Input
                    name="consumerName"
                    placeholder="Nhập tên khách hàng"
                    value={formData.consumerName}
                    onChange={handleInputChange}
                    className="h-12 text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                  <Input
                    name="tel"
                    placeholder="Nhập số điện thoại"
                    value={formData.tel}
                    onChange={handleInputChange}
                    className="h-12 text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Địa chỉ</label>
                  <Input
                    name="address"
                    placeholder="Nhập địa chỉ"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="h-12 text-base w-full"
                  />
                </div>
              </div>

              <div className="border-t pt-6 mt-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h3 className="text-lg font-bold text-gray-800">Chi tiết xuất hàng</h3>
                  <Button
                    onClick={addExportDetail}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow px-4 py-2 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Thêm chi tiết
                  </Button>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-72">
                  {formData.exportDetails.map((detail, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-3 md:p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-1 w-full">
                        <div className="flex-grow min-w-[120px] w-auto">
                          <label className="block text-xs text-gray-500 mb-1">Kho</label>
                          <Select
                            value={detail.wareId}
                            onChange={(e) => handleWarehouseChange(index, e.target.value)}
                            className="w-auto min-w-[120px]"
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>Chọn kho</em>
                            </MenuItem>
                            {warehouses.map((warehouse) => (
                              <MenuItem key={warehouse.id} value={String(warehouse.id)}>
                                {warehouse.wareName}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                        <div className="flex-grow min-w-[120px] w-auto">
                          <label className="block text-xs text-gray-500 mb-1">Sản phẩm</label>
                          <Select
                            value={
                              productsInWarehouses[index] &&
                              productsInWarehouses[index].some(p => String(p.id) === String(detail.proId))
                                ? String(detail.proId)
                                : ''
                            }
                            onChange={(e) => handleProductChange(index, e.target.value)}
                            className="w-auto min-w-[120px]"
                            displayEmpty
                            disabled={!detail.wareId || !productsInWarehouses[index] || productsInWarehouses[index].length === 0}
                          >
                            <MenuItem value="">
                              <em>Chọn sản phẩm</em>
                            </MenuItem>
                            {productsInWarehouses[index] && productsInWarehouses[index].length > 0 &&
                              productsInWarehouses[index].map((product) => (
                                <MenuItem key={product.id} value={String(product.id)}>
                                  {product.proName}
                                </MenuItem>
                              ))
                            }
                          </Select>
                        </div>
                        <div className="w-24 min-w-0">
                          <label className="block text-xs text-gray-500 mb-1">Số lượng</label>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="Số lượng"
                            value={detail.quantity}
                            onChange={(e) => updateExportDetail(index, "quantity", e.target.value)}
                            className="h-12 text-base w-full"
                          />
                        </div>
                        <div className="w-28 min-w-0">
                          <label className="block text-xs text-gray-500 mb-1">Đơn giá</label>
                          <Input
                            type="number"
                            min="0"
                            step="1000"
                            placeholder="Đơn giá"
                            value={detail.price}
                            onChange={(e) => updateExportDetail(index, "price", e.target.value)}
                            className="h-12 text-base w-full"
                          />
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center justify-end mt-2 md:mt-0">
                        <button
                          onClick={() => removeExportDetail(index)}
                          className="text-red-600 hover:text-white hover:bg-red-500 transition rounded-full p-2"
                          style={{ minWidth: 40 }}
                          title="Xóa chi tiết"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
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
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-2 font-semibold shadow"
                  disabled={formData.exportDetails.length === 0}
                >
                  {selectedExport ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-xs sm:max-w-lg md:max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              Chi tiết phiếu xuất
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b pb-2">
                  <label className="text-gray-600 text-sm">Tên khách hàng:</label>
                  <p className="text-gray-900 font-medium break-words">{selectedExport.consumerName}</p>
                </div>
                <div className="border-b pb-2">
                  <label className="text-gray-600 text-sm">Số điện thoại:</label>
                  <p className="text-gray-900 font-medium break-words">{selectedExport.tel}</p>
                </div>
                <div className="border-b pb-2">
                  <label className="text-gray-600 text-sm">Địa chỉ:</label>
                  <p className="text-gray-900 font-medium break-words">{selectedExport.address}</p>
                </div>
                <div className="border-b pb-2">
                  <label className="text-gray-600 text-sm">Tổng tiền:</label>
                  <p className="text-gray-900 font-medium break-words">{selectedExport.totalPrice}</p>
                </div>
                <div className="border-b pb-2">
                  <label className="text-gray-600 text-sm">Ngày tạo:</label>
                  <p className="text-gray-900 font-medium break-words">{selectedExport.createDate ? formatDate(selectedExport.createDate) : "--"}</p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Chi tiết xuất hàng</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedExport.exportDetails?.map((detail, index) => (
                    <div key={index} className="p-3 border rounded bg-white hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p><strong>Sản phẩm:</strong> {detail.productName}</p>
                          <p><strong>Kho:</strong> {warehouses.find(w => w.id === detail.wareId)?.wareName || 'N/A'}</p>
                        </div>
                        <div>
                          <p><strong>Số lượng:</strong> {detail.quantity}</p>
                          <p><strong>Đơn giá:</strong> {detail.price?.toLocaleString()} VNĐ</p>
                          <p><strong>Thành tiền:</strong> {(detail.quantity * detail.price)?.toLocaleString()} VNĐ</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end mt-6 gap-2">
              <Button
                onClick={() => setIsDetailModalOpen(false)}
                className="bg-gray-300 text-black hover:bg-gray-400"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}

      {printData && (
        <div style={{ display: 'none' }}>
          <ExportPrint ref={printRef} data={printData} />
        </div>
      )}
    </>
  );
};

export default Export;
