const html_modal_add_order = `    <!-- Modal: Tạo đơn hàng -->
    <div class="modal-overlay" id="modal-add-order" onclick="closeModalIfBg(event,'modal-add-order')">
        <div class="modal modal-wide">
            <div class="modal-header">
                <h2>📋 Tạo đơn hàng may đo</h2>
                <button class="modal-close" onclick="closeModal('modal-add-order')">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Khách hàng *</label>
                        <select id="order-customer">
                            <option value="">-- Chọn khách hàng --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Loại trang phục *</label>
                        <select id="order-type">
                            <option>Áo dài</option>
                            <option>Vest nam</option>
                            <option>Đầm cưới</option>
                            <option>Đầm dự tiệc</option>
                            <option>Áo sơ mi</option>
                            <option>Quần tây</option>
                            <option>Áo khoác</option>
                            <option>Đồng phục</option>
                            <option>Khác</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Vải sử dụng</label>
                        <select id="order-fabric">
                            <option value="">-- Chọn vải từ kho --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Mục đích sử dụng</label>
                        <select id="order-purpose">
                            <option>Đi tiệc</option>
                            <option>Công sở</option>
                            <option>Cưới hỏi</option>
                            <option>Thường ngày</option>
                            <option>Biểu diễn</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ngày nhận đơn</label>
                        <input type="date" id="order-date" />
                    </div>
                    <div class="form-group">
                        <label>Ngày hẹn thử đồ</label>
                        <input type="date" id="order-fitting-date" />
                    </div>
                    <div class="form-group">
                        <label>Ngày giao hàng *</label>
                        <input type="date" id="order-delivery-date" />
                    </div>
                    <div class="form-group">
                        <label>Thợ may phụ trách</label>
                        <input type="text" id="order-tailor" placeholder="Tên thợ may..." />
                    </div>
                    <div class="form-group">
                        <label>Tổng tiền (₫) *</label>
                        <input type="number" id="order-total" placeholder="0" min="0" />
                    </div>
                    <div class="form-group">
                        <label>Tiền cọc (₫)</label>
                        <input type="number" id="order-deposit" placeholder="0" min="0" />
                    </div>
                    <div class="form-group">
                        <label>Trạng thái ban đầu</label>
                        <select id="order-status">
                            <option>Mới tiếp nhận</option>
                            <option>Thiết kế rập</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ưu tiên</label>
                        <select id="order-priority">
                            <option value="normal">Bình thường</option>
                            <option value="high">Ưu tiên cao</option>
                            <option value="urgent">Khẩn cấp</option>
                        </select>
                    </div>
                    <div class="form-group full-width">
                        <label>Hình mẫu / Ảnh khách hàng (Gửi lên Google Drive)</label>
                        <div style="display:flex;gap:1rem;align-items:center;">
                            <input type="file" id="order-image-input" accept="image/*" style="display:none" onchange="previewOrderImage(event)" />
                            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('order-image-input').click()">🖼️ Chọn ảnh</button>
                            <div id="order-image-preview" style="width:60px;height:60px;border-radius:8px;background:#1a2040;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px dashed var(--purple-l)">
                                <span style="font-size:1.5rem">📸</span>
                            </div>
                            <div id="order-image-status" style="font-size:.8rem;color:var(--text-muted)">Chưa có ảnh</div>
                        </div>
                    </div>
                    <div class="form-group full-width">
                        <label>Mô tả / Yêu cầu kỹ thuật</label>
                        <textarea id="order-desc" rows="3"
                            placeholder="Mẫu thiết kế, màu sắc, chi tiết trang trí, yêu cầu đặc biệt..."></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('modal-add-order')">Hủy</button>
                <button class="btn btn-primary" onclick="saveOrder()">📋 Tạo đơn hàng</button>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', html_modal_add_order);
