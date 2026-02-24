const html_modal_qc = `    <!-- Modal: QC Checklist -->
    <div class="modal-overlay" id="modal-qc" onclick="closeModalIfBg(event,'modal-qc')">
        <div class="modal">
            <div class="modal-header">
                <h2>✅ Kiểm tra chất lượng QC</h2>
                <button class="modal-close" onclick="closeModal('modal-qc')">✕</button>
            </div>
            <div class="modal-body">
                <div id="qc-order-info" class="order-info-panel"></div>
                <div class="qc-checklist" style="margin-top:1rem">
                    <div class="qc-item">
                        <div class="qc-item-info">
                            <span class="qc-item-icon">📏</span>
                            <div>
                                <div class="qc-item-title">Đường may</div>
                                <div class="qc-item-desc">Đều, thẳng, không bỏ mũi, không nhăn nhúm</div>
                            </div>
                        </div>
                        <div class="qc-toggle-group">
                            <label class="qc-radio"><input type="radio" name="qc-seam" value="Đạt" /> Đạt</label>
                            <label class="qc-radio"><input type="radio" name="qc-seam" value="Không đạt" /> Không
                                đạt</label>
                        </div>
                    </div>
                    <div class="qc-item">
                        <div class="qc-item-info">
                            <span class="qc-item-icon">📐</span>
                            <div>
                                <div class="qc-item-title">Thông số kích thước</div>
                                <div class="qc-item-desc">Khớp với số đo đã điều chỉnh sau buổi fitting</div>
                            </div>
                        </div>
                        <div class="qc-toggle-group">
                            <label class="qc-radio"><input type="radio" name="qc-size" value="Đạt" /> Đạt</label>
                            <label class="qc-radio"><input type="radio" name="qc-size" value="Không đạt" /> Không
                                đạt</label>
                        </div>
                    </div>
                    <div class="qc-item">
                        <div class="qc-item-info">
                            <span class="qc-item-icon">🧹</span>
                            <div>
                                <div class="qc-item-title">Vệ sinh công nghiệp</div>
                                <div class="qc-item-desc">Sạch chỉ thừa, không có vết phấn vẽ hay vết bẩn</div>
                            </div>
                        </div>
                        <div class="qc-toggle-group">
                            <label class="qc-radio"><input type="radio" name="qc-clean" value="Đạt" /> Đạt</label>
                            <label class="qc-radio"><input type="radio" name="qc-clean" value="Không đạt" /> Không
                                đạt</label>
                        </div>
                    </div>
                    <div class="qc-item">
                        <div class="qc-item-info">
                            <span class="qc-item-icon">👔</span>
                            <div>
                                <div class="qc-item-title">Ủi / Lả</div>
                                <div class="qc-item-desc">Phẳng phiu, các đường ly sắc nét, giữ đúng form dáng</div>
                            </div>
                        </div>
                        <div class="qc-toggle-group">
                            <label class="qc-radio"><input type="radio" name="qc-iron" value="Đạt" /> Đạt</label>
                            <label class="qc-radio"><input type="radio" name="qc-iron" value="Không đạt" /> Không
                                đạt</label>
                        </div>
                    </div>
                </div>
                <div class="form-group" style="margin-top:1rem">
                    <label>Ghi chú QC</label>
                    <textarea id="qc-note" rows="2" placeholder="Ghi chú các điểm cần sửa hoặc lưu ý..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('modal-qc')">Hủy</button>
                <button class="btn btn-danger" onclick="submitQC('Không đạt')">❌ Không đạt – Trả về sản xuất</button>
                <button class="btn btn-success" onclick="submitQC('Đạt')">✅ Đạt – Chuyển giao hàng</button>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', html_modal_qc);
