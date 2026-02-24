const html_modal_att_result = `    <!-- Modal: Kết quả chấm công -->
    <div class="modal-overlay" id="modal-att-result" onclick="closeModalIfBg(event,'modal-att-result')">
        <div class="modal">
            <div class="modal-header">
                <h2 id="att-result-title">✅ Chấm công thành công</h2>
                <button class="modal-close" onclick="closeModal('modal-att-result')">✕</button>
            </div>
            <div class="modal-body" id="att-result-body"></div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeModal('modal-att-result')">OK</button>
            </div>
        </div>
    </div>

`;
document.body.insertAdjacentHTML('beforeend', html_modal_att_result);
