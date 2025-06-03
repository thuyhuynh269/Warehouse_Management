import { useState, useEffect, useRef, useMemo } from "react";
import { DataGrid } from '@mui/x-data-grid';

import { toast } from "react-toastify";
import { Card, CardContent } from "@mui/material";
import request from "../utils/request";
import { Button, Input } from "../components/ui";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ImportPrint from './ImportPrint';
import 'jspdf-autotable';
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

const Import = () => {
    const columns = [
        { field: "id", headerName: "ID", width: 20 },
        { field: "employeeName", headerName: "Nhân viên", width: 140 },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 140,
            renderCell: (params) => {
                const status = params.row.status;
                return (
                    <Select
                        value={status}
                        onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
                        disabled={isUpdatingStatus}
                        className={`w-full ${status === 1
                            ? 'bg-green-100 text-green-800'
                            : status === 2
                                ? 'bg-blue-100 text-blue-800'
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
                            Mới
                        </MenuItem>
                        <MenuItem value={1} sx={{
                            backgroundColor: 'rgb(220 252 231)',
                            color: 'rgb(22 101 52)',
                            '&:hover': { backgroundColor: 'rgb(134 239 172)' },
                            '&.Mui-selected': { backgroundColor: 'rgb(220 252 231)' }
                        }}>
                            Đang xử lí
                        </MenuItem>
                        <MenuItem value={2} sx={{
                            backgroundColor: 'rgb(219, 234, 254)',
                            color: 'rgb(30, 64, 175)',
                            '&:hover': { backgroundColor: 'rgb(191, 219, 254)' },
                            '&.Mui-selected': { backgroundColor: 'rgb(219, 234, 254)' }
                        }}>
                            Hoàn thành
                        </MenuItem>
                    </Select>
                );
            }
        },
        { field: "supplierName", headerName: "Tên nhà cung cấp", width: 200 },
        { field: "tel", headerName: "Số điện thoại", width: 110 },
        { field: "address", headerName: "Địa chỉ", width: 100 },
        { field: "email", headerName: "Email", width: 100 },
        { field: "quantity", headerName: "Số lượng", width: 50 },
        { field: "totalPrice", headerName: "Tổng tiền", width: 140 },
        {
            field: "createDate",
            headerName: "Ngày nhập",
            width: 115,
            renderCell: (params) => {
                const value = params.row?.createDate;
                return value ? formatDate(value) : "--";
            }
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 115,
            renderCell: (params) => (
                <div className="flex gap-2">
                    {/* xem */}
                    <button
                        onClick={() => {
                            setSelectedImport(params.row);
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
                    {/* chỉnh */}
                    <button
                        onClick={() => handleEditClick(params)}
            disabled={params.row.status === 2}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${params.row.status === 2
                            ? 'bg-gray-400 cursor-not-allowed opacity-50'
                            : 'bg-cyan-600 hover:bg-cyan-700'
                            }`}
                        title={params.row.status === 2 ? "Không thể chỉnh sửa phiếu đã hoàn thành" : "Chỉnh sửa"}
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
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${params.row.status !== 2
                            ? 'bg-gray-300 cursor-not-allowed opacity-50'
                            : 'bg-green-600 hover:bg-green-700'
                            }`}
                        title="In PDF"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2" fill="none" />
                        </svg>
                    </button>
                </div>
            ),
        },
    ];

    const [selectedRow, setSelectedRow] = useState(null);
    const [rows, setRows] = useState([]);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [selectedImport, setSelectedImport] = useState(null);
    const [formData, setFormData] = useState({
        employName: "",
        status: "",
        supplierName: "",
        tel: "",
        address: "",
        email: "",
        details: []
    });

    const getData = () => {
        request
            .get("import", {
                params: {
                    isActive: true
                }
            })
            .then((response) => {
                setRows(response.data);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    useEffect(() => {
        getData();
        getProducts();
    }, []);

    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    const getProducts = () => {
        request
            .get("product")
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };


    const handleStatusChange = async (impId, newStatus) => {
        try {
            setIsUpdatingStatus(true);
            const currentImport = rows.find(row => row.id === impId);
            if (!currentImport) {
                throw new Error("Không tìm thấy phiếu nhập");
            }

            // Prepare the request body according to the API format
            const requestData = {
                status: newStatus,
            };

            const response = await request.put(`Import/List/${impId}`, requestData);

            if (response && response.status === 200) {
                // Update the local state
                setRows(prevRows =>
                    prevRows.map(row =>
                        row.id === impId ? { ...row, status: newStatus } : row
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
    const [printData, setPrintData] = useState(null);
    const printRef = useRef();
    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const win = window.open('', '', 'height=900,width=1200');
        win.document.write('<html><head><title>Phiếu nhập kho</title>');
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

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleEditClick = (params) => {
        console.log(params.row)
        setSelectedImport(params.row);
        setFormData({
            totalPrice: params.row.totalPrice,
            supplierName: params.row.supplierName,
            tel: params.row.tel,
            address: params.row.address,
            email: params.row.email,
            details: params.row.importDetails
                ? params.row.importDetails.map(detail => ({
                    ...detail,
                    proId: Number(detail.proId),
                    quantity: Number(detail.quantity),
                    price: Number(detail.price),
                    manuDate: formatToYYYYMMDD(detail.manuDate)
                }))
                : []
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setIsDetailModalOpen(false);
        setSelectedImport(null);
        setFormData({
            status: "",
            supplierName: "",
            tel: "",
            address: "",
            email: "",
            details: []
        });
    };

    const handleSubmit = async () => {
        console.log(formData)
        if (!formData.supplierName || !formData.tel || !formData.address || !formData.email || !formData.details.length) {
            toast.error("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        // Kiểm tra chi tiết nhập hàng
        const invalidDetails = formData.details.some(
            detail => !detail.proId || !detail.quantity || !detail.price || !detail.manuDate
        );
        if (invalidDetails) {
            toast.error("Vui lòng nhập đầy đủ thông tin chi tiết nhập hàng.");
            return;
        }
        const createDate = new Date(formData.createDate || new Date());
        const hasInvalidManuDate = formData.details.some((detail) => {
            const manuDate = new Date(detail.manuDate);
            return manuDate > createDate;
        });
        if (hasInvalidManuDate) {
            toast.error("Ngày sản xuất không được lớn hơn ngày tạo phiếu.");
            return;
        }
        const requestData = {
            employId: Number(formData.employId),
            quantity: formData.details.reduce((sum, detail) => sum + Number(detail.quantity), 0),
            totalPrice: formData.details.reduce((sum, detail) => sum + (Number(detail.quantity) * Number(detail.price)), 0),
            supplierName: formData.supplierName,
            tel: formData.tel,
            address: formData.address,
            email: formData.email,
            details: formData.details.map(detail => ({
                proId: Number(detail.proId),
                quantity: Number(detail.quantity),
                price: Number(detail.price),
                manuDate: formatToYYYYMMDD(detail.manuDate)
            }))
        };
        try {
            let response;
            if (selectedImport) {
                response = await request.put(`Import/List/${selectedImport.id}`, requestData, {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                response = await request.post("Import/List", requestData, {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            if (response && response.status === 200) {
                toast.success(selectedImport ? "Cập nhật phiếu nhập thành công!" : "Thêm phiếu nhập thành công!");
                getData();
                handleCloseModal();
            } else {
                throw new Error(selectedImport ? "Không thể cập nhật phiếu nhập" : "Không thể tạo phiếu nhập");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || error.message
                || "Có lỗi xảy ra khi xử lý phiếu nhập!";
            toast.error(errorMessage);
        }

    };
    const filterProducts = useMemo(() => {
        const selectedProIds = formData.details
            .map(detail => Number(detail.proId))
            .filter(Boolean); // Loại bỏ các giá trị không hợp lệ

        return products.filter(product => !selectedProIds.includes(product.id));
    }, [formData.details, products]);

    const addImportDetail = () => {

        setFormData(prev => ({
            ...prev,
            details: [
                ...prev.details,
                { proId: "", quantity: "", price: "", manuDate: "" }
            ]
        }));
    };

    const deleteImportDetail = (index) => {
        setFormData(prev => ({
            ...prev,
            details: prev.details.filter((_, i) => i !== index)
        }));
    };

    const updateImportDetail = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            details: prev.details.map((detail, i) => {
                if (i !== index) return detail;

                if (field === 'proId') {
                    const selectedProduct = products.find(p => p.id === value);
                    return {
                        ...detail,
                        proId: value,
                        price: selectedProduct ? selectedProduct.importPrice : 0
                    };
                }

                return {
                    ...detail,
                    [field]: value
                };
            })
        }));
    };
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-3xl text-green-800">QUẢN LÝ PHIẾU NHẬP</h1>
                <Button
                    onClick={() => {
                        setSelectedImport(null);
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
                    <div className="bg-white rounded-xl shadow-2xl p-2 sm:p-6 md:p-5 w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                            aria-label="Đóng"
                            type="button"
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold text-green-800 mb-6">
                            {selectedImport ? 'Chỉnh sửa phiếu nhập' : 'Thêm phiếu nhập'}
                        </h2>
                        <form className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Nhà cung cấp</label>
                                    <Input
                                        name="supplierName"
                                        placeholder="Nhập nhà cung cấp"
                                        value={formData.supplierName}
                                        onChange={handleAddChange}
                                        className="h-12 text-base w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                                    <Input
                                        name="tel"
                                        placeholder="Nhập số điện thoại"
                                        value={formData.tel}
                                        onChange={handleAddChange}
                                        className="h-12 text-base w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Địa chỉ</label>
                                    <Input
                                        name="address"
                                        placeholder="Nhập địa chỉ"
                                        value={formData.address}
                                        onChange={handleAddChange}
                                        className="h-12 text-base w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                                    <Input
                                        name="email"
                                        placeholder="Nhập email"
                                        value={formData.email}
                                        onChange={handleAddChange}
                                        className="h-12 text-base w-full"
                                    />
                                </div>
                            </div>
                            <div className="border-t pt-6 mt-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                                    <h3 className="text-lg font-bold text-gray-800">Chi tiết nhập hàng</h3>
                                    <Button
                                        onClick={addImportDetail}
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow px-4 py-2 flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                        Thêm chi tiết
                                    </Button>
                                </div>
                                <div className="space-y-3 overflow-x-auto overflow-y-auto max-h-72">
                                    {
                                        formData.details.map((detail, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm items-center bg-white hover:bg-gray-50 transition"
                                            >
                                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center flex-1 w-full">
                                                    <div className="flex-1 w-full sm:w-48">
                                                        <label className="block text-xs text-gray-500 mb-1">Sản phẩm</label>
                                                        <Select
                                                            value={detail.proId}
                                                            onChange={(e) => updateImportDetail(index, "proId", Number(e.target.value))}
                                                            className="w-auto min-w-[120px]"
                                                            displayEmpty
                                                            renderValue={(selected) => {
                                                                if (!selected) {
                                                                    return <em>Chọn sản phẩm</em>;
                                                                }
                                                                const selectedProduct = products.find(product => product.id === selected);
                                                                return selectedProduct ? selectedProduct.proName : '';
                                                            }}
                                                        >
                                                           
                                                            <MenuItem value="">
                                                                <em>Chọn sản phẩm</em>
                                                            </MenuItem>
                                                            {filterProducts.map((product) => (
                                                                <MenuItem key={product.id} value={product.id}>
                                                                    {product.proName}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                    <div className="flex-1 w-full sm:w-32">
                                                        <label className="block text-xs text-gray-500 mb-1">Số lượng</label>
                                                        <Input
                                                            type="number"
                                                            placeholder="Số lượng"
                                                            value={detail.quantity}
                                                            onChange={(e) => updateImportDetail(index, "quantity", e.target.value)}
                                                            className="h-12 text-base"
                                                        />
                                                    </div>
                                                    <div className="flex-1 w-full sm:w-32">
                                                        <label className="block text-xs text-gray-500 mb-1">Đơn giá</label>
                                                        <Input
                                                            type="number"
                                                            placeholder="Đơn giá"
                                                            value={detail.price}
                                                            onChange={(e) => updateImportDetail(index, "price", e.target.value)}
                                                            className="h-12 text-base"
                                                        />
                                                    </div>
                                                    <div className="flex-1 w-full sm:w-32">
                                                        <label className="block text-xs text-gray-500 mb-1">Ngày sản xuất</label>
                                                        <Input
                                                            type="date"
                                                            placeholder="Ngày sản xuất"
                                                            value={detail.manuDate}
                                                            onChange={(e) => updateImportDetail(index, "manuDate", e.target.value)}
                                                            className="h-12 text-base"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0 flex items-center h-12">
                                                    <button
                                                        onClick={() => deleteImportDetail(index)}
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
                            <div className="flex justify-end gap-4 mt-8">
                                <Button
                                    onClick={handleCloseModal}
                                    className="bg-gray-300 text-black hover:bg-gray-400 rounded-lg px-6 py-2 font-semibold"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-2 font-semibold shadow"
                                >
                                    {selectedImport ? 'Cập nhật' : 'Thêm mới'}
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
            {isDetailModalOpen && selectedImport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                        <h2 className="text-2xl font-semibold text-green-1000 mb-4">
                            Chi tiết phiếu nhập
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border-b pb-2">
                                    <label className="text-gray-600 text-sm">Nhân viên:</label>
                                    <p className="text-gray-900 font-medium break-words">{selectedImport.employId}</p>
                                </div>

                                <div className="border-b pb-2">
                                    <label className="text-gray-600 text-sm">Tên nhà cung cấp:</label>
                                    <p className="text-gray-900 font-medium break-words">{selectedImport.supplierName}</p>
                                </div>

                                <div className="border-b pb-2">
                                    <label className="text-gray-600 text-sm">Số điện thoại:</label>
                                    <p className="text-gray-900 font-medium">{selectedImport.tel}</p>
                                </div>

                                <div className="border-b pb-2">
                                    <label className="text-gray-600 text-sm">Địa chỉ:</label>
                                    <p className="text-gray-900 font-medium break-words">{selectedImport.address}</p>
                                </div>

                                <div className="border-b pb-2">
                                    <label className="text-gray-600 text-sm">Email:</label>
                                    <p className="text-gray-900 font-medium break-words">{selectedImport.email}</p>
                                </div>

                                <div className="border-b pb-2">
                                    <label className="text-gray-600 text-sm">Tổng tiền:</label>
                                    <p className="text-gray-900 font-medium break-words">{selectedImport.totalPrice}</p>
                                </div>

                                <div className="border-b pb-2">
                                    <label className="text-gray-600 text-sm">Ngày nhập:</label>
                                    <p className="text-gray-900 font-medium">{selectedImport.createDate ? formatDate(selectedImport.createDate) : "--"}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold mb-2">Chi tiết nhập hàng</h3>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedImport.importDetails?.map((detail, index) => (
                                        <div key={index} className="p-3 border rounded bg-white hover:bg-gray-50 transition-colors">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                <div>
                                                    <p><strong>Sản phẩm:</strong> {detail.productName}</p>
                                                </div>
                                                <div>
                                                    <p><strong>Số lượng:</strong> {detail.quantity}</p>
                                                    <p><strong>Đơn giá:</strong> {detail.price}</p>
                                                    <p><strong>Ngày sản xuất:</strong> {formatDate(detail.manuDate)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="bg-gray-300 text-black hover:bg-gray-400"
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                </div >
            )}
            {
                printData && (
                    <div style={{ display: 'none' }}>
                        <ImportPrint ref={printRef} data={printData} />
                    </div>
                )
            }
        </>
    );
};
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
function formatToYYYYMMDD(dateInput) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
export default Import;