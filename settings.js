/* ============================================================
   settings.js – Logic trang Cài đặt TiệmMay Pro
   Lưu toàn bộ cấu hình vào localStorage
   ============================================================ */

// ─── NỘI DUNG Code.gs (nhúng sẵn để copy 1 click) ───────────
const CODE_GS_CONTENT = `/* =================================================================
   TIỆMMAY PRO — Google Apps Script Backend (Code.gs)
   Copy toàn bộ file này vào Google Apps Script, sau đó Deploy.
   ================================================================= */

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

function _getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

function _sheetToObjects(sh) {
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return [];
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
  sh.getRange(1, 1, 1, headers.length)
    .setBackground('#1a1f3a').setFontColor('#a9b4d8').setFontWeight('bold');
}

function _findRowById(sh, idField, id) {
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return -1;
  const headers = data[0].map(h => String(h).trim());
  const colIdx = headers.indexOf(idField);
  if (colIdx === -1) return -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][colIdx]) === String(id)) return i + 1;
  }
  return -1;
}

function _updateRowById(sh, idField, id, data) {
  const rowNum = _findRowById(sh, idField, id);
  if (rowNum === -1) return null;
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(h => String(h).trim());
  const rowRange = sh.getRange(rowNum, 1, 1, headers.length);
  const rowValues = rowRange.getValues()[0];
  headers.forEach((h, i) => { if (data[h] !== undefined) rowValues[i] = data[h]; });
  rowRange.setValues([rowValues]);
  const result = {}; headers.forEach((h, i) => { result[h] = rowValues[i]; });
  return result;
}

function _insertRecord(sh, data) {
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(h => String(h).trim());
  const rowValues = headers.map(h => data[h] !== undefined ? data[h] : '');
  sh.appendRow(rowValues);
}

function doGet(e) {
  try {
    const apiKey = e.parameter.apiKey || '';
    if (API_KEY && apiKey !== API_KEY) return _error('Truy cập bị từ chối: Sai API Key', 403);
    const action = e.parameter.action || 'getAll';
    const sheet  = e.parameter.sheet  || '';
    if (action === 'ping') return _json({ pong: true, time: new Date().toISOString() });
    if (action === 'getAll') {
      if (!SHEET_NAMES[sheet]) return _error('Sheet không tồn tại: ' + sheet);
      return _json(_sheetToObjects(_getSheet(SHEET_NAMES[sheet])));
    }
    if (action === 'getAllSheets') {
      const result = {};
      for (const [key, name] of Object.entries(SHEET_NAMES)) {
        try { result[key] = _sheetToObjects(_getSheet(name)); } catch(e) { result[key] = []; }
      }
      return _json(result);
    }
    return _error('Action không hợp lệ: ' + action);
  } catch(err) { return _error('Lỗi server: ' + err.message, 500); }
}

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
    if (action === 'insert') { _insertRecord(sh, data); return _json({ inserted: data }); }
    if (action === 'update') {
      const updatedRow = _updateRowById(sh, idField, id, data);
      if (!updatedRow) return _error('Không tìm thấy record id="' + id + '"');
      return _json({ updated: updatedRow });
    }
    if (action === 'delete') {
      const rowNum = _findRowById(sh, idField, id);
      if (rowNum === -1) return _error('Không tìm thấy record id="' + id + '"');
      sh.deleteRow(rowNum); return _json({ deleted: id });
    }
    if (action === 'saveAll') {
      if (!Array.isArray(data) || data.length === 0) { sh.clearContents(); return _json({ saved: 0 }); }
      _objectsToSheet(sh, data); return _json({ saved: data.length });
    }
    if (action === 'syncAll') {
      const results = {};
      for (const [key, rows] of Object.entries(data)) {
        if (!SHEET_NAMES[key]) continue;
        try {
          const s = _getSheet(SHEET_NAMES[key]);
          if (Array.isArray(rows) && rows.length > 0) { _objectsToSheet(s, rows); results[key] = rows.length; }
        } catch(err) { results[key] = 'error: ' + err.message; }
      }
      return _json({ synced: results });
    }
    if (action === 'uploadImage') {
      const folderName = "TiemMayPro_Attachments";
      let folder; const folders = DriveApp.getFoldersByName(folderName);
      if (folders.hasNext()) { folder = folders.next(); } else { folder = DriveApp.createFolder(folderName); }
      const fileName = data.fileName || "upload_" + new Date().getTime();
      const mimeType = data.mimeType || "image/jpeg";
      const blob = Utilities.newBlob(Utilities.base64Decode(data.base64Data), mimeType, fileName);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return _json({ fileId: file.getId(), viewUrl: file.getDownloadUrl().replace("download", "view"), directUrl: "https://lh3.googleusercontent.com/u/0/d/" + file.getId() });
    }
    return _error('Action không hợp lệ: ' + action);
  } catch(err) { return _error('Lỗi server: ' + err.message, 500); }
}

function setupInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setName('TiệmMay Pro – Database');
  SpreadsheetApp.getUi().alert('✅ Đã chuẩn bị xong sheets. Nhấn Run từng phần trong Script editor nếu cần dữ liệu mẫu.');
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🧵 TiệmMay Pro').addItem('⚙️ Tạo dữ liệu mẫu', 'setupInitialData').addToUi();
}`;

// ─── HÀM COPY Code.gs ──────────────────────────────────────────
function copyCodeGs() {
    const btn = event.target;
    const resultEl = document.getElementById('copy-gs-result');

    navigator.clipboard.writeText(CODE_GS_CONTENT).then(() => {
        if (resultEl) { resultEl.style.display = 'block'; }
        btn.textContent = '✅ Đã copy!';
        btn.style.background = 'var(--green)';
        setTimeout(() => {
            btn.textContent = '📋 Copy toàn bộ Code.gs';
            btn.style.background = '';
        }, 3000);
    }).catch(() => {
        // Fallback cho trình duyệt cũ
        const el = document.createElement('textarea');
        el.value = CODE_GS_CONTENT;
        el.style.position = 'fixed'; el.style.opacity = '0';
        document.body.appendChild(el);
        el.select(); document.execCommand('copy');
        document.body.removeChild(el);
        if (resultEl) resultEl.style.display = 'block';
        btn.textContent = '✅ Đã copy!';
        setTimeout(() => { btn.textContent = '📋 Copy toàn bộ Code.gs'; }, 3000);
    });
}

const SETTINGS_KEY = 'tiemmay_settings';

// ─── DEFAULT CONFIG ───────────────────────────────────────────
const DEFAULT_SETTINGS = {
    gsUrl: '',
    apiKey: '',
    shopName: 'TiệmMay Pro',
    ownerName: 'Admin',
    shopPhone: '',
    shopEmail: '',
    shopAddress: '',
    openTime: '07:00',
    closeTime: '18:00',
    wifiSsid: 'TiemMay_WiFi_5G',
    shiftStart: '07:30',
    shiftEnd: '17:00',
    lateThreshold: 15,
    otRate: 1.5,
    themeMode: 'dark',
    currency: 'VND',
    lockPassword: '', // Mật khẩu khóa các mục nhạy cảm
};

// ─── LOAD / SAVE ──────────────────────────────────────────────
function loadSettings() {
    try {
        return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'));
    } catch { return { ...DEFAULT_SETTINGS }; }
}

function persistSettings(partial) {
    const current = loadSettings();
    const merged = Object.assign(current, partial);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
    return merged;
}

// ─── APPLY SETTINGS ON LOAD ───────────────────────────────────
function applyAllSettings() {
    const cfg = loadSettings();

    // ── Google Sheets URL → inject vào db.js runtime
    if (cfg.gsUrl) {
        window.GS_URL = cfg.gsUrl;
        window.USE_GOOGLE_SHEETS = true;
    }

    // ── Thông tin tiệm → cập nhật sidebar
    _updateSidebarInfo(cfg);

    // ── Chấm công settings → update ATT config
    if (typeof ATT !== 'undefined') {
        ATT.shopWifi = cfg.wifiSsid || 'TiemMay_WiFi_5G';
    }

    // ── Theme color & mode
    _applyThemeColor(cfg.themeColor || 'purple');
    document.body.dataset.theme = cfg.themeMode || 'dark';

    return cfg;
}

function _updateSidebarInfo(cfg) {
    const nameEl = document.getElementById('sidebar-shop-name');
    const roleEl = document.getElementById('sidebar-shop-role');
    const avaEl = document.getElementById('sidebar-avatar');
    const titleEl = document.querySelector('.sidebar-brand-name');

    if (nameEl) nameEl.textContent = cfg.ownerName || 'Admin';
    if (roleEl) roleEl.textContent = cfg.shopName || 'Chủ tiệm';
    if (avaEl && cfg.ownerName) avaEl.textContent = cfg.ownerName[0].toUpperCase();
    if (titleEl && cfg.shopName) titleEl.textContent = cfg.shopName;
}

// ─── RENDER SETTINGS PAGE ─────────────────────────────────────
function renderSettings() {
    const cfg = loadSettings();

    // Google Sheets URL
    const urlEl = document.getElementById('set-gs-url');
    if (urlEl) urlEl.value = cfg.gsUrl || '';

    // Status dot + label in header
    _updateGsConnBar(cfg.gsUrl);

    // Google Sheets
    _setVal('set-gs-url', cfg.gsUrl);
    _setVal('set-gs-api-key', cfg.apiKey);

    // Shop info
    _setVal('set-shop-name', cfg.shopName);
    _setVal('set-owner-name', cfg.ownerName);
    _setVal('set-shop-phone', cfg.shopPhone);
    _setVal('set-shop-email', cfg.shopEmail);
    _setVal('set-shop-address', cfg.shopAddress);
    _setVal('set-open-time', cfg.openTime);
    _setVal('set-close-time', cfg.closeTime);

    // Attendance
    _setVal('set-wifi-ssid', cfg.wifiSsid);
    _setVal('set-shift-start', cfg.shiftStart);
    _setVal('set-shift-end', cfg.shiftEnd);
    _setVal('set-late-threshold', cfg.lateThreshold);
    _setVal('set-ot-rate', cfg.otRate);

    // Dữ liệu cài đặt Khuôn mặt
    _setVal('set-face-status', cfg.faceStatus || 'on');
    _setVal('set-face-accuracy', cfg.faceAccuracy || 'medium');
    _setVal('set-face-camera', cfg.faceCamera || 'user');
    _setVal('set-face-timeout', cfg.faceTimeout || '3000');

    _setVal('set-currency', cfg.currency);
    _setVal('set-theme-mode', cfg.themeMode || 'dark');
    _highlightColorSwatch(cfg.themeColor);

    // Security
    _setVal('set-lock-pass', cfg.lockPassword || '');

    // Storage info (about tab)
    const storEl = document.getElementById('set-storage-type');
    if (storEl) storEl.textContent = cfg.gsUrl
        ? `☁️ Google Sheets (${cfg.gsUrl.slice(0, 40)}...)`
        : 'Local (RAM – mất khi tải lại trang)';

    // Sync stats
    _refreshSyncStats();

    // Sync button state
    const syncBtn = document.getElementById('set-sync-btn');
    if (syncBtn) syncBtn.disabled = !cfg.gsUrl;
}

// ─── SWITCH TAB ───────────────────────────────────────────────
function switchSetTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.set-tab').forEach(el => {
        el.classList.toggle('active', el.dataset.tab === tab);
    });
    // Update panels
    document.querySelectorAll('.set-panel').forEach(el => {
        el.classList.toggle('active', el.id === `set-panel-${tab}`);
    });
}


function _setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
}

// Cập nhật header dot + gs-conn-bar (layout mới)
function _updateGsConnBar(url) {
    const dot = document.getElementById('set-dot-gs');
    const lbl = document.getElementById('set-lbl-gs');
    const bar = document.getElementById('gs-conn-bar');
    const icon = document.getElementById('gs-conn-icon');
    const title = document.getElementById('gs-conn-title');
    const sub = document.getElementById('gs-conn-sub');
    const online = typeof GS_STATE !== 'undefined' && GS_STATE.connected;

    if (dot) dot.style.background = online ? 'var(--green)' : url ? 'var(--orange)' : 'var(--red)';
    if (lbl) lbl.textContent = online ? 'Google Sheets: Online ✅' : url ? 'Google Sheets: Chưa kiểm tra' : 'Google Sheets: Offline';

    if (bar) bar.classList.toggle('online', online);
    if (icon) icon.textContent = online ? '☁️' : url ? '⏳' : '📴';
    if (title) title.textContent = online
        ? '✅ Đã kết nối Google Sheets'
        : url ? '⚠️ URL đã lưu — nhấn Kiểm tra để xác nhận'
            : 'Chưa kết nối Google Sheets';
    if (sub) sub.textContent = online
        ? `Đang đồng bộ tự động mỗi 5 phút`
        : url ? 'Nhấn 🔌 Kiểm tra bên dưới để kiểm tra kết nối'
            : 'Làm theo 6 bước hướng dẫn bên dưới để kết nối';
}

// Giữ lại để tương thích (có thể vẫn được gọi)
function _updateGsStatusBadge(url) { _updateGsConnBar(url); }


function _refreshSyncStats() {
    const statusEl = document.getElementById('set-stat-status');
    const lastEl = document.getElementById('set-stat-lastsync');
    const recordsEl = document.getElementById('set-stat-records');
    if (!statusEl) return;

    if (typeof GS_STATE === 'undefined') return;

    statusEl.textContent = GS_STATE.connected ? '🟢 Online' : '🔴 Offline';
    lastEl.textContent = GS_STATE.lastSync
        ? GS_STATE.lastSync.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        : '—';
    const total = (DB?.inventory?.length || 0) + (DB?.customers?.length || 0) +
        (DB?.orders?.length || 0) + (ATT?.staff?.length || 0) + (ATT?.logs?.length || 0);
    recordsEl.textContent = total ? `${total} bản ghi` : '—';
}

// ─── GOOGLE SHEETS SETTINGS ───────────────────────────────────
async function testGsConnection() {
    const url = document.getElementById('set-gs-url')?.value.trim();
    const key = document.getElementById('set-gs-api-key')?.value.trim();
    const box = document.getElementById('set-gs-test-result');
    if (!box) return;

    if (!url) {
        _showTestBox(box, 'error', '⚠️ Vui lòng nhập URL trước khi kiểm tra!');
        return;
    }

    if (!url.startsWith('https://script.google.com/macros/s/')) {
        _showTestBox(box, 'error', '❌ URL không đúng định dạng. Phải bắt đầu bằng: https://script.google.com/macros/s/');
        return;
    }

    _showTestBox(box, 'loading', '🔄 Đang kiểm tra kết nối...');

    try {
        const resp = await fetch(`${url}?action=ping&apiKey=${encodeURIComponent(key)}`, { method: 'GET' });
        if (!resp.ok) {
            if (resp.status === 403) throw new Error('Từ chối truy cập: Sai API Key');
            throw new Error(`HTTP ${resp.status}`);
        }
        const json = await resp.json();
        if (json.ok) {
            const t = json.data?.time ? new Date(json.data.time).toLocaleTimeString('vi-VN') : '';
            _showTestBox(box, 'success', `✅ Kết nối thành công! Server time: ${t}`);
        } else {
            throw new Error(json.error || 'Unknown response');
        }
    } catch (err) {
        _showTestBox(box, 'error',
            `❌ Kết nối thất bại: ${err.message}<br><span style="font-size:.78rem;font-weight:400">Kiểm tra lại URL hoặc API Key. Đảm bảo "Who has access: Anyone"</span>`);
    }
}

function _showTestBox(el, type, html) {
    el.style.display = 'flex';
    el.className = `settings-test-box ${type}`;
    el.innerHTML = html;
}

function saveGsSettings() {
    const url = document.getElementById('set-gs-url')?.value.trim();
    const key = document.getElementById('set-gs-api-key')?.value.trim();
    persistSettings({ gsUrl: url, apiKey: key });

    // Cập nhật runtime
    if (url) {
        window.GS_URL = url;
        window.GS_API_KEY = key;
        window.USE_GOOGLE_SHEETS = true;
        const syncBtn = document.getElementById('set-sync-btn');
        if (syncBtn) syncBtn.disabled = false;
        showToast('✅ Đã lưu cấu hình Google Sheets!', 'success');
        // Kết nối ngay lập tức
        setTimeout(() => {
            if (typeof gsLoadAll === 'function') {
                gsLoadAll().then(() => {
                    _updateGsStatusBadge(url);
                    _refreshSyncStats();
                    _updateConnectionBadge(GS_STATE?.connected);
                    const storEl = document.getElementById('set-storage-type');
                    if (storEl) storEl.textContent = `☁️ Google Sheets (${url.slice(0, 40)}...)`;
                });
            }
        }, 300);
    } else {
        showToast('⚠️ URL trống — chạy ở chế độ offline', 'warning');
    }
}

function clearGsSettings() {
    if (!confirm('Xóa cấu hình Google Sheets? Ứng dụng sẽ chạy offline.')) return;
    persistSettings({ gsUrl: '', apiKey: '' });
    window.GS_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
    window.GS_API_KEY = '';
    window.USE_GOOGLE_SHEETS = false;
    GS_STATE.connected = false;
    if (document.getElementById('set-gs-url')) document.getElementById('set-gs-url').value = '';
    if (document.getElementById('set-gs-api-key')) document.getElementById('set-gs-api-key').value = '';
    const box = document.getElementById('set-gs-test-result');
    if (box) box.style.display = 'none';
    const syncBtn = document.getElementById('set-sync-btn');
    if (syncBtn) syncBtn.disabled = true;
    _updateGsStatusBadge('');
    _updateConnectionBadge(false);
    showToast('🗑️ Đã xóa cấu hình Google Sheets', 'info');
}

// ─── SHOP INFO SETTINGS ───────────────────────────────────────
function saveShopSettings() {
    const cfg = persistSettings({
        shopName: document.getElementById('set-shop-name')?.value.trim() || '',
        ownerName: document.getElementById('set-owner-name')?.value.trim() || '',
        shopPhone: document.getElementById('set-shop-phone')?.value.trim() || '',
        shopEmail: document.getElementById('set-shop-email')?.value.trim() || '',
        shopAddress: document.getElementById('set-shop-address')?.value.trim() || '',
        openTime: document.getElementById('set-open-time')?.value || '',
        closeTime: document.getElementById('set-close-time')?.value || '',
    });
    _updateSidebarInfo(cfg);
    showToast('✅ Đã lưu thông tin tiệm!');
}

// ─── ATTENDANCE SETTINGS ──────────────────────────────────────
function saveAttSettings() {
    const cfg = persistSettings({
        wifiSsid: document.getElementById('set-wifi-ssid')?.value.trim() || '',
        shiftStart: document.getElementById('set-shift-start')?.value || '07:30',
        shiftEnd: document.getElementById('set-shift-end')?.value || '17:00',
        lateThreshold: parseInt(document.getElementById('set-late-threshold')?.value) || 15,
        otRate: parseFloat(document.getElementById('set-ot-rate')?.value) || 1.5,
        // Cấu hình khuôn mặt AI
        faceStatus: document.getElementById('set-face-status')?.value || 'on',
        faceAccuracy: document.getElementById('set-face-accuracy')?.value || 'medium',
        faceCamera: document.getElementById('set-face-camera')?.value || 'user',
        faceTimeout: document.getElementById('set-face-timeout')?.value || '3000',
    });
    // Apply to ATT
    if (typeof ATT !== 'undefined') ATT.shopWifi = cfg.wifiSsid;
    showToast('✅ Đã lưu cài đặt chấm công và AI Camera!');
}

// ─── UI / THEME SETTINGS ──────────────────────────────────────
const THEME_COLORS = {
    purple: { main: '#7c6af8', dark: '#5c4fd4', light: '#a9a0fb' },
    teal: { main: '#00c9c9', dark: '#008080', light: '#4dd9d9' },
    pink: { main: '#f05fa6', dark: '#c0357a', light: '#f590c0' },
    blue: { main: '#3f9cf8', dark: '#1565c0', light: '#7ac6fb' },
    orange: { main: '#ff8c42', dark: '#e65c00', light: '#ffb380' },
    green: { main: '#3ddc84', dark: '#1a8a45', light: '#70e8a8' },
};

function setThemeColor(color) {
    _applyThemeColor(color);
    persistSettings({ themeColor: color });
    _highlightColorSwatch(color);
    showToast('🎨 Đã đổi màu chủ đạo!');
}

function _applyThemeColor(color) {
    const c = THEME_COLORS[color] || THEME_COLORS.purple;
    const root = document.documentElement;
    root.style.setProperty('--purple', c.main);
    root.style.setProperty('--purple-d', c.dark);
    root.style.setProperty('--purple-l', c.light);
}

function _highlightColorSwatch(color) {
    document.querySelectorAll('.color-swatch').forEach(el => {
        el.classList.toggle('active', el.dataset.color === color);
    });
}

function saveUiSettings() {
    const mode = document.getElementById('set-theme-mode')?.value || 'dark';
    document.body.dataset.theme = mode;
    persistSettings({
        themeMode: mode,
        currency: document.getElementById('set-currency')?.value || 'VND',
    });
    showToast('✅ Đã lưu cài đặt giao diện!');
}

function resetUiSettings() {
    if (!confirm('Đặt lại giao diện về mặc định?')) return;
    persistSettings({ themeColor: 'purple', currency: 'VND', themeMode: 'dark' });
    _applyThemeColor('purple');
    _highlightColorSwatch('purple');
    document.body.dataset.theme = 'dark';

    const m = document.getElementById('set-theme-mode');
    if (m) m.value = 'dark';
    const cur = document.getElementById('set-currency');
    if (cur) cur.value = 'VND';

    showToast('↩️ Đã đặt lại giao diện mặc định');
}

// ─── DATA BACKUP / RESTORE ────────────────────────────────────
function exportAllData() {
    const payload = {
        exportedAt: new Date().toISOString(),
        version: '2.0.0',
        settings: loadSettings(),
        inventory: DB?.inventory || [],
        customers: DB?.customers || [],
        orders: DB?.orders || [],
        suppliers: DB?.suppliers || [],
        qcHistory: DB?.qcHistory || [],
        activities: DB?.activities || [],
        staff: ATT?.staff || [],
        attendanceLogs: ATT?.logs || [],
    };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiemmay_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Đã xuất file backup thành công!');
}

// ─── SECURITY SETTINGS ────────────────────────────────────────
function saveSecuritySettings() {
    const pass = document.getElementById('set-lock-pass')?.value.trim() || '';
    persistSettings({ lockPassword: pass });
    showToast('🔒 Đã cập nhật mật khẩu bảo mật!');
}


function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.version) throw new Error('File không đúng định dạng TiệmMay Pro');

            if (!confirm(`📤 Nhập dữ liệu từ backup ngày ${data.exportedAt?.slice(0, 10)}?\nToàn bộ dữ liệu hiện tại sẽ bị ghi đè.`)) return;

            // Restore
            if (data.inventory) DB.inventory = data.inventory;
            if (data.customers) DB.customers = data.customers;
            if (data.orders) DB.orders = data.orders;
            if (data.suppliers) DB.suppliers = data.suppliers;
            if (data.qcHistory) DB.qcHistory = data.qcHistory;
            if (data.activities) DB.activities = data.activities;
            if (data.staff) ATT.staff = data.staff;
            if (data.attendanceLogs) ATT.logs = data.attendanceLogs;
            if (data.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));

            applyAllSettings();
            showToast('✅ Nhập dữ liệu thành công! Tải lại trang để áp dụng đầy đủ.', 'success');
        } catch (err) {
            showToast('❌ Lỗi đọc file: ' + err.message, 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function resetAllData() {
    if (!confirm('⚠️ XÓA TOÀN BỘ DỮ LIỆU?\n\nThao tác này không thể hoàn tác!\nHãy backup dữ liệu trước.')) return;
    if (!confirm('Xác nhận lần 2: Bạn chắc chắn muốn xóa tất cả?')) return;

    // Reset DB
    if (typeof DB !== 'undefined') {
        DB.inventory = []; DB.customers = []; DB.orders = [];
        DB.suppliers = []; DB.qcHistory = []; DB.activities = [];
    }
    if (typeof ATT !== 'undefined') { ATT.staff = []; ATT.logs = []; }

    // Giữ settings, chỉ xóa data
    showToast('🗑️ Đã xóa toàn bộ dữ liệu!', 'warning');
    setTimeout(() => renderPage(currentPage), 500);
}

// ─── HOOK navigate ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Áp dụng tất cả settings khi load
    applyAllSettings();

    // Patch navigate
    const origNav = window.navigate;
    window.navigate = function (page) {
        // Kiểm tra mật khẩu nếu truy cập trang nhạy cảm
        const PROTECTED_PAGES = ['reports', 'settings', 'inventory', 'qc'];
        const cfg = loadSettings();

        if (PROTECTED_PAGES.includes(page) && cfg.lockPassword) {
            const pass = prompt('🔒 Vui lòng nhập mật khẩu để truy cập mục này:');
            if (pass !== cfg.lockPassword) {
                if (pass !== null) showToast('Sai mật khẩu!', 'error');
                return;
            }
        }

        origNav(page);
        if (page === 'settings') renderSettings();
    };

    // Thêm 'settings' vào navigate titles
    if (window._navTitles) window._navTitles.settings = '⚙️ Cài đặt hệ thống';

    // Cập nhật GS_STATE stats mỗi 10 giây khi ở trang settings
    setInterval(() => {
        if (typeof currentPage !== 'undefined' && currentPage === 'settings') {
            _refreshSyncStats();
            _updateGsStatusBadge(loadSettings().gsUrl);
        }
    }, 10000);
});
