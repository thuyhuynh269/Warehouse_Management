import { useState, useEffect, useRef } from "react";
import { DataGrid } from '@mui/x-data-grid';

import { toast } from "react-toastify";
import { Card, CardContent } from "@mui/material";
import request from "../utils/request";
import { Button, Input } from "../components/ui";
import { useNavigate } from "react-router-dom";

const Import = () => {
    const columns = [
        { field: "id", headerName: "ID", width: 50 },
        { field: "employId", headerName: "Mã nhân viên", width: 50 },
        { field: "createDate", headerName: "Ngày nhập", width: 70 },
        { field: "quantity", headerName: "Số lượng", width: 50 },
        { field: "totalPrice", headerName: "Tổng tiền", width: 50 },
        { field: "status", headerName: "Trạng thái", width: 50 },
        { field: "supplierName", headerName: "Tên nhà cung cấp", width: 200 },
        { field: "tel", headerName: "Số điện thoại", width: 100 },
        { field: "address", headerName: "Địa chỉ", width: 100 },
        { field: "email", headerName: "Email", width: 100 },
    ];

    const [selectedRow, setSelectedRow] = useState(null);
    const [rows, setRows] = useState([]);
    const [employId, setEmployId] = useState(0);
    const [status, setStatus] = useState(0);
    const [supplierName, setSupplierName] = useState("");
    const [tel, setTel] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const lable = useRef();

    const getData = () => {
        request
            .get("Import?isActive=true")
            .then((response) => {
                console.log(response);
                setRows(response.data);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    useEffect(getData, []);

    const handleImportDetail = () => {
        if (selectedRow) {
            navigate(`/ImportDetail/${selectedRow}`);
        } else {
            toast.warning("Vui lòng chọn một dòng!");
        }
    };

    const handleRowClick = (params) => {
        const selectedName = params.row.id === selectedRow ? "" : params.row.employId;
        console.log(params);
        setSelectedRow(params.row.id === selectedRow ? null : params.row.id);
        setEmployId(params.row.employId);
        setStatus(params.row.status);
        setSupplierName(params.row.supplierName);
        setTel(params.row.tel);
        setAddress(params.row.address);
        setEmail(params.row.email);
        lable.current.innerText = selectedName;
    };


    const handleAddData = () => {
        request
            .post("Import", { employId, status, supplierName, tel, address, email })
            .then((response) => {
                getData();
                setEmployId(0);
                setStatus(0);
                setSupplierName("");
                setAddress("");
                setTel("");
                setEmail("");
                toast.success(response.data.message);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const deselect = () => {
        setSelectedRow(null);
        lable.current.innerText = "";
    };

    const handleUpdateData = () => {
        request
            .put(`Import/${selectedRow}`, { id: selectedRow, employId, status, supplierName, address, tel, email })
            .then((response) => {
                getData();
                setEmployId(0);
                setStatus(0);
                setSupplierName("");
                setAddress("");
                setTel("");
                setEmail("");
                setSelectedRow(null);
                lable.current.innerText = "";
                toast.success(response.data.message);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const handleDeleteData = () => {
        request
            .delete(`import/${selectedRow}`)
            .then((response) => {
                getData();
                setEmployId(0);
                setStatus(0);
                setSupplierName("");
                setAddress("");
                setTel("");
                setEmail("");
                setSelectedRow(null);
                lable.current.innerText = "";
                toast.success(response.data.message);
            })
            .catch((error) => {
                toast.error(error);
            });
    };

    return (
        <>
            <h1 className="font-bold text-3xl text-green-800 mb-8">Danh mục nhập hàng</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full border-solid border-2 border-green-300 rounded-lg p-4">
                <Card >
                    <CardContent style={{ height: "80%", width: "100%" }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            selectionModel={selectedRow}
                            onRowClick={handleRowClick}
                            className="max-h-4/5" />
                    </CardContent>
                    <div className="grid grid-cols-4 mx-4 mb-2">
                        <label className="text-green-900 float-start m-auto">Selected:</label>

                        <div className="border-solid border-2 border-grey-500 rounded-lg grid grid-cols-5 col-span-2 w-full">
                            <span
                                className="rounded-l-lg px-1 col-span-4 text-center justify-center m-auto"
                                ref={lable}
                            />
                            <Button
                                className="w-auto text-red-500 font-bold bg-gray-100"
                                onClick={deselect}
                                disabled={selectedRow == null}
                            >
                                X
                            </Button>
                        </div>
                        <Button
                            className=" bg-green-200 float-end m-auto rounded-lg"
                            onClick={getData}
                        >
                            Refresh
                        </Button>
                    </div>
                    <div>
                        <Button
                            primary
                            onClick={handleImportDetail}
                            className="rounded-lg mb-2 ml-2"
                            disabled={selectedRow == null}
                        >
                            Chi tiết phiếu nhập
                        </Button>
                    </div>
                </Card>
                <div>
                    <div className="mx-4 mb-2">
                        <label className="text-green-900 text-xl float-start">Mã nhân viên</label>
                        <Input
                            type="text"
                            value={employId}
                            onChange={(e) => setEmployId(e.target.value)}
                            className="border-solid border-2 border-green-500 rounded-lg w-full"
                        />
                    </div>
                    <div className="mx-4 mb-2">
                        <label className="text-green-900 text-xl float-start">Trạng thái </label>
                        <Input
                            type="text"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border-solid border-2 border-green-500 rounded-lg w-full"
                        />
                    </div>
                    <div className="mx-4 mb-2">
                        <label className="text-green-900 text-xl float-start">Nhà cung cấp</label>
                        <Input
                            type="text"
                            value={supplierName}
                            onChange={(e) => setSupplierName(e.target.value)}
                            className="border-solid border-2 border-green-500 rounded-lg w-full"
                        />
                    </div>
                    <div className="mx-4 mb-2">
                        <label className="text-green-900 text-xl float-start">Số điện thoại </label>
                        <Input
                            type="text"
                            value={tel}
                            onChange={(e) => setTel(e.target.value)}
                            className="border-solid border-2 border-green-500 rounded-lg w-full"
                        />
                    </div>
                    <div className="mx-4 mb-2">
                        <label className="text-green-900 text-xl float-start">Địa chỉ </label>
                        <Input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="border-solid border-2 border-green-500 rounded-lg w-full"
                        />
                    </div>
                    <div className="mx-4 mb-2">
                        <label className="text-green-900 text-xl float-start">Email</label>
                        <Input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-solid border-2 border-green-500 rounded-lg w-full"
                        />
                    </div>
                    <div className="mx-2 float-start">
                        <Button
                            primary
                            onClick={handleAddData}
                            className="rounded-lg mb-2 ml-2"
                        >
                            Add
                        </Button>
                        <Button
                            primary
                            disabled={selectedRow == null}
                            onClick={handleUpdateData}
                            className="rounded-lg float-end disabled:bg-green-300 mb-2 ml-2"
                        >
                            Update
                        </Button>
                    </div>
                    <div className="mx-4 mb-2 ml-2">
                        <Button
                            primary
                            disabled={selectedRow == null}
                            onClick={handleDeleteData}
                            className="rounded-lg float-end bg-red-600 disabled:bg-red-300 hover:bg-red-400 mb-2 ml-2"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Import;