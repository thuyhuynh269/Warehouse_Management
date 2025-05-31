import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import request from '../../utils/request';

const TransferWarehouse = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [sourceWarehouse, setSourceWarehouse] = useState('');
  const [targetWarehouse, setTargetWarehouse] = useState('');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch danh sách kho khi component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const warehouseResponse = await request.get('warehouse');
        setWarehouses(warehouseResponse.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch sản phẩm khi chọn kho nguồn
  useEffect(() => {
    if (sourceWarehouse) {
      setLoading(true);
      console.log('Fetching products for warehouse:', sourceWarehouse);
      request.get(`warehouse/${sourceWarehouse}`)
        .then(response => {
          if (response.data && Array.isArray(response.data.details)) {
            const productsWithQuantity = response.data.details.map(item => ({
              id: item.productId,
              name: item.productName,
              sku: item.sku,
              image: item.image,
              available_quantity: item.quantity || 0,
              unit: item.unit
            })).filter(product => product.available_quantity > 0);

            setAllProducts(productsWithQuantity);
            setFilteredProducts(productsWithQuantity);
          } else {
            setAllProducts([]);
            setFilteredProducts([]);
          }
        })
        .catch(error => {
          console.error('Error fetching products:', error);
          toast.error('Lỗi khi tải danh sách sản phẩm');
          setAllProducts([]);
          setFilteredProducts([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setAllProducts([]);
      setFilteredProducts([]);
    }
  }, [sourceWarehouse]);

  // Lọc sản phẩm theo từ khóa tìm kiếm
  useEffect(() => {
    if (!sourceWarehouse) {
      setFilteredProducts([]);
      return;
    }

    const filtered = allProducts.filter(product => 
      searchTerm === '' || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [searchTerm, allProducts, sourceWarehouse]);

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (productId, newQuantity) => {
    setSelectedProducts(selectedProducts.map(product => {
      if (product.id === productId) {
        // Ensure newQuantity is a valid number and within bounds
        const parsedQuantity = parseInt(newQuantity) || 0;
        const quantity = Math.min(Math.max(0, parsedQuantity), product.available_quantity);
        return { ...product, quantity };
      }
      return product;
    }));
  };

  // Xử lý chọn sản phẩm
  const handleProductSelect = (product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(selectedProducts.map(p => 
        p.id === product.id 
          ? { 
              ...p, 
              quantity: Math.min((p.quantity || 0) + 1, product.available_quantity)
            }
          : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { 
        ...product, 
        quantity: 1,
        available_quantity: parseInt(product.available_quantity) || 0
      }]);
    }
  };

  // Xử lý xóa sản phẩm đã chọn
  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(product => product.id !== productId));
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    if (!sourceWarehouse || !targetWarehouse || !transferDate || selectedProducts.length === 0) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (sourceWarehouse === targetWarehouse) {
      toast.error('Kho nguồn và kho đích không được trùng nhau');
      return;
    }

    // Validate quantities before proceeding
    const invalidProducts = selectedProducts.filter(product => 
      !product.quantity || product.quantity <= 0 || product.quantity > product.available_quantity
    );

    if (invalidProducts.length > 0) {
      toast.error(`Số lượng không hợp lệ cho sản phẩm: ${invalidProducts.map(p => p.name).join(', ')}`);
      return;
    }

    try {
      setLoading(true);
      const results = [];
      const errors = [];

      // Thực hiện chuyển kho cho từng sản phẩm
      for (const product of selectedProducts) {
        try {
          console.log('=== BẮT ĐẦU CHUYỂN SẢN PHẨM ===');
          console.log('Sản phẩm:', product);
          
          // 1. Kiểm tra số lượng trong kho nguồn trước khi chuyển
          const sourceCheck = await request.get(`WarehouseDetail/GetByWarehouseAndProduct?wareId=${sourceWarehouse}&proId=${product.id}`);
          console.log('Kiểm tra kho nguồn:', {
            sản_phẩm: product.name,
            số_lượng_hiện_có: sourceCheck.data?.quantity,
            số_lượng_cần_chuyển: product.quantity
          });
          
          if (!sourceCheck.data || sourceCheck.data.quantity < product.quantity) {
            throw new Error(`Không đủ số lượng sản phẩm ${product.name} trong kho nguồn (cần: ${product.quantity}, có: ${sourceCheck.data?.quantity || 0})`);
          }

          // 2. Trừ số lượng từ kho nguồn
          const newSourceQuantity = sourceCheck.data.quantity - product.quantity;
          console.log('Cập nhật số lượng kho nguồn:', {
            sản_phẩm: product.name,
            số_lượng_cũ: sourceCheck.data.quantity,
            số_lượng_trừ: product.quantity,
            số_lượng_mới: newSourceQuantity
          });

          let sourceResponse;
          try {
            sourceResponse = await request.put(
              `WarehouseDetail/UpdateQuantity`,
              {
                proId: parseInt(product.id),
                wareId: parseInt(sourceWarehouse),
                quantity: newSourceQuantity
              }
            );
          } catch (error) {
            console.error('Lỗi khi gọi API trừ kho nguồn:', error);
            throw new Error(`Lỗi kết nối: Không thể cập nhật số lượng trong kho nguồn`);
          }

          if (!sourceResponse.data || sourceResponse.status !== 200) {
            throw new Error(`Lỗi khi trừ sản phẩm ${product.name} từ kho nguồn: ${sourceResponse.data?.message || 'Không có phản hồi từ server'}`);
          }

          // 3. Kiểm tra và cập nhật kho đích
          let targetCheck;
          try {
            targetCheck = await request.get(`WarehouseDetail/GetByWarehouseAndProduct?wareId=${targetWarehouse}&proId=${product.id}`);
          } catch (error) {
            // Nếu lỗi 404, có nghĩa là sản phẩm chưa có trong kho đích
            if (error.response?.status === 404) {
              targetCheck = { data: null };
            } else {
              console.error('Lỗi khi kiểm tra kho đích:', error);
              // Hoàn lại số lượng cho kho nguồn
              await request.put(
                `WarehouseDetail/UpdateQuantity`,
                {
                  proId: parseInt(product.id),
                  wareId: parseInt(sourceWarehouse),
                  quantity: sourceCheck.data.quantity
                }
              );
              throw new Error(`Lỗi kết nối: Không thể kiểm tra kho đích`);
            }
          }

          let targetResponse;
          try {
            if (targetCheck.data) {
              // 3a. Nếu sản phẩm đã có trong kho đích, cộng thêm số lượng
              const currentTargetQuantity = targetCheck.data.quantity || 0;
              const newTargetQuantity = currentTargetQuantity + product.quantity;
              
              targetResponse = await request.put(
                `WarehouseDetail/UpdateQuantity`,
                {
                  proId: parseInt(product.id),
                  wareId: parseInt(targetWarehouse),
                  quantity: newTargetQuantity
                }
              );
            } else {
              // 3b. Nếu sản phẩm chưa có trong kho đích, tạo mới
              targetResponse = await request.post(
                'WarehouseDetail/Create',
                {
                  proId: parseInt(product.id),
                  wareId: parseInt(targetWarehouse),
                  quantity: product.quantity,
                  productName: product.name,
                  sku: product.sku || '',
                  image: product.image || '',
                  unit: product.unit || 'Cái'
                }
              );
            }
          } catch (error) {
            console.error('Lỗi khi cập nhật kho đích:', error);
            // Hoàn lại số lượng cho kho nguồn
            await request.put(
              `WarehouseDetail/UpdateQuantity`,
              {
                proId: parseInt(product.id),
                wareId: parseInt(sourceWarehouse),
                quantity: sourceCheck.data.quantity
              }
            );
            throw new Error(`Lỗi kết nối: Không thể cập nhật kho đích`);
          }

          if (!targetResponse.data || targetResponse.status !== 200) {
            // Nếu cập nhật kho đích thất bại, hoàn lại số lượng cho kho nguồn
            console.log('Lỗi cập nhật kho đích, hoàn lại số lượng kho nguồn');
            await request.put(
              `WarehouseDetail/UpdateQuantity`,
              {
                proId: parseInt(product.id),
                wareId: parseInt(sourceWarehouse),
                quantity: sourceCheck.data.quantity
              }
            );
            throw new Error(`Lỗi kết nối: Không thể cập nhật kho đích`);
          }

          results.push({
            name: product.name,
            quantity: product.quantity,
            success: true
          });

          console.log(`=== HOÀN THÀNH CHUYỂN SẢN PHẨM: ${product.name} ===\n`);
        } catch (error) {
          console.error(`Lỗi khi chuyển sản phẩm ${product.name}:`, error);
          errors.push({
            name: product.name,
            error: error.message
          });
        }
      }

      // Hiển thị kết quả tổng hợp
      if (errors.length > 0) {
        const errorMessages = errors.map(e => `${e.name}: ${e.error}`).join('\n');
        toast.error(`Có lỗi xảy ra khi chuyển một số sản phẩm:\n${errorMessages}`, {
          autoClose: 5000
        });
      }

      if (results.length > 0) {
        const successMessages = results.map(r => `${r.name}: ${r.quantity}`).join('\n');
        toast.success(
          `Chuyển kho thành công ${results.length} sản phẩm:\n${successMessages}`,
          {
            autoClose: 5000
          }
        );
      }

      if (results.length > 0) {
        setTimeout(() => {
          navigate('/warehouse');
        }, 2000);
      }
    } catch (error) {
      console.error('Lỗi tổng thể:', error);
      toast.error('Có lỗi xảy ra trong quá trình chuyển kho');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Chuyển kho</h1>
        <button
          onClick={() => navigate('/warehouse')}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Quay lại
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Phần thông tin chuyển kho */}
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Kho nguồn</label>
              <select
                value={sourceWarehouse}
                onChange={(e) => setSourceWarehouse(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Chọn kho nguồn</option>
                {warehouses.map(warehouse => (
                  <option key={`source-${warehouse.id}`} value={warehouse.id}>
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
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={!sourceWarehouse}
              >
                <option value="">Chọn kho đích</option>
                {warehouses
                  .filter(w => w.id !== parseInt(sourceWarehouse))
                  .map(warehouse => (
                    <option key={`target-${warehouse.id}`} value={warehouse.id}>
                      {warehouse.wareName}
                    </option>
                  ))
                }
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Ngày chuyển</label>
              <input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Ghi chú</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nhập ghi chú nếu có..."
              />
            </div>
          </div>

          {/* Phần chọn sản phẩm */}
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Tìm kiếm sản phẩm</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nhập tên hoặc mã sản phẩm"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={!sourceWarehouse}
              />
            </div>

            {/* Danh sách sản phẩm có sẵn */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Sản phẩm có sẵn</h3>
              <div className="h-[300px] overflow-y-auto space-y-2">
                {!sourceWarehouse ? (
                  <div className="text-gray-500 text-center py-4">
                    Vui lòng chọn kho nguồn
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">
                    Không tìm thấy sản phẩm
                  </div>
                ) : (
                  filteredProducts.map(product => (
                    <div
                      key={`available-${product.id}`}
                      onClick={() => product.available_quantity > 0 && handleProductSelect(product)}
                      className={`flex items-center justify-between p-2 border rounded-lg ${
                        product.available_quantity > 0 
                          ? 'hover:bg-gray-50 cursor-pointer' 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                      </div>
                      <div className="text-sm">
                        Số lượng: {product.available_quantity}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Danh sách sản phẩm đã chọn */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Sản phẩm đã chọn</h3>
              <div className="space-y-2">
                {selectedProducts.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">
                    Chưa có sản phẩm nào được chọn
                  </div>
                ) : (
                  selectedProducts.map(product => (
                    <div key={`selected-${product.id}`} className="flex items-center justify-between p-2 border rounded-lg">
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
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                          className="w-20 p-1 border rounded-lg text-center"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProduct(product.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading || selectedProducts.length === 0}
          className={`px-4 py-2 text-white rounded-lg ${
            loading || selectedProducts.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận chuyển kho'}
        </button>
        <button
          onClick={() => navigate('/warehouse')}
          disabled={loading}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default TransferWarehouse;
