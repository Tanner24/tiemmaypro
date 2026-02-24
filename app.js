/* ============================================================
   TIỆM MAY PRO — Main Application Logic
   ============================================================ */

'use strict';

// ─── DATA STORE ────────────────────────────────────────────
const DB = {
  suppliers: [
    { id: 'NCC001', name: 'Vải Thành Công', goods: 'Vải linen, cotton, silk', phone: '0901111111', email: 'vaiTC@gmail.com', address: '45 Hàng Bông, HN', rating: 5, note: 'Giao hàng đúng hẹn, chất lượng ổn định', orders: 24 },
    { id: 'NCC002', name: 'Phụ Liệu Đại Việt', goods: 'Chỉ may, nút, khóa kéo', phone: '0902222222', email: 'dailiviet@gmail.com', address: '12 Lê Văn Sỹ, HCM', rating: 4, note: 'Giá cạnh tranh', orders: 18 },
    { id: 'NCC003', name: 'Vải Tuấn Nam', goods: 'Vải wool, tweed, denim', phone: '0903333333', email: 'vaiTN@gmail.com', address: '88 Nguyễn Trãi, HCM', rating: 4, note: 'Đa dạng mẫu mã', orders: 11 },
  ],
  inventory: [
    { id: 'VL001', name: 'Vải linen trắng', type: 'Vải', material: 'Linen', color: 'Trắng', qty: 45, unit: 'mét', threshold: 10, price: 120000, supplierId: 'NCC001', location: 'Kệ A1', note: '', status: 'Đủ hàng' },
    { id: 'VL002', name: 'Vải silk xanh navy', type: 'Vải', material: 'Silk', color: 'Xanh navy', qty: 8, unit: 'mét', threshold: 10, price: 280000, supplierId: 'NCC001', location: 'Kệ A2', note: '', status: 'Sắp hết' },
    { id: 'VL003', name: 'Vải wool đen', type: 'Vải', material: 'Wool', color: 'Đen', qty: 22, unit: 'mét', threshold: 8, price: 350000, supplierId: 'NCC003', location: 'Kệ B1', note: '', status: 'Đủ hàng' },
    { id: 'VL004', name: 'Chỉ trắng cao cấp', type: 'Chỉ', material: 'Polyester', color: 'Trắng', qty: 30, unit: 'cuộn', threshold: 5, price: 15000, supplierId: 'NCC002', location: 'Kệ C1', note: '', status: 'Đủ hàng' },
    { id: 'VL005', name: 'Khóa kéo inox 20cm', type: 'Phụ liệu', material: 'Inox', color: 'Bạc', qty: 3, unit: 'cái', threshold: 20, price: 8000, supplierId: 'NCC002', location: 'Kệ C2', note: '', status: 'Sắp hết' },
    { id: 'VL006', name: 'Nút áo xà cừ', type: 'Phụ liệu', material: 'Xà cừ', color: 'Trắng ngà', qty: 0, unit: 'hộp', threshold: 5, price: 45000, supplierId: 'NCC002', location: 'Kệ C3', note: '', status: 'Hết hàng' },
    { id: 'VL007', name: 'Vải cotton đỏ', type: 'Vải', material: 'Cotton', color: 'Đỏ', qty: 15, unit: 'mét', threshold: 8, price: 85000, supplierId: 'NCC001', location: 'Kệ A3', note: '', status: 'Đủ hàng' },
  ],
  customers: [
    { id: 'KH001', name: 'Nguyễn Thị Lan', phone: '0901234567', email: 'lan.nguyen@gmail.com', dob: '1990-05-15', address: '12 Nguyễn Huệ, Q1, HCM', measurements: { chest: 88, waist: 68, hip: 94, shoulder: 37, sleeve: 57, back: 39, length: 100, height: 158 }, bodyFeatures: 'Vai phải cao hơn vai trái 1cm', preferences: 'Thích phong cách thanh lịch, màu pastel', totalOrders: 4, totalSpent: 8500000 },
    { id: 'KH002', name: 'Trần Văn Hùng', phone: '0912345678', email: 'hung.tran@gmail.com', dob: '1985-08-20', address: '45 Lê Lợi, Q3, HCM', measurements: { chest: 96, waist: 82, hip: 98, shoulder: 43, sleeve: 62, back: 44, length: 105, height: 172 }, bodyFeatures: '', preferences: 'Ưa vest cổ điển, màu tối', totalOrders: 2, totalSpent: 5200000 },
    { id: 'KH003', name: 'Phạm Thị Hoa', phone: '0923456789', email: 'hoa.pham@gmail.com', dob: '1995-12-03', address: '78 Bà Triệu, HN', measurements: { chest: 84, waist: 64, hip: 90, shoulder: 36, sleeve: 55, back: 38, length: 98, height: 155 }, bodyFeatures: 'Lưng hơi cong', preferences: 'Thích váy xòe, màu sặc sỡ', totalOrders: 6, totalSpent: 14200000 },
    { id: 'KH004', name: 'Lê Minh Tuấn', phone: '0934567890', email: 'tuan.le@gmail.com', dob: '1988-03-22', address: '22 Đinh Tiên Hoàng, Q1, HCM', measurements: { chest: 100, waist: 88, hip: 102, shoulder: 45, sleeve: 64, back: 46, length: 108, height: 175 }, bodyFeatures: 'Bụng hơi to', preferences: 'Vest sang trọng cho công sở', totalOrders: 3, totalSpent: 9800000 },
  ],
  orders: [
    { id: 'DH001', customerId: 'KH001', type: 'Áo dài', fabric: 'VL001', purpose: 'Cưới hỏi', date: '2026-02-01', fittingDate: '2026-02-10', deliveryDate: '2026-02-20', tailor: 'Thợ An', total: 2800000, deposit: 1400000, status: 'Hoàn thành', priority: 'normal', desc: 'Áo dài trắng đính hoa', notes: [] },
    { id: 'DH002', customerId: 'KH002', type: 'Vest nam', fabric: 'VL003', purpose: 'Công sở', date: '2026-02-05', fittingDate: '2026-02-15', deliveryDate: '2026-02-25', tailor: 'Thợ Bình', total: 3500000, deposit: 1750000, status: 'May hoàn thiện', priority: 'normal', desc: 'Vest đen 2 nút, túi hộp', notes: [] },
    { id: 'DH003', customerId: 'KH003', type: 'Đầm dự tiệc', fabric: 'VL002', purpose: 'Đi tiệc', date: '2026-02-08', fittingDate: '2026-02-18', deliveryDate: '2026-02-28', tailor: 'Thợ An', total: 2200000, deposit: 1100000, status: 'Thử đồ', priority: 'high', desc: 'Đầm xanh navy dài chấm gót', notes: [] },
    { id: 'DH004', customerId: 'KH004', type: 'Vest nam', fabric: 'VL003', purpose: 'Công sở', date: '2026-02-10', fittingDate: '2026-02-20', deliveryDate: '2026-03-05', tailor: 'Thợ Cường', total: 4200000, deposit: 2100000, status: 'Đang cắt vải', priority: 'urgent', desc: 'Vest xám 3 nút, cài ngực', notes: [] },
    { id: 'DH005', customerId: 'KH001', type: 'Áo sơ mi', fabric: 'VL007', purpose: 'Công sở', date: '2026-02-12', fittingDate: '2026-02-22', deliveryDate: '2026-03-01', tailor: 'Thợ An', total: 850000, deposit: 425000, status: 'Mới tiếp nhận', priority: 'normal', desc: 'Sơ mi đỏ cổ đứng', notes: [] },
    { id: 'DH006', customerId: 'KH003', type: 'Áo dài', fabric: 'VL001', purpose: 'Cưới hỏi', date: '2026-02-14', fittingDate: '2026-02-24', deliveryDate: '2026-03-10', tailor: 'Thợ Bình', total: 3100000, deposit: 1550000, status: 'Thiết kế rập', priority: 'normal', desc: 'Áo dài cô dâu, đuôi phụng', notes: [] },
    { id: 'DH007', customerId: 'KH002', type: 'Quần tây', fabric: 'VL003', purpose: 'Công sở', date: '2026-02-15', fittingDate: '2026-02-23', deliveryDate: '2026-02-28', tailor: 'Thợ Cường', total: 1200000, deposit: 600000, status: 'Kiểm tra QC', priority: 'normal', desc: 'Quần tây đen ống suôn', notes: [] },
  ],
  qcHistory: [],
  activities: [
    { text: 'Đơn hàng DH007 chuyển sang Kiểm tra QC', time: '30 phút trước', color: '#7c6af8' },
    { text: 'Khách hàng Phạm Thị Hoa đến thử đồ lần 1', time: '1 giờ trước', color: '#00c9c9' },
    { text: 'Nhập kho: 20m vải linen trắng từ NCC001', time: '2 giờ trước', color: '#3ddc84' },
    { text: 'Đơn hàng DH001 hoàn thành và bàn giao', time: '3 giờ trước', color: '#3f9cf8' },
    { text: 'Tạo đơn hàng mới DH006 cho Phạm Thị Hoa', time: 'Hôm qua', color: '#ff8c42' },
  ],
  nextIds: { supplier: 4, inventory: 8, customer: 5, order: 8, qc: 1 }
};

// ─── NAVIGATION ─────────────────────────────────────────────
let currentPage = 'dashboard';
let currentOrderId = null;
let currentCustomerId = null;

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  currentPage = page;
  const titles = {
    dashboard: 'Bảng điều khiển', inventory: 'Kho Nguyên Phụ Liệu',
    customers: 'Khách hàng & Số đo', orders: 'Đơn hàng Sản xuất',
    qc: 'Kiểm soát Chất lượng', delivery: 'Giao hàng & Thanh toán',
    reports: 'Báo cáo Doanh thu', suppliers: 'Nhà cung cấp',
    attendance: 'Chấm công Thợ may'
  };
  document.getElementById('topbarTitle').textContent = titles[page] || page;
  renderPage(page);
}

function renderPage(page) {
  if (page === 'dashboard') renderDashboard();
  if (page === 'inventory') renderInventory();
  if (page === 'customers') renderCustomers();
  if (page === 'orders') renderOrders();
  if (page === 'qc') renderQC();
  if (page === 'delivery') renderDelivery();
  if (page === 'reports') renderReports();
  if (page === 'suppliers') renderSuppliers();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ─── HELPERS ────────────────────────────────────────────────
function fmt(n) {
  return Number(n).toLocaleString('vi-VN') + ' ₫';
}

function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('vi-VN');
}

function daysLeft(dateStr) {
  const now = new Date('2026-02-24');
  const d = new Date(dateStr);
  return Math.ceil((d - now) / 86400000);
}

function esc(text) {
  if (text === null || text === undefined) return '';
  if (typeof text !== 'string') text = String(text);
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function genId(prefix, n) {
  return prefix + String(n).padStart(3, '0');
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  t.innerHTML = `<span>${icons[type]}</span> ${msg}`;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
  if (id === 'modal-add-order') populateOrderSelects();
  if (id === 'modal-add-inventory') populateSupplierSelect();
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function closeModalIfBg(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}

function statusBadge(status) {
  const map = {
    'Mới tiếp nhận': 'badge-new', 'Thiết kế rập': 'badge-cutting',
    'Đang cắt vải': 'badge-cutting', 'May thô': 'badge-sewing',
    'Thử đồ': 'badge-fitting', 'May hoàn thiện': 'badge-sewing',
    'Kiểm tra QC': 'badge-qc', 'Hoàn thành': 'badge-done',
    'Đủ hàng': 'badge-instock', 'Sắp hết': 'badge-lowstock', 'Hết hàng': 'badge-outstock',
    'Đã giao': 'badge-delivered', 'Chờ giao': 'badge-waiting',
    'Đạt': 'badge-pass', 'Không đạt': 'badge-fail',
    'high': 'badge-high', 'urgent': 'badge-urgent'
  };
  const cls = map[status] || 'badge-new';
  return `<span class="badge ${cls}">${status}</span>`;
}

function getCustomerName(id) {
  const c = DB.customers.find(c => c.id === id);
  return c ? c.name : '—';
}

function getInventoryName(id) {
  const v = DB.inventory.find(v => v.id === id);
  return v ? v.name : '—';
}

function stars(r) {
  return '⭐'.repeat(r) + '☆'.repeat(5 - r);
}

// ─── DASHBOARD ──────────────────────────────────────────────
function renderDashboard() {
  const completedOrders = DB.orders.filter(o => o.status === 'Hoàn thành');
  const revenue = completedOrders.reduce((s, o) => s + o.total, 0);
  const activeOrders = DB.orders.filter(o => o.status !== 'Hoàn thành').length;
  const lowStock = DB.inventory.filter(i => i.status !== 'Đủ hàng').length;

  document.getElementById('stat-revenue').textContent = fmt(revenue);
  document.getElementById('stat-orders').textContent = activeOrders;
  document.getElementById('stat-customers').textContent = DB.customers.length;
  document.getElementById('stat-lowstock').textContent = lowStock;

  // Badges
  const setB = (id, val) => {
    const el = document.getElementById(id);
    el.textContent = val;
    el.style.display = val > 0 ? '' : 'none';
  };
  setB('badge-inventory', lowStock);
  setB('badge-customers', DB.customers.length);
  setB('badge-orders', activeOrders);

  // Pipeline
  const pipeMap = {
    'pipe-new': ['Mới tiếp nhận'],
    'pipe-cutting': ['Thiết kế rập', 'Đang cắt vải'],
    'pipe-sewing': ['May thô', 'May hoàn thiện'],
    'pipe-fitting': ['Thử đồ'],
    'pipe-done': ['Kiểm tra QC', 'Hoàn thành']
  };
  for (const [pid, statuses] of Object.entries(pipeMap)) {
    document.getElementById(pid).textContent = DB.orders.filter(o => statuses.includes(o.status)).length;
  }

  // Upcoming deadlines
  const upcoming = DB.orders
    .filter(o => o.status !== 'Hoàn thành')
    .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate))
    .slice(0, 5);
  const upEl = document.getElementById('upcoming-orders-list');
  upEl.innerHTML = upcoming.map(o => {
    const d = daysLeft(o.deliveryDate);
    const cls = d < 0 ? 'overdue' : d <= 2 ? 'soon' : 'ok';
    const txt = d < 0 ? `Quá hạn ${-d} ngày` : d === 0 ? 'Hôm nay!' : `Còn ${d} ngày`;
    return `<div class="deadline-item">
      <div><div class="deadline-code">${esc(o.id)}</div><div class="deadline-cust">${esc(getCustomerName(o.customerId))} — ${esc(o.type)}</div></div>
      <div class="deadline-date ${cls}">${esc(txt)}</div>
    </div>`;
  }).join('') || '<p style="color:var(--text-muted);font-size:.85rem">Không có đơn hàng sắp đến hạn</p>';

  // Low stock
  const ls = DB.inventory.filter(i => i.status !== 'Đủ hàng').slice(0, 5);
  document.getElementById('low-stock-list').innerHTML = ls.map(i =>
    `<div class="stock-item"><span class="stock-name">${esc(i.name)}</span><span class="stock-qty">${esc(i.qty)} ${esc(i.unit)} ${statusBadge(i.status)}</span></div>`
  ).join('') || '<p style="color:var(--text-muted);font-size:.85rem">Kho vật liệu đầy đủ ✅</p>';

  // Activities
  document.getElementById('recent-activities').innerHTML = DB.activities.map(a =>
    `<div class="activity-item">
      <div class="activity-dot" style="background:${esc(a.color)}"></div>
      <div><div class="activity-text">${esc(a.text)}</div><div class="activity-time">${esc(a.time)}</div></div>
    </div>`
  ).join('');
}

// ─── INVENTORY ──────────────────────────────────────────────
let inventoryPageSize = 25;
let inventoryDisplayCount = 25;

function renderInventory(data) {
  const base = data || DB.inventory;
  const total = base.length;
  // Sắp xếp ID giảm dần
  const sorted = [...base].sort((a, b) => b.id.localeCompare(a.id));

  const isFiltered = !!data;
  const displayData = isFiltered ? sorted : sorted.slice(0, inventoryDisplayCount);

  let rows = displayData.map(i => `
    <tr>
      <td>${esc(i.id)}</td>
      <td><strong style="color:var(--text-primary)">${esc(i.name)}</strong></td>
      <td>${esc(i.type)}</td>
      <td>${esc(i.material || '—')}</td>
      <td><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ccc;margin-right:4px"></span>${esc(i.color || '—')}</td>
      <td><strong>${esc(i.qty)}</strong></td>
      <td>${esc(i.unit)}</td>
      <td>${i.price ? fmt(i.price) : '—'}</td>
      <td>${statusBadge(i.status)}</td>
      <td>${i.supplierId ? esc((DB.suppliers.find(s => s.id === i.supplierId) || { name: '—' }).name) : '—'}</td>
      <td><div class="actions">
        <button class="btn-action btn-edit" onclick="editInventory('${esc(i.id)}')" title="Cập nhật số lượng">✏️</button>
        <button class="btn-action btn-delete" onclick="deleteInventory('${esc(i.id)}')" title="Xóa">🗑️</button>
      </div></td>
    </tr>`).join('');

  if (!isFiltered && total > inventoryDisplayCount) {
    rows += `<tr><td colspan="11" style="text-align:center;padding:1.5rem;background:rgba(124,106,248,0.03)">
      <button class="btn btn-secondary btn-sm" onclick="loadMoreInventory()">
        📂 Xem thêm (${total - inventoryDisplayCount} vật liệu khác...)
      </button>
    </td></tr>`;
  }
  document.getElementById('inventory-body').innerHTML = rows || '<tr><td colspan="11" style="text-align:center;color:var(--text-muted);padding:2rem">Chưa có dữ liệu kho</td></tr>';
}

function loadMoreInventory() {
  inventoryDisplayCount += inventoryPageSize;
  renderInventory();
}


function filterInventory() {
  const q = document.getElementById('inv-search').value.toLowerCase();
  const t = document.getElementById('inv-filter-type').value;
  const s = document.getElementById('inv-filter-status').value;
  const data = DB.inventory.filter(i =>
    (i.name.toLowerCase().includes(q) || i.material.toLowerCase().includes(q)) &&
    (!t || i.type === t) && (!s || i.status === s)
  );
  renderInventory(data);
}

function populateSupplierSelect() {
  const sel = document.getElementById('inv-supplier-select');
  sel.innerHTML = '<option value="">-- Chọn NCC --</option>' +
    DB.suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}

function saveInventory() {
  const name = document.getElementById('inv-name').value.trim();
  if (!name) { showToast('Vui lòng nhập tên vật liệu!', 'error'); return; }
  const qty = parseFloat(document.getElementById('inv-qty').value) || 0;
  const threshold = parseFloat(document.getElementById('inv-threshold').value) || 10;
  let status = qty === 0 ? 'Hết hàng' : qty <= threshold ? 'Sắp hết' : 'Đủ hàng';
  const item = {
    id: genId('VL', DB.nextIds.inventory++),
    name, type: document.getElementById('inv-type').value,
    material: document.getElementById('inv-material').value,
    color: document.getElementById('inv-color').value,
    qty, unit: document.getElementById('inv-unit').value,
    threshold, price: parseFloat(document.getElementById('inv-price').value) || 0,
    supplierId: document.getElementById('inv-supplier-select').value,
    location: document.getElementById('inv-location').value,
    note: document.getElementById('inv-note').value, status
  };
  DB.inventory.push(item);
  DB.activities.unshift({ text: `Nhập kho: ${qty} ${item.unit} ${name}`, time: 'Vừa xong', color: '#3ddc84' });
  closeModal('modal-add-inventory');
  ['inv-name', 'inv-material', 'inv-color', 'inv-qty', 'inv-threshold', 'inv-price', 'inv-location', 'inv-note'].forEach(id => document.getElementById(id).value = '');
  renderInventory();
  showToast(`Đã nhập kho: ${name}`);
}

function editInventory(id) {
  const i = DB.inventory.find(x => x.id === id);
  if (!i) return;
  const newQty = prompt(`Cập nhật số lượng cho "${i.name}" (hiện tại: ${i.qty} ${i.unit}):`, i.qty);
  if (newQty === null) return;
  i.qty = parseFloat(newQty) || 0;
  i.status = i.qty === 0 ? 'Hết hàng' : i.qty <= i.threshold ? 'Sắp hết' : 'Đủ hàng';
  renderInventory();
  showToast(`Đã cập nhật tồn kho: ${i.name}`);
}

function deleteInventory(id) {
  if (!confirm('Bạn chắc chắn muốn xóa vật liệu này?')) return;
  const idx = DB.inventory.findIndex(x => x.id === id);
  if (idx > -1) { DB.inventory.splice(idx, 1); renderInventory(); showToast('Đã xóa vật liệu', 'info'); }
}

// ─── CUSTOMERS ──────────────────────────────────────────────
let customerPageSize = 12; // Grid cards so use multiples of 3 or 4
let customerDisplayCount = 12;

function renderCustomers(data) {
  const base = data || DB.customers;
  const total = base.length;
  // Sắp xếp khách mới ở trên
  const sorted = [...base].sort((a, b) => b.id.localeCompare(a.id));

  const isFiltered = !!data;
  const displayData = isFiltered ? sorted : sorted.slice(0, customerDisplayCount);

  const m = c => c.measurements;
  let cardsHTML = displayData.map(c => `
    <div class="customer-card" onclick="viewCustomer('${esc(c.id)}')">
      <div class="cust-card-header">
        <div class="cust-avatar">${esc(c.name.split(' ').pop()[0])}</div>
        <div>
          <div class="cust-name">${esc(c.name)}</div>
          <div class="cust-phone">📞 ${esc(c.phone)}</div>
        </div>
      </div>
      <div class="cust-measurements">
        <div class="meas-item"><div class="meas-value">${esc(m(c).chest || '—')}</div><div class="meas-label">Ngực</div></div>
        <div class="meas-item"><div class="meas-value">${esc(m(c).waist || '—')}</div><div class="meas-label">Eo</div></div>
        <div class="meas-item"><div class="meas-value">${esc(m(c).hip || '—')}</div><div class="meas-label">Hông</div></div>
        <div class="meas-item"><div class="meas-value">${esc(m(c).height || '—')}</div><div class="meas-label">Cao</div></div>
      </div>
      <div class="cust-stats">
        <div><div class="cust-stat-label">Đơn hàng</div><div class="cust-stat-value">${esc(c.totalOrders)}</div></div>
        <div><div class="cust-stat-label">Tổng chi</div><div class="cust-stat-value">${(c.totalSpent / 1000000).toFixed(1)}M ₫</div></div>
        <div><div class="cust-stat-label">Chiều cao</div><div class="cust-stat-value">${esc(m(c).height)} cm</div></div>
      </div>
      <div class="cust-card-actions" onclick="event.stopPropagation()">
        <button class="btn btn-sm btn-primary" onclick="openOrderFromCust('${esc(c.id)}')">+ Đơn hàng</button>
        <button class="btn btn-sm btn-secondary" onclick="editCustomer('${esc(c.id)}')">✏️ Sửa</button>
      </div>
      </div>
    </div>`).join('');

  if (!isFiltered && total > customerDisplayCount) {
    cardsHTML += `
      <div class="load-more-container" style="grid-column:1/-1; text-align:center; padding:2rem">
         <button class="btn btn-secondary" onclick="loadMoreCustomers()">
           📂 Xem thêm (${total - customerDisplayCount} khách hàng khác...)
         </button>
      </div>`;
  }

  document.getElementById('customer-cards').innerHTML = cardsHTML || '<p style="color:var(--text-muted)">Chưa có khách hàng</p>';
}

function loadMoreCustomers() {
  customerDisplayCount += customerPageSize;
  renderCustomers();
}


function filterCustomers() {
  const q = document.getElementById('cust-search').value.toLowerCase();
  renderCustomers(DB.customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q)));
}

function saveCustomer() {
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  if (!name || !phone) { showToast('Vui lòng nhập tên và SĐT!', 'error'); return; }
  const cust = {
    id: genId('KH', DB.nextIds.customer++),
    name, phone,
    email: document.getElementById('cust-email').value,
    dob: document.getElementById('cust-dob').value,
    address: document.getElementById('cust-address').value,
    measurements: {
      chest: parseFloat(document.getElementById('m-chest').value) || 0,
      waist: parseFloat(document.getElementById('m-waist').value) || 0,
      hip: parseFloat(document.getElementById('m-hip').value) || 0,
      shoulder: parseFloat(document.getElementById('m-shoulder').value) || 0,
      sleeve: parseFloat(document.getElementById('m-sleeve').value) || 0,
      back: parseFloat(document.getElementById('m-back').value) || 0,
      length: parseFloat(document.getElementById('m-length').value) || 0,
      height: parseFloat(document.getElementById('m-height').value) || 0,
    },
    bodyFeatures: document.getElementById('cust-bodyfeatures').value,
    preferences: document.getElementById('cust-preferences').value,
    totalOrders: 0, totalSpent: 0
  };
  DB.customers.push(cust);
  DB.activities.unshift({ text: `Thêm khách hàng mới: ${name}`, time: 'Vừa xong', color: '#00c9c9' });
  closeModal('modal-add-customer');
  ['cust-name', 'cust-phone', 'cust-email', 'cust-dob', 'cust-address', 'cust-bodyfeatures', 'cust-preferences', 'm-chest', 'm-waist', 'm-hip', 'm-shoulder', 'm-sleeve', 'm-back', 'm-length', 'm-height'].forEach(id => document.getElementById(id).value = '');
  renderCustomers();
  showToast(`Đã thêm khách hàng: ${name}`);
}

function editCustomer(id) {
  const c = DB.customers.find(x => x.id === id);
  if (!c) return;
  currentCustomerId = id;
  document.getElementById('cust-name').value = c.name;
  document.getElementById('cust-phone').value = c.phone;
  document.getElementById('cust-email').value = c.email || '';
  document.getElementById('cust-dob').value = c.dob || '';
  document.getElementById('cust-address').value = c.address || '';
  document.getElementById('cust-bodyfeatures').value = c.bodyFeatures || '';
  document.getElementById('cust-preferences').value = c.preferences || '';
  const m = c.measurements || {};
  ['chest', 'waist', 'hip', 'shoulder', 'sleeve', 'back', 'length', 'height'].forEach(k => {
    document.getElementById('m-' + k).value = m[k] || '';
  });
  openModal('modal-add-customer');
}

function viewCustomer(id) {
  const c = DB.customers.find(x => x.id === id);
  if (!c) return;
  currentCustomerId = id;
  const m = c.measurements || {};
  const custOrders = DB.orders.filter(o => o.customerId === id);
  const body = document.getElementById('customer-profile-body');
  body.innerHTML = `
    <div class="profile-section">
      <div class="profile-section-title">Thông tin cá nhân</div>
      <div class="profile-info-grid">
        <div class="profile-info-item"><div class="label">Họ tên</div><div class="value">${esc(c.name)}</div></div>
        <div class="profile-info-item"><div class="label">Điện thoại</div><div class="value">${esc(c.phone)}</div></div>
        <div class="profile-info-item"><div class="label">Email</div><div class="value">${esc(c.email || '—')}</div></div>
        <div class="profile-info-item"><div class="label">Ngày sinh</div><div class="value">${fmtDate(c.dob) || '—'}</div></div>
        <div class="profile-info-item"><div class="label">Địa chỉ</div><div class="value">${esc(c.address || '—')}</div></div>
        <div class="profile-info-item"><div class="label">Tổng đơn hàng</div><div class="value" style="color:var(--teal)">${esc(c.totalOrders)}</div></div>
      </div>
    </div>
    <div class="profile-section">
      <div class="profile-section-title">Số đo cơ thể (cm)</div>
      <div class="measurements-display">
        ${[['chest', 'Ngực'], ['waist', 'Eo'], ['hip', 'Hông'], ['shoulder', 'Vai'], ['sleeve', 'Dài tay'], ['back', 'Dài lưng'], ['length', 'Dài váy'], ['height', 'Chiều cao']].map(([k, l]) => `
          <div class="meas-display-item">
            <div class="meas-display-val">${esc(m[k] || '—')}</div>
            <div class="meas-display-lbl">${esc(l)}</div>
            <div class="meas-display-unit">cm</div>
          </div>`).join('')}
      </div>
      ${c.bodyFeatures ? `<div style="margin-top:.75rem;padding:.75rem;background:rgba(255,140,66,.08);border-radius:8px;border:1px solid rgba(255,140,66,.2);font-size:.82rem"><strong>⚠️ Đặc điểm hình thể:</strong> ${esc(c.bodyFeatures)}</div>` : ''}
      ${c.preferences ? `<div style="margin-top:.5rem;padding:.75rem;background:rgba(124,106,248,.08);border-radius:8px;border:1px solid rgba(124,106,248,.2);font-size:.82rem"><strong>💜 Sở thích:</strong> ${esc(c.preferences)}</div>` : ''}
    </div>
    <div class="profile-section">
      <div class="profile-section-title">Lịch sử đơn hàng (${esc(custOrders.length)})</div>
      <div class="order-history-mini">
        ${custOrders.length ? custOrders.map(o => `
          <div class="order-history-item">
            <span style="font-weight:700;color:var(--purple-l)">${esc(o.id)}</span>
            <span>${esc(o.type)}</span>
            <span>${fmtDate(o.date)}</span>
            <span>${fmt(o.total)}</span>
            ${statusBadge(o.status)}
          </div>`).join('') : '<p style="color:var(--text-muted);font-size:.85rem">Chưa có đơn hàng nào</p>'}
      </div>
    </div>`;
  openModal('modal-view-customer');
}

function createOrderFromCustomer() {
  closeModal('modal-view-customer');
  openOrderFromCust(currentCustomerId);
}

function openOrderFromCust(custId) {
  populateOrderSelects();
  document.getElementById('order-customer').value = custId;
  openModal('modal-add-order');
}

// ─── ORDERS ─────────────────────────────────────────────────
let _currentOrderImageUrl = '';
let orderPageSize = 25;
let orderDisplayCount = 25;

async function previewOrderImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('order-image-preview');
    if (preview) preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover" />`;
  };
  reader.readAsDataURL(file);

  const status = document.getElementById('order-image-status');
  if (status) {
    status.textContent = '⏳ Đang tải...';
    status.style.color = 'var(--orange)';
  }

  const url = await gsUploadImage(file);
  if (url) {
    _currentOrderImageUrl = url;
    if (status) {
      status.textContent = '✅ Đã tải lên!';
      status.style.color = 'var(--green)';
    }
  } else {
    if (status) {
      status.textContent = '❌ Lỗi tải lên';
      status.style.color = 'var(--red)';
    }
  }
}

function populateOrderSelects() {
  const cs = document.getElementById('order-customer');
  cs.innerHTML = '<option value="">-- Chọn khách hàng --</option>' +
    DB.customers.map(c => `<option value="${c.id}">${c.name} — ${c.phone}</option>`).join('');
  const fs = document.getElementById('order-fabric');
  fs.innerHTML = '<option value="">-- Chọn vải từ kho --</option>' +
    DB.inventory.filter(i => i.type === 'Vải' && i.qty > 0).map(i =>
      `<option value="${i.id}">${i.name} (${i.qty}${i.unit})</option>`).join('');
  const today = new Date('2026-02-24').toISOString().split('T')[0];
  document.getElementById('order-date').value = today;

  // Reset image
  _currentOrderImageUrl = '';
  const preview = document.getElementById('order-image-preview');
  if (preview) preview.innerHTML = '<span style="font-size:1.5rem">📸</span>';
  const status = document.getElementById('order-image-status');
  if (status) {
    status.textContent = 'Chưa có ảnh';
    status.style.color = '';
  }
  const input = document.getElementById('order-image-input');
  if (input) input.value = '';
}

function renderOrders(data) {
  const base = data || DB.orders;
  const total = base.length;
  // Sắp xếp đơn mới nhất lên đầu (nếu chưa sắp xếp)
  const sorted = [...base].sort((a, b) => b.id.localeCompare(a.id));

  // Pagination logic
  const isFiltered = !!data;
  const displayData = isFiltered ? sorted : sorted.slice(0, orderDisplayCount);

  let rows = displayData.map(o => {
    const d = daysLeft(o.deliveryDate);
    const deadlineCls = d < 0 ? 'color:var(--red)' : d <= 2 ? 'color:var(--orange)' : '';
    const priorityTag = o.priority !== 'normal' ? statusBadge(o.priority) : '';
    return `<tr>
      <td><a href="#" onclick="updateOrder('${esc(o.id)}'); return false;" style="font-weight:bold;color:var(--purple-l);text-decoration:none;" title="Xem & Cập nhật chi tiết">${esc(o.id)}</a> ${priorityTag}</td>
      <td>
        ${o.imageUrl ? `<img src="${esc(o.imageUrl)}" style="width:30px;height:30px;border-radius:4px;object-fit:cover;margin-right:8px;vertical-align:middle;border:1px solid var(--purple-l)" onerror="this.style.display='none'">` : ''}
        ${esc(getCustomerName(o.customerId))}
      </td>
      <td>${esc(o.type)}</td>
      <td style="font-size:.78rem">${esc(getInventoryName(o.fabric))}</td>
      <td>${fmtDate(o.date)}</td>
      <td>${fmtDate(o.fittingDate)}</td>
      <td style="${deadlineCls}">${fmtDate(o.deliveryDate)}</td>
      <td>${fmt(o.deposit)}</td>
      <td>${fmt(o.total)}</td>
      <td>${statusBadge(o.status)}</td>
      <td><div class="actions">
        <button class="btn-action btn-print" onclick="PRINTER.printInvoice('${esc(o.id)}')" title="In phiếu A5">📄</button>
        <button class="btn-action btn-print" onclick="PRINTER.printK80('${esc(o.id)}')" title="In bill K80">🧾</button>
        <button class="btn-action btn-view" onclick="nextOrderStatus('${esc(o.id)}')" title="Chuyển trạng thái tiếp theo">🔄</button>
        ${o.status === 'May hoàn thiện' || o.status === 'Kiểm tra QC' ? `<button class="btn-action btn-qc" onclick="openQC('${esc(o.id)}')">✅QC</button>` : ''}
        <button class="btn-action btn-delete" onclick="deleteOrder('${esc(o.id)}')">🗑️</button>
      </div></td>
    </tr>`;
  }).join('');

  // Nút Load More
  if (!isFiltered && total > orderDisplayCount) {
    rows += `<tr><td colspan="11" style="text-align:center;padding:1.5rem;background:rgba(124,106,248,0.03)">
      <button class="btn btn-secondary btn-sm" onclick="loadMoreOrders()">
        📂 Xem thêm (${total - orderDisplayCount} đơn hàng cũ hơn...)
      </button>
    </td></tr>`;
  }

  document.getElementById('orders-body').innerHTML = rows || '<tr><td colspan="11" style="text-align:center;color:var(--text-muted);padding:2rem">Chưa có đơn hàng</td></tr>';
}

function loadMoreOrders() {
  orderDisplayCount += orderPageSize;
  renderOrders();
}


function filterOrders() {
  const q = document.getElementById('order-search').value.toLowerCase();
  const s = document.getElementById('order-filter-status').value;
  renderOrders(DB.orders.filter(o =>
    (o.id.toLowerCase().includes(q) || getCustomerName(o.customerId).toLowerCase().includes(q)) &&
    (!s || o.status === s)
  ));
}

function saveOrder() {
  const custId = document.getElementById('order-customer').value;
  const delivDate = document.getElementById('order-delivery-date').value;
  const total = parseFloat(document.getElementById('order-total').value) || 0;
  if (!custId) { showToast('Vui lòng chọn khách hàng!', 'error'); return; }
  if (!delivDate) { showToast('Vui lòng nhập ngày giao hàng!', 'error'); return; }
  if (!total) { showToast('Vui lòng nhập tổng tiền!', 'error'); return; }
  const order = {
    id: genId('DH', DB.nextIds.order++),
    customerId: custId,
    type: document.getElementById('order-type').value,
    fabric: document.getElementById('order-fabric').value,
    purpose: document.getElementById('order-purpose').value,
    date: document.getElementById('order-date').value,
    fittingDate: document.getElementById('order-fitting-date').value,
    deliveryDate: delivDate,
    tailor: document.getElementById('order-tailor').value,
    total, deposit: parseFloat(document.getElementById('order-deposit').value) || 0,
    status: document.getElementById('order-status').value,
    priority: document.getElementById('order-priority').value,
    desc: document.getElementById('order-desc').value,
    imageUrl: _currentOrderImageUrl,
    notes: []
  };
  DB.orders.push(order);
  const cust = DB.customers.find(c => c.id === custId);
  if (cust) cust.totalOrders++;
  DB.activities.unshift({ text: `Tạo đơn hàng ${order.id} cho ${getCustomerName(custId)}`, time: 'Vừa xong', color: '#6c63ff' });
  closeModal('modal-add-order');
  renderOrders();
  showToast(`Đã tạo đơn hàng ${order.id}`);
}

function updateOrder(id) {
  currentOrderId = id;
  const o = DB.orders.find(x => x.id === id);
  if (!o) return;
  document.getElementById('update-order-info').innerHTML = `
    <div class="oip-row"><div class="oip-label">Mã ĐH</div><div class="oip-value">${o.id}</div></div>
    <div class="oip-row"><div class="oip-label">Khách hàng</div><div class="oip-value">${getCustomerName(o.customerId)}</div></div>
    <div class="oip-row"><div class="oip-label">Loại SP</div><div class="oip-value">${o.type}</div></div>
    <div class="oip-row"><div class="oip-label">Ngày giao</div><div class="oip-value">${fmtDate(o.deliveryDate)}</div></div>`;
  document.getElementById('update-order-status').value = o.status;
  openModal('modal-update-order');
}

function updateOrderStatus() {
  const o = DB.orders.find(x => x.id === currentOrderId);
  if (!o) return;
  const newStatus = document.getElementById('update-order-status').value;
  const note = document.getElementById('update-order-note').value;
  o.status = newStatus;
  if (note) o.notes.push({ text: note, time: 'Vừa xong' });
  if (newStatus === 'Hoàn thành') {
    const cust = DB.customers.find(c => c.id === o.customerId);
    if (cust) cust.totalSpent += o.total;
  }
  DB.activities.unshift({ text: `Đơn ${currentOrderId} chuyển sang "${newStatus}"`, time: 'Vừa xong', color: '#7c6af8' });
  closeModal('modal-update-order');
  document.getElementById('update-order-note').value = '';
  renderOrders();
  showToast(`Đã cập nhật trạng thái: ${newStatus}`);
}

function deleteOrder(id) {
  if (!confirm('Xóa đơn hàng này?')) return;
  const idx = DB.orders.findIndex(x => x.id === id);
  if (idx > -1) { DB.orders.splice(idx, 1); renderOrders(); showToast('Đã xóa đơn hàng', 'info'); }
}

function nextOrderStatus(id) {
  const o = DB.orders.find(x => x.id === id);
  if (!o) return;

  const flow = [
    'Mới tiếp nhận',
    'Thiết kế rập',
    'Đang cắt vải',
    'May thô',
    'Thử đồ',
    'May hoàn thiện',
    'Kiểm tra QC',
    'Hoàn thành'
  ];

  const currentIndex = flow.indexOf(o.status);

  if (currentIndex === -1) {
    showToast('Trạng thái hiện tại không hợp lệ để chuyển tiếp!', 'error');
    return;
  }

  if (currentIndex === flow.length - 1) {
    showToast('Đơn hàng đã ở trạng thái hoàn thành cuối cùng!', 'info');
    return;
  }

  const nextStatus = flow[currentIndex + 1];
  o.status = nextStatus;

  if (nextStatus === 'Hoàn thành') {
    const cust = DB.customers.find(c => c.id === o.customerId);
    if (cust) cust.totalSpent += o.total;
  }

  DB.activities.unshift({ text: `Đơn ${id} chuyển sang "${nextStatus}"`, time: 'Vừa xong', color: '#7c6af8' });
  renderOrders();
  showToast(`Đã nâng trạng thái: ${nextStatus}`, 'success');
}

// ─── QC ─────────────────────────────────────────────────────
function renderQC() {
  const pending = DB.orders.filter(o => o.status === 'Kiểm tra QC' || o.status === 'May hoàn thiện');
  const pendingEl = document.getElementById('qc-pending-list');
  pendingEl.innerHTML = pending.map(o => `
    <div class="qc-pending-item">
      <div>
        <div style="font-weight:700;color:var(--purple-l)">${esc(o.id)}</div>
        <div style="font-size:.8rem;color:var(--text-secondary)">${esc(getCustomerName(o.customerId))} — ${esc(o.type)}</div>
      </div>
      <div style="display:flex;gap:.5rem;align-items:center">
        ${statusBadge(o.status)}
        <button class="btn-action btn-qc" onclick="openQC('${esc(o.id)}')">✅ Kiểm tra</button>
      </div>
    </div> `).join('') || '<p style="color:var(--text-muted);font-size:.85rem">Không có đơn nào chờ QC</p>';

  // QC History
  document.getElementById('qc-history-body').innerHTML = DB.qcHistory.map(q => `
    <tr>
      <td>${esc(q.orderId)}</td>
      <td>${esc(getCustomerName(DB.orders.find(o => o.id === q.orderId)?.customerId))}</td>
      <td>${fmtDate(q.date)}</td>
      <td>${statusBadge(q.seam)}</td>
      <td>${statusBadge(q.size)}</td>
      <td>${statusBadge(q.clean)}</td>
      <td>${statusBadge(q.iron)}</td>
      <td>${statusBadge(q.result)}</td>
      <td style="font-size:.78rem">${esc(q.note || '—')}</td>
    </tr> `).join('') || '<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:1.5rem">Chưa có lịch sử QC</td></tr>';
}

function openQC(id) {
  currentOrderId = id;
  const o = DB.orders.find(x => x.id === id);
  if (!o) return;
  document.getElementById('qc-order-info').innerHTML = `
    <div class="oip-row"><div class="oip-label">Mã ĐH</div><div class="oip-value">${esc(o.id)}</div></div>
    <div class="oip-row"><div class="oip-label">Khách hàng</div><div class="oip-value">${esc(getCustomerName(o.customerId))}</div></div>
    <div class="oip-row"><div class="oip-label">Loại SP</div><div class="oip-value">${esc(o.type)}</div></div>
    <div class="oip-row"><div class="oip-label">Vải</div><div class="oip-value">${esc(getInventoryName(o.fabric))}</div></div>`;
  ['qc-seam', 'qc-size', 'qc-clean', 'qc-iron'].forEach(name => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(r => r.checked = false);
  });
  document.getElementById('qc-note').value = '';
  openModal('modal-qc');
}

function submitQC(overallResult) {
  const getVal = name => {
    const r = document.querySelector(`input[name="${name}"]:checked`);
    return r ? r.value : '—';
  };
  const seam = getVal('qc-seam');
  const size = getVal('qc-size');
  const clean = getVal('qc-clean');
  const iron = getVal('qc-iron');
  const note = document.getElementById('qc-note').value;

  const qcRecord = {
    id: genId('QC', DB.nextIds.qc++),
    orderId: currentOrderId,
    date: '2026-02-24',
    seam, size, clean, iron,
    result: overallResult, note
  };
  DB.qcHistory.push(qcRecord);

  const o = DB.orders.find(x => x.id === currentOrderId);
  if (o) {
    o.status = overallResult === 'Đạt' ? 'Hoàn thành' : 'May hoàn thiện';
    DB.activities.unshift({ text: `QC đơn ${currentOrderId}: ${overallResult}${overallResult === 'Không đạt' ? ' → Trả về sản xuất' : ''} `, time: 'Vừa xong', color: overallResult === 'Đạt' ? '#3ddc84' : '#ff5f6d' });
  }
  closeModal('modal-qc');
  renderQC();
  showToast(`Kiểm tra QC: ${overallResult} `, overallResult === 'Đạt' ? 'success' : 'error');
}

// ─── DELIVERY ───────────────────────────────────────────────
function renderDelivery(data) {
  const delivOrders = (data || DB.orders).filter(o =>
    o.status === 'Hoàn thành' || o.status === 'Kiểm tra QC' || o.status === 'May hoàn thiện'
  );
  const cust = id => DB.customers.find(c => c.id === id) || {};
  document.getElementById('delivery-body').innerHTML = delivOrders.map(o => {
    const c = cust(o.customerId);
    const remaining = o.total - o.deposit;
    const isDelivered = o.status === 'Hoàn thành';
    const d = daysLeft(o.deliveryDate);
    return `<tr>
      <td>${esc(o.id)}</td>
      <td>${esc(c.name || '—')}</td>
      <td>${esc(c.phone || '—')}</td>
      <td>${esc(o.type)}</td>
      <td>${fmt(o.total)}</td>
      <td style="color:var(--green)">${fmt(o.deposit)}</td>
      <td style="color:var(--orange);font-weight:700">${fmt(remaining)}</td>
      <td style="${d < 0 ? 'color:var(--red)' : d <= 2 ? 'color:var(--orange)' : ''}">${fmtDate(o.deliveryDate)}</td>
      <td>${statusBadge(isDelivered ? 'Đã giao' : 'Chờ giao')}</td>
      <td>
        ${isDelivered ? '<span style="color:var(--green);font-size:.8rem">✅ Đã hậu mãi</span>' :
        '<span style="color:var(--text-muted);font-size:.8rem">Chưa giao</span>'}
      </td>
      <td><div class="actions">
        ${!isDelivered ? `<button class="btn-action btn-ship" onclick="markDelivered('${esc(o.id)}')">🚚 Giao hàng</button>` : ''}
        <button class="btn-action btn-view" onclick="viewCustomer('${esc(o.customerId)}')">👤</button>
      </div></td>
    </tr> `;
  }).join('') || '<tr><td colspan="11" style="text-align:center;color:var(--text-muted);padding:2rem">Không có đơn hàng nào</td></tr>';
}

function filterDelivery() {
  const q = document.getElementById('del-search').value.toLowerCase();
  const f = document.getElementById('del-filter').value;
  const all = DB.orders.filter(o => o.status === 'Hoàn thành' || o.status === 'Kiểm tra QC' || o.status === 'May hoàn thiện');
  renderDelivery(all.filter(o => {
    const matchQ = o.id.toLowerCase().includes(q) || getCustomerName(o.customerId).toLowerCase().includes(q);
    const matchF = !f || (f === 'Đã giao' ? o.status === 'Hoàn thành' : o.status !== 'Hoàn thành');
    return matchQ && matchF;
  }));
}

function markDelivered(id) {
  const o = DB.orders.find(x => x.id === id);
  if (!o) return;
  if (!confirm(`Xác nhận giao hàng đơn ${id}?`)) return;
  o.status = 'Hoàn thành';
  const cust = DB.customers.find(c => c.id === o.customerId);
  if (cust) cust.totalSpent += (o.total - o.deposit);
  DB.activities.unshift({ text: `Đã giao hàng đơn ${id} cho ${getCustomerName(o.customerId)} `, time: 'Vừa xong', color: '#3ddc84' });
  renderDelivery();
  showToast(`Đã giao hàng đơn ${id} thành công! 🎉`);
}

// ─── REPORTS ────────────────────────────────────────────────
function renderReports() {
  const completed = DB.orders.filter(o => o.status === 'Hoàn thành');
  const revenue = completed.reduce((s, o) => s + o.total, 0);
  const avg = completed.length ? Math.round(revenue / completed.length) : 0;
  const returning = DB.customers.filter(c => c.totalOrders > 1).length;
  const returnRate = DB.customers.length ? Math.round(returning / DB.customers.length * 100) : 0;

  document.getElementById('rpt-revenue').textContent = fmt(revenue);
  document.getElementById('rpt-orders').textContent = completed.length;
  document.getElementById('rpt-avg').textContent = fmt(avg);
  document.getElementById('rpt-return').textContent = returnRate + '%';

  // Top products
  const typeCounts = {};
  DB.orders.forEach(o => { typeCounts[o.type] = (typeCounts[o.type] || 0) + 1; });
  const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;
  document.getElementById('top-products').innerHTML = sorted.slice(0, 6).map(([type, cnt], i) => `
  <div class="top-product-item">
      <div class="top-product-rank ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}">${i + 1}</div>
      <div style="flex:1">
        <div class="top-product-name">${esc(type)}</div>
        <div class="top-product-bar" style="width:${(cnt / max * 100)}%"></div>
      </div>
      <div class="top-product-count">${esc(cnt)} đơn</div>
    </div> `).join('');

  // Distribution
  const statusCounts = {};
  DB.orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  const colors = ['#7c6af8', '#3f9cf8', '#00c9c9', '#ff9800', '#f05fa6', '#3ddc84', '#ff5f6d'];
  const total = DB.orders.length || 1;
  document.getElementById('order-distribution').innerHTML = Object.entries(statusCounts).map(([s, c], i) => `
  <div class="dist-item">
      <span>${esc(s)}</span>
      <div class="dist-bar-wrap"><div class="dist-bar" style="width:${c / total * 100}%;background:${esc(colors[i % colors.length])}"></div></div>
      <span style="font-weight:700;min-width:24px;text-align:right">${esc(c)}</span>
    </div> `).join('');
}

// ─── SUPPLIERS ──────────────────────────────────────────────
function renderSuppliers(data) {
  document.getElementById('suppliers-body').innerHTML = (data || DB.suppliers).map(s => `
  <tr>
      <td>${esc(s.id)}</td>
      <td><strong style="color:var(--text-primary)">${esc(s.name)}</strong></td>
      <td style="font-size:.8rem">${esc(s.goods)}</td>
      <td>${esc(s.phone)}</td>
      <td style="font-size:.78rem">${esc(s.email)}</td>
      <td style="font-size:.78rem">${esc(s.address)}</td>
      <td><span class="stars">${stars(s.rating)}</span></td>
      <td>${esc(s.orders)} đơn</td>
      <td><div class="actions">
        <button class="btn-action btn-edit" onclick="editSupplier('${esc(s.id)}')">✏️</button>
        <button class="btn-action btn-delete" onclick="deleteSupplier('${esc(s.id)}')">🗑️</button>
      </div></td>
    </tr> `).join('') || '<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:2rem">Chưa có nhà cung cấp</td></tr>';
}

function filterSuppliers() {
  const q = document.getElementById('sup-search').value.toLowerCase();
  renderSuppliers(DB.suppliers.filter(s => s.name.toLowerCase().includes(q) || s.goods.toLowerCase().includes(q)));
}

function saveSupplier() {
  const name = document.getElementById('sup-name').value.trim();
  if (!name) { showToast('Vui lòng nhập tên nhà cung cấp!', 'error'); return; }
  const sup = {
    id: genId('NCC', DB.nextIds.supplier++),
    name, goods: document.getElementById('sup-goods').value,
    phone: document.getElementById('sup-phone').value,
    email: document.getElementById('sup-email').value,
    address: document.getElementById('sup-address').value,
    rating: parseInt(document.getElementById('sup-rating').value) || 5,
    note: document.getElementById('sup-note').value,
    orders: 0
  };
  DB.suppliers.push(sup);
  closeModal('modal-add-supplier');
  ['sup-name', 'sup-goods', 'sup-phone', 'sup-email', 'sup-address', 'sup-note'].forEach(id => document.getElementById(id).value = '');
  renderSuppliers();
  showToast(`Đã thêm nhà cung cấp: ${name} `);
}

function editSupplier(id) {
  const s = DB.suppliers.find(x => x.id === id);
  if (!s) return;
  document.getElementById('sup-name').value = s.name;
  document.getElementById('sup-goods').value = s.goods;
  document.getElementById('sup-phone').value = s.phone;
  document.getElementById('sup-email').value = s.email;
  document.getElementById('sup-address').value = s.address;
  document.getElementById('sup-rating').value = s.rating;
  document.getElementById('sup-note').value = s.note;
  openModal('modal-add-supplier');
}

function deleteSupplier(id) {
  if (!confirm('Xóa nhà cung cấp này?')) return;
  const idx = DB.suppliers.findIndex(x => x.id === id);
  if (idx > -1) { DB.suppliers.splice(idx, 1); renderSuppliers(); showToast('Đã xóa nhà cung cấp', 'info'); }
}

function showNotifications() {
  showToast('Có 2 đơn hàng sắp đến hạn giao!', 'warning');
}

// ─── DATE DISPLAY ───────────────────────────────────────────
function updateDate() {
  const now = new Date('2026-02-24T19:06:47+07:00');
  document.getElementById('topbarDate').textContent = now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateDate();
  renderDashboard();
});
