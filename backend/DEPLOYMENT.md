# HƯỚNG DẪN TRIỂN KHAI HỆ THỐNG AURA TRÊN SSD LINUX HOSTING

Tài liệu này cung cấp quy trình từng bước để deploy và quản trị ứng dụng **AURA** trên môi trường **SSD Hosting Linux (NodeJS Hosting)** có quyền SSH, PM2, Git, và cơ sở dữ liệu PostgreSQL.

---

## 1. Yêu Cầu Cấu Hình Ban Đầu

Đảm bảo máy chủ Linux đã cài đặt:
* **Node.js** v18+ & **npm**
* **PM2** (`npm install -g pm2`)
* **PostgreSQL** Server (đang chạy và đã cấp tài khoản kết nối)
* **Git** CLI

---

## 2. Các Bước Triển Khai Lần Đầu (First-Time Deploy)

### Bước 2.1: Clone Source Code & Cài đặt
1. SSH vào hosting của bạn:
   ```bash
   ssh username@your-server-ip
   ```
2. Di chuyển tới thư mục chứa website (ví dụ: `/var/www/aura`):
   ```bash
   cd /var/www/aura
   ```
3. Clone repository hoặc giải nén mã nguồn:
   ```bash
   git clone https://github.com/leminhhuy1122/webshop-thoi_trang_nu.git .
   ```

### Bước 2.2: Cài Đặt và Build Dự Án

#### A. Đối với Client (React Frontend)
1. Di chuyển vào thư mục client:
   ```bash
   cd client
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Build mã nguồn tĩnh:
   ```bash
   npm run build
   ```
   *Thư mục build tĩnh sẽ được tạo ra tại `/client/dist`.*

#### B. Đối với Backend (NodeJS Express API)
1. Di chuyển vào thư mục backend:
   ```bash
   cd ../backend
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Tạo tệp `.env` cấu hình Production (đảm bảo tắt `DEMO_MODE`):
   ```bash
   nano .env
   ```
   *Nội dung tệp cấu hình tham khảo:*
   ```env
   NODE_ENV=production
   DEMO_MODE=false
   PORT=3000
   DATABASE_URL="postgresql://postgres:user_password@localhost:5432/aura_db?schema=public"
   JWT_SECRET="aura_super_secret_jwt_key_2026"
   JWT_REFRESH_SECRET="aura_super_secret_refresh_jwt_key_2026"
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
   ```
4. Thực thi khởi tạo cơ sở dữ liệu và seed dữ liệu mẫu ban đầu qua Prisma:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```
5. Thực hiện Build nén backend thành CJS file:
   ```bash
   npm run build
   ```

---

## 3. Khởi Chạy Ứng Dụng với PM2 (PM2 Management)

Để đảm bảo ứng dụng luôn chạy ngầm và tự động khởi động lại khi có lỗi xảy ra, chúng ta dùng PM2:

* **Khởi chạy ứng dụng**:
  ```bash
  pm2 start dist/server.cjs --name "aura-backend"
  ```
* **Khởi động lại ứng dụng** (sau khi cập nhật cấu hình/mã nguồn):
  ```bash
  pm2 restart aura-backend
  ```
* **Xem logs hoạt động thời gian thực**:
  ```bash
  pm2 logs aura-backend
  ```
* **Xem thông số tài nguyên CPU / RAM**:
  ```bash
  pm2 monit
  ```
* **Dừng ứng dụng**:
  ```bash
  pm2 stop aura-backend
  ```
* **Lưu cấu hình PM2** để tự động chạy lại khi server Linux restart:
  ```bash
  pm2 save
  pm2 startup
  ```

---

## 4. Quy Trình Cập Nhật Phiên Bản Mới (Deploy New Version)

Khi có bản cập nhật mới trên GitHub, chạy chuỗi lệnh sau tại thư mục gốc:

```bash
# 1. Kéo mã nguồn mới nhất về máy chủ
git pull origin main

# 2. Cập nhật và build lại Frontend
cd client
npm install
npm run build

# 3. Cập nhật, migrate database và build lại Backend
cd ../backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build

# 4. Khởi động lại ứng dụng PM2
pm2 restart aura-backend
```

---

## 5. Sao Lưu & Khôi Phục Cơ Sở Dữ Liệu (Backup & Restore Database)

Sử dụng các script Postgres tiện ích kết hợp Cronjob để lập lịch sao lưu tự động.

### Lệnh Sao Lưu Nhanh (Backup Database)
Chạy lệnh sau để xuất toàn bộ cơ sở dữ liệu thành tệp backup:
```bash
pg_dump -U postgres -h localhost -d aura_db -F c -b -v -f "/var/www/aura/backup/aura_db_$(date +%Y%m%d_%H%M%S).backup"
```

### Lệnh Khôi Phục Nhanh (Restore Database)
Chạy lệnh phục hồi dữ liệu từ tệp backup đã tạo:
```bash
pg_restore -U postgres -h localhost -d aura_db -v "/var/www/aura/backup/aura_db_filename.backup"
```

### Lập lịch Sao lưu tự động qua Cronjob
1. Mở bảng cấu hình cronjob của Linux:
   ```bash
   crontab -e
   ```
2. Thêm dòng sau để tự động sao lưu database vào lúc 2:00 sáng mỗi ngày:
   ```cron
   0 2 * * * pg_dump -U postgres -d aura_db -F c -f /var/www/aura/backup/daily_backup.backup
   ```
