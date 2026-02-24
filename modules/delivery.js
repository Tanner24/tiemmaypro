// Module: delivery
const html_delivery = `
            <div class="page-header">
                <h1>🛍 Giao hàng & Thanh toán</h1>
                <p class="page-subtitle">Giai đoạn 5: Thử đồ lần cuối, đóng gói và chăm sóc sau bán hàng</p>
            </div>

            <div class="toolbar">
                <div class="search-bar">
                    <span>🔍</span>
                    <input type="text" id="del-search" placeholder="Tìm mã đơn hàng..." oninput="filterDelivery()" />
                </div>
                <div class="filter-group">
                    <select id="del-filter" onchange="filterDelivery()">
                        <option value="">Tất cả</option>
                        <option value="Chờ giao">Chờ giao</option>
                        <option value="Đã giao">Đã giao</option>
                    </select>
                </div>
            </div>

            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Mã ĐH</th>
                            <th>Khách hàng</th>
                            <th>SĐT</th>
                            <th>Sản phẩm</th>
                            <th>Tổng tiền</th>
                            <th>Đã cọc</th>
                            <th>Còn lại</th>
                            <th>Ngày hẹn giao</th>
                            <th>Trạng thái</th>
                            <th>Hậu mãi</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="delivery-body"></tbody>
                </table>
            </div>
        `;
document.getElementById('page-delivery').innerHTML = html_delivery;
