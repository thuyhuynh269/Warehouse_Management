import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Box, 
  TextField, 
  MenuItem, 
  Button,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import request from '../../utils/request';

const WarehouseLogs = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [transferLogs, setTransferLogs] = useState([]);
  
  // Filter states
  const [sourceWarehouse, setSourceWarehouse] = useState('');
  const [targetWarehouse, setTargetWarehouse] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch warehouses on component mount
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await request.get('warehouse');
        setWarehouses(response.data);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
        toast.error('Không thể tải danh sách kho');
      }
    };

    fetchWarehouses();
  }, []);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return format(date, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Column definitions for the DataGrid
  const columns = [
    { 
      field: 'createdDate', 
      headerName: 'Ngày chuyển', 
      flex: 1,
      valueFormatter: (params) => formatDate(params?.value)
    },
    { 
      field: 'whSourceName', 
      headerName: 'Kho nguồn', 
      flex: 1
    },
    { 
      field: 'whTargetName', 
      headerName: 'Kho đích', 
      flex: 1
    },
    { 
      field: 'productName', 
      headerName: 'Sản phẩm', 
      flex: 1
    },
    { 
      field: 'quantity', 
      headerName: 'Số lượng', 
      flex: 0.5,
      type: 'number',
      align: 'center',
      headerAlign: 'center'
    },
    { 
      field: 'employeeName', 
      headerName: 'Người thực hiện', 
      flex: 1
    }
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      let queryParams = new URLSearchParams();
      
      if (sourceWarehouse) queryParams.append('sourceId', sourceWarehouse);
      if (targetWarehouse) queryParams.append('targetId', targetWarehouse);
      if (startDate) queryParams.append('startDate', format(startDate, 'yyyy-MM-dd'));
      if (endDate) queryParams.append('endDate', format(endDate, 'yyyy-MM-dd'));

      const response = await request.get(`Warehouse/logs?${queryParams}`);
      const logsWithIds = Array.isArray(response.data) ? response.data.map((log, index) => ({
        ...log,
        id: `${log.productId}_${log.createdDate}_${index}` // Create a unique ID using available data
      })) : [];
      setTransferLogs(logsWithIds);
    } catch (error) {
      console.error('Error fetching transfer logs:', error);
      toast.error('Không thể tải lịch sử chuyển kho');
      setTransferLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (row) => {
    // Implement view details functionality
    console.log('View details for:', row);
  };

  const handleReset = () => {
    setSourceWarehouse('');
    setTargetWarehouse('');
    setStartDate(null);
    setEndDate(null);
    setTransferLogs([]); // Clear the grid when resetting filters
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">LỊCH SỬ CHUYỂN KHO</h1>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate('/warehouse')}
        >
          Quay lại
        </Button>
      </div>

      <Box className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormControl fullWidth>
            <InputLabel>Kho nguồn</InputLabel>
            <Select
              value={sourceWarehouse}
              onChange={(e) => setSourceWarehouse(e.target.value)}
              label="Kho nguồn"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.wareName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Kho đích</InputLabel>
            <Select
              value={targetWarehouse}
              onChange={(e) => setTargetWarehouse(e.target.value)}
              label="Kho đích"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.wareName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Từ ngày"
              value={startDate}
              onChange={setStartDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                }
              }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Đến ngày"
              value={endDate}
              onChange={setEndDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                }
              }}
            />
          </LocalizationProvider>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outlined"
            onClick={handleReset}
          >
            Đặt lại
          </Button>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
          </Button>
        </div>
      </Box>

      <div style={{ height: 600, width: '100%' }} className="bg-white rounded-lg shadow">
        <DataGrid
          rows={transferLogs}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          loading={loading}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: 'createdDate', sort: 'desc' }],
            },
            pagination: {
              pageSize: 10,
            },
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              borderRight: '1px solid #e0e0e0',
            },
            '& .MuiDataGrid-columnHeader': {
              borderRight: '1px solid #e0e0e0',
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
            }
          }}
        />
      </div>
    </div>
  );
};

export default WarehouseLogs; 