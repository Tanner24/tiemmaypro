const html_modal_update_order = `    <!-- Modal: Cập nhật tiến độ đơn hàng -->
    <div class="modal-overlay" id="modal-update-order" onclick="closeModalIfBg(event,'modal-update-order')">
        <div class="modal">
            <div class="modal-header">
                <h2>🔄 Cập nhật tiến độ đơn hàng</h2>
                <button class="modal-close" onclick="closeModal('modal-update-order')">✕</button>
            </div>
            <div class="modal-body">
                <div id="update-order-info" class="order-info-panel"></div>
                <div class="form-group" style="margin-top:1rem">
                    <label>Trạng thái mới</label>
                    <select id="update-order-status">
                        <option>Mới tiếp nhận</option>
                        <option>Thiết kế rập</option>
                        <option>Đang cắt vải</option>
                        <option>May thô</option>
                        <option>Thử đồ</option>
                        <option>May hoàn thiện</option>
                        <option>Kiểm tra QC</option>
                        <option>Hoàn thành</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Ghi chú tiến độ</label>
                    <textarea id="update-order-note" rows="3" placeholder="Ghi chú điều chỉnh, lưu ý..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('modal-update-order')">Hủy</button>
                <button class="btn btn-primary" onclick="updateOrderStatus()">✅ Cập nhật</button>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', html_modal_update_order);
