# AURA - Website Shop Thời Trang Nữ Cao Cấp

AURA là một dự án website thương mại điện tử chuyên nghiệp dành riêng cho thời trang nữ, được xây dựng trên nền tảng React hiện đại kết hợp với hệ thống quản trị (Admin Dashboard) toàn diện và tích hợp trí tuệ nhân tạo Google Gemini AI để hỗ trợ trải nghiệm mua sắm.

Dự án được tối ưu hóa cấu hình để sẵn sàng deploy nhanh chóng lên **Git** và **Vercel** dưới dạng ứng dụng Serverless Hybrid (React SPA + Express API).

---

## 🌟 Tính Năng Nổi Bật

### Phía Khách Hàng (Client Interface)
* **Trang chủ thời thượng**: Banner chiến dịch sống động, khu vực Flash Sale đếm ngược thời gian thực, danh sách sản phẩm mới và bán chạy nhất.
* **Bộ lọc sản phẩm thông minh**: Lọc sản phẩm theo danh mục, mức giá, kích cỡ (size), màu sắc và sắp xếp linh hoạt.
* **Chi tiết sản phẩm trực quan**: Hình ảnh chất lượng cao, chọn màu/size, xem mô tả chi tiết, hướng dẫn bảo quản, đánh giá/bình luận sản phẩm từ khách hàng.
* **Giỏ hàng & Yêu thích**: Thêm sản phẩm vào giỏ hàng và danh sách yêu thích dễ dàng với hiệu ứng micro-animations mượt mà.
* **Trang thanh toán tối giản**: Tích hợp áp dụng mã giảm giá (vouchers), lựa chọn đơn vị vận chuyển (dự kiến GHTK) và đa dạng phương thức thanh toán (COD, Chuyển khoản, Ví điện tử).
* **Trang tin tức (Blog)**: Chia sẻ xu hướng thời trang, lookbook và các bài viết cảm hứng.
* **Trang cá nhân (Account)**: Quản lý thông tin tài khoản, theo dõi đơn hàng và lịch sử mua sắm.
* **Trợ lý mua sắm AI (Gemini AI)**: Tích hợp mô hình Gemini AI thế hệ mới để tư vấn thời trang, giải đáp thắc mắc của khách hàng tự động.

### Phía Quản Trị (Admin Dashboard)
* **Thống kê tổng quan**: Biểu đồ doanh thu, số lượng đơn hàng, khách hàng mới qua Recharts trực quan.
* **Quản lý sản phẩm**: Thêm mới, chỉnh sửa thông tin, cập nhật kho hàng, phân loại danh mục, và xóa sản phẩm.
* **Quản lý đơn hàng**: Theo dõi danh sách đơn hàng, chi tiết thông tin giao hàng và cập nhật trạng thái đơn hàng.
* **Quản lý mã giảm giá (Vouchers)**: Tạo mới mã voucher giảm theo số tiền cố định, giảm theo phần trăm hoặc miễn phí vận chuyển.
* **Quản lý nội dung (Storefront)**: Tuỳ chỉnh banner trang chủ, sản phẩm flash sale trực tiếp trên giao diện Admin.
* **Quản lý bài viết & Đánh giá**: Biên tập blog thời trang và kiểm duyệt bình luận của khách hàng.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
* **Core**: React 19, TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS v4, Lucide React (Icons)
* **State Management**: Zustand
* **Routing**: React Router v7
* **Charts**: Recharts

### Backend
* **API Framework**: Express
* **Real-time**: Socket.io / Socket.io-client
* **Runtime**: Node.js (hỗ trợ chuyển đổi Serverless trên Vercel)
* **AI Integration**: `@google/genai` (Google Gemini API)

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local Development)

### Yêu Cầu Hệ Thống
* Đã cài đặt **Node.js** (Khuyến nghị phiên bản LTS từ 18 trở lên).

### Các Bước Thực Hiện

1. **Clone dự án về máy:**
   ```bash
   git clone https://github.com/leminhhuy1122/webshop-thoi_trang_nu.git
   cd webshop-thoi_trang_nu
   ```

2. **Cài đặt thư viện phụ thuộc:**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường:**
   Tạo tệp `.env.local` ở thư mục gốc và cấu hình API Key của Google Gemini:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
   ```

4. **Khởi chạy ứng dụng ở chế độ phát triển:**
   ```bash
   npm run dev
   ```
   *Ứng dụng sẽ chạy tại địa chỉ: http://localhost:3000*

5. **Build đóng gói ứng dụng:**
   ```bash
   npm run build
   ```

---

## ☁️ Hướng Dẫn Deploy lên Vercel

Dự án này đã được tích hợp sẵn cấu hình `vercel.json` và API Serverless entrypoint (`api/index.ts`). Để deploy lên Vercel:

1. Đẩy mã nguồn lên repository GitHub của bạn.
2. Truy cập [Vercel Dashboard](https://vercel.com/dashboard) và tạo project mới từ repository đó.
3. Vercel sẽ tự động phát hiện cấu hình và thiết lập:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Cấu hình biến môi trường (Environment Variables) trên Vercel:
   - Nhập Key: `GEMINI_API_KEY` và Value là API Key của bạn.
5. Nhấn **Deploy** để hoàn tất.

---

## ⚠️ Lưu Ý Quan Trọng khi chạy trên Vercel (Serverless)

Vì Vercel hoạt động dựa trên cơ chế Serverless Functions:
1. **Dữ liệu tạm thời (In-Memory Data)**: Hệ thống đang sử dụng dữ liệu ảo lưu trên RAM ở backend (`src/server/models/...`). Khi chạy trên Vercel, dữ liệu này sẽ được tự động reset về mặc định mỗi khi serverless function khởi động lại (cold start). Sau này khi phát triển rộng rãi, hãy kết nối Express API với một cơ sở dữ liệu thực (như PostgreSQL, MySQL hoặc MongoDB thông qua Prisma/Mongoose).
2. **Socket.io Mock**: WebSocket kết nối thời gian thực sẽ không chạy được trên nền tảng Serverless của Vercel. Ứng dụng đã được cấu hình cơ chế fallback tự động chuyển sang REST API HTTP để lấy dữ liệu ảo từ backend giúp trang web hoạt động bình thường, ổn định và không phát sinh lỗi 500.

---

## 📄 Bản Quyền
Dự án được xây dựng và phát triển bởi leminhhuy1122. Vui lòng ghi nguồn khi sử dụng hoặc tham khảo mã nguồn.
