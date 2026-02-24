// Module: inventory
const html_inventory = `
            <div class="page-header">
                <h1>🧵 Kho Nguyên Phụ Liệu</h1>
                <p class="page-subtitle">Giai đoạn 1: Quản lý vải, chỉ, nút và các phụ liệu</p>
            </div>
            <div class="toolbar">
                <div class="search-bar">
                    <span>🔍</span>
                    <input type="text" id="inv-search" placeholder="Tìm kiếm theo tên, chất liệu..."
                        oninput="filterInventory()" />
                </div>
                <div class="filter-group">
                    <select id="inv-filter-type" onchange="filterInventory()">
                        <option value="">Tất cả loại</option>
                        <option value="Vải">Vải</option>
                        <option value="Chỉ">Chỉ</option>
                        <option value="Phụ liệu">Phụ liệu</option>
                    </select>
                    <select id="inv-filter-status" onchange="filterInventory()">
                        <option value="">Tất cả trạng thái</option>
                        <option value="Đủ hàng">Đủ hàng</option>
                        <option value="Sắp hết">Sắp hết</option>
                        <option value="Hết hàng">Hết hàng</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="openModal('modal-add-inventory')">+ Nhập kho</button>
            </div>

            <div class="table-wrapper">
                <table class="data-table" id="inventory-table">
                    <thead>
                        <tr>
                            <th>Mã SP</th>
                            <th>Tên vật liệu</th>
                            <th>Loại</th>
                            <th>Chất liệu</th>
                            <th>Màu sắc</th>
                            <th>Tồn kho</th>
                            <th>Đơn vị</th>
                            <th>Giá nhập</th>
                            <th>Trạng thái</th>
                            <th>Nhà cung cấp</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="inventory-body"></tbody>
                </table>
            </div>
        `;
document.getElementById('page-inventory').innerHTML = html_inventory;
