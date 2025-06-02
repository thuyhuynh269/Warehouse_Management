import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Box, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Tooltip
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import request from '../../utils/request';
import { formatDate } from '../../utils/format';

const WarehouseLogs = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [transferLogs, setTransferLogs] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Filter states
  const [sourceWarehouse, setSourceWarehouse] = useState('');
  const [targetWarehouse, setTargetWarehouse] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await request.get('product');
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Không thể tải danh sách sản phẩm');
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Move columns definition inside the component to access warehouses state
  const columns = useMemo(() => [
    { 
      field: 'createdDate', 
      headerName: 'Ngày chuyển', 
      flex: 1,
      minWidth: 150,
      // valueFormatter: (params) => {
      //   if (!params?.value) return '';
      //   try {
      //     const date = new Date(params.value);
      //     if (isNaN(date.getTime())) return '';
      //     return format(date, 'dd/MM/yyyy HH:mm');
      //   } catch (error) {
      //     console.error('Error formatting date:', error);
      //     return params.value || '';
      //   }
      // }
    },
    { 
      field: 'whSourceName', 
      headerName: 'Kho nguồn', 
      flex: 1,
      minWidth: 150
    },
    { 
      field: 'whTargetName', 
      headerName: 'Kho đích', 
      flex: 1,
      minWidth: 150
    },
    { 
      field: 'productName',
      headerName: 'Sản phẩm',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => {
        if (!params?.row?.productName) return '';
        return (
          <Tooltip title={params.row.productName} arrow>
            <div className="truncate">{params.row.productName}</div>
          </Tooltip>
        );
      }
    },
    {
      field: 'quantity',
      headerName: 'Số lượng',
      flex: 0.7,
      minWidth: 100,
      align: 'right',
      headerAlign: 'right'
    },
    { 
      field: 'employeeName', 
      headerName: 'Người thực hiện', 
      flex: 1,
      minWidth: 150
    }
  ], []);

  // Fetch warehouses on component mount
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await request.get('warehouse');
        setWarehouses(response.data || []);
        // After warehouses are loaded, fetch transfer logs
        handleSearch();
      } catch (error) {
        console.error('Error fetching warehouses:', error);
        toast.error('Không thể tải danh sách kho');
        setWarehouses([]);
      }
    };

    fetchWarehouses();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let queryParams = new URLSearchParams();
      
      if (sourceWarehouse) queryParams.append('sourceId', sourceWarehouse);
      if (targetWarehouse) queryParams.append('targetId', targetWarehouse);
      if (startDate) queryParams.append('fromDate', format(startDate, 'yyyy-MM-dd'));
      if (endDate) queryParams.append('toDate', format(endDate, 'yyyy-MM-dd'));

      const response = await request.get(`Warehouse/logs?${queryParams}`);
      console.log('API Response:', response.data);
      
      // Transform the data to include unique IDs and format dates
      const logsWithIds = Array.isArray(response.data) ? response.data.map((log, index) => ({
        ...log,
        id: `transfer-${index}`,
        createdDate: formatDate(log.createdDate) // Ensure createdDate is passed through
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

  const handleReset = () => {
    setSourceWarehouse('');
    setTargetWarehouse('');
    setStartDate(null);
    setEndDate(null);
    setTransferLogs([]);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Lịch Sử Chuyển Kho</h1>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/warehouse')}
          className="min-w-[100px]"
        >
          Quay lại
        </Button>
      </div>

      <Paper elevation={2} className="mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outlined"
            onClick={handleReset}
            className="min-w-[120px]"
          >
            Đặt lại
          </Button>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
          </Button>
        </div>
      </Paper>

      <Paper elevation={2} className="overflow-hidden">
        <DataGrid
          rows={transferLogs}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          loading={loading}
          getRowId={(row) => row.id}
          autoHeight
          className="min-h-[600px]"
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
      </Paper>
    </div>
  );
};

export default WarehouseLogs;
