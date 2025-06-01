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

const ImportPrint = forwardRef(({ data = [] }, ref) => {
  const supplierName = data.supplierName || '';
  // Tổng tiền
  const totalPrice = data.totalPrice || data.importDetails?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0;
console.log(data)
  return (
    <div ref={ref} style={{ fontFamily: 'Times New Roman, Arial, serif', color: '#000', width: '900px', margin: '0 auto', background: '#fff', padding: 32 }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 22, margin: '16px 0' }}>PHIẾU NHẬP KHO</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8, fontSize: 15 }}>
        <div><b>Nhân viên:</b> {data.employeeName}</div>
        <div><b>Tên nhà cung cấp:</b> {data.supplierName}</div>
        <div><b>Số điện thoại:</b> {data.tel}</div>
        <div><b>Địa chỉ:</b> {data.address}</div>
        <div><b>Email:</b> {data.email}</div>
        <div><b>Tổng tiền:</b> {totalPrice.toLocaleString()} VNĐ</div>
        <div><b>Ngày tạo:</b> {formatDate(data.createDate)}</div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, fontSize: 14 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: 4 }}>STT</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Tên, nhãn hiệu, quy cách, phẩm chất vật tư, dụng cụ, sản phẩm, hàng hoá</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Mã số</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Đơn vị tính</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Số lượng yêu cầu</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Số lượng thực nhập</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Đơn giá</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {data.importDetails?.map((item, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{idx + 1}</td>
              <td style={{ border: '1px solid #000', padding: 4 }}>{item.productName || item.proName}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{item.proId}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{item.unit}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{item.quantity}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{item.quantity}</td>
              <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{item.price}</td>
              <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{item.quantity * item.price}</td>
            </tr>
          ))}
          {/* Dòng tổng tiền */}
          <tr>
            <td colSpan={7} style={{ border: '1px solid #000', textAlign: 'right', padding: 4, fontWeight: 'bold' }}>Tổng tiền</td>
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

export default ImportPrint; 