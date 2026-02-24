// Module: attendance
const html_attendance = `
            <div class="page-header">
                <h1>👷 Chấm công Thợ may</h1>
                <p class="page-subtitle">Quản lý giờ vào – ra, chấm công theo ngày / tháng bằng QR, Khuôn mặt, WiFi</p>
            </div>

            <!-- CLOCK + QUICK CHECK-IN -->
            <div class="att-top-row">
                <div class="card att-clock-card">
                    <div class="att-live-clock" id="att-live-clock">00:00:00</div>
                    <div class="att-live-date" id="att-live-date">Thứ Ba, 24 tháng 2 năm 2026</div>
                    <div class="att-method-tabs">
                        <button class="att-tab active" id="tab-qr" onclick="switchAttTab('qr')">📷 QR Code</button>
                        <button class="att-tab" id="tab-face" onclick="switchAttTab('face')">😊 Khuôn mặt</button>
                        <button class="att-tab" id="tab-wifi" onclick="switchAttTab('wifi')">📶 WiFi</button>
                        <button class="att-tab" id="tab-manual" onclick="switchAttTab('manual')">✍️ Thủ công</button>
                    </div>

                    <!-- QR Panel -->
                    <div class="att-panel" id="panel-qr">
                        <div class="qr-scanner-area" id="qr-scanner-area">
                            <div class="qr-frame">
                                <div class="qr-corner tl"></div>
                                <div class="qr-corner tr"></div>
                                <div class="qr-corner bl"></div>
                                <div class="qr-corner br"></div>
                                <div class="qr-scan-line" id="qr-scan-line"></div>
                                <div class="qr-placeholder">📷<br><span>Camera đang chờ</span></div>
                            </div>
                        </div>
                        <div class="att-panel-actions">
                            <button class="btn btn-primary" onclick="simulateScanQR()">▶ Mở Camera Quét QR</button>
                        </div>
                    </div>

                    <!-- Face Panel -->
                    <div class="att-panel" id="panel-face" style="display:none">
                        <div class="face-scanner-area">
                            <div class="face-camera-wrapper" style="position:relative; width:220px; height:220px; display:flex; align-items:center; justify-content:center;">
                                <video id="att-video-feed" autoplay playsinline style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; border-radius:50%; display:none; border:3px solid var(--teal); box-shadow:0 0 20px rgba(0,201,201,0.2); z-index:1;"></video>
                                <canvas id="att-video-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; border-radius:50%; display:none; z-index:2; pointer-events:none;"></canvas>
                                
                                <div class="face-ring" id="face-ring" style="width:100%; height:100%; border-radius:50%; position:relative; z-index:0;">
                                    <div class="face-icon">😊</div>
                                    <div class="face-dots">
                                        <span></span><span></span><span></span><span></span>
                                        <span></span><span></span><span></span><span></span>
                                    </div>
                                </div>
                            </div>
                            <div class="face-status" id="face-status">Đưa khuôn mặt vào khung hình</div>
                        </div>
                        <div class="att-panel-actions" style="margin-top:0.5rem">
                            <button class="btn btn-primary" id="btn-start-camera" onclick="startRealFaceScan()">▶ Mở Camera AI Nhận Diện</button>
                        </div>
                    </div>

                    <!-- WiFi Panel -->
                    <div class="att-panel" id="panel-wifi" style="display:none">
                        <div class="wifi-scanner-area">
                            <div class="wifi-rings">
                                <div class="wifi-ring r1"></div>
                                <div class="wifi-ring r2"></div>
                                <div class="wifi-ring r3"></div>
                                <div class="wifi-icon">📶</div>
                            </div>
                            <div class="wifi-info">
                                <div class="wifi-ssid" id="wifi-ssid">🔍 Đang quét mạng...</div>
                                <div class="wifi-status" id="wifi-status">Chưa kết nối mạng định danh</div>
                            </div>
                        </div>
                        <div class="att-panel-actions">
                            <button class="btn btn-primary" onclick="simulateWifiScan()">▶ Giả lập quét WiFi</button>
                            <p class="att-hint">Chấm công tự động khi thiết bị kết nối WiFi nội bộ tiệm</p>
                        </div>
                    </div>

                    <!-- Manual Panel -->
                    <div class="att-panel" id="panel-manual" style="display:none">
                        <div class="manual-form">
                            <div class="form-group">
                                <label>Chọn thợ may</label>
                                <select id="manual-tailor-select"></select>
                            </div>
                            <div class="form-group">
                                <label>Loại chấm</label>
                                <select id="manual-type">
                                    <option value="in">🟢 Vào ca</option>
                                    <option value="out">🔴 Ra ca</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Thời gian</label>
                                <input type="datetime-local" id="manual-time" />
                            </div>
                            <div class="form-group">
                                <label>Ghi chú</label>
                                <input type="text" id="manual-note" placeholder="Lý do chấm thủ công..." />
                            </div>
                        </div>
                        <div class="att-panel-actions">
                            <button class="btn btn-primary" onclick="saveManualAttendance()">✅ Lưu chấm công</button>
                        </div>
                    </div>
                </div>

                <!-- Today Status Cards -->
                <div class="att-today-col">
                    <div class="card att-today-stat">
                        <div class="att-stat-icon" style="background:rgba(61,220,132,0.15);color:#3ddc84">✅</div>
                        <div>
                            <div class="att-stat-val" id="att-present">0</div>
                            <div class="att-stat-lbl">Đang làm việc</div>
                        </div>
                    </div>
                    <div class="card att-today-stat">
                        <div class="att-stat-icon" style="background:rgba(255,95,109,0.15);color:#ff5f6d">❌</div>
                        <div>
                            <div class="att-stat-val" id="att-absent">0</div>
                            <div class="att-stat-lbl">Vắng mặt</div>
                        </div>
                    </div>
                    <div class="card att-today-stat">
                        <div class="att-stat-icon" style="background:rgba(255,140,66,0.15);color:#ff8c42">⏰</div>
                        <div>
                            <div class="att-stat-val" id="att-late">0</div>
                            <div class="att-stat-lbl">Đi muộn</div>
                        </div>
                    </div>
                    <div class="card att-today-stat">
                        <div class="att-stat-icon" style="background:rgba(124,106,248,0.15);color:#7c6af8">👷</div>
                        <div>
                            <div class="att-stat-val" id="att-total-staff">0</div>
                            <div class="att-stat-lbl">Tổng thợ may</div>
                        </div>
                    </div>
                    <div class="card" style="padding:1rem">
                        <div
                            style="font-size:.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:.75rem">
                            Trạng thái hôm nay</div>
                        <div id="att-today-status-list" style="display:flex;flex-direction:column;gap:.5rem"></div>
                    </div>
                </div>
            </div>

            <!-- TABS: Nhân viên / Bảng chấm công / Báo cáo -->
            <div class="att-section-tabs" style="margin-top:1.5rem">
                <button class="att-sec-tab active" id="sec-staff" onclick="switchAttSection('staff')">👷 Danh sách nhân
                    viên</button>
                <button class="att-sec-tab" id="sec-log" onclick="switchAttSection('log')">📋 Nhật ký chấm công</button>
                <button class="att-sec-tab" id="sec-monthly" onclick="switchAttSection('monthly')">📅 Bảng tổng hợp
                    tháng</button>
            </div>

            <!-- STAFF LIST -->
            <div id="att-section-staff" class="att-section">
                <div class="toolbar" style="margin-top:1rem">
                    <div class="search-bar">
                        <span>🔍</span><input type="text" id="staff-search" placeholder="Tìm theo tên thợ..."
                            oninput="filterStaff()" />
                    </div>
                    <div class="filter-group">
                        <select id="staff-filter-status" onchange="filterStaff()">
                            <option value="">Tất cả</option>
                            <option value="active">Đang làm</option>
                            <option value="inactive">Nghỉ việc</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" onclick="openModal('modal-add-staff')">+ Thêm thợ may</button>
                </div>
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Mã NV</th>
                                <th>Họ tên & SĐT</th>
                                <th>Chuyên môn</th>
                                <th>Lương/giờ</th>
                                <th>Ca làm việc</th>
                                <th>Trạng thái</th>
                                <th>Giờ vào hôm nay</th>
                                <th>Giờ ra hôm nay</th>
                                <th>Tổng giờ tháng</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody id="staff-body"></tbody>
                    </table>
                </div>
            </div>

            <!-- ATTENDANCE LOG -->
            <div id="att-section-log" class="att-section" style="display:none">
                <div class="toolbar" style="margin-top:1rem">
                    <div class="search-bar">
                        <span>🔍</span><input type="text" id="log-search" placeholder="Tìm theo tên, ngày..."
                            oninput="filterAttLog()" />
                    </div>
                    <div class="filter-group">
                        <input type="date" id="log-filter-date" onchange="filterAttLog()" />
                        <select id="log-filter-staff" onchange="filterAttLog()">
                            <option value="">Tất cả nhân viên</option>
                        </select>
                    </div>
                </div>
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Nhân viên</th>
                                <th>Ngày</th>
                                <th>Giờ vào</th>
                                <th>Giờ ra</th>
                                <th>Tổng giờ</th>
                                <th>Phương thức</th>
                                <th>Trạng thái</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody id="att-log-body"></tbody>
                    </table>
                </div>
            </div>

            <!-- MONTHLY REPORT -->
            <div id="att-section-monthly" class="att-section" style="display:none">
                <div class="toolbar" style="margin-top:1rem">
                    <div class="filter-group">
                        <select id="monthly-month" onchange="renderMonthlyReport()">
                            <option value="2">Tháng 2/2026</option>
                            <option value="1">Tháng 1/2026</option>
                            <option value="12">Tháng 12/2025</option>
                        </select>
                    </div>
                    <button class="btn btn-secondary" onclick="exportMonthly()">📥 Xuất Excel</button>
                </div>
                <div class="table-wrapper">
                    <table class="data-table" id="monthly-table">
                        <thead>
                            <tr>
                                <th>Mã NV</th>
                                <th>Họ tên</th>
                                <th>Ngày công</th>
                                <th>Giờ chuẩn</th>
                                <th>Giờ thực tế</th>
                                <th>Giờ OT</th>
                                <th>Đi muộn</th>
                                <th>Vắng phép</th>
                                <th>Lương cơ bản</th>
                                <th>Phụ cấp OT</th>
                                <th>Tổng lương</th>
                            </tr>
                        </thead>
                        <tbody id="monthly-body"></tbody>
                    </table>
                </div>
            </div>
        `;
document.getElementById('page-attendance').innerHTML = html_attendance;
