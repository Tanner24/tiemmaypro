// Module: orders
const html_orders = `
            <div class="page-header">
                <h1>📋 Đơn hàng Sản xuất</h1>
                <p class="page-subtitle">Giai đoạn 3: Theo dõi tiến độ từ thiết kế rập đến may hoàn thiện</p>
            </div>
            <div class="toolbar">
                <div class="search-bar">
                    <span>🔍</span>
                    <input type="text" id="order-search" placeholder="Tìm theo mã ĐH, tên khách..."
                        oninput="filterOrders()" />
                </div>
                <div class="filter-group">
                    <select id="order-filter-status" onchange="filterOrders()">
                        <option value="">Tất cả trạng thái</option>
                        <option value="Mới tiếp nhận">Mới tiếp nhận</option>
                        <option value="Thiết kế rập">Thiết kế rập</option>
                        <option value="Đang cắt vải">Đang cắt vải</option>
                        <option value="May thô">May thô</option>
                        <option value="Thử đồ">Thử đồ</option>
                        <option value="May hoàn thiện">May hoàn thiện</option>
                        <option value="Kiểm tra QC">Kiểm tra QC</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="openModal('modal-add-order')">+ Tạo đơn hàng</button>
            </div>

            <div class="table-wrapper">
                <table class="data-table" id="orders-table">
                    <thead>
                        <tr>
                            <th>Mã ĐH</th>
                            <th>Khách hàng</th>
                            <th>Loại trang phục</th>
                            <th>Vải</th>
                            <th>Ngày nhận</th>
                            <th>Ngày thử đồ</th>
                            <th>Ngày giao</th>
                            <th>Cọc</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="orders-body"></tbody>
                </table>
            </div>
        `;
document.getElementById('page-orders').innerHTML = html_orders;
