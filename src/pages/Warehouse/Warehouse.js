import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { Card, CardContent } from "@mui/material";
import request from "../../utils/request";
import { Button } from "../../components/ui";
import Switch from "@mui/material/Switch";
import EditWarehouseModal from "./EditWarehouse";
import { useNavigate } from "react-router-dom";

const Warehouse = () => {
  const navigate = useNavigate();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "wareName", headerName: "Tên kho", width: 200 },
    { field: "address", headerName: "Địa chỉ", width: 300 },
    { field: "tel", headerName: "Điện thoại", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "isActive",
      headerName: "Trạng thái",
      width: 150,
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
          <button
            onClick={() => handleUpdateData(params)}
            disabled={!params.row.isActive}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${params.row.isActive ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-400 cursor-not-allowed'}`}
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

  // Lọc dữ liệu khi searchTerm hoặc rows thay đổi
  useEffect(() => {
    const filtered = rows.filter(warehouse => 
      warehouse.wareName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  const handleUpdateData = (params) => {
    setSelectedWarehouse(params.row);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-3xl text-green-800">Danh sách kho hàng</h1>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm kho..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-64"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => navigate("/add-warehouse")}
            className="bg-[#00B4D8] hover:bg-[#0096c7] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"/>
              <polyline points="2.32 6.16 12 11 21.68 6.16"/>
              <line x1="12" y1="22.76" x2="12" y2="11"/>
            </svg>
            Thêm kho
          </button>
          <button 
            onClick={() => navigate("/transfer-warehouse")}
            className="bg-[#00B4D8] hover:bg-[#0096c7] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            Chuyển kho
          </button>
          <button 
            onClick={() => {
              if (selectedWarehouse) {
                navigate(`/detail-warehouse/${selectedWarehouse.id}`);
              } else {
                toast.warning('Vui lòng chọn kho trước!');
              }
            }}
            className="bg-[#00B4D8] hover:bg-[#0096c7] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM12 17v-6M8 17v-4m8 4v-8"/>
            </svg>
            Quản lý sản phẩm kho
          </button>
        </div>
      </div>

      <div className="w-full border-solid border-2 border-green-300 rounded-lg p-4">
        <Card className="w-full">
          <CardContent style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10, 25, 100]}
              onRowClick={(params) => setSelectedWarehouse(params.row)}
              className="w-full"
              disableRowSelectionOnClick
              autoHeight
            />
          </CardContent>
        </Card>
      </div>

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