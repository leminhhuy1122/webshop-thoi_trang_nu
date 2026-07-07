import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Cấu hình các thư mục lưu trữ cục bộ
const STORAGE_ROOT = path.join(process.cwd(), 'storage');

// Tự động kiểm tra và tạo các thư mục lưu trữ
const subfolders = ['products', 'categories', 'banners', 'blog', 'avatar', 'reviews', 'temp'];
subfolders.forEach(folder => {
  const dirPath = path.join(STORAGE_ROOT, folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Multer memory storage để tiếp nhận file dạng Buffer trước khi Sharp xử lý
const memoryStorage = multer.memoryStorage();

// Bộ lọc định dạng file hợp lệ (MIME Type)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Định dạng tệp không hợp lệ. Chỉ chấp nhận các tệp ảnh JPG, PNG, WEBP, GIF.'));
  }
};

// Cấu hình Multer tiếp nhận tối đa 5MB
export const uploadRaw = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

/**
 * Xử lý nén ảnh, resize và lưu trữ cục bộ sang định dạng WebP
 * @param subfolder Thư mục con trong /storage (ví dụ: 'products', 'categories')
 * @param width Kích thước chiều rộng tối đa (pixel)
 */
export const processAndSaveImage = (subfolder: string, width = 800) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }

    try {
      const filename = `${subfolder}-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      const relativePath = `/storage/${subfolder}/${filename}`;
      const absolutePath = path.join(STORAGE_ROOT, subfolder, filename);

      // Sử dụng Sharp để resize và nén WebP chất lượng 80
      await sharp(req.file.buffer)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(absolutePath);

      // Gắn đường dẫn tệp vào request để Controller sử dụng
      (req as any).savedFileUrl = relativePath;
      (req as any).savedFilePath = absolutePath;

      next();
    } catch (error) {
      console.error('Lỗi khi xử lý hình ảnh Sharp:', error);
      next(error);
    }
  };
};

/**
 * Hàm xóa tệp tin cục bộ khi cập nhật hoặc xóa dữ liệu
 * @param relativePath Đường dẫn tương đối lưu trong DB (ví dụ: '/storage/products/xxx.webp')
 */
export const deleteLocalFile = (relativePath: string) => {
  if (!relativePath || !relativePath.startsWith('/storage/')) return;
  
  const absolutePath = path.join(process.cwd(), relativePath);
  if (fs.existsSync(absolutePath)) {
    try {
      fs.unlinkSync(absolutePath);
      console.log(`[File System] Đã xóa file cục bộ: ${absolutePath}`);
    } catch (err) {
      console.error(`Lỗi khi xóa file cục bộ tại ${absolutePath}:`, err);
    }
  }
};
