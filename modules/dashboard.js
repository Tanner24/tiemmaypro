// Module: dashboard
const html_dashboard = `
            <div class="page-header dashboard-header" style="display:flex; justify-content:space-between; align-items:flex-end;">
                <div>
                    <h1>Bảng điều khiển</h1>
                    <p class="page-subtitle">Tổng quan hoạt động tiệm may hôm nay</p>
                </div>
                <div class="date-widget" style="text-align:right; color:var(--text-secondary); font-size:0.9rem;">
                    <strong style="color:var(--text-primary); font-size:1.1rem;" id="board-date-display"></strong>
                    <br><span id="board-time-display"></span>
                </div>
            </div>

            <!-- Top Stats Banner -->
            <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 2rem;">
                <!-- Revenue -->
                <div class="stat-card" style="background:linear-gradient(145deg, rgba(124,106,248,0.1), rgba(0,0,0,0)); border: 1px solid rgba(124,106,248,0.3); padding: 1.5rem;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <div class="stat-label" style="text-transform:uppercase; letter-spacing:0.05em; font-size:0.75rem;">Doanh thu tháng này</div>
                            <div class="stat-value" id="stat-revenue" style="font-size:1.8rem; margin:0.5rem 0; color:var(--text-primary);">0 ₫</div>
                        </div>
                        <div class="stat-icon" style="background:rgba(124,106,248,0.2); padding:0.5rem; border-radius:var(--radius-sm); color:var(--purple-l); font-size:1.2rem;">💰</div>
                    </div>
                    <div class="stat-change up" style="display:flex; align-items:center; gap:0.25rem;"><span style="font-size:1rem;">↑</span> 12% so với tháng trước</div>
                </div>

                <!-- Orders -->
                <div class="stat-card" style="background:linear-gradient(145deg, rgba(63,156,248,0.1), rgba(0,0,0,0)); border: 1px solid rgba(63,156,248,0.3); padding: 1.5rem;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <div class="stat-label" style="text-transform:uppercase; letter-spacing:0.05em; font-size:0.75rem;">Đơn hàng đang xử lý</div>
                            <div class="stat-value" id="stat-orders" style="font-size:1.8rem; margin:0.5rem 0; color:var(--text-primary);">0</div>
                        </div>
                        <div class="stat-icon" style="background:rgba(63,156,248,0.2); padding:0.5rem; border-radius:var(--radius-sm); color:var(--blue); font-size:1.2rem;">📋</div>
                    </div>
                    <div class="stat-change up" style="display:flex; align-items:center; gap:0.25rem;"><span style="font-size:1rem;">↑</span> 5 đơn mới hôm nay</div>
                </div>
                
                <!-- Customers -->
                <div class="stat-card" style="background:linear-gradient(145deg, rgba(0,201,201,0.1), rgba(0,0,0,0)); border: 1px solid rgba(0,201,201,0.3); padding: 1.5rem;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <div class="stat-label" style="text-transform:uppercase; letter-spacing:0.05em; font-size:0.75rem;">Khách hàng</div>
                            <div class="stat-value" id="stat-customers" style="font-size:1.8rem; margin:0.5rem 0; color:var(--text-primary);">0</div>
                        </div>
                        <div class="stat-icon" style="background:rgba(0,201,201,0.2); padding:0.5rem; border-radius:var(--radius-sm); color:var(--teal); font-size:1.2rem;">👗</div>
                    </div>
                    <div class="stat-change up" style="display:flex; align-items:center; gap:0.25rem;"><span style="font-size:1rem;">↑</span> 3 khách mới</div>
                </div>

                <!-- Stock Alerts -->
                <div class="stat-card" style="background:linear-gradient(145deg, rgba(255,140,66,0.1), rgba(0,0,0,0)); border: 1px solid rgba(255,140,66,0.3); padding: 1.5rem;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <div class="stat-label" style="text-transform:uppercase; letter-spacing:0.05em; font-size:0.75rem;">Vật liệu sắp hết</div>
                            <div class="stat-value" id="stat-lowstock" style="font-size:1.8rem; margin:0.5rem 0; color:var(--text-primary);">0</div>
                        </div>
                        <div class="stat-icon" style="background:rgba(255,140,66,0.2); padding:0.5rem; border-radius:var(--radius-sm); color:var(--orange); font-size:1.2rem;">⚠️</div>
                    </div>
                    <div class="stat-change down" style="display:flex; align-items:center; gap:0.25rem; color:var(--orange);"><span style="font-size:1rem;">↓</span> Cần nhập thêm kho</div>
                </div>
            </div>

            <!-- Main Layout Grid -->
            <div class="dashboard-grid" style="grid-template-columns: 2fr 1fr; gap: 1.5rem;">
                
                <!-- Left Column -->
                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                    
                    <!-- Pipeline Section -->
                    <div class="card" style="border:1px solid rgba(255,255,255,0.05); background:linear-gradient(to bottom right, rgba(255,255,255,0.02), rgba(0,0,0,0.2));">
                        <div class="card-header" style="border-bottom:1px dashed rgba(255,255,255,0.1); padding: 1.25rem 1.75rem;">
                            <h3 style="font-size:1.1rem; display:flex; align-items:center; gap:0.5rem;">
                                <span style="background:rgba(255,255,255,0.1); padding:0.3rem 0.5rem; border-radius:var(--radius-sm); font-size:0.9rem;">📍</span>
                                Tiến độ Đơn hàng
                            </h3>
                        </div>
                        <div class="card-body" style="padding: 2rem 1.75rem;">
                            <div class="pipeline" style="display:flex; justify-content:space-between; align-items:center;">
                                <div class="pipeline-step" onclick="navigate('orders')" style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1rem; flex:1;">
                                    <div class="pipeline-count" id="pipe-new" style="color:#6c63ff; font-size:2rem;">0</div>
                                    <div class="pipeline-label" style="font-size:0.8rem; font-weight:600; text-transform:uppercase;">Mới nhận</div>
                                    <div class="pipeline-bar" style="background:linear-gradient(90deg, #6c63ff, transparent); height:4px; border-radius:99px; margin-top:0.75rem;"></div>
                                </div>
                                <div class="pipeline-arrow" style="font-size:1.5rem; color:var(--text-muted); padding:0 0.5rem;">›</div>
                                
                                <div class="pipeline-step" onclick="navigate('orders')" style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1rem; flex:1;">
                                    <div class="pipeline-count" id="pipe-cutting" style="color:#2196f3; font-size:2rem;">0</div>
                                    <div class="pipeline-label" style="font-size:0.8rem; font-weight:600; text-transform:uppercase;">Cắt vải</div>
                                    <div class="pipeline-bar" style="background:linear-gradient(90deg, #2196f3, transparent); height:4px; border-radius:99px; margin-top:0.75rem;"></div>
                                </div>
                                <div class="pipeline-arrow" style="font-size:1.5rem; color:var(--text-muted); padding:0 0.5rem;">›</div>
                                
                                <div class="pipeline-step" onclick="navigate('orders')" style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1rem; flex:1;">
                                    <div class="pipeline-count" id="pipe-sewing" style="color:#00bcd4; font-size:2rem;">0</div>
                                    <div class="pipeline-label" style="font-size:0.8rem; font-weight:600; text-transform:uppercase;">Đang may</div>
                                    <div class="pipeline-bar" style="background:linear-gradient(90deg, #00bcd4, transparent); height:4px; border-radius:99px; margin-top:0.75rem;"></div>
                                </div>
                                <div class="pipeline-arrow" style="font-size:1.5rem; color:var(--text-muted); padding:0 0.5rem;">›</div>
                                
                                <div class="pipeline-step" onclick="navigate('orders')" style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1rem; flex:1;">
                                    <div class="pipeline-count" id="pipe-fitting" style="color:#ff9800; font-size:2rem;">0</div>
                                    <div class="pipeline-label" style="font-size:0.8rem; font-weight:600; text-transform:uppercase;">Thử đồ</div>
                                    <div class="pipeline-bar" style="background:linear-gradient(90deg, #ff9800, transparent); height:4px; border-radius:99px; margin-top:0.75rem;"></div>
                                </div>
                                <div class="pipeline-arrow" style="font-size:1.5rem; color:var(--text-muted); padding:0 0.5rem;">›</div>
                                
                                <div class="pipeline-step" onclick="navigate('orders')" style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1rem; flex:1;">
                                    <div class="pipeline-count" id="pipe-done" style="color:#4caf50; font-size:2rem;">0</div>
                                    <div class="pipeline-label" style="font-size:0.8rem; font-weight:600; text-transform:uppercase;">Hoàn thành</div>
                                    <div class="pipeline-bar" style="background:linear-gradient(90deg, #4caf50, transparent); height:4px; border-radius:99px; margin-top:0.75rem;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Upcoming Deadlines -->
                    <div class="card" style="border:1px solid rgba(255,255,255,0.05);">
                        <div class="card-header" style="border-bottom:1px dashed rgba(255,255,255,0.1); padding: 1.25rem 1.75rem;">
                            <h3 style="font-size:1.1rem; display:flex; align-items:center; gap:0.5rem;">
                                <span style="background:rgba(255,255,255,0.1); padding:0.3rem 0.5rem; border-radius:var(--radius-sm); font-size:0.9rem;">⏰</span>
                                Đơn hàng sắp đến hạn
                            </h3>
                            <button class="btn btn-sm btn-secondary" onclick="navigate('orders')">Xem tất cả ›</button>
                        </div>
                        <div class="card-body" style="padding: 1.5rem 1.75rem;">
                            <div id="upcoming-orders-list" class="deadline-list">
                                <!-- JS items injected here -->
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Right Column -->
                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                    
                    <!-- Low Stock Alerts -->
                    <div class="card" style="border:1px solid rgba(255,140,66,0.3); background:rgba(255,140,66,0.02);">
                        <div class="card-header" style="border-bottom:1px dashed rgba(255,140,66,0.2); padding: 1.25rem 1.75rem;">
                            <h3 style="font-size:1.1rem; color:var(--orange); display:flex; align-items:center; gap:0.5rem;">
                                ⚠️ Cảnh báo kho
                            </h3>
                            <button class="btn btn-sm" onclick="navigate('inventory')" style="background:rgba(255,140,66,0.1); color:var(--orange); border:none;">Kiểm tra ›</button>
                        </div>
                        <div class="card-body" style="padding: 1.5rem 1.75rem;">
                            <div id="low-stock-list" class="stock-alerts">
                                <!-- JS items injected here -->
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activities -->
                    <div class="card" style="border:1px solid rgba(255,255,255,0.05); flex:1;">
                        <div class="card-header" style="border-bottom:1px dashed rgba(255,255,255,0.1); padding: 1.25rem 1.75rem;">
                            <h3 style="font-size:1.1rem; display:flex; align-items:center; gap:0.5rem;">
                                <span style="background:rgba(255,255,255,0.1); padding:0.3rem 0.5rem; border-radius:var(--radius-sm); font-size:0.9rem;">🕒</span>
                                Hoạt động gần đây
                            </h3>
                        </div>
                        <div class="card-body" style="padding: 1.5rem 1.75rem;">
                            <div id="recent-activities" class="activity-list" style="position:relative; padding-left:1.5rem;">
                                <div style="position:absolute; left:7px; top:0; bottom:0; width:2px; background:rgba(255,255,255,0.05);"></div>
                                <!-- JS items injected here -->
                                <div style="color:var(--text-muted); font-size:0.85rem; padding:1rem 0;">Tính năng đang cập nhật...</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            <script>
                // Format the real date to display on dashboard load
                setTimeout(() => {
                    const now = new Date();
                    const days = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
                    document.getElementById('board-date-display').innerText = days[now.getDay()] + ', ' + now.getDate() + ' tháng ' + (now.getMonth() + 1);
                    
                    const timeInt = setInterval(()=>{
                        const t = new Date();
                        const el = document.getElementById('board-time-display');
                        if(el) el.innerText = t.toLocaleTimeString('vi-VN');
                        else clearInterval(timeInt);
                    }, 1000);
                }, 500);
            </script>
        `;
document.getElementById('page-dashboard').innerHTML = html_dashboard;
