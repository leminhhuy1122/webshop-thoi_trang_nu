# Trạng Thái Phát Triển Dự Án AURA (07/07/2026)

Tài liệu này ghi lại trạng thái cấu trúc dự án và các bước tiếp theo sau khi tái cấu trúc từ mô hình phẳng sang Monorepo (Client & Backend riêng biệt).

---

## 1. Cấu Trúc Thư Mục Mới
Dự án đã được phân chia thành hai phần độc lập:
* **`client/`**: Chứa toàn bộ giao diện khách hàng và Admin Dashboard (React Vite SPA + Tailwind CSS v4 + Zustand).
* **`backend/`**: Chứa Express API, mô hình Repository Pattern, tích hợp Gemini AI và Prisma ORM (kết nối PostgreSQL).
* **`api/`** (Root): Chứa file entrypoint Vercel Serverless Function (`api/index.ts`).

---

## 2. Các Thay Đổi Đã Thực Hiện
- [x] **Di chuyển mã nguồn**: Chuyển phần Front-end cũ vào thư mục `client/` và Back-end vào `backend/`.
- [x] **Cập nhật script điều khiển**: File `package.json` ở root đã được đổi các câu lệnh để kiểm soát toàn bộ dự án từ một nơi:
  * `npm run install:all` - Cài đặt thư viện cho cả hai thư mục.
  * `npm run dev:client` - Chạy thử client (Cổng 5173).
  * `npm run dev:backend` - Chạy thử backend API (Cổng 3000).
  * `npm run build:all` - Biên dịch cả client và backend.
- [x] **Repository Pattern cho API**: Cấu trúc lại mã nguồn truy xuất dữ liệu trong [backend/src/repositories](file:///d:/cong%20ty%20vietkey/demo/demo%20website%20shop%20%C4%91%E1%BB%93%20n%E1%BB%AF/web%20shop%20th%E1%BB%9Di%20trang%20n%E1%BB%AF/backend/src/repositories). Hỗ trợ chạy song song chế độ giả lập (`DEMO_MODE=true` sử dụng dữ liệu JSON dưới `backend/src/demo/`) hoặc chế độ production PostgreSQL.
- [x] **Cập nhật Vercel Serverless Entrypoint**: Điều chỉnh import trong [api/index.ts](file:///d:/cong%20ty%20vietkey/demo/demo%20website%20shop%20%C4%91%E1%BB%93%20n%E1%BB%AF/web%20shop%20th%E1%BB%9Di%20trang%20n%E1%BB%AF/api/index.ts) trỏ đúng sang thư mục `backend/` thay vì thư mục `src/` cũ ở root đã bị xóa.

---

## 3. Hướng Dẫn Chạy Môi Trường Phát Triển
Để tiếp tục lập trình, thực hiện các lệnh sau tại thư mục gốc:

1. **Cài đặt mọi dependency**:
   ```bash
   npm run install:all
   ```

2. **Chạy song song Client & Backend**:
   - Chạy Frontend:
     ```bash
     npm run dev:client
     ```
   - Chạy Backend API:
     ```bash
     npm run dev:backend
     ```

---

## 4. Các Công Việc Tiếp Theo (TODO)
- [ ] Chạy thử ứng dụng local để xác thực kết nối giữa Frontend (Zustand store) và Backend API mới.
- [ ] Kiểm tra tính năng AI tư vấn qua Gemini API xem hoạt động ổn định trên cấu trúc mới chưa.
- [ ] Cấu hình các biến môi trường trong `backend/.env` để test chế độ kết nối cơ sở dữ liệu PostgreSQL qua Prisma (`npx prisma migrate dev`).
- [ ] Deploy thử nghiệm lên hosting (theo hướng dẫn [backend/DEPLOYMENT.md](file:///d:/cong%20ty%20vietkey/demo/demo%20website%20shop%20%C4%91%E1%BB%93%20n%E1%BB%AF/web%20shop%20th%E1%BB%9Di%20trang%20n%E1%BB%AF/backend/DEPLOYMENT.md)) hoặc deploy lên Vercel.
