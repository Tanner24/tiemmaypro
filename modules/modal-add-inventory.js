const html_modal_add_inventory = `    <!-- Modal: Nhập kho -->
    <div class="modal-overlay" id="modal-add-inventory" onclick="closeModalIfBg(event,'modal-add-inventory')">
        <div class="modal">
            <div class="modal-header">
                <h2>📦 Nhập kho nguyên phụ liệu</h2>
                <button class="modal-close" onclick="closeModal('modal-add-inventory')">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Tên vật liệu *</label>
                        <input type="text" id="inv-name" placeholder="VD: Vải linen trắng..." />
                    </div>
                    <div class="form-group">
                        <label>Loại *</label>
                        <select id="inv-type">
                            <option>Vải</option>
                            <option>Chỉ</option>
                            <option>Phụ liệu</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Chất liệu</label>
                        <input type="text" id="inv-material" placeholder="Linen, Silk, Wool, Cotton..." />
                    </div>
                    <div class="form-group">
                        <label>Màu sắc</label>
                        <input type="text" id="inv-color" placeholder="Trắng, Đen, Xanh navy..." />
                    </div>
                    <div class="form-group">
                        <label>Số lượng *</label>
                        <input type="number" id="inv-qty" placeholder="0" min="0" />
                    </div>
                    <div class="form-group">
                        <label>Đơn vị *</label>
                        <select id="inv-unit">
                            <option>mét</option>
                            <option>cuộn</option>
                            <option>cái</option>
                            <option>kg</option>
                            <option>hộp</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ngưỡng cảnh báo tồn kho</label>
                        <input type="number" id="inv-threshold" placeholder="10" min="0" />
                    </div>
                    <div class="form-group">
                        <label>Giá nhập (₫/đơn vị)</label>
                        <input type="number" id="inv-price" placeholder="0" min="0" />
                    </div>
                    <div class="form-group">
                        <label>Nhà cung cấp</label>
                        <select id="inv-supplier-select">
                            <option value="">-- Chọn NCC --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Vị trí lưu kho</label>
                        <input type="text" id="inv-location" placeholder="Kệ A1, Ngăn 2..." />
                    </div>
                    <div class="form-group full-width">
                        <label>Ghi chú</label>
                        <textarea id="inv-note" rows="2" placeholder="Lỗi dệt, ghi chú đặc biệt..."></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('modal-add-inventory')">Hủy</button>
                <button class="btn btn-primary" onclick="saveInventory()">💾 Lưu vào kho</button>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', html_modal_add_inventory);
