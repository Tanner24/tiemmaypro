const html_modal_add_supplier = `    <!-- Modal: Nhà cung cấp -->
    <div class="modal-overlay" id="modal-add-supplier" onclick="closeModalIfBg(event,'modal-add-supplier')">
        <div class="modal">
            <div class="modal-header">
                <h2>🏭 Thêm nhà cung cấp</h2>
                <button class="modal-close" onclick="closeModal('modal-add-supplier')">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Tên nhà cung cấp *</label>
                        <input type="text" id="sup-name" placeholder="Công ty Vải ABC..." />
                    </div>
                    <div class="form-group">
                        <label>Mặt hàng cung cấp</label>
                        <input type="text" id="sup-goods" placeholder="Vải linen, Chỉ may..." />
                    </div>
                    <div class="form-group">
                        <label>Số điện thoại</label>
                        <input type="tel" id="sup-phone" placeholder="0901 234 567" />
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="sup-email" placeholder="nhacc@email.com" />
                    </div>
                    <div class="form-group">
                        <label>Địa chỉ</label>
                        <input type="text" id="sup-address" placeholder="123 Đường May, Quận 5..." />
                    </div>
                    <div class="form-group">
                        <label>Đánh giá (1-5 ⭐)</label>
                        <select id="sup-rating">
                            <option value="5">⭐⭐⭐⭐⭐ Xuất sắc</option>
                            <option value="4">⭐⭐⭐⭐ Tốt</option>
                            <option value="3">⭐⭐⭐ Khá</option>
                            <option value="2">⭐⭐ Trung bình</option>
                            <option value="1">⭐ Kém</option>
                        </select>
                    </div>
                    <div class="form-group full-width">
                        <label>Ghi chú đánh giá</label>
                        <textarea id="sup-note" rows="2"
                            placeholder="Giao hàng đúng hẹn, chất lượng ổn định..."></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('modal-add-supplier')">Hủy</button>
                <button class="btn btn-primary" onclick="saveSupplier()">💾 Lưu nhà cung cấp</button>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', html_modal_add_supplier);
