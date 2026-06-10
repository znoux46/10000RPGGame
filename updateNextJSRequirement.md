Dưới đây là tài liệu **Yêu cầu dự án cập nhật (Updated Project Requirements)** khi bạn chuyển đổi sang kiến trúc tách rời (Decoupled/Headless Architecture): **Next.js đóng vai trò Frontend** và **ASP.NET Core đóng vai trò Backend API**, kết nối cơ sở dữ liệu **PostgreSQL**.

---

# 📝 TÀI LIỆU YÊU CẦU DỰ ÁN (CẬP NHẬT)

**Kiến trúc:** Tách rời (Headless Architecture)

**Frontend:** Next.js (React Framework) | **Backend:** ASP.NET Core Web API | **Database:** PostgreSQL

---

## 1. Phân chia Vai trò hệ thống (System Architecture)

Hệ thống sẽ không còn gộp chung giao diện và logic vào một nơi (như mô hình MVC truyền thống), mà chia tách thành hai dự án độc lập vận hành thông qua giao thức HTTP (JSON API):

* **Next.js (Frontend Client):** * Chịu trách nhiệm toàn bộ về trải nghiệm người dùng (UX/UI).
* Hiển thị đồ họa, xử lý hiệu ứng Point-and-Click (hoạt ảnh nhân vật, hiệu ứng chuyển cảnh bối cảnh).
* Gửi yêu cầu dữ liệu (Fetch API) tới Backend và render giao diện động một cách mượt mà không cần tải lại trang (Single Page Experience).


* **ASP.NET Core (Backend API):**
* Đóng vai trò là một RESTful API thuần túy (Không chứa lớp View).
* Chịu trách nhiệm tính toán logic game: Xử lý dữ liệu nhân vật, kiểm tra thăng cấp, cập nhật tọa độ bản đồ.
* Đảm bảo an toàn dữ liệu, kết nối và thực hiện các câu lệnh truy vấn tới PostgreSQL thông qua EF Core.



---

## 2. Yêu cầu Chức năng chi tiết (Functional Requirements)

### 2.1. Phía Frontend (Next.js)

* **Màn hình khởi tạo:** Cho phép người dùng nhập tên để tạo nhân vật mới. Gửi dữ liệu qua API và chuyển hướng người chơi vào game khi thành công.
* **Giao diện Point-and-Click (Bản đồ trực quan):** * Hiển thị bức vẽ Sketch bối cảnh toàn màn hình dựa vào URL ảnh nhận từ Backend.
* Hiển thị các vùng có thể click (Nút bấm hoặc Tọa độ) để chuyển sang địa điểm tiếp theo.


* **Bảng trạng thái nhân vật (Character Dashboard):** Hiển thị thanh cấp độ (Level), điểm kinh nghiệm (EXP), và số vàng (Gold) hiện tại một cách trực quan, tự động cập nhật ngay khi nhận được phản hồi từ hành động click.
* **Tối ưu hóa hình ảnh Sketch:** Sử dụng thành phần `<Image />` tích hợp sẵn của Next.js để tự động nén, tối ưu dung lượng và lười tải (Lazy-load) các bức tranh nhân vật/bối cảnh độ phân giải cao nhằm tránh giật lag.

### 2.2. Phía Backend (ASP.NET Core Web API)

* **Endpoint Tạo Nhân Vật (`POST /api/game/character/create`):** Tiếp nhận tên nhân vật từ Next.js, tạo bản ghi mới trong PostgreSQL với chỉ số mặc định (Level 1, Vị trí ban đầu = 1) và trả về đối tượng JSON của nhân vật.
* **Endpoint Trạng Thái (`GET /api/game/character/{id}`):** Trả về toàn bộ dữ liệu hiện tại của nhân vật kèm theo thông tin chi tiết của địa điểm đó (bao gồm liên kết ảnh bối cảnh `backgroundImageUrl`).
* **Endpoint Di Chuyển (`POST /api/game/character/move`):** * Nhận thông tin `CharacterId` và `TargetLocationId`.
* Thực hiện logic cộng EXP (+10) và tự động tính toán thăng cấp ($EXP \ge Level \times 100$).
* Trả về kết quả JSON trạng thái mới nhất cho Frontend.



---

## 3. Yêu cầu Phi chức năng & Giao tiếp (Non-Functional & Integration)

### 3.1. Cấu hình CORS (Cross-Origin Resource Sharing)

* Do Next.js và ASP.NET Core chạy trên hai cổng (Port) hoặc Domain khác nhau, Backend ASP.NET Core **bắt buộc** phải cấu hình chính sách CORS (`AllowAnyMethod`, `AllowAnyHeader`) và chỉ định rõ nguồn gốc (Origin) từ địa chỉ của Next.js (ví dụ: `http://localhost:3000`) để trình duyệt cho phép giao tiếp.

### 3.2. Quản lý trạng thái và Kết nối hình ảnh

* **Lưu trữ tranh Sketch:** Các file ảnh thiết kế nhân vật và bối cảnh sẽ được lưu trên một dịch vụ đám mây (Cloudinary/Amazon S3). Cơ sở dữ liệu PostgreSQL chỉ lưu trữ chuỗi URL dạng tuyệt đối.
* **Giao tiếp dữ liệu:** Tất cả các dữ liệu truyền tải giữa Next.js và ASP.NET Core bắt buộc phải sử dụng định dạng tiêu chuẩn **JSON**.

---

## 4. Mô hình luồng dữ liệu tương tác (Data Flow)

1. Người dùng click vào một điểm trên màn hình **Next.js**.
2. **Next.js** thực hiện lệnh `fetch()` gửi yêu cầu JSON qua **ASP.NET Core API**.
3. **ASP.NET Core** tiếp nhận, thay đổi vị trí nhân vật trong **PostgreSQL** và tính toán thăng cấp.
4. **ASP.NET Core** phản hồi lại dữ liệu JSON (Chỉ số mới + URL ảnh bối cảnh mới).
5. **Next.js** nhận dữ liệu, cập nhật lại State (Trạng thái giao diện) và thay đổi hình ảnh hiển thị lập tức.