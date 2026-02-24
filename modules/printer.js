/**
 * Module: printer.js
 * Xử lý in hóa đơn và phiếu may đo cho TiệmMay Pro
 */

const PRINTER = {
    /**
     * In hóa đơn/phiếu may đo cho một đơn hàng
     * @param {string} orderId 
     */
    printInvoice: function (orderId) {
        const order = DB.orders.find(o => o.id === orderId);
        if (!order) {
            showToast('Không tìm thấy đơn hàng!', 'error');
            return;
        }

        const customer = DB.customers.find(c => c.id === order.customerId);
        const settings = JSON.parse(localStorage.getItem('tiemmay_settings') || '{}');
        const shopName = settings.shopName || 'TiệmMay Pro';
        const shopPhone = settings.shopPhone || '—';
        const shopAddress = settings.shopAddress || '—';

        // Tạo nội dung in
        const printWindow = window.open('', '_blank');
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>In hóa đơn - ${orderId}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;700&display=swap');
        body { font-family: 'Be Vietnam Pro', sans-serif; padding: 20px; color: #333; line-height: 1.5; }
        .invoice-box { max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; box-shadow: 0 0 10px rgba(0, 0, 0, .15); }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
        .shop-info h1 { margin: 0; color: #7c6af8; font-size: 24px; }
        .shop-info p { margin: 5px 0; font-size: 14px; color: #666; }
        .invoice-title { text-align: right; }
        .invoice-title h2 { margin: 0; color: #333; text-transform: uppercase; letter-spacing: 1px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
        .info-section h3 { border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; font-size: 16px; color: #7c6af8; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
        .info-label { color: #666; }
        .info-value { font-weight: 700; }
        .measurement-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
        .meas-item { text-align: center; }
        .meas-val { font-weight: 700; font-size: 16px; display: block; }
        .meas-lbl { font-size: 11px; color: #888; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        table th { background: #f2f2f2; text-align: left; padding: 10px; font-size: 14px; }
        table td { padding: 10px; border-bottom: 1px solid #eee; font-size: 14px; }
        .total-section { text-align: right; margin-top: 20px; }
        .total-row { display: flex; justify-content: flex-end; gap: 20px; margin-bottom: 5px; }
        .total-label { font-size: 14px; color: #666; }
        .total-value { font-size: 16px; font-weight: 700; min-width: 120px; }
        .grand-total { font-size: 20px; color: #7c6af8; border-top: 2px solid #7c6af8; padding-top: 5px; margin-top: 5px; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px dashed #eee; padding-top: 20px; }
        .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; text-align: center; }
        .signature-box { height: 100px; }
        @media print {
            body { padding: 0; }
            .invoice-box { border: none; box-shadow: none; }
            .no-print { display: none; }
        }
    </style>
</head>
<body onload="window.print(); window.close();">
    <div class="invoice-box">
        <div class="header">
            <div class="shop-info">
                <h1>${shopName}</h1>
                <p>📍 ${shopAddress}</p>
                <p>📞 ${shopPhone}</p>
            </div>
            <div class="invoice-title">
                <h2>Phiếu May Đo</h2>
                <p style="margin:5px 0">Số: <strong>${order.id}</strong></p>
                <p style="font-size:12px; color:#888">${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}</p>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-section">
                <h3>Thông tin khách hàng</h3>
                <div class="info-row"><span class="info-label">Khách hàng:</span> <span class="info-value">${customer?.name || '—'}</span></div>
                <div class="info-row"><span class="info-label">Số điện thoại:</span> <span class="info-value">${customer?.phone || '—'}</span></div>
                <div class="info-row"><span class="info-label">Địa chỉ:</span> <span class="info-value">${customer?.address || '—'}</span></div>
            </div>
            <div class="info-section">
                <h3>Chi tiết đơn hàng</h3>
                <div class="info-row"><span class="info-label">Loại trang phục:</span> <span class="info-value">${order.type}</span></div>
                <div class="info-row"><span class="info-label">Ngày nhận:</span> <span class="info-value">${fmtDate(order.date)}</span></div>
                <div class="info-row"><span class="info-label">Ngày giao (Hẹn):</span> <span class="info-value">${fmtDate(order.deliveryDate)}</span></div>
            </div>
        </div>

        <div class="info-section">
            <h3>Số đo chi tiết (cm)</h3>
            <div class="measurement-grid">
                <div class="meas-item"><span class="meas-val">${customer?.measurements?.chest || '—'}</span><span class="meas-lbl">Ngực</span></div>
                <div class="meas-item"><span class="meas-val">${customer?.measurements?.waist || '—'}</span><span class="meas-lbl">Eo</span></div>
                <div class="meas-item"><span class="meas-val">${customer?.measurements?.hip || '—'}</span><span class="meas-lbl">Hông</span></div>
                <div class="meas-item"><span class="meas-val">${customer?.measurements?.shoulder || '—'}</span><span class="meas-lbl">Vai</span></div>
                <div class="meas-item"><span class="meas-val">${customer?.measurements?.sleeve || '—'}</span><span class="meas-lbl">Dài tay</span></div>
                <div class="meas-item"><span class="meas-val">${customer?.measurements?.back || '—'}</span><span class="meas-lbl">Dài lưng</span></div>
                <div class="meas-item"><span class="meas-val">${customer?.measurements?.length || '—'}</span><span class="meas-lbl">Dài váy/áo</span></div>
                <div class="meas-item"><span class="meas-val">${customer?.measurements?.height || '—'}</span><span class="meas-lbl">Chiều cao</span></div>
            </div>
            ${customer?.bodyFeatures ? `<p style="font-size:13px"><strong>Lưu ý hình thể:</strong> ${customer.bodyFeatures}</p>` : ''}
        </div>

        <div class="info-section">
            <h3>Chi tiết thanh toán</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nội dung trang phục</th>
                        <th>Chất liệu vải</th>
                        <th style="text-align:right">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <strong>${order.type}</strong>
                            <div style="font-size:12px; color:#666; margin-top:5px">${order.desc || ''}</div>
                        </td>
                        <td>${getInventoryName(order.fabric)}</td>
                        <td style="text-align:right"><strong>${fmt(order.total)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="total-section">
            <div class="total-row"><span class="total-label">Tổng cộng:</span> <span class="total-value">${fmt(order.total)}</span></div>
            <div class="total-row"><span class="total-label">Đã đặt cọc:</span> <span class="total-value">${fmt(order.deposit)}</span></div>
            <div class="total-row grand-total"><span class="total-label" style="color:#7c6af8">Cần thanh toán:</span> <span class="total-value">${fmt(order.total - order.deposit)}</span></div>
        </div>

        <div class="signature-grid">
            <div>
                <p><strong>Khách hàng ký tên</strong></p>
                <div class="signature-box"></div>
                <p style="font-size:12px; color:#888">(Ký và ghi rõ họ tên)</p>
            </div>
            <div>
                <p><strong>Người lập phiếu</strong></p>
                <div class="signature-box"></div>
                <p style="font-size:12px; color:#888">${settings.ownerName || 'Admin'}</p>
            </div>
        </div>

        <div class="footer">
            <p>Cảm ơn quý khách đã tin tưởng lựa chọn dịch vụ của ${shopName}!</p>
            <p>Vui lòng mang theo phiếu này khi đến thử đồ hoặc nhận hàng.</p>
        </div>
    </div>
</body>
</html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    },

    /**
     * In biên lai K80 (Khổ giấy in nhiệt 80mm)
     * @param {string} orderId 
     */
    printK80: function (orderId) {
        const order = DB.orders.find(o => o.id === orderId);
        if (!order) return;
        const customer = DB.customers.find(c => c.id === order.customerId);
        const settings = JSON.parse(localStorage.getItem('tiemmay_settings') || '{}');
        const shopName = settings.shopName || 'TiệmMay Pro';

        const printWindow = window.open('', '_blank', 'width=300,height=600');
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Bill - ${orderId}</title>
    <style>
        body { font-family: 'Courier New', Courier, monospace; width: 80mm; margin: 0; padding: 5mm; font-size: 12px; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .line { border-bottom: 1px dashed #000; margin: 5px 0; }
        .row { display: flex; justify-content: space-between; margin: 2px 0; }
        .header h2 { margin: 5px 0; font-size: 16px; }
        .footer { font-size: 10px; margin-top: 15px; }
    </style>
</head>
<body onload="window.print(); window.close();">
    <div class="center">
        <h2 class="bold">${shopName.toUpperCase()}</h2>
        <div>${settings.shopAddress || ''}</div>
        <div>ĐT: ${settings.shopPhone || ''}</div>
        <div class="line"></div>
        <div class="bold">BIÊN LAI THANH TOÁN</div>
        <div>Số: ${order.id}</div>
        <div>Ngày: ${new Date().toLocaleDateString('vi-VN')}</div>
    </div>
    <div class="line"></div>
    <div>Khách: ${customer?.name || 'Vãng lai'}</div>
    <div>SP: ${order.type}</div>
    <div class="line"></div>
    <div class="row bold"><span>Tổng tiền:</span> <span>${fmt(order.total)}</span></div>
    <div class="row"><span>Đã cọc:</span> <span>${fmt(order.deposit)}</span></div>
    <div class="line"></div>
    <div class="row bold" style="font-size:14px"><span>CÒN LẠI:</span> <span>${fmt(order.total - order.deposit)}</span></div>
    <div class="line"></div>
    <div class="center footer">
        Hẹn thử đồ: ${fmtDate(order.fittingDate)}<br>
        Hẹn giao: ${fmtDate(order.deliveryDate)}<br><br>
        Cảm ơn quý khách!<br>Hẹn gặp lại.
    </div>
</body>
</html>`;
        printWindow.document.write(html);
        printWindow.document.close();
    }
};
