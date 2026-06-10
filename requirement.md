Dưới đây là tài liệu **Yêu cầu dự án (Project Requirements)** chi tiết cho dự án Game RPG Point-and-Click của bạn. Tài liệu này được thiết kế theo chuẩn phát triển phần mềm, giúp bạn định hình rõ ràng các tính năng cần làm ở cả phía Backend, Database lẫn định hướng tích hợp các bức vẽ Sketch nhân vật/bối cảnh của bạn.

---

# 📝 TÀI LIỆU YÊU CẦU DỰ ÁN (PROJECT REQUIREMENTS)

**Tên dự án:** RPG Point-and-Click Adventure Game (Backend API)

**Mục tiêu:** Xây dựng hệ thống backend quản lý logic trò chơi nhập vai dạng click chuột, tích hợp hiển thị hình ảnh bối cảnh và nhân vật tự thiết kế (Sketch).

---

## 1. Yêu cầu chức năng (Functional Requirements)

### 1.1. Quản lý nhân vật (Character Management)

* **Tạo nhân vật:** Người chơi có thể tạo một nhân vật mới với tên tự chọn. Hệ thống tự động thiết lập các chỉ số mặc định ban đầu: Level = 1, Gold = 0, Experience = 0, và vị trí ban đầu là "Làng Tân Thủ".
* **Trạng thái nhân vật:** Hệ thống phải cung cấp API để lấy thông tin chi tiết hiện tại của nhân vật (Tên, Cấp độ, Kinh nghiệm, Vàng, Địa điểm hiện tại).

### 1.2. Cơ chế Di chuyển & Tương tác (Point-and-Click Mechanics)

* **Bản đồ & Địa điểm:** Game có các địa điểm cố định được lưu trong hệ thống. Mỗi địa điểm sẽ có tên, mô tả, tọa độ ($X, Y$) và một liên kết hình ảnh bối cảnh nền (URL chứa bức vẽ sketch của bạn).
* **Click di chuyển:** Khi người chơi click chọn một địa điểm mới trên giao diện:
* Hệ thống kiểm tra tính hợp lệ của nhân vật và địa điểm đích.
* Cập nhật vị trí mới của nhân vật vào cơ sở dữ liệu.


* **Phần thưởng di chuyển:** Mỗi lần di chuyển thành công đến vùng đất mới, nhân vật sẽ nhận được một lượng Điểm kinh nghiệm (EXP) nhất định (mặc định: +10 EXP).

### 1.3. Logic Thăng cấp (Level Up System)

* Hệ thống tự động kiểm tra điều kiện lên cấp mỗi khi nhân vật nhận được EXP.
* **Công thức thăng cấp:** Cần đạt số EXP bằng $Level \times 100$ để lên cấp tiếp theo.
* Khi đủ điều kiện, cấp độ nhân vật tăng lên 1 và điểm EXP hiện tại được reset về 0 (hoặc trừ đi lượng EXP cần thiết).

---

## 2. Yêu cầu phi chức năng (Non-Functional Requirements)

### 2.1. Công nghệ & Nền tảng (Tech Stack)

* **Framework:** ASP.NET Core 8.0/9.0 (Web API).
* **Database:** PostgreSQL (Hệ quản trị cơ sở dữ liệu quan hệ).
* **ORM:** Entity Framework Core (EF Core) để giao tiếp dữ liệu.
* **Kiến trúc:** RESTful API kiến trúc Controller-Service (hoặc Controller trực tiếp cho dự án nhỏ).

### 2.2. Hiệu năng & Bảo mật (Performance & Security)

* **Tốc độ phản hồi:** Các API di chuyển và lấy trạng thái phải phản hồi dưới 200ms để đảm bảo trải nghiệm chơi game không bị khựng.
* **Tính toàn vẹn dữ liệu:** Logic tính toán EXP và Level phải được xử lý hoàn toàn ở Backend (không tin tưởng dữ liệu tính toán từ Frontend gửi lên) để tránh gian lận (hack chỉ số).
* **CORS (Cross-Origin Resource Sharing):** Phải cấu hình CORS cho phép các ứng dụng Frontend (React, Vue hoặc Unity WebGL) có thể gọi API một cách an toàn.

---

## 3. Yêu cầu về Dữ liệu (Database Requirements)

Hệ thống yêu cầu cơ sở dữ liệu PostgreSQL gồm ít nhất 2 bảng chính với mối quan hệ Một - Nhiều ($1 - N$):

* **Bảng `Locations` (Địa điểm):** Lưu trữ thông tin bản đồ game.
* **Bảng `Characters` (Nhân vật):** Lưu trữ thông tin người chơi. Mỗi nhân vật tại một thời điểm chỉ thuộc về một địa điểm duy nhất (`CurrentLocationId` khóa ngoại liên kết tới `Locations`).

> 💡 **Yêu cầu Seed Dữ liệu:** Hệ thống phải tự động chèn sẵn ít nhất 3 địa điểm cơ bản (Làng Tân Thủ, Khu Rừng Hắc Ám, Hang Rồng) kèm theo URL ảnh sketch tương ứng vào database ngay khi khởi tạo (Migration).

---

## 4. Kế hoạch tích hợp Sketch (Artwork Integration)

Để tối ưu hóa kỹ năng vẽ nhân vật vào dự án backend này, hệ thống cần đáp ứng:

1. **Hỗ trợ CDN/Cloud Storage:** Trường `BackgroundImageUrl` trong bảng địa điểm và các trường hình ảnh nhân vật (nếu phát triển thêm) phải lưu trữ được link ảnh dạng tuyệt đối (ví dụ: link từ Cloudinary hoặc Imgur) để Frontend chỉ việc tải ảnh về hiển thị.
2. **Định dạng hình ảnh hỗ trợ:** Hệ thống xử lý chuỗi URL chấp nhận các định dạng ảnh phổ biến `.png` (khuyên dùng cho nhân vật có nền trong suốt) và `.jpg`/`.webp` (cho ảnh bối cảnh nền).

Connection string: postgresql://neondb_owner:npg_2da0qezviwWt@ep-ancient-feather-ap3nymyy-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require