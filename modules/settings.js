// Module: settings
const html_settings = `  
        <!-- Navbar Ngang -->
        <nav class="settings-nav set-nav-horizontal">
            <button class="set-tab active" data-tab="gs" onclick="switchSetTab('gs')">☁️ Google Sheets</button>
            <button class="set-tab" data-tab="shop" onclick="switchSetTab('shop')">🏪 Thông tin tiệm</button>
            <button class="set-tab" data-tab="att" onclick="switchSetTab('att')">📶 Chấm công</button>
            <button class="set-tab" data-tab="ui" onclick="switchSetTab('ui')">🎨 Giao diện</button>
            <button class="set-tab" data-tab="data" onclick="switchSetTab('data')">🗄️ Dữ liệu</button>
            <button class="set-tab" data-tab="security" onclick="switchSetTab('security')">🔒 Bảo mật</button>
            <button class="set-tab" data-tab="about" onclick="switchSetTab('about')">ℹ️ Về ứng dụng</button>
        </nav>

        <!-- Content Panels Wrapper -->
        <div class="settings-content-container" style="display:flex; justify-content:center; flex:1; overflow-y:auto; padding:2rem 1.75rem;">
            <!-- Content Panels Card -->
            <div class="settings-content-card" style="width:100%; max-width:960px;">
                
                <!-- ══ TAB: GOOGLE SHEETS ══════════════════════════════ -->
                <div class="set-panel active" id="set-panel-gs">
                <div class="set-panel-header">
                    <h2>☁️ Kết nối Google Sheets</h2>
                    <p>Lưu dữ liệu lên cloud — dùng được trên nhiều thiết bị, không mất khi tải lại trang</p>
                </div>

                <!-- Status bar -->
                <div class="gs-conn-bar" id="gs-conn-bar">
                    <span id="gs-conn-icon" style="font-size:1.8rem;">📴</span>
                    <div style="flex:1;">
                        <div id="gs-conn-title" style="font-weight:700;font-size:1rem;color:var(--text-primary);">Chưa kết nối Google Sheets</div>
                        <div id="gs-conn-sub" style="font-size:.85rem;color:var(--text-muted);margin-top:.2rem;">Làm theo 6 bước bên dưới để kết nối</div>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="gsSyncNow()" id="set-sync-btn" disabled>🔄 Sync ngay</button>
                </div>

                <!-- Stats -->
                <div class="gs-stat-row">
                    <div class="gs-stat-card"><div class="gs-stat-val" id="set-stat-status">📴 Offline</div><div class="gs-stat-lbl">Trạng thái</div></div>
                    <div class="gs-stat-card"><div class="gs-stat-val" id="set-stat-lastsync">—</div><div class="gs-stat-lbl">Sync lần cuối</div></div>
                    <div class="gs-stat-card"><div class="gs-stat-val" id="set-stat-records">—</div><div class="gs-stat-lbl">Tổng bản ghi</div></div>
                </div>

                <!-- URL input -->
                <div class="set-section">
                    <div class="set-section-title">Web App URL & API Key</div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-bottom:1rem;">
                        <div class="form-group">
                            <label style="font-size:0.8rem; margin-bottom:0.4rem; display:block;">Web App URL</label>
                            <input type="url" id="set-gs-url" placeholder="https://script.google.com/macros/s/.../exec" style="width:100%; font-size:.9rem; padding:.75rem 1rem; border-radius:var(--radius-sm);" />
                        </div>
                        <div class="form-group">
                            <label style="font-size:0.8rem; margin-bottom:0.4rem; display:block;">API Secret Key</label>
                            <input type="password" id="set-gs-api-key" placeholder="Nhập API Key..." style="width:100%; font-size:.9rem; padding:.75rem 1rem; border-radius:var(--radius-sm);" />
                        </div>
                    </div>
                    <div style="display:flex; gap:0.8rem; justify-content: flex-end;">
                        <button class="btn btn-primary" onclick="testGsConnection()">🔌 Kiểm tra</button>
                        <button class="btn btn-success" onclick="saveGsSettings()">💾 Lưu</button>
                        <button class="btn btn-secondary" onclick="clearGsSettings()" title="Xóa cấu hình">🗑️</button>
                    </div>
                    <div id="set-gs-test-result" style="display:none;margin-top:1rem;" class="settings-test-box"></div>
                </div>

                <!-- Wizard -->
                <div class="set-section">
                    <div class="set-section-title">Hướng dẫn cài đặt — 6 bước đơn giản</div>
                    <div class="gs-wizard">
                        <div class="gs-step"><div class="gs-step-num">1</div><div class="gs-step-body"><div class="gs-step-title">Tạo Google Spreadsheet mới</div><div class="gs-step-desc">Truy cập <a href="https://sheets.google.com" target="_blank" class="gs-link">sheets.google.com</a> → Nhấn <strong>+</strong> (Bảng tính trống) → Đặt tên tuỳ ý.</div></div></div>
                        <div class="gs-step"><div class="gs-step-num">2</div><div class="gs-step-body"><div class="gs-step-title">Mở Apps Script</div><div class="gs-step-desc">Trong Google Sheets vừa tạo, nhấn menu:<br><span class="gs-breadcrumb">Tiện ích mở rộng</span> → <span class="gs-breadcrumb">Apps Script</span></div></div></div>
                        <div class="gs-step"><div class="gs-step-num">3</div><div class="gs-step-body"><div class="gs-step-title">Dán code vào Apps Script</div><div class="gs-step-desc">Trong cửa sổ Apps Script: Nhấn <kbd>Ctrl+A</kbd> và <kbd>Delete</kbd> xóa mã cũ.<br>Nhấn nút bên dưới copy code, <kbd>Ctrl+V</kbd> dán vào, sau đó nhấn <kbd>Ctrl+S</kbd> để lưu.</div><button class="btn btn-primary" style="margin-top:.6rem;font-size:.82rem" onclick="copyCodeGs()">📋 Copy toàn bộ Code.gs</button><span id="copy-gs-result" style="display:none;margin-left:.75rem;font-size:.8rem;color:var(--green);">✅ Đã copy!</span></div></div>
                        <div class="gs-step"><div class="gs-step-num">4</div><div class="gs-step-body"><div class="gs-step-title">Tạo dữ liệu mẫu</div><div class="gs-step-desc">Chọn hàm <strong class="gs-code">setupInitialData</strong> từ thanh công cụ trên cùng → Nhấn nút <strong>▶ Run</strong>.<br>Cấp quyền (Review permissions → Allow) nếu được hỏi.</div></div></div>
                        <div class="gs-step"><div class="gs-step-num">5</div><div class="gs-step-body"><div class="gs-step-title">Deploy làm Web App</div><div class="gs-step-desc">Nhấn <strong>Deploy</strong> (góc trên phải) → Chọn <strong>New deployment</strong>.<br>Loại: <strong>Web app</strong>. Execute as: <strong>Me</strong>. Who has access: <strong class="gs-important">Anyone</strong>. → Nhấn <strong>Deploy</strong>.</div></div></div>
                        <div class="gs-step gs-step-last"><div class="gs-step-num" style="background:var(--green)">✓</div><div class="gs-step-body"><div class="gs-step-title">Dán URL vào ô bên trên</div><div class="gs-step-desc">Copy URL được cấp sau khi Deploy và dán vào ô "Web App URL" phía trên, nhấn <strong>🔌 Kiểm tra</strong> và <strong>💾 Lưu</strong>.</div></div></div>
                    </div>
                </div>
            </div>

            <!-- ══ TAB: THÔNG TIN TIỆM ══════════════════════════════ -->
            <div class="set-panel" id="set-panel-shop">
                <div class="set-panel-header"><h2>🏪 Thông tin tiệm may</h2><p>Tên tiệm, chủ tiệm và thông tin liên hệ hiển thị trong ứng dụng</p></div>
                <div class="set-section">
                    <div class="set-form-grid">
                        <div class="form-group"><label>Tên tiệm</label><input type="text" id="set-shop-name" placeholder="Tiệm May Hoa Hồng" /></div>
                        <div class="form-group"><label>Chủ tiệm / Tên tài khoản</label><input type="text" id="set-owner-name" placeholder="Nguyễn Thị Hoa" /></div>
                        <div class="form-group"><label>Số điện thoại</label><input type="tel" id="set-shop-phone" placeholder="0901 234 567" /></div>
                        <div class="form-group"><label>Email</label><input type="email" id="set-shop-email" placeholder="tiemmay@gmail.com" /></div>
                        <div class="form-group" style="grid-column:span 2"><label>Địa chỉ</label><input type="text" id="set-shop-address" placeholder="123 Đường ABC, Quận 1, TP.HCM" /></div>
                        <div class="form-group"><label>Giờ mở cửa</label><input type="time" id="set-open-time" value="07:00" /></div>
                        <div class="form-group"><label>Giờ đóng cửa</label><input type="time" id="set-close-time" value="18:00" /></div>
                    </div>
                    <div style="margin-top:2rem;text-align:right;"><button class="btn btn-primary" onclick="saveShopSettings()">💾 Lưu thông tin tiệm</button></div>
                </div>
            </div>

            <!-- ══ TAB: CHẤM CÔNG ══════════════════════════════════ -->
            <div class="set-panel" id="set-panel-att">
                <div class="set-panel-header"><h2>📶 Cài đặt chấm công</h2><p>Cấu hình ca làm việc, nhận diện khuôn mặt bộ định tuyến WiFi và lương OT</p></div>
                <div class="set-section">
                    <div class="set-section-title">Ca làm việc & Chấm công WiFi</div>
                    <div class="set-form-grid">
                        <div class="form-group" style="grid-column:span 2"><label>Tên mạng WiFi nội bộ (dùng cho chấm công WiFi)</label><input type="text" id="set-wifi-ssid" placeholder="TiemMay_WiFi_5G" /></div>
                        <div class="form-group"><label>Giờ bắt đầu ca chính</label><input type="time" id="set-shift-start" value="07:30" /></div>
                        <div class="form-group"><label>Giờ kết thúc ca chính</label><input type="time" id="set-shift-end" value="17:00" /></div>
                        <div class="form-group"><label>Ngưỡng tính đi muộn (phút)</label><input type="number" id="set-late-threshold" value="15" min="0" max="60" /></div>
                        <div class="form-group"><label>Hệ số lương OT (x lương giờ)</label><input type="number" id="set-ot-rate" value="1.5" min="1" max="3" step="0.1" /></div>
                    </div>
                </div>

                <div class="set-section" style="margin-top:2rem;">
                    <div class="set-section-title">Nhận diện bằng khuôn mặt (AI Camera)</div>
                    <div class="set-form-grid">
                        <div class="form-group">
                            <label>Trạng thái Nhận diện</label>
                            <select id="set-face-status">
                                <option value="on">🟢 Bật (Khuyên dùng)</option>
                                <option value="off">🔴 Tắt</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Độ chính xác (Ngưỡng tin cậy)</label>
                            <select id="set-face-accuracy">
                                <option value="high">Cao (80%++ trùng khớp)</option>
                                <option value="medium" selected>Trung bình (60% trùng khớp)</option>
                                <option value="low">Thấp (Nhận diện nhanh)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Camera sử dụng mặc định</label>
                            <select id="set-face-camera">
                                <option value="user">Camera trước (Selfie)</option>
                                <option value="environment">Camera sau (Laptop/Phone)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Thời gian phân tích</label>
                            <select id="set-face-timeout">
                                <option value="2000">Nhanh (2 giây)</option>
                                <option value="3000" selected>Chuẩn (3 giây)</option>
                                <option value="5000">Chậm (5 giây)</option>
                            </select>
                        </div>
                    </div>
                    <div style="margin-top:2rem;text-align:right;"><button class="btn btn-primary" onclick="saveAttSettings()">💾 Lưu cài đặt chấm công</button></div>
                </div>
            </div>

            <!-- ══ TAB: GIAO DIỆN ══════════════════════════════════ -->
            <div class="set-panel" id="set-panel-ui">
                <div class="set-panel-header"><h2>🎨 Tùy chỉnh Giao diện</h2><p>Màu chủ đạo, tiền tệ và tùy chỉnh hiển thị</p></div>
                <div class="set-section">
                    <div class="set-section-title">Màu chủ đạo</div>
                    <div class="color-swatches" id="color-swatches" style="gap:1rem">
                        <div class="color-swatch active" data-color="purple" style="background:linear-gradient(135deg,#7c6af8,#5c4fd4)" onclick="setThemeColor('purple')"><span class="color-swatch-label">Tím</span></div>
                        <div class="color-swatch" data-color="teal" style="background:linear-gradient(135deg,#00c9c9,#008080)" onclick="setThemeColor('teal')"><span class="color-swatch-label">Ngọc</span></div>
                        <div class="color-swatch" data-color="pink" style="background:linear-gradient(135deg,#f05fa6,#c0357a)" onclick="setThemeColor('pink')"><span class="color-swatch-label">Hồng</span></div>
                        <div class="color-swatch" data-color="blue" style="background:linear-gradient(135deg,#3f9cf8,#1565c0)" onclick="setThemeColor('blue')"><span class="color-swatch-label">Biển</span></div>
                        <div class="color-swatch" data-color="orange" style="background:linear-gradient(135deg,#ff8c42,#e65c00)" onclick="setThemeColor('orange')"><span class="color-swatch-label">Cam</span></div>
                        <div class="color-swatch" data-color="green" style="background:linear-gradient(135deg,#3ddc84,#1a8a45)" onclick="setThemeColor('green')"><span class="color-swatch-label">Lá</span></div>
                    </div>
                </div>
                <div class="set-section" style="margin-top:2rem;">
                    <div class="set-section-title">Chế độ Hiển thị (Sáng / Tối)</div>
                    <select id="set-theme-mode" style="max-width:300px; padding:.75rem; border-radius:var(--radius-sm);" onchange="document.body.dataset.theme = this.value">
                        <option value="dark">🌙 Chế độ Tối (Nền đen)</option>
                        <option value="light">☀️ Chế độ Sáng (Nền trắng)</option>
                    </select>
                </div>
                <div class="set-section" style="margin-top:2rem;">
                    <div class="set-section-title">Tiền tệ hiển thị</div>
                    <select id="set-currency" style="max-width:300px; padding:.75rem; border-radius:var(--radius-sm);">
                        <option value="VND">₫ Việt Nam Đồng (VNĐ)</option>
                        <option value="USD">\$ US Dollar (USD)</option>
                    </select>
                </div>
                <div style="display:flex;gap:1rem;margin-top:2rem; justify-content:flex-end;">
                    <button class="btn btn-secondary" onclick="resetUiSettings()">↩️ Đặt lại</button>
                    <button class="btn btn-primary" onclick="saveUiSettings()">💾 Lưu giao diện</button>
                </div>
            </div>

            <!-- ══ TAB: DỮ LIỆU ════════════════════════════════════ -->
            <div class="set-panel" id="set-panel-data">
                <div class="set-panel-header"><h2>🗄️ Dữ liệu & Sao lưu</h2><p>Xuất, nhập, hoặc xóa toàn bộ dữ liệu trong ứng dụng</p></div>
                <div class="set-section">
                    <div class="set-data-grid">
                        <div class="set-data-card" onclick="exportAllData()">
                            <div class="set-data-icon">📥</div><div class="set-data-info"><div class="set-data-title">Xuất dữ liệu (JSON)</div><div class="set-data-desc">Tải về file backup — lưu trữ offline</div></div>
                        </div>
                        <div class="set-data-card" onclick="document.getElementById('import-file').click()">
                            <div class="set-data-icon">📤</div><div class="set-data-info"><div class="set-data-title">Nhập dữ liệu (JSON)</div><div class="set-data-desc">Khôi phục từ file backup, chép đè</div></div>
                        </div>
                        <div class="set-data-card danger" onclick="resetAllData()">
                            <div class="set-data-icon" style="color:var(--red);">⚠️</div><div class="set-data-info"><div class="set-data-title" style="color:var(--red)">Xóa toàn bộ dữ liệu</div><div class="set-data-desc">Không thể hoàn tác! Hãy xuất backup trước.</div></div>
                        </div>
                    </div>
                    <input type="file" id="import-file" accept=".json" style="display:none" onchange="importData(event)" />
                </div>
            </div>

            <!-- ══ TAB: BẢO MẬT ════════════════════════════════════ -->
            <div class="set-panel" id="set-panel-security">
                <div class="set-panel-header"><h2>🔒 Bảo mật & Phân quyền</h2><p>Thiết lập mật khẩu bảo vệ các mục quan trọng như Báo cáo và Cài đặt</p></div>
                <div class="set-section">
                    <div class="set-form-grid" style="max-width:500px">
                        <div class="form-group" style="grid-column:1/-1">
                            <label>Mật khẩu khóa ứng dụng (Để trống nếu không dùng)</label>
                            <input type="password" id="set-lock-pass" placeholder="Nhập mật khẩu..." />
                        </div>
                    </div>
                    <div style="margin-top:1.5rem; color:var(--text-muted); font-size:.85rem">
                        <p>💡 Khi được thiết lập, hệ thống sẽ yêu cầu mật khẩu này khi truy cập các trang: <strong>Kho, Báo cáo, Cài đặt</strong>.</p>
                    </div>
                    <div style="margin-top:2rem;text-align:right;"><button class="btn btn-primary" onclick="saveSecuritySettings()">💾 Lưu mật khẩu</button></div>
                </div>
            </div>

            <!-- ══ TAB: VỀ ỨNG DỤNG ═══════════════════════════════ -->
            <div class="set-panel" id="set-panel-about">
                <div class="set-panel-header"><h2>ℹ️ Về ứng dụng</h2><p>Thông tin phiên bản ứng dụng TiệmMay Pro</p></div>
                <div class="set-section" style="display:flex; justify-content:center; align-items:center; padding:3rem 0;">
                    <div class="set-about-card">
                        <div class="set-about-logo">🧵</div>
                        <div class="set-about-name">TiệmMay Pro</div>
                        <div class="set-about-tagline">Hệ thống Quản lý Tiệm may Chuyên nghiệp</div>
                        <div class="set-about-rows">
                            <div class="set-about-row"><span>📦 Phiên bản</span><strong>2.0.0</strong></div>
                            <div class="set-about-row"><span>📅 Cập nhật</span><strong>24/02/2026</strong></div>
                            <div class="set-about-row"><span>💾 Lưu trữ</span><strong id="set-storage-type">Local Offline</strong></div>
                            <div class="set-about-row"><span>🌐 Backend (Tùy chọn)</span><strong>Google Apps Script</strong></div>
                            <div class="set-about-row"><span>📁 Công nghệ</span><strong>Thuần túy (Vanilla HTML/JS)</strong></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
`;
document.getElementById('page-settings').innerHTML = html_settings;

