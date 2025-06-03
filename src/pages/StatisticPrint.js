import React, { forwardRef } from 'react';

const SatisticPrint = forwardRef(({ data, fromDate, toDate }, ref) => {
  // Tính tổng các trường nếu cần
  const totalImport = data?.reduce((sum, d) => sum + (d.totalImported || 0), 0);
  const totalImportPrice = data?.reduce((sum, d) => sum + (d.totalImportPrice || 0), 0);
  const totalExport = data?.reduce((sum, d) => sum + (d.totalExported || 0), 0);
  const totalExportPrice = data?.reduce((sum, d) => sum + (d.totalExportPrice || 0), 0);

  return (
    <div ref={ref} style={{ fontFamily: 'Times New Roman, Arial, serif', color: '#000', width: '900px', margin: '0 auto', background: '#fff', padding: 32 }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 22, marginBottom: 16 }}>THỐNG KÊ SẢN PHẨM</div>
      <div style={{ fontSize: 15, marginBottom: 8 }}>
        <b>Từ ngày:</b> {fromDate} &nbsp; <b>Đến ngày:</b> {toDate}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: 4 }}>ID</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Tên sản phẩm</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Tồn kho</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Chưa phân phối</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Số lượng nhập</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Tổng giá nhập</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Số xuất</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Tổng giá xuất</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((d, idx) => (
            <tr key={d.proId || idx}>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{d.proId}</td>
              <td style={{ border: '1px solid #000', padding: 4 }}>{d.proName}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{d.remainingStock}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{d.unallocatedStock}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{d.totalImported}</td>
              <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{d.totalImportPrice?.toLocaleString()}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{d.totalExported}</td>
              <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{d.totalExportPrice?.toLocaleString()}</td>
            </tr>
          ))}
          {/* Tổng cộng */}
          <tr>
            <td colSpan={4} style={{ border: '1px solid #000', textAlign: 'right', padding: 4, fontWeight: 'bold' }}>Tổng cộng</td>
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4, fontWeight: 'bold' }}>{totalImport}</td>
            <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4, fontWeight: 'bold' }}>{totalImportPrice?.toLocaleString()}</td>
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4, fontWeight: 'bold' }}>{totalExport}</td>
            <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4, fontWeight: 'bold' }}>{totalExportPrice?.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default SatisticPrint;
