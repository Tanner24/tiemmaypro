// Module: qc
const html_qc = `
            <div class="page-header">
                <h1>✅ Kiểm soát Chất lượng (QC)</h1>
                <p class="page-subtitle">Giai đoạn 4: Kiểm tra đường may, thông số và hoàn thiện trước bàn giao</p>
            </div>

            <div class="qc-grid">
                <div class="card">
                    <div class="card-header">
                        <h3>Đơn hàng chờ kiểm tra QC</h3>
                    </div>
                    <div class="card-body" id="qc-pending-list"></div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3>Tiêu chuẩn Kiểm tra</h3>
                    </div>
                    <div class="card-body">
                        <div class="qc-checklist-standard">
                            <div class="qc-std-item">
                                <span class="qc-std-icon">📏</span>
                                <div>
                                    <div class="qc-std-title">Đường may</div>
                                    <div class="qc-std-desc">Đều, thẳng, không bỏ mũi, không nhăn nhúm</div>
                                </div>
                            </div>
                            <div class="qc-std-item">
                                <span class="qc-std-icon">📐</span>
                                <div>
                                    <div class="qc-std-title">Thông số kích thước</div>
                                    <div class="qc-std-desc">Khớp với số đo đã điều chỉnh sau buổi fitting</div>
                                </div>
                            </div>
                            <div class="qc-std-item">
                                <span class="qc-std-icon">🧹</span>
                                <div>
                                    <div class="qc-std-title">Vệ sinh công nghiệp</div>
                                    <div class="qc-std-desc">Sạch chỉ thừa, không có vết phấn vẽ hay vết bẩn</div>
                                </div>
                            </div>
                            <div class="qc-std-item">
                                <span class="qc-std-icon">👔</span>
                                <div>
                                    <div class="qc-std-title">Ủi / Lả</div>
                                    <div class="qc-std-desc">Phẳng phiu, các đường ly sắc nét, giữ đúng form dáng</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-top:1.5rem">
                <div class="card-header">
                    <h3>Lịch sử kiểm tra QC</h3>
                </div>
                <div class="card-body">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Mã ĐH</th>
                                    <th>Khách hàng</th>
                                    <th>Ngày kiểm tra</th>
                                    <th>Đường may</th>
                                    <th>Thông số</th>
                                    <th>Vệ sinh</th>
                                    <th>Ủi lả</th>
                                    <th>Kết quả</th>
                                    <th>Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody id="qc-history-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
document.getElementById('page-qc').innerHTML = html_qc;
