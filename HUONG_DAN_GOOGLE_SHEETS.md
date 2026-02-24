# 🧵 TiệmMay Pro — Hướng dẫn kết nối Google Sheets

## Tổng quan kiến trúc

```
Trình duyệt (index.html)
       │
       │  fetch / POST
       ▼
Google Apps Script (Code.gs)  ←→  Google Sheets (Database)
```

- **Google Sheets** = Cơ sở dữ liệu (8 sheets tương đương 8 bảng)
- **Google Apps Script** = API backend (miễn phí, không cần server)
- **Web App** = Gọi API để đọc/ghi dữ liệu real-time

---

## 📋 Bước 1 — Tạo Google Spreadsheet

1. Truy cập [sheets.google.com](https://sheets.google.com)
2. Tạo spreadsheet mới → đặt tên **"TiệmMay Pro Database"**
3. Ghi nhớ URL spreadsheet (dùng sau)

---

## 📋 Bước 2 — Mở Apps Script

1. Trong Google Sheets, click menu **Tiện ích mở rộng → Apps Script**
2. Một tab mới mở ra (script.google.com)
3. Xóa toàn bộ code cũ trong `Code.gs`

---

## 📋 Bước 3 — Copy code vào Apps Script

1. Mở file **`Code.gs`** trong thư mục `d:\Code\quản lý tiệm may\`
2. Copy toàn bộ nội dung
3. Dán vào cửa sổ Apps Script (đè lên code cũ)
4. Nhấn **Ctrl+S** để lưu

---

## 📋 Bước 4 — Tạo dữ liệu mẫu ban đầu

1. Trong Apps Script, chọn function **`setupInitialData`** từ dropdown
2. Nhấn nút **▶ Run**
3. Cho phép quyền truy cập khi được hỏi (Authorize)
4. Quay lại Google Sheets → kiểm tra đã có 8 sheets chưa:
   - `Kho` `KhachHang` `DonHang` `KiemTraQC`
   - `NhaCungCap` `HoatDong` `NhanVien` `ChamCong`

---

## 📋 Bước 5 — Deploy làm Web App

1. Trong Apps Script, nhấn nút **Deploy → New deployment**
2. Chọn loại: **Web app**
3. Cấu hình:
   ```
   Execute as:      Me (email của bạn)
   Who has access:  Anyone
   ```
   > ⚠️ Chọn "Anyone" để web app có thể gọi API mà không cần đăng nhập
4. Nhấn **Deploy**
5. **Copy URL** hiện ra (dạng: `https://script.google.com/macros/s/ABC.../exec`)

---

## 📋 Bước 6 — Dán URL vào Web App

1. Mở file **`db.js`** trong thư mục `d:\Code\quản lý tiệm may\`
2. Tìm dòng:
   ```javascript
   const GS_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
   ```
3. Thay bằng URL vừa copy:
   ```javascript
   const GS_URL = 'https://script.google.com/macros/s/ABC.../exec';
   ```
4. Lưu file

---

## ✅ Kiểm tra

1. Mở lại `index.html` trên trình duyệt (F5)
2. Góc dưới màn hình hiển thị:
   - 🔄 `Đang tải dữ liệu từ Google Sheets...`
   - ☁️ `Đã tải X bản ghi từ Google Sheets`
3. Trên topbar xuất hiện badge **☁️ Sheets** màu xanh

---

## 🔁 Cách hoạt động sau khi cài đặt

| Thao tác | Kết quả |
|----------|---------|
| Mở web app | Tự động tải dữ liệu từ Sheets |
| Thêm khách hàng | Tự ghi vào sheet `KhachHang` |
| Chấm công | Tự ghi vào sheet `ChamCong` |
| Tạo đơn hàng | Tự ghi vào sheet `DonHang` |
| Nhấn badge ☁️ | Đồng bộ thủ công ngay lập tức |
| Mỗi 5 phút | Tự động đồng bộ |

---

## 🖥️ Sử dụng đa thiết bị

```
Máy tính tiệm 1 ──────┐
Máy tính tiệm 2 ──────┼──► Google Sheets ◄── Điện thoại di động
Tablet (quầy thu tiền) ┘
```

Tất cả thiết bị cùng xem/sửa dữ liệu real-time qua mạng internet.

---

## ❓ Lưu ý quan trọng

### Giới hạn miễn phí của Apps Script
- **6 phút/lần** chạy tối đa
- **20.000 lần đọc/ngày** từ Sheets
- **2.000 lần ghi/ngày** vào Sheets
- → Hoàn toàn đủ cho tiệm may quy mô vừa nhỏ

### Nếu gặp lỗi CORS
- Kiểm tra lại "Who has access: **Anyone**" trong Deploy settings
- Phải Deploy **version mới** mỗi khi sửa Code.gs

### Backup dữ liệu
- Google Sheets tự backup lịch sử 30 ngày
- Vào **File → Lịch sử phiên bản** để xem/phục hồi

---

## 📞 Hỗ trợ thêm

Nếu gặp vấn đề, mở Console trình duyệt (F12 → Console) và tìm các dòng bắt đầu bằng `[GS]` để xem lỗi chi tiết.
