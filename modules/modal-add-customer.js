const html_modal_add_customer = `    <!-- Modal: Thêm khách hàng -->
    <div class="modal-overlay" id="modal-add-customer" onclick="closeModalIfBg(event,'modal-add-customer')">
        <div class="modal modal-wide">
            <div class="modal-header">
                <h2>👗 Thêm / Sửa hồ sơ khách hàng</h2>
                <button class="modal-close" onclick="closeModal('modal-add-customer')">✕</button>
            </div>
            <div class="modal-body">
                <div class="modal-section-title">Thông tin cá nhân</div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Họ và tên *</label>
                        <input type="text" id="cust-name" placeholder="Nguyễn Thị Lan" />
                    </div>
                    <div class="form-group">
                        <label>Số điện thoại *</label>
                        <input type="tel" id="cust-phone" placeholder="0901 234 567" />
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="cust-email" placeholder="khachhang@email.com" />
                    </div>
                    <div class="form-group">
                        <label>Ngày sinh</label>
                        <input type="date" id="cust-dob" />
                    </div>
                    <div class="form-group full-width">
                        <label>Địa chỉ</label>
                        <input type="text" id="cust-address" placeholder="123 Đường ABC, Quận 1, TP.HCM" />
                    </div>
                </div>

                <div class="modal-section-title" style="margin-top:1.5rem">Số đo (cm)</div>
                <div class="measurements-grid">
                    <div class="form-group">
                        <label>Ngực</label>
                        <input type="number" id="m-chest" placeholder="90" step="0.5" />
                    </div>
                    <div class="form-group">
                        <label>Eo</label>
                        <input type="number" id="m-waist" placeholder="70" step="0.5" />
                    </div>
                    <div class="form-group">
                        <label>Hông</label>
                        <input type="number" id="m-hip" placeholder="95" step="0.5" />
                    </div>
                    <div class="form-group">
                        <label>Vai</label>
                        <input type="number" id="m-shoulder" placeholder="38" step="0.5" />
                    </div>
                    <div class="form-group">
                        <label>Dài tay</label>
                        <input type="number" id="m-sleeve" placeholder="58" step="0.5" />
                    </div>
                    <div class="form-group">
                        <label>Dài lưng</label>
                        <input type="number" id="m-back" placeholder="40" step="0.5" />
                    </div>
                    <div class="form-group">
                        <label>Dài váy/quần</label>
                        <input type="number" id="m-length" placeholder="100" step="0.5" />
                    </div>
                    <div class="form-group">
                        <label>Chiều cao</label>
                        <input type="number" id="m-height" placeholder="160" step="0.5" />
                    </div>
                </div>

                <div class="modal-section-title" style="margin-top:1.5rem">Đặc điểm hình thể đặc biệt</div>
                <div class="form-group">
                    <textarea id="cust-bodyfeatures" rows="2"
                        placeholder="Vai lệch, lưng tôm, bụng to, tay dài... (ghi chú để thợ may lưu ý)"></textarea>
                </div>
                <div class="form-group">
                    <label>Sở thích / Yêu cầu đặc biệt</label>
                    <textarea id="cust-preferences" rows="2"
                        placeholder="Thích vải nhẹ, không mặc màu đỏ, ưa kiểu cổ V..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('modal-add-customer')">Hủy</button>
                <button class="btn btn-primary" onclick="saveCustomer()">💾 Lưu hồ sơ</button>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', html_modal_add_customer);
