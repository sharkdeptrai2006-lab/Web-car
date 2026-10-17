# Mercedes-Benz Car Shop

Website bán ô tô Mercedes-Benz

## Công nghệ sử dụng

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js, EJS (server-side rendering)
- **Database:** Microsoft SQL Server
- **Xác thực:** express-session, bcryptjs (mã hóa mật khẩu)

## Cấu trúc project
MercedesCarShop/
├── config/database.js # Kết nối SQL Server
├── middleware/auth.js # Kiểm tra đăng nhập, phân quyền admin
├── routes/ # Xử lý logic từng nhóm chức năng
│ ├── auth.js # Đăng ký, đăng nhập, đăng xuất
│ ├── cars.js # Danh sách xe, chi tiết xe
│ ├── cart.js # Giỏ hàng
│ ├── orders.js # Đặt xe, xem đơn hàng
│ └── admin.js # Quản trị: dashboard, quản lý xe, đơn hàng
├── views/ # Giao diện EJS
│ ├── partials/ # Header, footer dùng chung
│ └── admin/ # Giao diện trang quản trị
├── public/ # CSS, JS, hình ảnh tĩnh
├── database/mercedes_shop.sql # Script tạo database + dữ liệu mẫu
├── server.js # File khởi động server
└── .env # Cấu hình kết nối (không đưa lên Git)


## Cách cài đặt và chạy project

### Yêu cầu
- Node.js đã cài đặt
- SQL Server + SQL Server Management Studio (SSMS)

### Các bước

1. **Cài package:**
```bash
   npm install
```

2. **Tạo database:** Mở SSMS, chạy toàn bộ nội dung file `database/mercedes_shop.sql`.

3. **Cấu hình kết nối:** Mở file `.env`, sửa `DB_PASSWORD` thành mật khẩu SQL Server của bạn.

4. **Chạy project:**
```bash
   npm run dev
```

5. **Mở trình duyệt:** truy cập `http://localhost:3000`

## Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | admin@gmail.com | Admin@123 |
| User | (tự đăng ký tại `/register`) | — |

## Chức năng chính

### Người dùng
- Xem trang chủ, danh sách xe, tìm kiếm xe theo tên/model
- Xem chi tiết từng xe
- Đăng ký / đăng nhập / đăng xuất
- Thêm xe vào giỏ hàng, tăng giảm số lượng, xóa xe khỏi giỏ
- Đặt xe (checkout), xem lịch sử đơn hàng

### Quản trị viên (Admin)
- Xem dashboard: tổng số xe, người dùng, đơn hàng, doanh thu
- Quản lý xe: thêm, sửa, xóa
- Quản lý đơn hàng: xem, cập nhật trạng thái (PENDING → CONFIRMED → COMPLETED / CANCELLED)

## Hướng dẫn demo (thứ tự nên trình bày)

1. Vào trang chủ → xem banner và xe nổi bật
2. Vào `/cars` → tìm kiếm thử (ví dụ gõ "C200")
3. Bấm vào 1 xe → xem trang chi tiết
4. Đăng ký tài khoản mới → đăng nhập
5. Thêm 2-3 xe vào giỏ hàng → vào `/cart` → thử tăng/giảm số lượng
6. Bấm "Tiến hành đặt xe" → điền form → xác nhận đặt xe
7. Vào `/orders` → xem đơn hàng vừa đặt
8. Đăng xuất → đăng nhập lại bằng tài khoản `admin@gmail.com`
9. Vào `/admin` → xem dashboard
10. Vào "Quản lý xe" → thêm 1 xe mới, sau đó sửa 1 xe có sẵn
11. Vào "Quản lý đơn hàng" → cập nhật trạng thái đơn hàng vừa đặt ở bước 6
12. Đăng xuất khỏi admin, đăng nhập lại bằng tài khoản user ban đầu → vào `/orders` → xác nhận trạng thái đơn hàng đã được cập nhật

## Ghi chú

- Giỏ hàng được lưu trong session, không lưu trong database — sẽ mất khi đóng trình duyệt hoặc session hết hạn.
- Không sử dụng REST API riêng — toàn bộ dữ liệu được Node.js truy vấn trực tiếp từ SQL Server rồi render ra HTML qua EJS.
- Ảnh xe hiện đang dùng placeholder (do chưa có ảnh thật trong `public/images/`) — có thể thay bằng ảnh thật cùng tên file đã khai báo trong database.