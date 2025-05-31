import React, { forwardRef } from 'react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const ExportPrint = forwardRef(({ data, warehouses = [] }, ref) => {
  // Lấy wareId đầu tiên trong exportDetails
  const wareId = data.exportDetails?.[0]?.wareId;
  // Tìm tên kho từ danh sách kho
  const warehouseName = warehouses.length > 0
    ? (warehouses.find(w => String(w.id) === String(wareId))?.wareName || '')
    : (data.exportDetails?.[0]?.warehouseName || '');
  // Tổng tiền
  const totalPrice = data.totalPrice || data.exportDetails?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0;

  return (
    <div ref={ref} style={{ fontFamily: 'Times New Roman, Arial, serif', color: '#000', width: '900px', margin: '0 auto', background: '#fff', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 22, flex: 1 }}>PHIẾU XUẤT KHO</div>
        <div style={{ fontSize: 15, textAlign: 'right', minWidth: 180 }}><b>Mã phiếu xuất:</b> {data.id}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8, fontSize: 15 }}>
        <div><b>Nhân viên:</b> {data.employeeName}</div>
        <div><b>Tên khách hàng:</b> {data.consumerName}</div>
        <div><b>Số điện thoại:</b> {data.tel}</div>
        <div><b>Địa chỉ:</b> {data.address}</div>
        <div><b>Tổng tiền:</b> {totalPrice.toLocaleString()} VNĐ</div>
        <div><b>Ngày tạo:</b> {formatDate(data.createDate)}</div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, fontSize: 14 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: 4 }}>STT</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Tên sản phẩm, hàng hoá</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Mã số</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Đơn vị tính</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Kho xuất</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Số lượng yêu cầu</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Số lượng thực xuất</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Đơn giá</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {data.exportDetails?.map((item, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{idx + 1}</td>
              <td style={{ border: '1px solid #000', padding: 4 }}>{item.productName || item.proName}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{item.proId}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{item.unit}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>
                {warehouses.length > 0
                  ? (warehouses.find(w => String(w.id) === String(item.wareId))?.wareName || '')
                  : (item.warehouseName || '')}
              </td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{item.quantity}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{item.quantity}</td>
              <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{item.price}</td>
              <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{item.quantity * item.price}</td>
            </tr>
          ))}
          {/* Dòng tổng tiền */}
          <tr>
            <td colSpan={8} style={{ border: '1px solid #000', textAlign: 'right', padding: 4, fontWeight: 'bold' }}>Tổng tiền</td>
            <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4, fontWeight: 'bold' }}>{totalPrice.toLocaleString()} VNĐ</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
        <div style={{ textAlign: 'center', width: '33%' }}>
          Người lập phiếu<br /><br /><br />
          (Ký, họ tên)
        </div>
        <div style={{ textAlign: 'center', width: '33%' }}>
          Người nhận hàng<br /><br /><br />
          (Ký, họ tên)
        </div>
        <div style={{ textAlign: 'center', width: '33%' }}>
          Thủ kho<br /><br /><br />
          (Ký, họ tên)
        </div>
      </div>
    </div>
  );
});

export default ExportPrint; 