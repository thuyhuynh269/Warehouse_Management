import { useState, useEffect, useCallback } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { toast } from "react-toastify";
import { Card, CardContent, Select, MenuItem, Paper, Typography, Box, Switch, FormControlLabel } from "@mui/material";
import request from "../utils/request";
import { Button, Input } from "../components/ui";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const Employee = () => {
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    password: "",
    gender: true,
    tel: "",
    email: "",
    address: "",
    role: 1,
    isActive: true
  });
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmployeeId, setResetEmployeeId] = useState(null);

  const roleOptions = {
    1: "Employee",
    2: "Manager",
    3: "Admin"
  };

  const roleNameToRole = {
    "Employee": 1,
    "Manager": 2,
    "Admin": 3
  };

  const handleResetPassword = useCallback(async () => {
    if (!resetEmployeeId) return;
    try {
      const response = await request.post(`/Employee/ResetPassword/${resetEmployeeId}`);
      if (response && response.status === 200) {
        toast.success('Reset mật khẩu thành công!');
      } else {
        throw new Error('Không thể reset mật khẩu');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi reset mật khẩu!';
      toast.error(errorMessage);
    } finally {
      setResetDialogOpen(false);
      setResetEmployeeId(null);
    }
  }, [resetEmployeeId]);

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "Tên nhân viên", width: 180 },
    { field: "code", headerName: "Mã nhân viên", width: 120 },
    { field: "tel", headerName: "Số điện thoại", width: 120 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "address", headerName: "Địa chỉ", width: 150 },
    { 
      field: "roleName", 
      headerName: "Vai trò", 
      width: 120
    },
    {
      field: "isActive",
      headerName: "Trạng thái",
      width: 120,
      renderCell: (params) => {
        const handleToggle = () => {
          const newStatus = !params.row.isActive;
          request
            .put(`employee/${params.row.id}`, {
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
      }
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 150,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedEmployee(params.row);
              setFormData({
                name: params.row.name,
                code: params.row.code,
                password: "",
                gender: params.row.gender,
                tel: params.row.tel,
                email: params.row.email,
                address: params.row.address,
                role: roleNameToRole[params.row.roleName] || 1,
                isActive: params.row.isActive
              });
              setIsEditModalOpen(true);
            }}
            className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center hover:bg-cyan-700"
            title="Chỉnh sửa"
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
          <button
            onClick={() => {
              setResetEmployeeId(params.row.id);
              setResetDialogOpen(true);
            }}
            className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center hover:bg-orange-600"
            title="Reset mật khẩu nhân viên"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path d="M12 15v2m0 4a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const getData = () => {
    request
      .get("employee")
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        toast.error("Có lỗi xảy ra khi tải dữ liệu!");
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' || name === 'gender' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.code || !formData.tel || !formData.email || !formData.address) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      if (isEditModalOpen) {
        await request.put(`employee/${selectedEmployee.id}`, {
          name: formData.name,
          code: formData.code,
          gender: formData.gender,
          tel: formData.tel,
          email: formData.email,
          address: formData.address,
          role: formData.role,
          isActive: formData.isActive
        });
        toast.success("Cập nhật nhân viên thành công!");
      } else {
        await request.post("employee", formData);
        toast.success("Thêm nhân viên thành công!");
      }
      getData();
      handleCloseModal();
    } catch (error) {
      console.error('Lỗi:', error.response?.data);
      toast.error("Có lỗi xảy ra khi xử lý!");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
    setFormData({
      name: "",
      code: "",
      password: "",
      gender: true,
      tel: "",
      email: "",
      address: "",
      role: 1,
      isActive: true
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-3xl text-green-800">DANH SÁCH NHÂN VIÊN</h1>
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
              className="max-h-4/5"
              disableSelectionOnClick
            />
          </CardContent>
        </Card>
      </div>

      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-2xl p-2 sm:p-6 md:p-10 w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-green-800 mb-6">
              {isEditModalOpen ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
            </h2>
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Tên nhân viên</label>
                  <Input
                    name="name"
                    placeholder="Nhập tên nhân viên"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-12 text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Mã nhân viên</label>
                  <Input
                    name="code"
                    placeholder="Nhập mã nhân viên"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="h-12 text-base w-full"
                  />
                </div>
                {!isEditModalOpen && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Mật khẩu</label>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-12 text-base w-full"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                  <Input
                    name="tel"
                    placeholder="Nhập số điện thoại"
                    value={formData.tel}
                    onChange={handleInputChange}
                    className="h-12 text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Email</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-12 text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Địa chỉ</label>
                  <Input
                    name="address"
                    placeholder="Nhập địa chỉ"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="h-12 text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Vai trò</label>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full h-12 text-base"
                  >
                    {Object.entries(roleOptions).map(([key, value]) => (
                      <MenuItem key={key} value={Number(key)}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className="flex items-center">
                  <label className="block text-gray-700 font-medium mb-1 mr-4">Giới tính</label>
                  <label className="flex items-center mr-4">
                    <input
                      type="radio"
                      name="gender"
                      value={true}
                      checked={formData.gender === true}
                      onChange={() => setFormData(prev => ({ ...prev, gender: true }))}
                      className="mr-1"
                    />
                    Nam
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={false}
                      checked={formData.gender === false}
                      onChange={() => setFormData(prev => ({ ...prev, gender: false }))}
                      className="mr-1"
                    />
                    Nữ
                  </label>
                </div>
                <div className="flex items-center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        name="isActive"
                        color="primary"
                      />
                    }
                    label="Trạng thái hoạt động"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
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

      {/* Dialog xác nhận reset mật khẩu */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}>Xác nhận</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
            <WarningAmberIcon style={{ fontSize: 56, color: '#ff9800', marginBottom: 8 }} />
            <DialogContentText style={{ textAlign: 'center', fontSize: 18 }}>
              Bạn có chắc chắn muốn reset mật khẩu cho nhân viên này?
            </DialogContentText>
          </div>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', paddingBottom: 20 }}>
          <Button onClick={() => setResetDialogOpen(false)} variant="outlined" color="inherit">
            Hủy
          </Button>
          <Button onClick={handleResetPassword} variant="contained" style={{ background: '#ff9800', color: '#fff' }}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Employee; 