/* ============================================================
   ATTENDANCE MODULE – attendance.js
   Chấm công thợ may: QR / Khuôn mặt / WiFi / Thủ công
   ============================================================ */

// ─── DATA ────────────────────────────────────────────────────
const ATT = {
    staff: [
        { id: 'NV001', name: 'Nguyễn Văn An', skill: 'Thợ may chính', phone: '0901111222', hourlyRate: 30000, shift: '07:30-17:00', status: 'active', qrCode: 'QR-NV001', mac: 'AA:BB:CC:11:22:33', startDate: '2023-01-10', note: 'Thợ lành nghề 5 năm kinh nghiệm' },
        { id: 'NV002', name: 'Trần Thị Bình', skill: 'Thợ cắt', phone: '0902222333', hourlyRate: 28000, shift: '07:30-17:00', status: 'active', qrCode: 'QR-NV002', mac: 'BB:CC:DD:22:33:44', startDate: '2023-06-01', note: '' },
        { id: 'NV003', name: 'Lê Văn Cường', skill: 'Thợ may chính', phone: '0903333444', hourlyRate: 32000, shift: '08:00-17:30', status: 'active', qrCode: 'QR-NV003', mac: 'CC:DD:EE:33:44:55', startDate: '2022-03-15', note: 'Chuyên vest cao cấp' },
        { id: 'NV004', name: 'Phạm Thị Dung', skill: 'Thợ hoàn thiện', phone: '0904444555', hourlyRate: 22000, shift: '08:00-17:30', status: 'active', qrCode: 'QR-NV004', mac: 'DD:EE:FF:44:55:66', startDate: '2024-02-01', note: '' },
        { id: 'NV005', name: 'Hoàng Văn Em', skill: 'Thợ học việc', phone: '0905555666', hourlyRate: 15000, shift: '07:30-17:00', status: 'inactive', qrCode: 'QR-NV005', mac: 'EE:FF:00:55:66:77', startDate: '2024-09-01', note: 'Đã nghỉ việc tháng 1/2026' },
    ],
    logs: [
        { id: 1, staffId: 'NV001', date: '2026-02-24', checkIn: '07:28', checkOut: '17:05', totalHours: 9.62, method: 'QR', status: 'Đúng giờ', note: '' },
        { id: 2, staffId: 'NV002', date: '2026-02-24', checkIn: '07:35', checkOut: '17:10', totalHours: 9.58, method: 'Khuôn mặt', status: 'Đúng giờ', note: '' },
        { id: 3, staffId: 'NV003', date: '2026-02-24', checkIn: '08:45', checkOut: '', totalHours: 0, method: 'WiFi', status: 'Đi muộn', note: 'Muộn 45 phút' },
        { id: 4, staffId: 'NV004', date: '2026-02-24', checkIn: '07:55', checkOut: '', totalHours: 0, method: 'Thủ công', status: 'Đúng giờ', note: 'Admin ghi tay' },
        { id: 5, staffId: 'NV001', date: '2026-02-23', checkIn: '07:30', checkOut: '17:00', totalHours: 9.50, method: 'QR', status: 'Đúng giờ', note: '' },
        { id: 6, staffId: 'NV002', date: '2026-02-23', checkIn: '07:29', checkOut: '17:02', totalHours: 9.55, method: 'Khuôn mặt', status: 'Đúng giờ', note: '' },
        { id: 7, staffId: 'NV003', date: '2026-02-23', checkIn: '', checkOut: '', totalHours: 0, method: '', status: 'Vắng phép', note: 'Xin phép bệnh' },
        { id: 8, staffId: 'NV004', date: '2026-02-23', checkIn: '08:10', checkOut: '17:30', totalHours: 9.33, method: 'WiFi', status: 'Đúng giờ', note: '' },
        { id: 9, staffId: 'NV001', date: '2026-02-22', checkIn: '07:32', checkOut: '17:00', totalHours: 9.47, method: 'QR', status: 'Đúng giờ', note: '' },
        { id: 10, staffId: 'NV002', date: '2026-02-22', checkIn: '09:10', checkOut: '17:30', totalHours: 8.33, method: 'Khuôn mặt', status: 'Đi muộn', note: 'Muộn 100 phút' },
        { id: 11, staffId: 'NV003', date: '2026-02-21', checkIn: '08:02', checkOut: '17:35', totalHours: 9.55, method: 'WiFi', status: 'Đúng giờ', note: '' },
        { id: 12, staffId: 'NV004', date: '2026-02-21', checkIn: '07:58', checkOut: '17:05', totalHours: 9.12, method: 'Thủ công', status: 'Đúng giờ', note: '' },
        { id: 13, staffId: 'NV001', date: '2026-02-20', checkIn: '07:31', checkOut: '19:00', totalHours: 11.48, method: 'QR', status: 'Đúng giờ', note: 'OT 2 tiếng' },
        { id: 14, staffId: 'NV002', date: '2026-02-20', checkIn: '07:28', checkOut: '17:00', totalHours: 9.53, method: 'Khuôn mặt', status: 'Đúng giờ', note: '' },
    ],
    nextLogId: 15,
    nextStaffId: 6,
    shopWifi: 'TiemMay_WiFi_5G',
    shopSSID: 'TiemMayPro_Internal',
};

const TODAY = '2026-02-24';
let clockInterval = null;

// ─── LIVE CLOCK ───────────────────────────────────────────────
function startClock() {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    function tick() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const el = document.getElementById('att-live-clock');
        if (el) el.textContent = `${h}:${m}:${s}`;
        const dateEl = document.getElementById('att-live-date');
        if (dateEl) dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`;
    }
    tick();
    if (!clockInterval) clockInterval = setInterval(tick, 1000);
}

function stopClock() {
    if (clockInterval) { clearInterval(clockInterval); clockInterval = null; }
}

// ─── INIT HOOK (called after DOMContentLoaded) ────────────────
function _patchNavigateForAttendance() {
    const orig = window.navigate;
    window.navigate = function (page) {
        orig(page);
        if (page === 'attendance') {
            startClock();
            // Small delay ensures DOM is visible before rendering
            setTimeout(renderAttendance, 60);
        } else {
            stopClock();
        }
    };
}

// ─── MAIN RENDER ──────────────────────────────────────────────
function renderAttendance() {
    updateAttStats();
    renderStaffTable();
    renderAttLog();
    renderMonthlyReport();
    populateManualSelect();
    populateLogFilterSelect();
}

// ─── STATS PANEL ─────────────────────────────────────────────
function updateAttStats() {
    const active = ATT.staff.filter(s => s.status === 'active');
    const todayLogs = ATT.logs.filter(l => l.date === TODAY);
    const presentIds = [...new Set(todayLogs.filter(l => l.checkIn && l.status !== 'Vắng phép').map(l => l.staffId))];
    const lateIds = [...new Set(todayLogs.filter(l => l.status === 'Đi muộn').map(l => l.staffId))];
    const absentCount = active.filter(s => !presentIds.includes(s.id)).length;

    _setEl('att-present', presentIds.length);
    _setEl('att-absent', absentCount);
    _setEl('att-late', lateIds.length);
    _setEl('att-total-staff', active.length);

    // Side status list
    const list = document.getElementById('att-today-status-list');
    if (!list) return;
    list.innerHTML = active.map(s => {
        const log = todayLogs.find(l => l.staffId === s.id);
        let dot = '#525773', txt = 'Chưa vào ca';
        if (log) {
            if (log.status === 'Vắng phép') { dot = '#9d8ff9'; txt = 'Vắng phép'; }
            else if (log.checkOut) { dot = '#3f9cf8'; txt = `✅ Ra: ${log.checkOut}`; }
            else if (log.status === 'Đi muộn') { dot = '#ff8c42'; txt = `⏰ Muộn: ${log.checkIn}`; }
            else { dot = '#3ddc84'; txt = `🟢 Vào: ${log.checkIn}`; }
        }
        return `<div class="att-status-row">
      <span><span class="att-status-dot" style="background:${esc(dot)}"></span>${esc(s.name)}</span>
      <span style="font-size:.75rem;color:var(--text-muted)">${esc(txt)}</span>
    </div>`;
    }).join('');
}

function _setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ─── STAFF TABLE ──────────────────────────────────────────────
function renderStaffTable(data) {
    const body = document.getElementById('staff-body');
    if (!body) return;
    const list = data !== undefined ? data : ATT.staff;

    body.innerHTML = list.map(s => {
        const log = ATT.logs.find(l => l.staffId === s.id && l.date === TODAY);
        const monthHours = ATT.logs
            .filter(l => l.staffId === s.id && l.date.startsWith('2026-02'))
            .reduce((sum, l) => sum + (l.totalHours || 0), 0);
        const sCls = s.status === 'active' ? 'badge-instock' : 'badge-outstock';
        const sTxt = s.status === 'active' ? '🟢 Đang làm' : '⛔ Nghỉ việc';
        const inTxt = log?.checkIn || '—';
        const outTxt = log?.checkOut || '—';
        return `<tr>
      <td>${esc(s.id)}</td>
      <td><strong style="color:var(--text-primary)">${esc(s.name)}</strong><br><span style="font-size:.72rem;color:var(--text-muted)">${esc(s.phone)}</span></td>
      <td>${esc(s.skill)}</td>
      <td style="color:var(--teal);font-weight:700">${Number(s.hourlyRate).toLocaleString('vi-VN')} ₫/h</td>
      <td style="font-size:.78rem">${esc(s.shift)}</td>
      <td><span class="badge ${esc(sCls)}">${esc(sTxt)}</span></td>
      <td style="color:var(--green);font-weight:700">${esc(inTxt)}</td>
      <td style="color:${log?.checkOut ? '#7ac6fb' : 'var(--text-muted)'};font-weight:700">${esc(outTxt)}</td>
      <td><strong style="color:var(--purple-l)">${monthHours.toFixed(1)}h</strong></td>
      <td><div class="actions">
        <button class="btn-action btn-view" onclick="quickCheckin('${esc(s.id)}','in','Thủ công')">🟢 Vào</button>
        <button class="btn-action btn-ship" onclick="quickCheckin('${esc(s.id)}','out','Thủ công')">🔴 Ra</button>
        <button class="btn-action btn-edit" onclick="editStaff('${esc(s.id)}')">✏️</button>
        <button class="btn-action btn-delete" onclick="deleteStaff('${esc(s.id)}')">🗑️</button>
      </div></td>
    </tr>`;
    }).join('') || '<tr><td colspan="10" style="text-align:center;color:var(--text-muted);padding:2rem">Chưa có nhân viên. Nhấn "+ Thêm thợ may" để bắt đầu.</td></tr>';
}

function filterStaff() {
    const q = document.getElementById('staff-search')?.value.toLowerCase() || '';
    const st = document.getElementById('staff-filter-status')?.value || '';
    renderStaffTable(ATT.staff.filter(s =>
        (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)) &&
        (!st || s.status === st)
    ));
}

// ─── ATTENDANCE LOG ───────────────────────────────────────────
function renderAttLog(data) {
    const body = document.getElementById('att-log-body');
    if (!body) return;
    const list = data !== undefined ? data : [...ATT.logs].reverse();

    const methodTag = m => {
        const cfg = {
            'QR': ['badge-qr-method', '📷 QR'],
            'Khuôn mặt': ['badge-face-method', '😊 Khuôn mặt'],
            'WiFi': ['badge-wifi-method', '📶 WiFi'],
            'Thủ công': ['badge-manual-method', '✍️ Thủ công'],
        };
        const [cls, lbl] = cfg[m] || ['badge-manual-method', m];
        return `<span class="badge ${cls}">${lbl}</span>`;
    };
    const statusTag = s => {
        const cls = { 'Đúng giờ': 'badge-checkedin', 'Đi muộn': 'badge-late', 'Vắng phép': 'badge-leave', 'Vắng mặt': 'badge-absent' };
        return `<span class="badge ${cls[s] || 'badge-absent'}">${s}</span>`;
    };

    body.innerHTML = list.map((l, i) => {
        const staff = ATT.staff.find(s => s.id === l.staffId);
        const hrs = l.totalHours ? `<strong style="color:var(--teal)">${l.totalHours.toFixed(1)}h</strong>` : '—';
        return `<tr>
      <td>${i + 1}</td>
      <td><strong style="color:var(--text-primary)">${esc(staff?.name || l.staffId)}</strong></td>
      <td>${fmtDate(l.date)}</td>
      <td style="color:var(--green);font-weight:700">${esc(l.checkIn || '—')}</td>
      <td style="color:#7ac6fb;font-weight:700">${esc(l.checkOut || '—')}</td>
      <td>${hrs}</td>
      <td>${l.method ? methodTag(l.method) : '—'}</td>
      <td>${statusTag(l.status)}</td>
      <td style="font-size:.78rem;color:var(--text-muted)">${esc(l.note || '—')}</td>
    </tr>`;
    }).join('') || '<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:2rem">Chưa có dữ liệu chấm công</td></tr>';
}

function filterAttLog() {
    const q = document.getElementById('log-search')?.value.toLowerCase() || '';
    const date = document.getElementById('log-filter-date')?.value || '';
    const staffId = document.getElementById('log-filter-staff')?.value || '';
    renderAttLog([...ATT.logs].reverse().filter(l => {
        const name = ATT.staff.find(s => s.id === l.staffId)?.name || '';
        return name.toLowerCase().includes(q) &&
            (!date || l.date === date) &&
            (!staffId || l.staffId === staffId);
    }));
}

function populateLogFilterSelect() {
    const sel = document.getElementById('log-filter-staff');
    if (!sel) return;
    sel.innerHTML = '<option value="">Tất cả nhân viên</option>' +
        ATT.staff.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}

function populateManualSelect() {
    const sel = document.getElementById('manual-tailor-select');
    if (!sel) return;
    sel.innerHTML = ATT.staff.filter(s => s.status === 'active')
        .map(s => `<option value="${s.id}">${s.name} — Ca ${s.shift}</option>`).join('');
    const dt = document.getElementById('manual-time');
    if (dt && !dt.value) {
        const now = new Date();
        dt.value = `${TODAY}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
}

// ─── MONTHLY REPORT ───────────────────────────────────────────
function renderMonthlyReport() {
    const body = document.getElementById('monthly-body');
    if (!body) return;
    const month = document.getElementById('monthly-month')?.value || '2';
    const prefix = month.length === 1 ? `2026-0${month}` : `2026-${month}`;
    const workDays = month === '2' ? 20 : 22;
    const STD_H = 8;

    body.innerHTML = ATT.staff.filter(s => s.status === 'active').map(s => {
        const logs = ATT.logs.filter(l => l.staffId === s.id && l.date.startsWith(prefix));
        const worked = logs.filter(l => l.checkIn && l.status !== 'Vắng phép').length;
        const total = logs.reduce((a, l) => a + (l.totalHours || 0), 0);
        const std = worked * STD_H;
        const ot = Math.max(0, total - std);
        const late = logs.filter(l => l.status === 'Đi muộn').length;
        const leave = logs.filter(l => l.status === 'Vắng phép').length;
        const base = total * s.hourlyRate;
        const otPay = ot * s.hourlyRate * 1.5;
        const total$ = base + otPay;
        return `<tr>
      <td>${esc(s.id)}</td>
      <td><strong style="color:var(--text-primary)">${esc(s.name)}</strong></td>
      <td><strong>${esc(worked)}</strong>/${esc(workDays)}</td>
      <td>${std.toFixed(0)}h</td>
      <td><strong>${total.toFixed(1)}h</strong></td>
      <td class="td-ot">${ot.toFixed(1)}h</td>
      <td class="td-late">${esc(late)} lần</td>
      <td class="td-absent">${esc(leave)} ngày</td>
      <td>${Number(base).toLocaleString('vi-VN')} ₫</td>
      <td class="td-ot">${Number(otPay).toLocaleString('vi-VN')} ₫</td>
      <td class="td-salary">${Number(total$).toLocaleString('vi-VN')} ₫</td>
    </tr>`;
    }).join('');
}

function exportMonthly() {
    const table = document.getElementById('monthly-table');
    if (!table) return;

    const monthSelect = document.getElementById('monthly-month');
    const monthText = monthSelect && monthSelect.options[monthSelect.selectedIndex] ? monthSelect.options[monthSelect.selectedIndex].text : 'Báo_Cáo';
    const filename = `Bang_Cham_Cong_${monthText.replace(/[\/\s]/g, '_')}.xls`;

    // Extract detailed logs for each staff
    const mVal = monthSelect?.value || '2';
    const monthPrefix = `2026-${mVal.padStart(2, '0')}`;
    let detailsHTML = `<br><br><h2>CHI TIẾT CHẤM CÔNG TỪNG NHÂN VIÊN</h2>`;

    ATT.staff.forEach(s => {
        const sLogs = ATT.logs.filter(l => l.staffId === s.id && l.date.startsWith(monthPrefix));
        if (sLogs.length === 0) return;

        detailsHTML += `
            <br>
            <h3 style="color: #444; margin-bottom: 4px;">Người lao động: ${s.name} - Mã NV: ${s.id}</h3>
            <table>
                <thead>
                    <tr>
                        <th style="background-color: #d9e1f2">Ngày</th>
                        <th style="background-color: #d9e1f2">Giờ vào</th>
                        <th style="background-color: #d9e1f2">Giờ ra</th>
                        <th style="background-color: #d9e1f2">Tổng giờ (h)</th>
                        <th style="background-color: #d9e1f2">Phương thức</th>
                        <th style="background-color: #d9e1f2">Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    ${sLogs.map(l => `
                        <tr>
                            <td>${esc(l.date)}</td>
                            <td>${esc(l.checkIn || '-')}</td>
                            <td>${esc(l.checkOut || '-')}</td>
                            <td><b>${l.totalHours ? l.totalHours.toFixed(2) : '0'}</b></td>
                            <td>${esc(l.method || '-')}</td>
                            <td>${esc(l.note || '')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    });

    const template = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>Bảng Chấm Công</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                table { border-collapse: collapse; width: 100%; font-family: 'Times New Roman', Times, serif; }
                th, td { border: 1px solid #777; padding: 8px; text-align: left; }
                th { background-color: #f0f0f0; font-weight: bold; }
                .td-ot, .td-salary { font-weight: bold; }
            </style>
        </head>
        <body>
            <h2>TỔNG HỢP ${monthText.toUpperCase()}</h2>
            ${table.outerHTML}
            ${detailsHTML}
        </body>
        </html>
    `;

    const blob = new Blob([template], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('✅ Đã xuất báo cáo ra file Excel (.xls)!', 'success');
}

// ─── CHECK-IN / CHECK-OUT ────────────────────────────────────
function _nowHHMM() {
    const n = new Date();
    return `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
}

function doCheckIn(staffId, method, note = '') {
    const staff = ATT.staff.find(s => s.id === staffId);
    if (!staff) { showToast('Không tìm thấy nhân viên!', 'error'); return; }

    const now = _nowHHMM();
    let existLog = ATT.logs.find(l => l.staffId === staffId && l.date === TODAY);

    if (existLog) {
        if (existLog.checkIn && !existLog.checkOut) {
            // → Check-out
            const [ih, im] = existLog.checkIn.split(':').map(Number);
            const [oh, om] = now.split(':').map(Number);
            const hrs = parseFloat(((oh * 60 + om - ih * 60 - im) / 60).toFixed(2));
            existLog.checkOut = now;
            existLog.totalHours = hrs;
            _showCheckResult(staff, 'out', now, hrs);
            if (typeof DB !== 'undefined') DB.activities.unshift({ text: `${staff.name} ra ca lúc ${now}`, time: 'Vừa xong', color: '#3f9cf8' });
        } else if (existLog.checkOut) {
            showToast(`${staff.name} đã chấm công đủ hôm nay! ✅`, 'info'); return;
        }
    } else {
        // → Check-in
        const [sh, sm] = staff.shift.split('-')[0].split(':').map(Number);
        const [nh, nm] = now.split(':').map(Number);
        const lateMin = (nh * 60 + nm) - (sh * 60 + sm);
        const status = lateMin > 15 ? 'Đi muộn' : 'Đúng giờ';
        const noteStr = lateMin > 15 ? `Muộn ${lateMin} phút` : (note || '');
        ATT.logs.push({ id: ATT.nextLogId++, staffId, date: TODAY, checkIn: now, checkOut: '', totalHours: 0, method, status, note: noteStr });
        _showCheckResult(staff, 'in', now, 0, status);
        if (typeof DB !== 'undefined') DB.activities.unshift({ text: `${staff.name} vào ca lúc ${now} (${method})`, time: 'Vừa xong', color: '#3ddc84' });
    }

    updateAttStats();
    renderStaffTable();
    renderAttLog();
}

function _showCheckResult(staff, type, time, hours, status = '') {
    const isIn = type === 'in';
    const lateWarn = status === 'Đi muộn'
        ? `<div style="margin-top:.75rem;padding:.5rem .85rem;background:rgba(255,140,66,.12);border-radius:8px;color:var(--orange);font-size:.82rem">⚠️ Đi muộn – ${status}</div>`
        : '';
    const color = isIn ? 'rgba(61,220,132,.08)' : 'rgba(63,156,248,.08)';
    const border = isIn ? 'rgba(61,220,132,.3)' : 'rgba(63,156,248,.3)';
    const timeColor = isIn ? 'var(--green)' : '#7ac6fb';
    const title = isIn ? '🟢 Vào ca thành công' : '🔵 Ra ca thành công';
    document.getElementById('att-result-title').textContent = title;
    document.getElementById('att-result-body').innerHTML = `
    <div class="att-result-card" style="background:${esc(color)};border-color:${esc(border)}">
      <div class="att-result-avatar">${esc(staff.name.split(' ').pop()[0])}</div>
      <div class="att-result-name">${esc(staff.name)}</div>
      <div class="att-result-skill">${esc(staff.skill)} &nbsp;·&nbsp; Ca ${esc(staff.shift)}</div>
      <div class="att-result-time" style="color:${esc(timeColor)}">${esc(time)}</div>
      <div class="att-result-detail">
        ${isIn
            ? `Ca làm: <strong>${esc(staff.shift)}</strong>`
            : `Tổng gờ hôm nay: <strong style="color:var(--teal)">${hours.toFixed(1)}h</strong>`
        }
      </div>
      ${lateWarn}
    </div>`;
    openModal('modal-att-result');
}

function quickCheckin(staffId, type, method) {
    if (type === 'in') {
        doCheckIn(staffId, method);
    } else {
        const log = ATT.logs.find(l => l.staffId === staffId && l.date === TODAY);
        if (log && log.checkIn && !log.checkOut) doCheckIn(staffId, method);
        else showToast('Nhân viên chưa vào ca hoặc đã ra ca rồi!', 'info');
    }
}

// ─── TAB SWITCHERS ────────────────────────────────────────────
function switchAttTab(tab) {
    if (tab !== 'face' && typeof stopRealFaceScan === 'function') {
        stopRealFaceScan();
    }
    ['qr', 'face', 'wifi', 'manual'].forEach(t => {
        document.getElementById(`tab-${t}`)?.classList.toggle('active', t === tab);
        const p = document.getElementById(`panel-${t}`);
        if (p) p.style.display = t === tab ? '' : 'none';
    });
}

function switchAttSection(sec) {
    ['staff', 'log', 'monthly'].forEach(s => {
        document.getElementById(`sec-${s}`)?.classList.toggle('active', s === sec);
        const el = document.getElementById(`att-section-${s}`);
        if (el) el.style.display = s === sec ? '' : 'none';
    });
    if (sec === 'monthly') renderMonthlyReport();
    if (sec === 'log') renderAttLog();
}

// ─── SIMULATE SCAN ───────────────────────────────────────────
function simulateScanQR() {
    const line = document.getElementById('qr-scan-line');
    if (line) line.classList.add('active');
    showToast('📷 Đang quét mã QR...', 'info');
    setTimeout(() => {
        if (line) line.classList.remove('active');
        const active = ATT.staff.filter(s => s.status === 'active');
        const pick = active[Math.floor(Math.random() * active.length)];
        if (pick) doCheckIn(pick.id, 'QR');
    }, 2000);
}

let videoStream = null;
let scanningActive = false;
let faceScanTimeout = null;

async function startRealFaceScan() {
    const video = document.getElementById('att-video-feed');
    const ring = document.getElementById('face-ring');
    const stat = document.getElementById('face-status');
    const overlay = document.getElementById('att-video-overlay');
    const btn = document.getElementById('btn-start-camera');

    if (scanningActive) {
        stopRealFaceScan();
        return;
    }

    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        video.srcObject = videoStream;
        video.style.display = 'block';
        if (ring) ring.style.opacity = '0.1'; // Make static icon dim
        scanningActive = true;
        btn.innerHTML = '⏹ Tắt Camera';
        btn.className = 'btn btn-secondary';

        if (stat) stat.textContent = 'Đang phân tích hệ quy chiếu khuôn mặt...';

        // Loop recognition periodically
        const recognizeFace = () => {
            if (!scanningActive) return;
            overlay.style.display = 'block';
            const ctx = overlay.getContext('2d');
            overlay.width = overlay.offsetWidth;
            overlay.height = overlay.offsetHeight;

            // Dynamic bounding box
            const w = 180, h = 220;
            const x = (overlay.width - w) / 2;
            const y = (overlay.height - h) / 2 + 10;

            // Draw scanning line animation
            let lineY = y;
            const scanAnim = setInterval(() => {
                if (!scanningActive) { clearInterval(scanAnim); return; }
                ctx.clearRect(0, 0, overlay.width, overlay.height);

                // Box background
                ctx.fillStyle = 'rgba(61, 220, 132, 0.15)';
                ctx.fillRect(x, y, w, h);

                // Box border
                ctx.strokeStyle = '#3ddc84';
                ctx.setLineDash([8, 4]);
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y, w, h);

                ctx.beginPath();
                ctx.moveTo(x, lineY);
                ctx.lineTo(x + w, lineY);
                ctx.strokeStyle = '#3ddc84';
                ctx.setLineDash([]);
                ctx.stroke();
                lineY += 5;

                if (lineY > y + h) {
                    clearInterval(scanAnim);
                    finalizeRecognition(ctx, x, y, w, h);
                }
            }, 35);
        };

        const finalizeRecognition = (ctx, x, y, w, h) => {
            if (!scanningActive) return;
            const active = ATT.staff.filter(s => s.status === 'active');
            const pick = active[Math.floor(Math.random() * active.length)];

            ctx.fillStyle = 'rgba(13, 15, 26, 0.85)';
            ctx.fillRect(x, y - 35, w, 35);
            ctx.fillStyle = '#3ddc84';
            ctx.font = 'bold 15px "Be Vietnam Pro", sans-serif';
            ctx.fillText(pick ? pick.name : 'Unknown', x + 10, y - 12);

            if (stat) stat.innerHTML = `<span style="color:#3ddc84">✅ Đã nhận diện: ${pick.name}</span>`;
            showToast('😊 AI Nhận diện bằng khuôn mặt thành công!', 'info');

            if (pick) doCheckIn(pick.id, 'Khuôn mặt');

            // Pause before another scan
            faceScanTimeout = setTimeout(() => {
                if (!scanningActive) return;
                ctx.clearRect(0, 0, overlay.width, overlay.height);
                overlay.style.display = 'none';
                if (stat) stat.textContent = 'Đang chờ khuôn mặt tiếp theo...';

                faceScanTimeout = setTimeout(recognizeFace, 3000);
            }, 3000);
        };

        faceScanTimeout = setTimeout(recognizeFace, 2000);

    } catch (err) {
        console.error('Camera error: ', err);
        showToast('Không thể mở Camera. Vui lòng cấp quyền truy cập trình duyệt!', 'error');
        stopRealFaceScan();
    }
}

function stopRealFaceScan() {
    scanningActive = false;
    const video = document.getElementById('att-video-feed');
    const ring = document.getElementById('face-ring');
    const stat = document.getElementById('face-status');
    const overlay = document.getElementById('att-video-overlay');
    const btn = document.getElementById('btn-start-camera');

    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    if (video) video.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    if (ring) ring.style.opacity = '1';
    if (btn) {
        btn.innerHTML = '▶ Mở Camera AI Nhận Diện';
        btn.className = 'btn btn-primary';
    }
    if (stat) stat.textContent = 'Đưa khuôn mặt vào khung hình';
    if (faceScanTimeout) clearTimeout(faceScanTimeout);
}

function simulateWifiScan() {
    const ssidEl = document.getElementById('wifi-ssid');
    const statEl = document.getElementById('wifi-status');
    if (ssidEl) ssidEl.textContent = '🔍 Đang quét mạng WiFi...';
    if (statEl) statEl.textContent = 'Tìm kiếm mạng nội bộ tiệm...';
    showToast('📶 Đang quét WiFi...', 'info');
    setTimeout(() => {
        if (ssidEl) ssidEl.textContent = `✅ Kết nối: ${ATT.shopWifi}`;
        if (statEl) statEl.textContent = 'Nhận diện thiết bị thành công – Đang xác nhận danh tính...';
        setTimeout(() => {
            const active = ATT.staff.filter(s => s.status === 'active');
            const pick = active[Math.floor(Math.random() * active.length)];
            if (pick) doCheckIn(pick.id, 'WiFi');
            setTimeout(() => {
                if (ssidEl) ssidEl.textContent = '🔍 Đang quét mạng...';
                if (statEl) statEl.textContent = 'Chưa kết nối mạng định danh';
            }, 4000);
        }, 800);
    }, 1800);
}

// ─── MANUAL CHECK-IN ─────────────────────────────────────────
function saveManualAttendance() {
    const staffId = document.getElementById('manual-tailor-select')?.value;
    const type = document.getElementById('manual-type')?.value;
    const note = document.getElementById('manual-note')?.value || 'Chấm công thủ công bởi Admin';
    if (!staffId) { showToast('Vui lòng chọn thợ may!', 'error'); return; }
    if (type === 'in') doCheckIn(staffId, 'Thủ công', note);
    else quickCheckin(staffId, 'out', 'Thủ công');
    const n = document.getElementById('manual-note');
    if (n) n.value = '';
}

// ─── STAFF CRUD ───────────────────────────────────────────────
let _editingStaffId = null;

function captureFaceId() {
    const input = document.getElementById('staff-face-id');
    const btn = document.getElementById('btn-scan-face-id');
    const name = document.getElementById('staff-name')?.value.trim() || 'Nhân viên';

    btn.innerHTML = '🔄 Đang quét...';
    btn.disabled = true;
    showToast('Mở Camera AI: Hãy đưa khuôn mặt vào giữa khung hình...', 'info');

    // Giả lập sau 2.5s thì lấy được mẫu
    setTimeout(() => {
        const fakeHash = 'FID-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        if (input) input.value = fakeHash;

        btn.innerHTML = '✅ Đã lấy mẫu';
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-secondary');
        showToast(`✅ Đã thu thập sinh trắc học cho ${name}!`, 'success');

        setTimeout(() => {
            btn.innerHTML = '📷 Lấy lại';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
            btn.disabled = false;
        }, 2000);
    }, 2500);
}

function handleFaceUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const input = document.getElementById('staff-face-id');
    const name = document.getElementById('staff-name')?.value.trim() || 'Nhân viên';

    showToast(`Đang phân tích ảnh: ${file.name}...`, 'info');

    // Giả lập sau 1.5s thì phân tích xong ảnh
    setTimeout(() => {
        const fakeHash = 'FID-IMG' + Math.random().toString(36).substr(2, 5).toUpperCase();
        if (input) input.value = fakeHash;

        showToast(`✅ Đã trích xuất Face ID từ ảnh cho ${name}!`, 'success');
        event.target.value = ''; // Reset input để có thể chọn lại ảnh đó
    }, 1500);
}

function saveStaff() {
    const name = document.getElementById('staff-name')?.value.trim();
    if (!name) { showToast('Vui lòng nhập họ tên!', 'error'); return; }

    if (_editingStaffId) {
        // Edit mode
        const s = ATT.staff.find(x => x.id === _editingStaffId);
        if (s) {
            s.name = name;
            s.phone = document.getElementById('staff-phone')?.value || '';
            s.skill = document.getElementById('staff-skill')?.value || s.skill;
            s.shift = document.getElementById('staff-shift')?.value || s.shift;
            s.hourlyRate = parseInt(document.getElementById('staff-hourly')?.value) || s.hourlyRate;
            s.startDate = document.getElementById('staff-start')?.value || s.startDate;
            s.qrCode = document.getElementById('staff-qr')?.value || s.qrCode;
            s.faceId = document.getElementById('staff-face-id')?.value || s.faceId;
            s.mac = document.getElementById('staff-mac')?.value || s.mac;
            s.status = document.getElementById('staff-status')?.value || s.status;
            s.note = document.getElementById('staff-note')?.value || '';
            showToast(`✅ Đã cập nhật thông tin: ${name}`);
        }
        _editingStaffId = null;
    } else {
        // Add mode
        const codeInput = document.getElementById('staff-code')?.value.trim();
        const id = codeInput || `NV${String(ATT.nextStaffId++).padStart(3, '0')}`;
        if (ATT.staff.find(s => s.id === id)) { showToast(`Mã ${id} đã tồn tại!`, 'error'); return; }
        ATT.staff.push({
            id, name,
            phone: document.getElementById('staff-phone')?.value || '',
            skill: document.getElementById('staff-skill')?.value || 'Thợ may chính',
            shift: document.getElementById('staff-shift')?.value || '07:30-17:00',
            hourlyRate: parseInt(document.getElementById('staff-hourly')?.value) || 25000,
            startDate: document.getElementById('staff-start')?.value || TODAY,
            qrCode: document.getElementById('staff-qr')?.value || `QR-${id}`,
            faceId: document.getElementById('staff-face-id')?.value || '',
            mac: document.getElementById('staff-mac')?.value || '',
            status: document.getElementById('staff-status')?.value || 'active',
            note: document.getElementById('staff-note')?.value || '',
        });
        if (typeof DB !== 'undefined') DB.activities.unshift({ text: `Thêm thợ may: ${name}`, time: 'Vừa xong', color: '#7c6af8' });
        showToast(`✅ Đã thêm thợ may: ${name}`);
    }

    closeModal('modal-add-staff');
    ['staff-name', 'staff-code', 'staff-phone', 'staff-qr', 'staff-face-id', 'staff-mac', 'staff-note']
        .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

    renderStaffTable();
    updateAttStats();
    populateManualSelect();
    populateLogFilterSelect();
}

function editStaff(id) {
    const s = ATT.staff.find(x => x.id === id);
    if (!s) return;
    _editingStaffId = id;
    document.getElementById('staff-name').value = s.name;
    document.getElementById('staff-code').value = s.id;
    document.getElementById('staff-phone').value = s.phone;
    document.getElementById('staff-skill').value = s.skill;
    document.getElementById('staff-shift').value = s.shift;
    document.getElementById('staff-hourly').value = s.hourlyRate;
    document.getElementById('staff-start').value = s.startDate;
    document.getElementById('staff-qr').value = s.qrCode || '';
    if (document.getElementById('staff-face-id')) document.getElementById('staff-face-id').value = s.faceId || '';
    document.getElementById('staff-mac').value = s.mac || '';
    document.getElementById('staff-status').value = s.status;
    document.getElementById('staff-note').value = s.note;
    openModal('modal-add-staff');
}

function deleteStaff(id) {
    const s = ATT.staff.find(x => x.id === id);
    if (!s || !confirm(`Xóa nhân viên "${s.name}" khỏi hệ thống?`)) return;
    ATT.staff.splice(ATT.staff.indexOf(s), 1);
    renderStaffTable();
    updateAttStats();
    populateManualSelect();
    populateLogFilterSelect();
    showToast('🗑️ Đã xóa nhân viên', 'info');
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Patch navigate to hook attendance rendering + clock
    const origNav = window.navigate;
    window.navigate = function (page) {
        origNav(page);
        if (page === 'attendance') {
            startClock();
            setTimeout(renderAttendance, 80);
        } else {
            stopClock();
        }
    };
});
