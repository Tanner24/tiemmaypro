/* =================================================================
   db.js – Lớp dịch vụ dữ liệu Google Sheets cho TiệmMay Pro
   =================================================================
   HƯỚNG DẪN:
   1. Sau khi deploy Apps Script, copy URL vào GS_URL bên dưới.
   2. Để chạy offline (không cần Sheets), đặt USE_GOOGLE_SHEETS = false.
   ================================================================= */

// ══════════════════════════════════════════════════════════════
//  ⚙️  CẤU HÌNH — Tự động nạp từ Cài Đặt (Local Storage)
// ══════════════════════════════════════════════════════════════
var _savedDbSettings = JSON.parse(localStorage.getItem('tiemmay_settings') || '{}');
var GS_URL = _savedDbSettings.gsUrl || 'PASTE_YOUR_WEB_APP_URL_HERE';
var GS_API_KEY = _savedDbSettings.apiKey || '';
var USE_GOOGLE_SHEETS = (GS_URL !== 'PASTE_YOUR_WEB_APP_URL_HERE' && GS_URL !== '');

// ══════════════════════════════════════════════════════════════
const GS_STATE = {
    connected: false,
    loading: false,
    lastSync: null,
    error: null,
    isSyncing: false,  // đang chạy ngầm
};

// ══════════════════════════════════════════════════════════════
//  INDEXEDDB SETUP (DEXIE.JS)
// ══════════════════════════════════════════════════════════════
const tdb = new Dexie("TiemMayDB");
tdb.version(1).stores({
    inventory: 'id, name, status',
    customers: 'id, name, phone',
    orders: 'id, customerId, status',
    qcHistory: '++idx, orderId',
    suppliers: 'id, name',
    activities: '++idx, time',
    staff: 'id, name',
    attendance: 'id, staffId, date',
    pending_sync: '++id, action, sheet' // Action: insert, update, delete
});


// ══════════════════════════════════════════════════════════════
//  INDICATOR UI
// ══════════════════════════════════════════════════════════════
function _showSyncStatus(state, msg) {
    let bar = document.getElementById('gs-sync-bar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'gs-sync-bar';
        bar.style.cssText = `
      position:fixed; bottom:1rem; left:50%; transform:translateX(-50%);
      padding:.45rem 1.25rem; border-radius:99px;
      font-family:'Be Vietnam Pro',sans-serif; font-size:.82rem; font-weight:600;
      z-index:9999; transition:all .3s ease; display:flex; align-items:center; gap:.5rem;
      box-shadow:0 4px 18px rgba(0,0,0,.4); white-space:nowrap;
    `;
        document.body.appendChild(bar);
    }
    const styles = {
        syncing: 'background:#1a2040;color:#8db8f9;border:1px solid rgba(63,156,248,.35)',
        success: 'background:#0d2a1a;color:#3ddc84;border:1px solid rgba(61,220,132,.35)',
        error: 'background:#2a0d11;color:#ff5f6d;border:1px solid rgba(255,95,109,.35)',
        offline: 'background:#1e1a0e;color:#ff8c42;border:1px solid rgba(255,140,66,.35)',
        hidden: 'opacity:0;pointer-events:none',
    };
    const icons = { syncing: '🔄', success: '☁️', error: '⚠️', offline: '📴', hidden: '' };
    bar.style.cssText += ';' + (styles[state] || styles.hidden);
    bar.innerHTML = state === 'hidden'
        ? ''
        : `<span style="animation:${state === 'syncing' ? 'spin 1s linear infinite' : 'none'}">${icons[state]}</span> ${msg}`;

    if (state === 'success') setTimeout(() => _showSyncStatus('hidden'), 3000);
}

// Inject spin animation
if (!document.getElementById('gs-keyframes')) {
    const s = document.createElement('style');
    s.id = 'gs-keyframes';
    s.textContent = '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
    document.head.appendChild(s);
}

// ══════════════════════════════════════════════════════════════
//  FETCH HELPERS
// ══════════════════════════════════════════════════════════════
async function _gsGet(params) {
    const combinedParams = { ...params, apiKey: GS_API_KEY };
    const url = GS_URL + '?' + new URLSearchParams(combinedParams).toString();
    const resp = await fetch(url, { method: 'GET' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    if (!json.ok) throw new Error(json.error || 'Unknown error');
    return json.data;
}

async function _gsPost(body) {
    const combinedBody = { ...body, apiKey: GS_API_KEY };
    const resp = await fetch(GS_URL, {
        method: 'POST',
        // Dùng text/plain để tránh preflight OPTIONS (CORS) lỗi trên Google Script
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(combinedBody),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    if (!json.ok) throw new Error(json.error || 'Unknown error');
    return json.data;
}

// ══════════════════════════════════════════════════════════════
//  KIỂU DỮ LIỆU CHUYỂN ĐỔI (Sheets → JS objects)
// ══════════════════════════════════════════════════════════════
function _parseInventory(rows) {
    return rows.map(r => ({
        ...r,
        qty: Number(r.qty) || 0,
        threshold: Number(r.threshold) || 0,
        price: Number(r.price) || 0,
    }));
}

function _parseCustomers(rows) {
    return rows.map(r => ({
        ...r,
        totalOrders: Number(r.totalOrders) || 0,
        totalSpent: Number(r.totalSpent) || 0,
        measurements: {
            chest: Number(r.chest) || 0,
            waist: Number(r.waist) || 0,
            hip: Number(r.hip) || 0,
            shoulder: Number(r.shoulder) || 0,
            sleeve: Number(r.sleeve) || 0,
            back: Number(r.back) || 0,
            length: Number(r.length) || 0,
            height: Number(r.height) || 0,
        },
        bodyFeatures: r.bodyFeatures || '',
        preferences: r.preferences || '',
    }));
}

function _flattenCustomer(c) {
    return {
        id: c.id, name: c.name, phone: c.phone, email: c.email, dob: c.dob,
        address: c.address,
        chest: c.measurements?.chest || 0,
        waist: c.measurements?.waist || 0,
        hip: c.measurements?.hip || 0,
        shoulder: c.measurements?.shoulder || 0,
        sleeve: c.measurements?.sleeve || 0,
        back: c.measurements?.back || 0,
        length: c.measurements?.length || 0,
        height: c.measurements?.height || 0,
        bodyFeatures: c.bodyFeatures || '',
        preferences: c.preferences || '',
        totalOrders: c.totalOrders || 0,
        totalSpent: c.totalSpent || 0,
    };
}

function _parseOrders(rows) {
    return rows.map(r => ({
        ...r,
        total: Number(r.total) || 0,
        deposit: Number(r.deposit) || 0,
        notes: r.notes ? (typeof r.notes === 'string' ? r.notes.split('|') : r.notes) : [],
    }));
}

function _flattenOrder(o) {
    return { ...o, notes: Array.isArray(o.notes) ? o.notes.join('|') : (o.notes || '') };
}

function _parseStaff(rows) {
    return rows.map(r => ({ ...r, hourlyRate: Number(r.hourlyRate) || 0 }));
}

function _parseAttendance(rows) {
    return rows.map(r => ({
        ...r,
        id: Number(r.id) || 0,
        totalHours: Number(r.totalHours) || 0,
    }));
}

function _parseSuppliers(rows) {
    return rows.map(r => ({ ...r, rating: Number(r.rating) || 0, orders: Number(r.orders) || 0 }));
}

// ══════════════════════════════════════════════════════════════
//  LOAD TẤT CẢ DỮ LIỆU (initial load)
// ══════════════════════════════════════════════════════════════
async function gsLoadAll() {
    // 1. Tải từ IndexedDB lên bộ nhớ ngay lập tức (để UI mượt)
    await _loadFromLocalDB();

    if (!USE_GOOGLE_SHEETS) {
        _showSyncStatus('offline', 'Chạy offline — dữ liệu lưu tại máy');
        setTimeout(() => _showSyncStatus('hidden'), 4000);
        return false;
    }

    GS_STATE.loading = true;
    _showSyncStatus('syncing', 'Đang đồng bộ với Google Sheets...');

    try {
        const all = await _gsGet({ action: 'getAllSheets' });

        // 2. Cập nhật IndexedDB từ kết quả Sheets
        await tdb.transaction('rw', [tdb.inventory, tdb.customers, tdb.orders, tdb.qcHistory, tdb.suppliers, tdb.activities, tdb.staff, tdb.attendance], async () => {
            if (all.inventory) { await tdb.inventory.clear(); await tdb.inventory.bulkAdd(all.inventory); }
            if (all.customers) { await tdb.customers.clear(); await tdb.customers.bulkAdd(all.customers); }
            if (all.orders) { await tdb.orders.clear(); await tdb.orders.bulkAdd(all.orders); }
            if (all.qcHistory) { await tdb.qcHistory.clear(); await tdb.qcHistory.bulkAdd(all.qcHistory); }
            if (all.suppliers) { await tdb.suppliers.clear(); await tdb.suppliers.bulkAdd(all.suppliers); }
            if (all.activities) { await tdb.activities.clear(); await tdb.activities.bulkAdd(all.activities); }
            if (all.staff) { await tdb.staff.clear(); await tdb.staff.bulkAdd(all.staff); }
            if (all.attendance) { await tdb.attendance.clear(); await tdb.attendance.bulkAdd(all.attendance); }
        });

        // 3. Tải lại vào object global DB/ATT
        await _loadFromLocalDB();

        GS_STATE.connected = true;
        GS_STATE.error = null;
        GS_STATE.lastSync = new Date();
        _showSyncStatus('success', `☁️ Đã đồng bộ ${_countTotal(all)} bản ghi`);
        _updateConnectionBadge(true);

        // Xuất lệnh xử lý hàng đợi ngầm (nếu có dữ liệu chưa kịp đẩy lên lúc mất mạng)
        processPendingSync();

        if (typeof currentPage !== 'undefined' && currentPage) {
            setTimeout(() => renderPage(currentPage), 100);
        }
        return true;

    } catch (err) {
        GS_STATE.connected = false;
        GS_STATE.error = err.message;
        _showSyncStatus('offline', '⚠️ Đang dùng dữ liệu tại máy (Offline)');
        _updateConnectionBadge(false);
        console.warn('[GS] Sync error, using local mirror:', err);
        return false;
    } finally {
        GS_STATE.loading = false;
    }
}

async function _loadFromLocalDB() {
    DB.inventory = _parseInventory(await tdb.inventory.toArray());
    DB.customers = _parseCustomers(await tdb.customers.toArray());
    DB.orders = _parseOrders(await tdb.orders.toArray());
    DB.qcHistory = await tdb.qcHistory.toArray();
    DB.suppliers = _parseSuppliers(await tdb.suppliers.toArray());
    DB.activities = await tdb.activities.toArray();
    ATT.staff = _parseStaff(await tdb.staff.toArray());
    ATT.logs = _parseAttendance(await tdb.attendance.toArray());
    _syncNextIds();
    if (typeof updateSidebarBadges === 'function') updateSidebarBadges();
}


function _countTotal(all) {
    return Object.values(all).reduce((s, v) => s + (Array.isArray(v) ? v.length : 0), 0);
}

function _syncNextIds() {
    const maxId = arr => arr.reduce((max, r) => {
        const n = parseInt(String(r.id || '').replace(/\D/g, '')) || 0;
        return Math.max(max, n);
    }, 0);
    if (DB.suppliers.length) DB.nextIds.supplier = maxId(DB.suppliers) + 1;
    if (DB.inventory.length) DB.nextIds.inventory = maxId(DB.inventory) + 1;
    if (DB.customers.length) DB.nextIds.customer = maxId(DB.customers) + 1;
    if (DB.orders.length) DB.nextIds.order = maxId(DB.orders) + 1;
    if (ATT.staff.length) ATT.nextStaffId = maxId(ATT.staff) + 1;
    if (ATT.logs.length) ATT.nextLogId = maxId(ATT.logs) + 1;
}

// ══════════════════════════════════════════════════════════════
//  GHI / CẬP NHẬT / XÓA DỮ LIỆU
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
//  GHI / CẬP NHẬT / XÓA DỮ LIỆU (Local First + Background Sync)
// ══════════════════════════════════════════════════════════════

// Chung: insert 1 record
async function gsInsert(sheet, data) {
    // 1. Lưu vào Local DB ngay lập tức
    const flat = _flattenRecord(sheet, data);
    await tdb[sheet].add(flat);

    // 2. Thêm vào hàng đợi sync
    await tdb.pending_sync.add({ action: 'insert', sheet, data: flat });

    // 3. Chạy sync ngầm
    processPendingSync();
}

// Chung: update 1 record
async function gsUpdate(sheet, id, data, idField = 'id') {
    // 1. Cập nhật Local DB
    const flat = _flattenRecord(sheet, data);
    await tdb[sheet].where(idField).equals(String(id)).modify(flat);

    // 2. Thêm vào hàng đợi sync
    await tdb.pending_sync.add({ action: 'update', sheet, id: String(id), idField, data: flat });

    // 3. Chạy sync ngầm
    processPendingSync();
}

// Chung: delete 1 record
async function gsDelete(sheet, id, idField = 'id') {
    // 1. Xóa khỏi Local DB
    await tdb[sheet].where(idField).equals(String(id)).delete();

    // 2. Thêm vào hàng đợi sync
    await tdb.pending_sync.add({ action: 'delete', sheet, id: String(id), idField });

    // 3. Chạy sync ngầm
    processPendingSync();
}

// ─── UPLOAD IMAGE ─────────────────────────────────────────────
async function gsUploadImage(file) {
    if (!USE_GOOGLE_SHEETS) {
        showToast('Tính năng tải ảnh chỉ khả dụng khi kết nối Google Sheets!', 'warning');
        return null;
    }

    try {
        _showSyncStatus('syncing', 'Đang tải ảnh lên Drive...');

        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
        });
        reader.readAsDataURL(file);
        const base64Data = await base64Promise;

        const result = await _gsPost({
            action: 'uploadImage',
            data: {
                fileName: `order_${Date.now()}_${file.name}`,
                mimeType: file.type,
                base64Data: base64Data
            }
        });

        _showSyncStatus('success', 'Đã tải ảnh thành công ✅');
        localStorage.setItem('gs_last_upload', JSON.stringify(result));
        return result.directUrl || result.viewUrl;
    } catch (err) {
        _showSyncStatus('error', 'Lỗi tải ảnh: ' + err.message);
        console.error('[DB] Upload error:', err);
        return null;
    }
}

// ══════════════════════════════════════════════════════════════
//  XỬ LÝ ĐỒNG BỘ NGẦM (Background Sync)
// ══════════════════════════════════════════════════════════════
async function processPendingSync() {
    if (GS_STATE.isSyncing || !USE_GOOGLE_SHEETS) return;

    const pending = await tdb.pending_sync.toArray();
    if (pending.length === 0) return;

    GS_STATE.isSyncing = true;
    _showSyncStatus('syncing', `Đang đẩy ${pending.length} thay đổi lên cloud...`);

    for (const item of pending) {
        try {
            if (item.action === 'insert') {
                await _gsPost({ action: 'insert', sheet: item.sheet, data: item.data });
            } else if (item.action === 'update') {
                await _gsPost({ action: 'update', sheet: item.sheet, id: item.id, idField: item.idField, data: item.data });
            } else if (item.action === 'delete') {
                await _gsPost({ action: 'delete', sheet: item.sheet, id: item.id, idField: item.idField });
            }

            // Thành công thì xóa khỏi hàng đợi
            await tdb.pending_sync.delete(item.id);
        } catch (err) {
            console.error('[Sync] Item failed, will retry later:', err);
            // Dừng vòng lặp nếu lỗi mạng để thử lại sau
            break;
        }
    }

    GS_STATE.isSyncing = false;
    const remaining = await tdb.pending_sync.count();
    if (remaining === 0) {
        _showSyncStatus('success', 'Đã đồng bộ toàn bộ dữ liệu ✅');
        GS_STATE.connected = true;
        _updateConnectionBadge(true);
    } else {
        _showSyncStatus('offline', `Còn ${remaining} thay đổi chưa sync (Offline)`);
        GS_STATE.connected = false;
        _updateConnectionBadge(false);
    }
}


// Ghi đè toàn bộ 1 sheet (dùng cho sync thủ công)
async function gsSaveAll(sheet, data) {
    if (!USE_GOOGLE_SHEETS || !GS_STATE.connected) return;
    try {
        _showSyncStatus('syncing', `Đang đồng bộ ${sheet}...`);
        const flat = data.map(r => _flattenRecord(sheet, r));
        await _gsPost({ action: 'saveAll', sheet, data: flat });
        _showSyncStatus('success', 'Đồng bộ thành công ✅');
    } catch (err) {
        _showSyncStatus('error', 'Lỗi đồng bộ: ' + err.message);
        console.error('[GS] SaveAll error:', err);
    }
}

// Flatten theo từng loại sheet
function _flattenRecord(sheet, data) {
    if (sheet === 'customers') return _flattenCustomer(data);
    if (sheet === 'orders') return _flattenOrder(data);
    return data;
}

// ══════════════════════════════════════════════════════════════
//  SYNC THỦ CÔNG (nút bấm trên topbar)
// ══════════════════════════════════════════════════════════════
async function gsSyncNow() {
    if (!USE_GOOGLE_SHEETS) {
        showToast('⚙️ Chưa cấu hình Google Sheets URL trong db.js', 'warning');
        return;
    }
    await gsLoadAll();
}

// ══════════════════════════════════════════════════════════════
//  CONNECTION BADGE (hiển thị trên topbar)
// ══════════════════════════════════════════════════════════════
function _updateConnectionBadge(connected) {
    let badge = document.getElementById('gs-badge');
    if (!badge) return;
    badge.textContent = connected ? '☁️ Sheets' : '📴 Offline';
    badge.style.color = connected ? '#3ddc84' : '#ff8c42';
    badge.title = connected
        ? `Kết nối Google Sheets\nSync lần cuối: ${GS_STATE.lastSync?.toLocaleTimeString('vi-VN')}`
        : 'Chưa kết nối Google Sheets';
}

function _injectTopbarBadge() {
    const actions = document.querySelector('.topbar-actions');
    if (!actions || document.getElementById('gs-badge')) return;

    const badge = document.createElement('button');
    badge.id = 'gs-badge';
    badge.className = 'btn-icon';
    badge.title = 'Google Sheets';
    badge.textContent = USE_GOOGLE_SHEETS ? '🔄 Kết nối...' : '📴 Offline';
    badge.style.fontSize = '.78rem';
    badge.onclick = () => {
        if (USE_GOOGLE_SHEETS) gsSyncNow();
        else showToast('Dán URL vào GS_URL trong db.js để kết nối Google Sheets', 'info');
    };
    actions.insertBefore(badge, actions.firstChild);
}

// ══════════════════════════════════════════════════════════════
//  KHỞI ĐỘNG
// ══════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════
//  KHỞI ĐỘNG & TỰ ĐỘNG ĐỒNG BỘ
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    _injectTopbarBadge();

    // Load ngay khi mở trang
    gsLoadAll();

    if (USE_GOOGLE_SHEETS) {
        // Auto-sync mỗi 5 phút để cập nhật nếu có thiết bị khác ghi vào
        setInterval(gsLoadAll, 5 * 60 * 1000);

        // Khi có mạng lại, tự đẩy hàng đợi lên
        window.addEventListener('online', processPendingSync);
    }
});


// ══════════════════════════════════════════════════════════════
//  PATCH CÁC HÀM SAVE/DELETE CỦA app.js VÀ attendance.js
//  để tự động ghi lên Google Sheets khi có thay đổi
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    // ── INVENTORY ───────────────────────────────────────────────
    const _origSaveInventory = window.saveInventory;
    window.saveInventory = async function () {
        const before = DB.inventory.length;
        _origSaveInventory();
        const after = DB.inventory.length;
        if (after > before) {
            await gsInsert('inventory', DB.inventory[DB.inventory.length - 1]);
        } else {
            const id = window._editingInvId;
            if (id) await gsUpdate('inventory', id, DB.inventory.find(i => i.id === id));
        }
    };

    const _origDeleteInventory = window.deleteInventory;
    window.deleteInventory = async function (id) {
        _origDeleteInventory(id);
        await gsDelete('inventory', id);
    };

    // ── CUSTOMERS ────────────────────────────────────────────────
    const _origSaveCustomer = window.saveCustomer;
    window.saveCustomer = async function () {
        const before = DB.customers.length;
        _origSaveCustomer();
        const after = DB.customers.length;
        if (after > before) {
            await gsInsert('customers', _flattenCustomer(DB.customers[DB.customers.length - 1]));
        } else {
            const id = window._editingCustId;
            if (id) await gsUpdate('customers', id, _flattenCustomer(DB.customers.find(c => c.id === id)));
        }
    };

    // ── ORDERS ───────────────────────────────────────────────────
    const _origSaveOrder = window.saveOrder;
    window.saveOrder = async function () {
        const before = DB.orders.length;
        _origSaveOrder();
        const after = DB.orders.length;
        if (after > before) {
            await gsInsert('orders', _flattenOrder(DB.orders[DB.orders.length - 1]));
        }
    };

    const _origUpdateOrder = window.updateOrderStatus;
    window.updateOrderStatus = async function () {
        const orderId = window._updatingOrderId;
        _origUpdateOrder();
        if (orderId) {
            const o = DB.orders.find(x => x.id === orderId);
            if (o) await gsUpdate('orders', orderId, _flattenOrder(o));
        }
    };

    const _origDeleteOrder = window.deleteOrder;
    window.deleteOrder = async function (id) {
        _origDeleteOrder(id);
        await gsDelete('orders', id);
    };

    // ── SUPPLIERS ────────────────────────────────────────────────
    const _origSaveSupplier = window.saveSupplier;
    window.saveSupplier = async function () {
        const before = DB.suppliers.length;
        _origSaveSupplier();
        const after = DB.suppliers.length;
        if (after > before) {
            await gsInsert('suppliers', DB.suppliers[DB.suppliers.length - 1]);
        } else {
            const id = window._editingSuppId;
            if (id) await gsUpdate('suppliers', id, DB.suppliers.find(s => s.id === id));
        }
    };

    const _origDeleteSupplier = window.deleteSupplier;
    window.deleteSupplier = async function (id) {
        _origDeleteSupplier(id);
        await gsDelete('suppliers', id);
    };

    // ── STAFF (attendance) ───────────────────────────────────────
    const _origSaveStaff = window.saveStaff;
    window.saveStaff = async function () {
        const before = ATT.staff.length;
        _origSaveStaff();
        const after = ATT.staff.length;
        if (after > before) {
            await gsInsert('staff', ATT.staff[ATT.staff.length - 1]);
        } else {
            const id = window._editingStaffId;
            if (id) await gsUpdate('staff', id, ATT.staff.find(s => s.id === id));
        }
    };

    const _origDeleteStaff = window.deleteStaff;
    window.deleteStaff = async function (id) {
        _origDeleteStaff(id);
        await gsDelete('staff', id);
    };

    // ── ATTENDANCE LOG ────────────────────────────────────────────
    const _origDoCheckIn = window.doCheckIn;
    window.doCheckIn = async function (staffId, method, note) {
        const before = ATT.logs.length;
        _origDoCheckIn(staffId, method, note);
        const after = ATT.logs.length;
        if (after > before) {
            await gsInsert('attendance', ATT.logs[ATT.logs.length - 1]);
        } else {
            // checkout → update existing log
            const log = ATT.logs.find(l => l.staffId === staffId && l.date === '2026-02-24');
            if (log) await gsUpdate('attendance', log.id, log);
        }
    };
});
