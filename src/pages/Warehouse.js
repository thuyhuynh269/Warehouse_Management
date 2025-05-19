import { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { Card, CardContent } from "@mui/material";
import request from "../utils/request";
import { Button, Input } from "../components/ui";

const Warehouse = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "wareName", headerName: "Tên kho", width: 150 },
    { field: "address", headerName: "Địa chỉ", width: 200 },
    { field: "tel", headerName: "Điện thoại", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
  ];

  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [wareName, setwareName] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  

  const label = useRef();

const getData = () => {
    request
      .get("Warehouse?isActive=true")
      .then((response) => {
        console.log(response);
        setRows(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(getData, []);

  const handleRowClick = (params) => {
    const selectedName = params.row.id === selectedRow ? "" : params.row.wareName;
    console.log(params);
    setSelectedRow(params.row.id === selectedRow ? null : params.row.id);
    setwareName(params.row.wareName);
    setAddress(params.row.address);
    setTel(params.row.tel);
    setEmail(params.row.email);
    label.current.innerText = selectedName;
  };

  const handleAddData = () => {
    request
      .post("warehouse", { wareName, address, tel, email })
      .then((response) => {
        getData();
        setwareName("");
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
    label.current.innerText = "";
    setwareName("");
    setAddress("");
    setTel("");
    setEmail("");
  };

  const handleUpdateData = () => {
    request
      .put(`warehouse/${selectedRow}`, { id: selectedRow, wareName, address, tel, email })
      .then((response) => {
        getData();
        setwareName("");
        setAddress("");
        setTel("");
        setEmail("");
        setSelectedRow(null);
        label.current.innerText = "";
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleDeleteData = () => {
    request
      .delete(`warehouse/${selectedRow}`)
      .then((response) => {
        getData();
        setwareName("");
        setAddress("");   
        setTel("");
        setEmail("");
        setSelectedRow(null);
        label.current.innerText = "";
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <>
     <h1 className="font-bold text-3xl text-green-800 mb-8">Danh mục sản phẩm</h1>
    <div className="grid grid-cols-3 md:grid-cols-2 w-full border-solid border-2 border-green-300 rounded-lg p-4">
      <Card >
        <CardContent style={{ height: "80%", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              selectionModel={selectedRow}
              onRowClick={handleRowClick}
              className="max-h-4/5"
            />
        </CardContent>
        <div className="grid grid-cols-4 mx-4 mb-2">
          <label className="text-green-900 float-start m-auto">Selected:</label>

          <div className="border-solid border-2 border-grey-500 rounded-lg grid grid-cols-5 col-span-2 w-full">
            <span
              className="rounded-l-lg px-1 col-span-4 text-center justify-center m-auto"
              ref={label}
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
      <div className="col-span-1">
        <div className="mx-4 mb-2">
          <label className="text-green-900 text-xl float-start">Name</label>
          <Input
            type="text"
            value={wareName}
            onChange={(e) => setwareName(e.target.value)}
            className="border-solid border-2 border-green-500 rounded-lg w-full"
          />
        </div>
        <div className="mx-4 mb-2">
          <label className="text-green-900 text-xl float-start">Address</label>
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border-solid border-2 border-green-500 rounded-lg w-full"
          />
        </div>
        <div className="mx-4 mb-2">
          <label className="text-green-900 text-xl float-start">Tel</label>
          <Input
            type="text"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
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

export default Warehouse;
