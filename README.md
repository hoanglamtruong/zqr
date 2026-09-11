# zQR - Trình Tạo Mã QR Đa Năng & Chuyên Nghiệp

Ứng dụng tạo mã QR chất lượng cao được thiết kế cho hệ sinh thái ZOS, chạy trên nền tảng Next.js (App Router), React 19, Tailwind CSS và `qr-code-styling`.

## 🚀 Tính năng nổi bật

- **Đa dạng định dạng dữ liệu:**
  - 🌐 **Website (URL):** Tạo mã truy cập trang web, link mạng xã hội, tài liệu.
  - 💳 **VietQR (Napas 247):** Hỗ trợ đầy đủ danh sách các ngân hàng tại Việt Nam (VCB, MB, TCB, VPB, ACB, BIDV...). Tự động mã hoá chuỗi EMVCo Napas chuẩn xác 100% offline (tự tính CRC16-CCITT).
  - 📶 **Mạng Wi-Fi:** Quét để tự động kết nối Wi-Fi (chuẩn WPA/WPA2/WPA3, WEP hoặc mạng mở; hỗ trợ SSID ẩn).
  - 📇 **Danh thiếp điện tử (vCard):** Lưu thông tin liên hệ (Họ tên, SĐT, Email, Tổ chức, Chức vụ, Website) thẳng vào danh bạ điện thoại.
  - 📝 **Văn bản thuần túy, Email & Gọi điện thoại.**

- **Tùy biến thẩm mỹ chuyên sâu:**
  - 🎨 **Màu sắc & Gradient:** Hỗ trợ đơn sắc hoặc dải màu Gradient 2 màu với góc xoay tùy chỉnh (0° - 360°).
  - ✨ **Kiểu dáng hạt (Patterns):** Hạt bo tròn mềm, chấm tròn (dots), cổ điển (classy), góc bo đậm hoặc vuông chuẩn.
  - 👁️ **Mắt định vị (Corner Eyes):** Tùy biến hình dáng khung mắt và tâm mắt định vị độc lập.
  - 🖼️ **Chèn Logo thương hiệu:** Tải logo lên từ máy tính, tự động canh giữa, điều chỉnh kích thước và viền trắng bảo vệ.
  - 🛡️ **Khả năng sửa lỗi (Error Correction):** 4 cấp độ (L 7%, M 15%, Q 25%, H 30%). Tự động kích hoạt mức H khi chèn logo để đảm bảo quét mượt mà không lỗi.

- **Xuất file chất lượng cao:**
  - 🖼️ **PNG độ nét cao:** Tùy chọn 512px, 1024px (HD) hoặc 2048px (Ultra).
  - 📐 **Vector SVG:** File vector không bị vỡ hạt, chuyên dụng cho in ấn bạt, menu, standee khổ lớn.
  - 📋 **Sao chép:** Copy chuỗi dữ liệu mã hoá chỉ với 1 click.

## 🛠️ Công nghệ

- **Framework:** Next.js 16 (Turbopack, App Router) + React 19
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS v4
- **Thư viện mã QR:** `qr-code-styling`
- **Bộ icon:** Lucide React
- **Đóng gói:** Docker multi-stage build, mạng `homelab-net`

## 📦 Chạy dự án

### Chạy trực tiếp (Local Development)
```bash
npm install
npm run dev
# Truy cập: http://localhost:8122
```

### Chạy bằng Docker
```bash
docker compose up -d --build
```

---
*Phát triển bởi Zteam · zQR v1.0*
