import { useState, useEffect, useRef } from "react";
import { DataGrid } from '@mui/x-data-grid';

import { toast } from "react-toastify";

import { Card, CardContent, Select, MenuItem, InputLabel } from "@mui/material";
import request from "../utils/request";
import { Button, Input } from "../components/ui";

const Manufacturer  = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "manuName", headerName: "Tên nhà SXSX", width: 200 },
    { field: "address", headerName: "Địa chỉ", width: 100 },
    { field: "tel", headerName: "Điện thoại", width: 100 },
    { field: "email", headerName: "Email", width: 100 },
    { field: "wwebsite", headerName: "Website", width: 100 },
  ];
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [manuName, setName] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
 
  const lable = useRef();

  const getData = () => {
    request
      .get("Manufacturers?isActive=true")
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
    const selectedName = params.row.id === selectedRow ? "" : params.row.manuName;
    console.log(params);
    setSelectedRow(params.row.id === selectedRow ? null : params.row.id);
    setName(params.row.manuName);
    setAddress(params.row.address);
    setTel(params.row.tel);
    setEmail(params.row.email);
    setWebsite(params.row.website);
    lable.current.innerText = selectedName;
  };


  const handleAddData = () => {
    request
      .post("manufacturers", { manuName, address, tel, email, website })
      .then((response) => {
        getData();
        setName("");
        setAddress("");
        setTel("");
        setEmail("");
        setWebsite("");
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
      .put(`manufacturers/${selectedRow}`, { id: selectedRow, manuName, address, tel, email, website })
      .then((response) => {
        getData();
        setName("");
        setAddress("");
        setTel("");
        setEmail("");
        setWebsite("");
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
      .delete(`manufacturers/${selectedRow}`)
      .then((response) => {
        getData();
        setName("");
        setAddress("");
        setTel("");
        setEmail("");
        setWebsite("");
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
    <h1 className="font-bold text-3xl text-green-800 mb-8">Danh sách nhà sản xuấtxuất</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 w-full border-solid border-2 border-green-300 rounded-lg p-4">
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
          <label className="text-green-900 text-xl float-start">Tên</label>
          <Input
            type="text"
            value={manuName}
            onChange={(e) => setName(e.target.value)}
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
          <label className="text-green-900 text-xl float-start">Số điện thoại </label>
          <Input
            type="text"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            className="border-solid border-2 border-green-500 rounded-lg w-full"
          />
        </div>
        <div className="mx-4 mb-2">
          <label className="text-green-900 text-xl float-start">Email </label>
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-solid border-2 border-green-500 rounded-lg w-full"
          />
        </div>
        <div className="mx-4 mb-2">
          <label className="text-green-900 text-xl float-start">Website</label>
          <Input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
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

export default Manufacturer;