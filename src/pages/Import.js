import { useState, useEffect, useRef } from "react";
import { DataGrid } from '@mui/x-data-grid';

import { toast } from "react-toastify";
import { Card, CardContent } from "@mui/material";
import request from "../utils/request";
import { Button, Input } from "../components/ui";
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const Import = () => {
    const columns = [
        { field: "id", headerName: "ID", width: 20 },
        { field: "employId", headerName: "Nhân viên", width: 100 },
        { field: "status", headerName: "Trạng thái", width: 20 },
        { field: "supplierName", headerName: "Tên nhà cung cấp", width: 200 },
        { field: "tel", headerName: "Số điện thoại", width: 100 },
        { field: "address", headerName: "Địa chỉ", width: 100 },
        { field: "email", headerName: "Email", width: 100 },
        { field: "quantity", headerName: "Số lượng", width: 50 },
        { field: "manuDate", headerName: "Ngày sản xuất", width: 170 },
        { field: "totalPrice", headerName: "Tổng tiền", width: 70 },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 100,
            renderCell: (params) => (
                <div className="flex gap-2">
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
                    <button
                        onClick={() => {
                            setSelectedImport(params.row);
                            setFormData({
                                employId: params.row.employId,
                                status: params.row.status,
                                supplierName: params.row.supplierName,
                                tel: params.row.tel,
                                address: params.row.address,
                                email: params.row.email
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


    const [selectedRow, setSelectedRow] = useState(null);
    const [rows, setRows] = useState([]);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedImport, setSelectedImport] = useState(null);
    const [formData, setFormData] = useState({
        employName: "",
        status: "",
        supplierName: "",
        tel: "",
        address: "",
        email: "",
        importDetails: []
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
        getEmployees();
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

    const getEmployees = () => {
        request
            .get("employee")
            .then((response) => {
                setEmployees(response.data);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };


    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setIsDetailModalOpen(false);
        setSelectedImport(null);
        setFormData({
            employName: "",
            status: "",
            supplierName: "",
            tel: "",
            address: "",
            email: ""
        });
    };

    const handleSubmit = async () => {
        if (!formData.employId || !formData.supplierName || !formData.tel || !formData.address) {
            toast.error("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        // Kiểm tra chi tiết xuất hàng
        const invalidDetails = formData.importDetails.some(
            detail => !detail.proId || !detail.quantity || !detail.price
        );
        if (invalidDetails) {
            toast.error("Vui lòng nhập đầy đủ thông tin chi tiết nhập hàng.");
            return;
        }

        try {
            // Tính tổng tiền và số lượng
            const totalQuantity = formData.importDetails.reduce((sum, detail) => sum + Number(detail.quantity), 0);
            const totalPrice = formData.importDetails.reduce((sum, detail) => sum + (Number(detail.quantity) * Number(detail.price)), 0);

            if (!isEditModalOpen) {
                const data = {
                    employId: Number(formData.employId),
                    supplierName: formData.supplierName,
                    tel: formData.tel,
                    address: formData.address,
                    quantity: totalQuantity,
                    totalPrice: totalPrice,
                    isActive: true,
                    importDetails: formData.importDetails.map(detail => ({
                        proId: Number(detail.proId),
                        quantity: Number(detail.quantity),
                        price: Number(detail.price),
                        manuDate: Date(detail.manuDate),
                        isActive: true
                    }))
                };

                console.log('Dữ liệu gửi lên:', JSON.stringify(data, null, 2));
                try {
                    const response = await request.post("import", data);
                    toast.success("Thêm phiếu nhập thành công!");
                    getData();
                    handleCloseModal();
                } catch (error) {
                    console.error('Lỗi chi tiết:', error.response?.data);
                    if (error.response?.data?.error) {
                        toast.error(`Lỗi: ${error.response.data.error}`);
                    } else if (error.response?.data?.message) {
                        toast.error(`Lỗi: ${error.response.data.message}`);
                    } else {
                        toast.error("Có lỗi xảy ra khi thêm phiếu nhập!");
                    }
                }
                return;
            }

            const data = {
                employId: Number(formData.employId),
                supplierName: formData.supplierName,
                tel: formData.tel,
                address: formData.address,
                quantity: totalQuantity,
                totalPrice: totalPrice,
                isActive: true,
                importDetails: formData.importDetails.map(detail => ({
                    proId: Number(detail.proId),
                    quantity: Number(detail.quantity),
                    price: Number(detail.price),
                    manuDate: Date(detail.manuDate),
                    isActive: true
                }))
            };

            if (isEditModalOpen && selectedImport) {
                try {
                    const response = await request.put(`import/${selectedImport.id}`, {
                        ...data,
                        id: selectedImport.id
                    });
                    console.log(response);
                    toast.success("Cập nhật phiếu nhập thành công!");
                    getData();
                    handleCloseModal();
                } catch (error) {
                    console.error('Lỗi chi tiết:', error.response?.data);
                    if (error.response?.data?.error) {
                        toast.error(`Lỗi: ${error.response.data.error}`);
                    } else if (error.response?.data?.message) {
                        toast.error(`Lỗi: ${error.response.data.message}`);
                    } else {
                        toast.error("Có lỗi xảy ra khi cập nhật phiếu nhập!");
                    }
                }
            }
        } catch (error) {
            console.error('Lỗi chi tiết:', error.response?.data);
            toast.error("Có lỗi xảy ra khi xử lý phiếu nhập!");
        }
    };

    const addImportDetail = () => {
        setFormData(prev => ({
            ...prev,
            importDetails: [
                ...prev.importDetails,
                { proId: "", quantity: "", price: "", manuDate: "" }
            ]
        }));
    };

    const deleteImportDetail = (index) => {
        setFormData(prev => ({
            ...prev,
            importDetails: prev.importDetails.filter((_, i) => i !== index)
        }));
    };

    const updateImportDetail = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            importDetails: prev.importDetails.map((detail, i) =>
                i === index ? { ...detail, [field]: value } : detail
            )
        }));
    };

    return (
        <>
            <div className="p-6">
                <Card>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <Typography variant="h5" component="h2">
                                Quản lý phiếu nhập
                            </Typography>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="M12 5v14" />
                                </svg>
                                Thêm mới
                            </Button>
                        </div>
                        <div style={{ height: 400, width: "100%" }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                checkboxSelection
                                disableSelectionOnClick
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8 md:p-10 w-full max-w-full sm:max-w-2xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-green-800 mb-6">
                            Thêm phiếu xuất
                        </h2>
                        <form className="space-y-5">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Nhân viên</label>
                                <Select
                                    name="employId"
                                    value={formData.employId}
                                    onChange={handleAddChange}
                                    className="w-full h-12 text-base"
                                    displayEmpty
                                >
                                    <MenuItem value="">
                                        <em>Chọn nhân viên</em>
                                    </MenuItem>
                                    {
                                        employees.map((employee) => (
                                            <MenuItem key={employee.id} value={String(employee.id)}>
                                                {employee.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Nhà cung cấp</label>
                                <Input
                                    name="supplierName"
                                    placeholder="Nhập nhà cung cấp"
                                    value={formData.supplierName}
                                    onChange={handleAddChange}
                                    className="h-12 text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                                <Input
                                    name="tel"
                                    placeholder="Nhập số điện thoại"
                                    value={formData.tel}
                                    onChange={handleAddChange}
                                    className="h-12 text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Địa chỉ</label>
                                <Input
                                    name="address"
                                    placeholder="Nhập địa chỉ"
                                    value={formData.address}
                                    onChange={handleAddChange}
                                    className="h-12 text-base"
                                />
                            </div>
                            <div className="border-t pt-6 mt-4">
                                <div className="flex justify-between items-center mb-4">
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
                                    {formData.importDetails.map((detail, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm items-center bg-white hover:bg-gray-50 transition"
                                        >
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center flex-1 w-full">
                                                <div className="flex-1 w-full sm:w-48">
                                                    <label className="block text-xs text-gray-500 mb-1">Sản phẩm</label>
                                                    <Select
                                                        value={detail.proId}
                                                        onChange={(e) => updateImportDetail(index, "proId", e.target.value)}
                                                        className="w-full h-12 text-base"
                                                        displayEmpty
                                                    >
                                                        <MenuItem value="">
                                                            <em>Chọn sản phẩm</em>
                                                        </MenuItem>
                                                        {products.map((product) => (
                                                            <MenuItem key={product.id} value={String(product.id)}>
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
                                    {isEditModalOpen ? 'Cập nhật' : 'Thêm mới'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isDetailModalOpen && selectedImport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                        <h2 className="text-2xl font-semibold text-green-800 mb-4">
                            Chi tiết phiếu nhập
                        </h2>

                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <label className="text-gray-600 text-sm">Nhân viên:</label>
                                <p className="text-gray-900 font-medium">{selectedImport.employId}</p>
                            </div>

                            <div className="border-b pb-2">
                                <label className="text-gray-600 text-sm">Tên nhà cung cấp:</label>
                                <p className="text-gray-900 font-medium">{selectedImport.supplierName}</p>
                            </div>

                            <div className="border-b pb-2">
                                <label className="text-gray-600 text-sm">Số điện thoại:</label>
                                <p className="text-gray-900 font-medium">{selectedImport.tel}</p>
                            </div>

                            <div className="border-b pb-2">
                                <label className="text-gray-600 text-sm">Địa chỉ:</label>
                                <p className="text-gray-900 font-medium">{selectedImport.address}</p>
                            </div>

                            <div className="border-b pb-2">
                                <label className="text-gray-600 text-sm">Tổng tiền:</label>
                                <p className="text-gray-900 font-medium">{selectedImport.totalPrice}</p>
                            </div>

                            <div className="border-b pb-2">
                                <label className="text-gray-600 text-sm">Ngày sản xuất:</label>
                                <p className="text-gray-900 font-medium">{selectedImport.manuDate}</p>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-lg font-semibold mb-2">Chi tiết nhập hàng</h3>
                                <div className="space-y-2">
                                    {selectedImport.importDetails?.map((detail, index) => (
                                        <div key={index} className="p-3 border rounded">
                                            <p><strong>Sản phẩm:</strong> {detail.productName}</p>
                                            <p><strong>Số lượng:</strong> {detail.quantity}</p>
                                            <p><strong>Đơn giá:</strong> {detail.price}</p>
                                            <p><strong>Ngày sản xuất:</strong> {detail.manuDate}</p>
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
                </div>
            )}
        </>
    );
};
export default Import;