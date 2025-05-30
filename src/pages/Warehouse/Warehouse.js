import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { Card, CardContent } from "@mui/material";
import request from "../../utils/request";
import { Button } from "../../components/ui";
import Switch from "@mui/material/Switch";
import AddWarehouseModal from "../Warehouse/AddWarehouse";
import EditWarehouseModal from "../Warehouse/EditWarehouse";
import { useNavigate } from "react-router-dom";

const Warehouse = () => {
  const navigate = useNavigate();
  
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "wareName", headerName: "Tên kho", width: 150 },
    { field: "address", headerName: "Địa chỉ", width: 200 },
    { field: "tel", headerName: "Điện thoại", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "isActive",
      headerName: "Trạng thái",
      width: 100,
      renderCell: (params) => {
        const handleToggle = () => {
          const newStatus = !params.row.isActive;
          request
            .put(`warehouse/${params.row.id}`, {
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
          {/* Nút Xem chi tiết */}
          <button
            onClick={() => navigate(`/detail-warehouse/${params.row.id}`)}
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

          {/* Nút Sửa */}
          <button
            onClick={() => handleUpdateData(params)}
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

 
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const getData = () => {
    request
      .get("warehouse")
      .then((response) => {
        console.log(response);
        setRows(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  useEffect(getData, []);

  const handleUpdateData = (params) => {
    setSelectedWarehouse(params.row);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-3xl text-green-800">Danh sách kho hàng</h1>
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

      <div className="grid grid-cols-3 md:grid-cols-2 w-full border-solid border-2 border-green-300 rounded-lg p-4">
        <Card className="col-span-3">
          <CardContent style={{ height: "100%", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              onRowClick={(params) => {}}
              className="max-h-4/5"
            />
          </CardContent>
        </Card>
      </div>

      {isModalOpen && (
        <AddWarehouseModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={getData}
        />
      )}

      {isEditModalOpen && selectedWarehouse && (
        <EditWarehouseModal
          warehouse={selectedWarehouse}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedWarehouse(null);
          }}
          onSuccess={getData}
        />
      )}
    </>
  );
};

export default Warehouse;