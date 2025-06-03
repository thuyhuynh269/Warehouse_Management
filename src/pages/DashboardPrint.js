import React, { forwardRef } from 'react';

const DashboardPrint = forwardRef(({ data, fromDate, toDate }, ref) => {
  // Tính tổng các trường nếu cần
  const totalImportCount = data?.reduce((sum, d) => sum + (d.importCount || 0), 0);
  const totalImportPrice = data?.reduce((sum, d) => sum + (d.importPrice || 0), 0);
  const totalImportCompleted = data?.reduce((sum, d) => sum + (d.importCompleted || 0), 0);
  const totalImportProcessing = data?.reduce((sum, d) => sum + (d.importProcessing || 0), 0);
  const totalImportNew = data?.reduce((sum, d) => sum + (d.importNew || 0), 0);
  const totalExportCount = data?.reduce((sum, d) => sum + (d.exportCount || 0), 0);
  const totalExportPrice = data?.reduce((sum, d) => sum + (d.exportPrice || 0), 0);
  const totalExportCompleted = data?.reduce((sum, d) => sum + (d.exportCompleted || 0), 0);
  const totalExportPending = data?.reduce((sum, d) => sum + (d.exportPending || 0), 0);

  return (
    <div ref={ref} style={{ fontFamily: 'Times New Roman, Arial, serif', color: '#000', width: '1200px', margin: '0 auto', background: '#fff', padding: 32 }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 22, marginBottom: 16 }}>BÁO CÁO NHẬP XUẤT</div>
      <div style={{ fontSize: 15, marginBottom: 8 }}>
        <b>Từ ngày:</b> {fromDate} &nbsp; <b>Đến ngày:</b> {toDate}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: 4 }}>Ngày</th>
            {/* Nhóm nhập */}
            <th style={{ border: '1px solid #000', padding: 4 }}>Số đơn nhập</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Số tiền nhập</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Nhập hoàn thành</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Nhập đang xử lý</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Nhập mới</th>
            {/* Nhóm xuất */}
            <th style={{ border: '1px solid #000', padding: 4 }}>Số đơn xuất</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Số tiền xuất</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Xuất hoàn thành</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Xuất chờ</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((d, idx) => (
            <tr key={d.date || idx}>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{d.date}</td>
              {/* Nhóm nhập */}
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{d.importCount}</td>
              <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{d.importPrice?.toLocaleString()}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{d.importCompleted}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{d.importProcessing}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{d.importNew}</td>
              {/* Nhóm xuất */}
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{d.exportCount}</td>
              <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{d.exportPrice?.toLocaleString()}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{d.exportCompleted}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{d.exportPending}</td>
            </tr>
          ))}
          {/* Tổng cộng */}
          <tr>
            <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4, fontWeight: 'bold' }}>Tổng cộng</td>
            {/* Nhóm nhập */}
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4, fontWeight: 'bold' }}>{totalImportCount}</td>
            <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4, fontWeight: 'bold' }}>{totalImportPrice?.toLocaleString()}</td>
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4, fontWeight: 'bold' }}>{totalImportCompleted}</td>
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4, fontWeight: 'bold' }}>{totalImportProcessing}</td>
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4, fontWeight: 'bold' }}>{totalImportNew}</td>
            {/* Nhóm xuất */}
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4, fontWeight: 'bold' }}>{totalExportCount}</td>
            <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4, fontWeight: 'bold' }}>{totalExportPrice?.toLocaleString()}</td>
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4, fontWeight: 'bold' }}>{totalExportCompleted}</td>
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4, fontWeight: 'bold' }}>{totalExportPending}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default DashboardPrint;
