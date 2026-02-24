/* =================================================================
   TIỆMMAY PRO — Google Apps Script Backend (Code.gs)
   Copy toàn bộ file này vào Google Apps Script, sau đó Deploy.
   ================================================================= */

// ─── CẤU HÌNH ──────────────────────────────────────────────────
const SHEET_NAMES = {
  inventory   : 'Kho',
  customers   : 'KhachHang',
  orders      : 'DonHang',
  qcHistory   : 'KiemTraQC',
  suppliers   : 'NhaCungCap',
  activities  : 'HoatDong',
  staff       : 'NhanVien',
  attendance  : 'ChamCong',
};

// ─── BẢO MẬT API ──────────────────────────────────────────────
// Thay đổi chuỗi này để bảo mật Web App của bạn
const API_KEY = 'TIEMMAY_SECRET_2026';

// ─── CORS HEADERS ──────────────────────────────────────────────
function _corsHeaders() {
  return {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type'                : 'application/json',
  };
}

function _json(data, code) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, data, code: code || 200 }))
    .setMimeType(ContentService.MimeType.JSON);
}

function _error(msg, code) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: msg, code: code || 400 }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── UTILITY ───────────────────────────────────────────────────
function _getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
  }
  return sh;
}

function _sheetToObjects(sh) {
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return [];            // chỉ có header hoặc trống
  const headers = data[0].map(h => String(h).trim());
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

function _objectsToSheet(sh, rows) {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const values  = [headers, ...rows.map(r => headers.map(h => r[h] !== undefined ? r[h] : ''))];
  sh.clearContents();
  sh.getRange(1, 1, values.length, values[0].length).setValues(values);
  // Format header row
  sh.getRange(1, 1, 1, headers.length)
    .setBackground('#1a1f3a')
    .setFontColor('#a9b4d8')
    .setFontWeight('bold');
}

// ── DELTA SYNC HELPERS ───────────────────────────────────────
function _findRowById(sh, idField, id) {
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return -1;
  const headers = data[0].map(h => String(h).trim());
  const colIdx = headers.indexOf(idField);
  if (colIdx === -1) return -1;
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][colIdx]) === String(id)) return i + 1; // 1-indexed
  }
  return -1;
}

function _updateRowById(sh, idField, id, data) {
  const rowNum = _findRowById(sh, idField, id);
  if (rowNum === -1) return null;
  
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(h => String(h).trim());
  const rowRange = sh.getRange(rowNum, 1, 1, headers.length);
  const rowValues = rowRange.getValues()[0];
  
  headers.forEach((h, i) => {
    if (data[h] !== undefined) rowValues[i] = data[h];
  });
  
  rowRange.setValues([rowValues]);
  // Trả về object đã merge
  const result = {};
  headers.forEach((h, i) => { result[h] = rowValues[i]; });
  return result;
}

function _insertRecord(sh, data) {
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(h => String(h).trim());
  const rowValues = headers.map(h => data[h] !== undefined ? data[h] : '');
  sh.appendRow(rowValues);
}

// ─── GET HANDLER ───────────────────────────────────────────────
function doGet(e) {
  try {
    const apiKey = e.parameter.apiKey || '';
    if (API_KEY && apiKey !== API_KEY) return _error('Truy cập bị từ chối: Sai API Key', 403);

    const action = e.parameter.action || 'getAll';
    const sheet  = e.parameter.sheet  || '';

    if (action === 'ping') return _json({ pong: true, time: new Date().toISOString() });

    if (action === 'getAll') {
      // Lấy tất cả data của 1 sheet
      if (!SHEET_NAMES[sheet]) return _error('Sheet không tồn tại: ' + sheet);
      const sh   = _getSheet(SHEET_NAMES[sheet]);
      const rows = _sheetToObjects(sh);
      return _json(rows);
    }

    if (action === 'getAllSheets') {
      // Load tất cả sheets cùng lúc (initial load)
      const result = {};
      for (const [key, name] of Object.entries(SHEET_NAMES)) {
        try {
          const sh = _getSheet(name);
          result[key] = _sheetToObjects(sh);
        } catch(err) {
          result[key] = [];
        }
      }
      return _json(result);
    }

    return _error('Action không hợp lệ: ' + action);
  } catch(err) {
    return _error('Lỗi server: ' + err.message, 500);
  }
}

// ─── POST HANDLER ──────────────────────────────────────────────
function doPost(e) {
  try {
    const body   = JSON.parse(e.postData.contents);
    const apiKey = body.apiKey || '';
    if (API_KEY && apiKey !== API_KEY) return _error('Truy cập bị từ chối: Sai API Key', 403);

    const action = body.action || '';
    const sheet  = body.sheet  || '';
    const data   = body.data;
    const id     = body.id;
    const idField= body.idField || 'id';

    if (!SHEET_NAMES[sheet]) return _error('Sheet không tồn tại: ' + sheet);
    const sh = _getSheet(SHEET_NAMES[sheet]);

    // ── INSERT (Delta) ──────────────────────────────────────────
    if (action === 'insert') {
      _insertRecord(sh, data);
      return _json({ inserted: data });
    }

    // ── UPDATE (Delta) ──────────────────────────────────────────
    if (action === 'update') {
      const updatedRow = _updateRowById(sh, idField, id, data);
      if (!updatedRow) return _error(`Không tìm thấy record id="${id}" trong sheet "${sheet}"`);
      return _json({ updated: updatedRow });
    }

    // ── DELETE (Delta) ──────────────────────────────────────────
    if (action === 'delete') {
      const rowNum = _findRowById(sh, idField, id);
      if (rowNum === -1) return _error(`Không tìm thấy record id="${id}"`);
      sh.deleteRow(rowNum);
      return _json({ deleted: id });
    }

    // ── SAVE ALL (ghi đè toàn bộ 1 sheet) ──────────────────────
    if (action === 'saveAll') {
      if (!Array.isArray(data) || data.length === 0) {
        sh.clearContents();
        return _json({ saved: 0 });
      }
      _objectsToSheet(sh, data);
      return _json({ saved: data.length });
    }

    // ── SYNC ALL (ghi nhiều sheets cùng lúc) ───────────────────
    if (action === 'syncAll') {
      const results = {};
      for (const [key, rows] of Object.entries(data)) {
        if (!SHEET_NAMES[key]) continue;
        try {
          const s = _getSheet(SHEET_NAMES[key]);
          if (Array.isArray(rows) && rows.length > 0) {
            _objectsToSheet(s, rows);
            results[key] = rows.length;
          }
        } catch(err) {
          results[key] = 'error: ' + err.message;
        }
      }
      return _json({ synced: results });
    }

    // ── UPLOAD IMAGE TO DRIVE ──────────────────────────────────
    if (action === 'uploadImage') {
      const folderName = "TiemMayPro_Attachments";
      let folder;
      const folders = DriveApp.getFoldersByName(folderName);
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder(folderName);
      }
      
      const fileName = data.fileName || "upload_" + new Date().getTime();
      const mimeType = data.mimeType || "image/jpeg";
      const base64Data = data.base64Data;
      
      const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      return _json({ 
        fileId: file.getId(), 
        viewUrl: file.getDownloadUrl().replace("download", "view"),
        directUrl: "https://lh3.googleusercontent.com/u/0/d/" + file.getId()
      });
    }

    return _error('Action không hợp lệ: ' + action);
  } catch(err) {
    return _error('Lỗi server: ' + err.message, 500);
  }
}

// ─── SETUP: Tạo sheets và nhập dữ liệu mẫu ban đầu ────────────
function setupInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setName('TiệmMay Pro – Database');

  // Inventory / Kho
  const invSh = _getSheet(SHEET_NAMES.inventory);
  _objectsToSheet(invSh, [
    { id:'VL001', name:'Vải linen trắng',   type:'Vải',     material:'Linen',    color:'Trắng',    qty:45, unit:'mét',  threshold:10, price:120000, supplierId:'NCC001', location:'Kệ A1', note:'', status:'Đủ hàng' },
    { id:'VL002', name:'Vải silk xanh navy',type:'Vải',     material:'Silk',     color:'Xanh navy',qty:8,  unit:'mét',  threshold:5,  price:280000, supplierId:'NCC001', location:'Kệ A2', note:'', status:'Sắp hết' },
    { id:'VL003', name:'Vải wool đen',       type:'Vải',     material:'Wool',     color:'Đen',      qty:22, unit:'mét',  threshold:8,  price:350000, supplierId:'NCC002', location:'Kệ A3', note:'', status:'Đủ hàng' },
    { id:'VL004', name:'Chỉ trắng cao cấp', type:'Chỉ',     material:'Polyester',color:'Trắng',    qty:30, unit:'cuộn', threshold:5,  price:15000,  supplierId:'NCC003', location:'Kệ B1', note:'', status:'Đủ hàng' },
    { id:'VL005', name:'Khóa kéo Inox 20cm',type:'Phụ liệu',material:'Inox',     color:'Bạc',      qty:3,  unit:'cái',  threshold:10, price:8000,   supplierId:'NCC003', location:'Kệ B2', note:'', status:'Sắp hết' },
    { id:'VL006', name:'Nút áo xà cừ',      type:'Phụ liệu',material:'Xà cừ',   color:'Trắng ngà', qty:0,  unit:'hộp',  threshold:2,  price:45000,  supplierId:'NCC003', location:'Kệ B3', note:'', status:'Hết hàng' },
    { id:'VL007', name:'Vải cotton đỏ',     type:'Vải',     material:'Cotton',   color:'Đỏ',       qty:15, unit:'mét',  threshold:5,  price:85000,  supplierId:'NCC001', location:'Kệ A4', note:'', status:'Đủ hàng' },
  ]);
  Logger.log('✅ Đã tạo sheet Kho');

  // Customers
  const custSh = _getSheet(SHEET_NAMES.customers);
  _objectsToSheet(custSh, [
    { id:'KH001', name:'Nguyễn Thị Lan', phone:'0901234567', email:'lan@gmail.com', dob:'1990-05-15', address:'12 Nguyễn Huệ, Q1, HCM', chest:88, waist:68, hip:94, shoulder:37, sleeve:57, back:39, length:100, height:158, bodyFeatures:'Vai phải cao hơn vai trái 1cm', preferences:'Thích phong cách thanh lịch, màu pastel', totalOrders:4, totalSpent:8500000 },
    { id:'KH002', name:'Trần Văn Hùng',  phone:'0912345678', email:'hung@gmail.com', dob:'1985-08-20', address:'56 Lê Lợi, Q3, HCM',    chest:96, waist:82, hip:98, shoulder:42, sleeve:62, back:43, length:105, height:172, bodyFeatures:'', preferences:'Ưa vest đậm màu',             totalOrders:2, totalSpent:5200000 },
    { id:'KH003', name:'Phạm Thị Hoa',  phone:'0923456789', email:'hoa@gmail.com', dob:'1995-11-30', address:'88 Hai Bà Trưng, HN',   chest:84, waist:64, hip:90, shoulder:36, sleeve:55, back:38, length:98,  height:155, bodyFeatures:'Ngực lép',  preferences:'Thích áo đầm cổ V',       totalOrders:6, totalSpent:14200000 },
    { id:'KH004', name:'Lê Minh Tuấn',  phone:'0934567890', email:'tuan@gmail.com', dob:'1988-03-10', address:'22 Đinh Tiên Hoàng, HN', chest:100,waist:88, hip:102,shoulder:44, sleeve:63, back:45, length:108, height:175, bodyFeatures:'Bụng to',    preferences:'Vest rộng thoải mái',     totalOrders:3, totalSpent:9800000 },
  ]);
  Logger.log('✅ Đã tạo sheet KhachHang');

  // Suppliers
  const supSh = _getSheet(SHEET_NAMES.suppliers);
  _objectsToSheet(supSh, [
    { id:'NCC001', name:'Vải Thành Công',    goods:'Vải linen, cotton, silk', phone:'0901111111', email:'vaiTC@gmail.com',  address:'45 Hàng Bông, HN',        rating:5, note:'Giao hàng đúng hẹn', orders:24 },
    { id:'NCC002', name:'Vải Tuấn Nam',      goods:'Vải wool, tweed, denim',  phone:'0902222222', email:'vaiTN@gmail.com',  address:'12 Phố Huế, HN',          rating:4, note:'Giá tốt, chất lượng ổn', orders:18 },
    { id:'NCC003', name:'Phụ Liệu Đại Việt', goods:'Chỉ, nút, khóa kéo',     phone:'0903333333', email:'phulieuDV@gmail.com',address:'67 Trần Phú, HCM',        rating:4, note:'Nhiều mẫu mã', orders:31 },
  ]);
  Logger.log('✅ Đã tạo sheet NhaCungCap');

  // Staff
  const staffSh = _getSheet(SHEET_NAMES.staff);
  _objectsToSheet(staffSh, [
    { id:'NV001', name:'Nguyễn Văn An',  skill:'Thợ may chính',  phone:'0901111222', hourlyRate:30000, shift:'07:30-17:00', status:'active',   qrCode:'QR-NV001', mac:'AA:BB:CC:11:22:33', startDate:'2023-01-10', note:'Thợ lành nghề 5 năm kinh nghiệm' },
    { id:'NV002', name:'Trần Thị Bình',  skill:'Thợ cắt',        phone:'0902222333', hourlyRate:28000, shift:'07:30-17:00', status:'active',   qrCode:'QR-NV002', mac:'BB:CC:DD:22:33:44', startDate:'2023-06-01', note:'' },
    { id:'NV003', name:'Lê Văn Cường',   skill:'Thợ may chính',  phone:'0903333444', hourlyRate:32000, shift:'08:00-17:30', status:'active',   qrCode:'QR-NV003', mac:'CC:DD:EE:33:44:55', startDate:'2022-03-15', note:'Chuyên vest cao cấp' },
    { id:'NV004', name:'Phạm Thị Dung',  skill:'Thợ hoàn thiện', phone:'0904444555', hourlyRate:22000, shift:'08:00-17:30', status:'active',   qrCode:'QR-NV004', mac:'DD:EE:FF:44:55:66', startDate:'2024-02-01', note:'' },
  ]);
  Logger.log('✅ Đã tạo sheet NhanVien');

  // Attendance Log (trống, sẽ ghi vào khi chấm công)
  const attSh = _getSheet(SHEET_NAMES.attendance);
  const attHeaders = [['id','staffId','date','checkIn','checkOut','totalHours','method','status','note']];
  attSh.clearContents();
  attSh.getRange(1,1,1,attHeaders[0].length).setValues(attHeaders);

  // Orders (để trống ban đầu hoặc thêm mẫu)
  const ordSh = _getSheet(SHEET_NAMES.orders);
  _objectsToSheet(ordSh, [
    { id:'DH001', customerId:'KH001', type:'Áo dài',  fabric:'VL001', purpose:'Cưới hỏi', date:'2026-02-01', fittingDate:'2026-02-10', deliveryDate:'2026-02-20', tailor:'Thợ An', total:2800000, deposit:1400000, status:'Hoàn thành', priority:'normal', desc:'Áo dài trắng đính hoa', notes:'' },
    { id:'DH002', customerId:'KH002', type:'Vest nam',fabric:'VL003', purpose:'Công sở',  date:'2026-02-05', fittingDate:'2026-02-15', deliveryDate:'2026-02-25', tailor:'Thợ An', total:3500000, deposit:1750000, status:'May hoàn thiện', priority:'normal', desc:'Vest đen 2 lớp', notes:'' },
    { id:'DH003', customerId:'KH003', type:'Đầm dự tiệc',fabric:'VL002', purpose:'Đi tiệc', date:'2026-02-08', fittingDate:'2026-02-18', deliveryDate:'2026-02-28', tailor:'Thợ Bình', total:2200000, deposit:1100000, status:'Thử đồ',  priority:'high', desc:'Đầm xanh navy cổ thuyền', notes:'' },
  ]);
  Logger.log('✅ Đã tạo sheet DonHang');

  // QC History
  const qcSh = _getSheet(SHEET_NAMES.qcHistory);
  const qcHeaders = [['orderId','customerId','date','seam','dimensions','cleanliness','ironing','result','note']];
  qcSh.clearContents();
  qcSh.getRange(1,1,1,qcHeaders[0].length).setValues(qcHeaders);

  // Activities
  const actSh = _getSheet(SHEET_NAMES.activities);
  _objectsToSheet(actSh, [
    { text:'Đơn hàng DH003 chuyển sang Thử đồ', time:'30 phút trước', color:'#7c6af8' },
    { text:'Nhập kho 20m Vải linen trắng',         time:'2 giờ trước',  color:'#3ddc84' },
    { text:'Khách hàng Lê Minh Tuấn đặt đơn mới', time:'Hôm qua',      color:'#3f9cf8' },
  ]);

  Logger.log('🎉 Setup hoàn tất! Tất cả sheets đã được tạo.');
  SpreadsheetApp.getUi().alert('✅ Setup hoàn tất!\n\nĐã tạo đủ 8 sheets:\n- Kho\n- KhachHang\n- DonHang\n- KiemTraQC\n- NhaCungCap\n- HoatDong\n- NhanVien\n- ChamCong\n\nBây giờ hãy Deploy làm Web App.');
}

// ─── MENU trong Google Sheets ───────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🧵 TiệmMay Pro')
    .addItem('⚙️ Tạo dữ liệu mẫu ban đầu', 'setupInitialData')
    .addItem('🌐 Mở hướng dẫn Deploy', 'openDeployGuide')
    .addToUi();
}

function openDeployGuide() {
  const html = HtmlService.createHtmlOutput(`
    <style>body{font-family:sans-serif;padding:20px;line-height:1.6}
    code{background:#f0f0f0;padding:2px 6px;border-radius:4px}
    h3{color:#5b4cf8}</style>
    <h3>🚀 Hướng dẫn Deploy Web App</h3>
    <ol>
      <li>Nhấn <strong>Deploy → New deployment</strong></li>
      <li>Chọn loại: <strong>Web app</strong></li>
      <li>Execute as: <strong>Me (your email)</strong></li>
      <li>Who has access: <strong>Anyone</strong></li>
      <li>Nhấn <strong>Deploy</strong></li>
      <li>Copy URL → Dán vào file <code>db.js</code> của web app</li>
    </ol>
    <p>⚠️ Mỗi lần sửa code phải deploy version mới!</p>
  `).setWidth(480).setHeight(340);
  SpreadsheetApp.getUi().showModalDialog(html, '📋 Hướng dẫn Deploy');
}
