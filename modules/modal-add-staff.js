const html_modal_add_staff = `    <!-- Modal: Thêm nhân viên -->
    <div class="modal-overlay" id="modal-add-staff" onclick="closeModalIfBg(event,'modal-add-staff')">
        <div class="modal modal-wide">
            <div class="modal-header">
                <h2>👷 Thêm / Sửa hồ sơ Thợ may</h2>
                <button class="modal-close" onclick="closeModal('modal-add-staff')">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Họ và tên *</label>
                        <input type="text" id="staff-name" placeholder="Nguyễn Văn An" />
                    </div>
                    <div class="form-group">
                        <label>Mã nhân viên</label>
                        <input type="text" id="staff-code" placeholder="NV001 (tự tạo nếu để trống)" />
                    </div>
                    <div class="form-group">
                        <label>Số điện thoại</label>
                        <input type="tel" id="staff-phone" placeholder="0901 234 567" />
                    </div>
                    <div class="form-group">
                        <label>Chuyên môn</label>
                        <select id="staff-skill">
                            <option>Thợ may chính</option>
                            <option>Thợ cắt</option>
                            <option>Thợ thêu</option>
                            <option>Thợ hoàn thiện</option>
                            <option>Thợ học việc</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ca làm việc</label>
                        <select id="staff-shift">
                            <option value="07:30-17:00">Ca ngày: 07:30 – 17:00</option>
                            <option value="08:00-17:30">Ca sáng: 08:00 – 17:30</option>
                            <option value="13:00-21:00">Ca chiều: 13:00 – 21:00</option>
                            <option value="flexible">Ca linh hoạt</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Lương theo giờ (₫)</label>
                        <input type="number" id="staff-hourly" placeholder="25000" min="0" />
                    </div>
                    <div class="form-group">
                        <label>Ngày bắt đầu</label>
                        <input type="date" id="staff-start" />
                    </div>
                    
                    <!-- BIOMETRICS & ID SECTION -->
                    <div class="form-group full-width" style="background:var(--bg-layer-2); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border)">
                        <label style="margin-bottom:0.75rem; color:var(--text-main); font-size:1.05rem; border-bottom:1px solid var(--border); padding-bottom:0.5rem; display:block">🔐 Dữ liệu Định Danh & Sinh trắc học</label>
                        
                        <div class="form-grid" style="grid-template-columns: 1fr 1fr; gap:1rem;">
                            <div class="form-group" style="margin-bottom:0">
                                <label style="font-size:0.85rem; font-weight:normal; color:var(--text-muted)">Mã QR Thẻ cứng</label>
                                <input type="text" id="staff-qr" placeholder="Mở khóa QR (tự sinh)" />
                            </div>
                            <div class="form-group" style="margin-bottom:0">
                                <label style="font-size:0.85rem; font-weight:normal; color:var(--text-muted)">Dữ liệu Khuôn mặt (Face ID)</label>
                                <div style="display:flex; gap:0.5rem">
                                    <input type="text" id="staff-face-id" readonly placeholder="Chưa có dữ liệu" style="background:var(--bg); cursor:not-allowed; flex:1" />
                                    <button type="button" class="btn btn-secondary" id="btn-scan-face-id" onclick="captureFaceId()" style="white-space:nowrap; padding: 0.5rem 0.75rem;" title="Quét khuôn mặt qua Camera trực tiếp">📷 Chụp</button>
                                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('staff-face-upload').click()" style="white-space:nowrap; padding: 0.5rem 0.75rem;" title="Tải ảnh chân dung từ máy tính">📁 Tải ảnh</button>
                                    <input type="file" id="staff-face-upload" accept="image/png, image/jpeg, image/jpg" style="display:none" onchange="handleFaceUpload(event)" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>WiFi MAC Address</label>
                        <input type="text" id="staff-mac" placeholder="AA:BB:CC:DD:EE:FF" />
                    </div>
                    <div class="form-group">
                        <label>Trạng thái</label>
                        <select id="staff-status">
                            <option value="active">Đang làm việc</option>
                            <option value="inactive">Nghỉ việc</option>
                        </select>
                    </div>
                    <div class="form-group full-width">
                        <label>Ghi chú</label>
                        <textarea id="staff-note" rows="2" placeholder="Kỹ năng đặc biệt, lưu ý..."></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('modal-add-staff')">Hủy</button>
                <button class="btn btn-primary" onclick="saveStaff()">💾 Lưu nhân viên</button>
            </div>
        </div>
    </div>

`;
document.body.insertAdjacentHTML('beforeend', html_modal_add_staff);
