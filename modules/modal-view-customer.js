const html_modal_view_customer = `    <!-- Modal: Xem hồ sơ khách hàng -->
    <div class="modal-overlay" id="modal-view-customer" onclick="closeModalIfBg(event,'modal-view-customer')">
        <div class="modal modal-wide">
            <div class="modal-header">
                <h2>👗 Hồ sơ khách hàng</h2>
                <button class="modal-close" onclick="closeModal('modal-view-customer')">✕</button>
            </div>
            <div class="modal-body" id="customer-profile-body"></div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('modal-view-customer')">Đóng</button>
                <button class="btn btn-primary" onclick="createOrderFromCustomer()">📋 Tạo đơn hàng mới</button>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', html_modal_view_customer);
