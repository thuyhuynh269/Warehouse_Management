import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import request from '../../utils/request';
import { Button, Input } from '../../components/ui';

const TransferWarehouse = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [sourceWarehouse, setSourceWarehouse] = useState('');
  const [targetWarehouse, setTargetWarehouse] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [note, setNote] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch warehouses on component mount
  useEffect(() => {
    request.get('warehouse')
      .then(response => {
        setWarehouses(response.data);
      })
      .catch(error => {
        toast.error('Lỗi khi tải danh sách kho');
      });
  }, []);

  // Fetch products when source warehouse changes
  useEffect(() => {
    if (sourceWarehouse) {
      request.get(`warehouse/${sourceWarehouse}/products`)
        .then(response => {
          setProducts(response.data);
          setFilteredProducts(response.data);
        })
        .catch(error => {
          toast.error('Lỗi khi tải danh sách sản phẩm');
        });
    }
  }, [sourceWarehouse]);

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleProductSelect = (product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(selectedProducts.map(p => 
        p.id === product.id 
          ? { ...p, quantity: Math.min(p.quantity + 1, p.available_quantity) }
          : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setSelectedProducts(selectedProducts.map(product => {
      if (product.id === productId) {
        const quantity = Math.min(Math.max(1, newQuantity), product.available_quantity);
        return { ...product, quantity };
      }
      return product;
    }));
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(product => product.id !== productId));
  };

  const handleSubmit = async () => {
    if (!sourceWarehouse || !targetWarehouse || !transferDate || selectedProducts.length === 0) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (sourceWarehouse === targetWarehouse) {
      toast.error('Kho nguồn và kho đích không được trùng nhau');
      return;
    }

    const transferData = {
      sourceWarehouseId: sourceWarehouse,
      targetWarehouseId: targetWarehouse,
      transferDate,
      note,
      products: selectedProducts.map(product => ({
        productId: product.id,
        quantity: product.quantity
      }))
    };

    try {
      await request.post('warehouse/transfer', transferData);
      toast.success('Chuyển kho thành công');
      navigate('/warehouse');
    } catch (error) {
      toast.error('Lỗi khi chuyển kho');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-green-800">Chuyển kho</h2>
        <Button
          onClick={() => navigate("/warehouse")}
          className="bg-gray-500 text-white hover:bg-gray-600"
        >
          Quay lại
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Kho nguồn</label>
            <select
              value={sourceWarehouse}
              onChange={(e) => setSourceWarehouse(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn kho nguồn</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.wareName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Kho đích</label>
            <select
              value={targetWarehouse}
              onChange={(e) => setTargetWarehouse(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn kho đích</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.wareName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Ngày chuyển</label>
            <input
              type="date"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Tìm kiếm sản phẩm</label>
            <Input
              type="text"
              placeholder="Nhập tên hoặc mã sản phẩm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border rounded-lg p-4 h-[300px] overflow-y-auto">
            <h3 className="font-medium mb-2">Sản phẩm có sẵn</h3>
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleProductSelect(product)}
              >
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                </div>
                <div className="text-sm">
                  Số lượng: {product.available_quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Sản phẩm đã chọn</h3>
            {selectedProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-2 border-b">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={product.available_quantity}
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Xác nhận chuyển kho
        </Button>
        <Button
          onClick={() => navigate("/warehouse")}
          className="bg-gray-300 text-black hover:bg-gray-400"
        >
          Hủy
        </Button>
      </div>
    </div>
  );
};

export default TransferWarehouse; 