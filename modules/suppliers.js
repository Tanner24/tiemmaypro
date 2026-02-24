// Module: suppliers
const html_suppliers = `
            <div class="page-header">
                <h1>🏭 Nhà cung cấp</h1>
                <p class="page-subtitle">Danh sách nhà cung cấp vải và phụ liệu đã đánh giá</p>
            </div>
            <div class="toolbar">
                <div class="search-bar">
                    <span>🔍</span>
                    <input type="text" id="sup-search" placeholder="Tìm theo tên, mặt hàng..."
                        oninput="filterSuppliers()" />
                </div>
                <button class="btn btn-primary" onclick="openModal('modal-add-supplier')">+ Thêm nhà cung cấp</button>
            </div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Mã NCC</th>
                            <th>Tên nhà cung cấp</th>
                            <th>Mặt hàng cung cấp</th>
                            <th>SĐT</th>
                            <th>Email</th>
                            <th>Địa chỉ</th>
                            <th>Đánh giá</th>
                            <th>Tổng đơn hàng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="suppliers-body"></tbody>
                </table>
            </div>
        `;
document.getElementById('page-suppliers').innerHTML = html_suppliers;
