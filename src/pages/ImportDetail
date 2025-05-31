import { useState, useEffect, useRef } from "react";
import { DataGrid } from '@mui/x-data-grid';

import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@mui/material";
import request from "../utils/request";
import { Button, Input } from "../components/ui";

const ImportDetail = () => {
    const columns = [
        { field: "id", headerName: "ID", width: 50 },
        { field: "proId", headerName: "Mã sản phẩm", width: 50 },
        { field: "productName", headerName: "Tên sản phẩm", width: 100 },
        { field: "impId", headerName: "Mã phiếu nhập", width: 50 },
        { field: "quantity", headerName: "Số lượng", width: 70 },
        { field: "price", headerName: "Giá tiền", width: 140 },
        { field: "manuDate", headerName: "Ngày sản xuất", width: 200 },
    ];

    const [selectedRow, setSelectedRow] = useState(null);
    const [rows, setRows] = useState([]);
    const [proId, setProId] = useState(0);
    //const [impId, setImpId] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [manuDate, setManuDate] = useState("");

    const { impId } = useParams();

    const lable = useRef();

    const getData = () => {
        request
            .get(`ImportDetail?impId=${impId}`)
            .then((response) => {
                setRows(response.data);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    useEffect(getData, []);


    const handleRowClick = (params) => {
        const selectedName = params.row.id === selectedRow ? "" : params.row.id;
        console.log(params);
        setSelectedRow(params.row.id === selectedRow ? null : params.row.id);
        setProId(params.row.proId);
        setQuantity(params.row.quantity);
        setPrice(params.row.price);
        setManuDate(params.row.manuDate);
        lable.current.innerText = selectedName;
    };


    const handleAddData = () => {
        request
            .post("ImportDetail", { proId, impId, quantity, price, manuDate })
            .then((response) => {
                getData();
                setProId(0);
                setQuantity(0);
                setPrice(0);
                setManuDate("");
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
            .put(`ImportDetail/${selectedRow}`, { id: selectedRow, proId, impId, quantity, price, manuDate })
            .then((response) => {
                getData();
                setProId(0);
                setQuantity(0);
                setPrice(0);
                setManuDate("");
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
            .delete(`ImportDetail/${selectedRow}`)
            .then((response) => {
                getData();
                setProId(0);
                setQuantity(0);
                setPrice(0);
                setManuDate("");
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
            <h1 className="font-bold text-3xl text-green-800 mb-8">Danh mục chi tiết nhập hàng</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full border-solid border-2 border-green-300 rounded-lg p-4">
                <Card >
                    <CardContent style={{ height: "80%", width: "100%" }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            selectionModel={selectedRow ? [selectedRow] : []}
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
                </Card>
                <div>
                    <div className="mx-4 mb-2">
                        <label className="text-green-900 text-xl float-start">Mã sản phẩm</label>
                        <Input
                            type="text"
                            value={proId}
                            onChange={(e) => setProId(e.target.value)}
                            className="border-solid border-2 border-green-500 rounded-lg w-full"
                        />
                    </div>
                    <div className="mx-4 mb-2">
                        <label className="text-green-900 text-xl float-start">Mã phiếu nhập</label>
                        <Input
                            type="text"
                            value={impId}
                            onChange={(e) => setImpId(e.target.value)}
                            className="border-solid border-2 border-green-500 rounded-lg w-full"
                        />
                    </div>
                    <div className="mx-4 mb-2">
                        <label className="text-green-900 text-xl float-start">Số lượng</label>
                        <Input
                            type="text"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="border-solid border-2 border-green-500 rounded-lg w-full"
                        />
                    </div>
                    <div className="mx-4 mb-2">
                        <label className="text-green-900 text-xl float-start">Giá tiền</label>
                        <Input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border-solid border-2 border-green-500 rounded-lg w-full"
                        />
                    </div>
                    <div className="mx-4 mb-2">
                        <label className="text-green-900 text-xl float-start">Ngày sản xuất</label>
                        <Input
                            type="date"
                            value={manuDate}
                            onChange={(e) => setManuDate(e.target.value)}
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
export default ImportDetail;