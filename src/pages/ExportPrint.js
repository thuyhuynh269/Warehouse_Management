import React, { forwardRef } from 'react';

const ExportPrint = forwardRef(({ data }, ref) => (
  <div ref={ref} style={{ fontFamily: 'Times New Roman, Arial, serif', color: '#000', width: '900px', margin: '0 auto', background: '#fff', padding: 32 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <div>
        <div>Đơn vị: .............................................</div>
        <div>Bộ phận: ...........................................</div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 13 }}>
        <div style={{ fontWeight: 'bold' }}>Mẫu số 02 - VT</div>
        <div>(Ban hành theo Thông tư số 200/2014/TT-BTC</div>
        <div>Ngày 22/12/2014 của Bộ Tài chính)</div>
      </div>
    </div>
    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 22, margin: '16px 0' }}>PHIẾU XUẤT KHO</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <div>Ngày ..... tháng ..... năm .....</div>
      <div>Số: ............</div>
      <div>Nợ: ............</div>
      <div>Có: ............</div>
    </div>
    <div style={{ marginBottom: 8 }}>- Họ và tên người nhận hàng: <b>{data.consumerName}</b> &nbsp; Địa chỉ (bộ phận): <b>{data.address}</b></div>
    <div style={{ marginBottom: 8 }}>- Lý do xuất kho: .......................................................................................................................</div>
    <div style={{ marginBottom: 8 }}>- Xuất tại kho (ngăn lô): <b>{data.exportDetails?.[0]?.warehouseName || ''}</b> &nbsp; Địa điểm: .......................................................</div>
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, fontSize: 14 }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000', padding: 4 }}>STT</th>
          <th style={{ border: '1px solid #000', padding: 4 }}>Tên, nhãn hiệu, quy cách, phẩm chất vật tư, dụng cụ, sản phẩm, hàng hoá</th>
          <th style={{ border: '1px solid #000', padding: 4 }}>Mã số</th>
          <th style={{ border: '1px solid #000', padding: 4 }}>Đơn vị tính</th>
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
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{item.quantity}</td>
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{item.quantity}</td>
            <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{item.price}</td>
            <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{item.quantity * item.price}</td>
          </tr>
        ))}
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
));

export default ExportPrint;
