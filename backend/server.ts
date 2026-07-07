import dotenv from 'dotenv';
// Load environment variables as early as possible
dotenv.config();

import express from 'express';
import path from 'path';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import { initSocket } from './src/server/socket';
import productRoutes from './src/server/routes/productRoutes';
import categoryRoutes from './src/server/routes/categoryRoutes';
import orderRoutes from './src/server/routes/orderRoutes';
import authRoutes from './src/routes/authRoutes';
import aiRoutes from './src/routes/aiRoutes';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  
  // Áp dụng các middleware bảo mật và tối ưu hiệu năng
  app.use(helmet({
    contentSecurityPolicy: false, // Tắt CSP để tránh chặn tải ảnh mẫu từ bên thứ ba (Unsplash)
  }));
  app.use(compression());
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  // Giới hạn tần suất yêu cầu chống Spam/DDoS
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    limit: 100, // Tối đa 100 yêu cầu/IP mỗi 15 phút
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Yêu cầu quá thường xuyên, vui lòng thử lại sau 15 phút.' }
  });
  app.use('/api', apiLimiter);

  const server = http.createServer(app);
  initSocket(server);

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/orders', orderRoutes);

  // Phục vụ Client tĩnh (cho chế độ Production trên Linux SSD)
  if (process.env.NODE_ENV !== 'production' && process.env.DEMO_MODE !== 'true') {
    // Vite middleware chỉ chạy khi lập trình local
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Tự động tìm đường dẫn thư mục build client phù hợp với CWD khởi chạy
    let distPath = path.join(process.cwd(), 'client/dist');
    if (!fs.existsSync(distPath)) {
      distPath = path.join(process.cwd(), '../client/dist');
    }
    
    console.log(`[Static Server] Phục vụ giao diện từ thư mục: ${distPath}`);
    
    // Tắt cache hoàn toàn đối với tệp tĩnh để chống mojibake/cache lỗi của trình duyệt
    app.use(express.static(distPath, {
      etag: false,
      lastModified: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        } else {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        }
      }
    }));

    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server chạy tại: http://localhost:${PORT}`);
    console.log(`Chế độ: ${process.env.DEMO_MODE === 'true' ? 'DEMO MODE (JSON files)' : 'PRODUCTION MODE (PostgreSQL DB)'}`);
  });
}

startServer();
