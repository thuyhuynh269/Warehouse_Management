import { useState, useEffect, useRef } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { toast } from "react-toastify";
import { Card, CardContent, Select, MenuItem, InputLabel, InputAdornment, Paper, Typography, Box, Grid, Modal, IconButton, useTheme, useMediaQuery } from "@mui/material";
import request from "../utils/request";
import { Button, Input } from "../components/ui";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Product = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add' or 'edit'
  
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "proName", headerName: "Tên sản phẩm", width: 200, flex: 1 },
    { field: "image", headerName: "Hình ảnh", width: 100, hide: isMobile },
    { field: "unit", headerName: "Đơn vị", width: 100, hide: isTablet },
    { field: "expiry", headerName: "Hạn sử dụng", width: 100, hide: isTablet },
    { field: "categoryName", headerName: "Danh mục", width: 150, hide: isMobile },
    { field: "manufacturerName", headerName: "Nhà sản xuất", width: 150, hide: isMobile },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 120,
      renderCell: (params) => (
        <Box className="flex gap-2">
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row);
            }}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm"
          >
            {isMobile ? "Sửa" : "Sửa"}
          </Button>
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.id);
            }}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm"
          >
            {isMobile ? "Xóa" : "Xóa"}
          </Button>
        </Box>
      ),
    },
  ];
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [productName, setProductName] = useState("");
  const [image, setImage] = useState("");
  const [unit, setUnit] = useState("");
  const [expiry, setExpiry] = useState("");
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const lable = useRef();

  const getData = () => {
    request
      .get("product")
      .then((response) => {
        console.log(response);
        setRows(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const getCategories = () => {
    request
      .get("Categories?isActive=true")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const getManufacturers = () => {
    request
      .get("Manufacturers?isActive=true")
      .then((response) => {
        console.log("Raw Manufacturers data:", response.data);
        if (response && response.data) {
          const formattedManufacturers = response.data.map(manu => ({
            id: manu.id,
            name: manu.manuName
          }));
          console.log("Formatted Manufacturers:", formattedManufacturers);
          setManufacturers(formattedManufacturers);
        }
      })
      .catch((error) => {
        toast.error("Lỗi khi tải danh sách nhà sản xuất");
      });
  };

  useEffect(() => {
    getData();
    getCategories();
    getManufacturers();
  }, []);

  const handleChangeProductName = (event) => {
    setProductName(event.target.value);
  };
  const handleChangeImage = (event) => {
    setImage(event.target.value);
  };
  const handleChangeUnit = (event) => {
    setUnit(event.target.value);
  };
  const handleChangeExpiry = (event) => {
    setExpiry(event.target.value);
  };
  const handleChangeCategory = (event) => {
    setSelectedCategory(event.target.value);
    console.log('Selected category id:', event.target.value);
  };
  const handleChangeManufacturer = (event) => {
    setSelectedManufacturer(event.target.value);
    console.log('Selected Manufacturer:', event.target.value);
  };

  const handleRowClick = (params) => {
    const selectedName = params.row.id === selectedRow ? "" : params.row.proName;
    console.log(params);
    setSelectedRow(params.row.id === selectedRow ? null : params.row.id);
    setProductName(params.row.proName);
    setImage(params.row.image);
    setUnit(params.row.unit);
    setExpiry(params.row.expiry);
    setSelectedCategory(params.row.categoryId || "");
    setSelectedManufacturer(params.row.manufacturerId || "");
    lable.current.innerText = selectedName;
  };

  const handleAddData = () => {
    const addData = {
      manuId: Number(selectedManufacturer),
      cateId: Number(selectedCategory),
      proName: productName,
      image: image,
      unit: unit,
      expiry: Number(expiry)
    };

    console.log('Add data:', addData); // For debugging

    request
      .post("product", addData)
      .then((response) => {
        getData();
        setImage("");
        setProductName("");
        setUnit("");
        setExpiry("");
        setSelectedCategory("");
        setSelectedManufacturer("");
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.error('Add error:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || error.message);
      });
  };

  const deselect = () => {
    setSelectedRow(null);
    lable.current.innerText = "";
  };

  const handleUpdateData = () => {
    const updateData = {
      proName: productName || "",
      image: image || "",
      unit: unit || "",
      expiry: Number(expiry) || 0,
      cateId: Number(selectedCategory) || 0,
      manuId: Number(selectedManufacturer) || 0,
      isActive: true
    };
    console.log("Update data:", updateData);
    request
      .put(`product/${selectedRow}`, updateData)
      .then((response) => {
        getData();
        setImage("");
        setProductName("");
        setUnit("");
        setExpiry("");
        setSelectedCategory("");
        setSelectedManufacturer("");
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
      .delete(`products/${selectedRow}`)
      .then((response) => {
        getData();
        setImage("");
        setProductName("");
        setUnit("");
        setExpiry("");
        setSelectedCategory("");
        setSelectedManufacturer("");
        setSelectedRow(null);
        lable.current.innerText = "";
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleAdd = () => {
    setModalType('add');
    setOpenModal(true);
    // Reset form
    setProductName("");
    setImage("");
    setUnit("");
    setExpiry("");
    setSelectedCategory("");
    setSelectedManufacturer("");
  };

  const handleEdit = (row) => {
    console.log('row:', row);
    console.log('categories:', categories);
    console.log('manufacturers:', manufacturers);

    if (!categories.length || !manufacturers.length) {
      toast.info("Đang tải dữ liệu danh mục hoặc nhà sản xuất...");
      return;
    }

    // Tìm id của category và manufacturer dựa vào name
    const foundCategory = categories.find(c => c.name === row.categoryName);
    const foundManufacturer = manufacturers.find(m => m.name === row.manufacturerName);

    setModalType('edit');
    setOpenModal(true);
    setSelectedRow(row.id);
    setProductName(row.proName);
    setImage(row.image);
    setUnit(row.unit);
    setExpiry(row.expiry);
    setSelectedCategory(foundCategory ? String(foundCategory.id) : "");
    setSelectedManufacturer(foundManufacturer ? String(foundManufacturer.id) : "");
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      request
        .delete(`products/${id}`)
        .then((response) => {
          getData();
          toast.success(response.data.message);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
    // Reset form
    setProductName("");
    setImage("");
    setUnit("");
    setExpiry("");
    setSelectedCategory("");
    setSelectedManufacturer("");
  };

  const handleSubmit = () => {
    if (modalType === 'add') {
      handleAddData();
    } else {
      handleUpdateData();
    }
    handleCloseModal();
  };

  return (
    <Box className="p-4 md:p-6 lg:p-8 max-w-[95%] md:max-w-[90%] lg:max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <Typography variant="h4" className="font-bold text-gray-800 text-2xl md:text-3xl lg:text-4xl">
          Quản lý sản phẩm
        </Typography>
        <Button
          primary
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full md:w-auto"
        >
          + Thêm sản phẩm
        </Button>
      </Box>
      
      <Paper elevation={3} className="p-3 md:p-4 lg:p-6 rounded-xl shadow-lg">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          className="max-h-[500px] md:max-h-[600px]"
          sx={{
            '& .MuiDataGrid-cell:hover': {
              backgroundColor: '#f0f9f0',
            },
            '& .MuiDataGrid-row.Mui-selected': {
              backgroundColor: '#e8f5e9',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              color: '#1e293b',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-cell': {
              borderColor: '#e2e8f0',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #e2e8f0',
            },
          }}
        />
      </Paper>

      {/* Modal Form */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        className="flex items-center justify-center p-4"
      >
        <Paper className="w-full max-w-2xl p-4 md:p-6 lg:p-8 m-4 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <Typography variant="h5" className="text-gray-800 font-bold mb-4 md:mb-6">
            {modalType === 'add' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
          </Typography>
          
          <Box className="space-y-3 md:space-y-4">
            <Box>
              <Typography className="text-gray-700 font-medium mb-2">Tên sản phẩm</Typography>
              <Input
                type="text"
                value={productName}
                onChange={handleChangeProductName}
                className="w-full border border-gray-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 md:px-4 py-2"
                placeholder="Nhập tên sản phẩm"
              />
            </Box>

            <Box>
              <Typography className="text-gray-700 font-medium mb-2">Danh mục</Typography>
              <Select
                value={selectedCategory}
                onChange={handleChangeCategory}
                className="w-full border border-gray-200 rounded-lg"
                displayEmpty
              >
                <MenuItem value="">
                  <em>Chọn danh mục</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography className="text-gray-700 font-medium mb-2">Nhà sản xuất</Typography>
              <Select
                value={selectedManufacturer}
                onChange={handleChangeManufacturer}
                className="w-full border border-gray-200 rounded-lg"
                displayEmpty
              >
                <MenuItem value="">
                  <em>Chọn nhà sản xuất</em>
                </MenuItem>
                {manufacturers.map((manufacturer) => (
                  <MenuItem key={manufacturer.id} value={String(manufacturer.id)}>
                    {manufacturer.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography className="text-gray-700 font-medium mb-2">Ảnh</Typography>
              <Input
                type="text"
                value={image}
                onChange={handleChangeImage}
                className="w-full border border-gray-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 md:px-4 py-2"
                placeholder="Nhập đường dẫn ảnh"
              />
            </Box>

            <Box>
              <Typography className="text-gray-700 font-medium mb-2">Đơn vị</Typography>
              <Input
                type="text"
                value={unit}
                onChange={handleChangeUnit}
                className="w-full border border-gray-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 md:px-4 py-2"
                placeholder="Nhập đơn vị"
              />
            </Box>

            <Box>
              <Typography className="text-gray-700 font-medium mb-2">Hạn sử dụng</Typography>
              <Input
                type="text"
                value={expiry}
                onChange={handleChangeExpiry}
                className="w-full border border-gray-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 px-3 md:px-4 py-2"
                placeholder="Nhập hạn sử dụng"
              />
            </Box>

            <Box className="flex flex-col md:flex-row justify-end gap-3 pt-4 md:pt-6">
              <Button
                onClick={handleCloseModal}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 md:px-6 py-2 rounded-lg transition-colors duration-200 w-full md:w-auto"
              >
                Hủy
              </Button>
              <Button
                primary
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full md:w-auto"
              >
                {modalType === 'add' ? 'Thêm mới' : 'Cập nhật'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default Product;