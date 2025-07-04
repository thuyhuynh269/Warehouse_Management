import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { Card, CardContent, Modal, Box, Typography } from "@mui/material";
import request from "../../utils/request";
import { Button } from "../../components/ui";
import Switch from "@mui/material/Switch";
import EditWarehouseModal from "./EditWarehouse";
import { useNavigate } from "react-router-dom";

const Warehouse = ({role}) => {
  const navigate = useNavigate();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingWarehouse, setViewingWarehouse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);

  const columns = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "wareName", headerName: "Tên kho", width: 200 },
  { field: "address", headerName: "Địa chỉ", width: 300 },
  { field: "tel", headerName: "Điện thoại", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
];

// Chỉ thêm cột Trạng thái và Hành động nếu không phải là employee
if (role !== "employee") {
  columns.push(
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
            onClick={() => handleViewDetails(params.row)}
            className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700"
          >
            {/* View icon */}
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
          <button
            onClick={() => handleUpdateData(params)}
            disabled={!params.row.isActive}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${params.row.isActive ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {/* Edit icon */}
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
    }
  );
}


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

  const handleViewDetails = (warehouse) => {
    setViewingWarehouse(warehouse);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setViewingWarehouse(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-3xl text-green-800">DANH SÁCH KHO HÀNG</h1>
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
          {role !== "employee" &&
            <button 
              onClick={() => navigate("/add-warehouse")}
              className="bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Thêm kho
            </button>
            }
          <button 
            onClick={() => navigate("/transfer-warehouse")}
            className="bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
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
            className="bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
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

      {/* Detail Modal */}
      <Modal
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        className="flex items-center justify-center"
      >
        <Box className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md m-4">
          <Typography variant="h6" component="h2" className="text-xl font-bold mb-6 text-green-700">
            Chi tiết kho
          </Typography>
          {viewingWarehouse && (
            <div className="space-y-4">
              <div className="border-b pb-3">
                <p className="text-gray-600 mb-1">ID:</p>
                <p className="text-lg text-gray-900">{viewingWarehouse.id}</p>
              </div>
              <div className="border-b pb-3">
                <p className="text-gray-600 mb-1">Tên kho:</p>
                <p className="text-lg text-gray-900">{viewingWarehouse.wareName}</p>
              </div>
              <div className="border-b pb-3">
                <p className="text-gray-600 mb-1">Địa chỉ:</p>
                <p className="text-lg text-gray-900">{viewingWarehouse.address}</p>
              </div>
              <div className="border-b pb-3">
                <p className="text-gray-600 mb-1">Điện thoại:</p>
                <p className="text-lg text-gray-900">{viewingWarehouse.tel}</p>
              </div>
              <div className="border-b pb-3">
                <p className="text-gray-600 mb-1">Email:</p>
                <p className="text-lg text-gray-900">{viewingWarehouse.email}</p>
              </div>
              <div className="border-b pb-3">
                <p className="text-gray-600 mb-1">Trạng thái:</p>
                <p className={`text-lg ${viewingWarehouse.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {viewingWarehouse.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleCloseDetailModal}
              className="bg-gray-500 text-white hover:bg-gray-600 px-5 py-2 rounded-lg"
            >
              Đóng
            </Button>
          </div>
        </Box>
      </Modal>

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