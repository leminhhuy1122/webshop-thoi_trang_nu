import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, addReview } from '../controllers/productController';
import { uploadRaw, processAndSaveImage } from '../../middlewares/uploadMiddleware';
import { authenticateJWT, requireRole } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', getProducts);

// Thêm sản phẩm mới (yêu cầu Admin/Staff & xử lý tải ảnh)
router.post(
  '/',
  authenticateJWT,
  requireRole(['ADMIN', 'STAFF']),
  uploadRaw.single('image'),
  processAndSaveImage('products', 800),
  createProduct
);

// Sửa sản phẩm (yêu cầu Admin/Staff & xử lý tải ảnh mới)
router.put(
  '/:id',
  authenticateJWT,
  requireRole(['ADMIN', 'STAFF']),
  uploadRaw.single('image'),
  processAndSaveImage('products', 800),
  updateProduct
);

// Xóa sản phẩm (yêu cầu Admin/Staff)
router.delete(
  '/:id',
  authenticateJWT,
  requireRole(['ADMIN', 'STAFF']),
  deleteProduct
);

// Đăng tải bình luận đánh giá (ai cũng được bình luận)
router.post('/:id/reviews', addReview);

export default router;
