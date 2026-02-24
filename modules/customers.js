// Module: customers
const html_customers = `
            <div class="page-header">
                <h1>👗 Khách hàng & Số đo</h1>
                <p class="page-subtitle">Giai đoạn 2: Hồ sơ khách hàng, số đo và lịch sử đặt hàng</p>
            </div>
            <div class="toolbar">
                <div class="search-bar">
                    <span>🔍</span>
                    <input type="text" id="cust-search" placeholder="Tìm theo tên, SĐT..."
                        oninput="filterCustomers()" />
                </div>
                <button class="btn btn-primary" onclick="openModal('modal-add-customer')">+ Thêm khách hàng</button>
            </div>

            <div id="customer-cards" class="customer-grid"></div>
        `;
document.getElementById('page-customers').innerHTML = html_customers;
