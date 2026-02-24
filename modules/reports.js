// Module: reports
const html_reports = `
            <div class="page-header">
                <h1>📈 Báo cáo Doanh thu</h1>
                <p class="page-subtitle">Phân tích hiệu suất kinh doanh theo thời gian</p>
            </div>

            <div class="report-filter">
                <select id="report-period" onchange="renderReports()">
                    <option value="month">Tháng này</option>
                    <option value="quarter">Quý này</option>
                    <option value="year">Năm nay</option>
                </select>
            </div>

            <div class="stats-grid">
                <div class="stat-card stat-purple">
                    <div class="stat-icon">💰</div>
                    <div class="stat-body">
                        <div class="stat-value" id="rpt-revenue">0 ₫</div>
                        <div class="stat-label">Tổng doanh thu</div>
                    </div>
                </div>
                <div class="stat-card stat-blue">
                    <div class="stat-icon">📋</div>
                    <div class="stat-body">
                        <div class="stat-value" id="rpt-orders">0</div>
                        <div class="stat-label">Đơn hàng hoàn thành</div>
                    </div>
                </div>
                <div class="stat-card stat-teal">
                    <div class="stat-icon">📊</div>
                    <div class="stat-body">
                        <div class="stat-value" id="rpt-avg">0 ₫</div>
                        <div class="stat-label">Giá trị trung bình / đơn</div>
                    </div>
                </div>
                <div class="stat-card stat-orange">
                    <div class="stat-icon">🔄</div>
                    <div class="stat-body">
                        <div class="stat-value" id="rpt-return">0%</div>
                        <div class="stat-label">Tỷ lệ khách quay lại</div>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid" style="grid-template-columns:1fr 1fr">
                <div class="card">
                    <div class="card-header">
                        <h3>Top sản phẩm bán chạy</h3>
                    </div>
                    <div class="card-body" id="top-products"></div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3>Phân bố trạng thái đơn hàng</h3>
                    </div>
                    <div class="card-body" id="order-distribution"></div>
                </div>
            </div>
        `;
document.getElementById('page-reports').innerHTML = html_reports;
