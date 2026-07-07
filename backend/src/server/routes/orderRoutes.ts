import { Router } from 'express';
import { getOrders, createOrder, updateOrderStatus } from '../controllers/orderController';
import { authenticateJWT, requireRole } from '../../middlewares/authMiddleware';

const router = Router();

// Lấy danh sách đơn hàng (yêu cầu đăng nhập)
router.get('/', authenticateJWT, getOrders);

// Tạo đơn hàng mới
router.post('/', authenticateJWT, createOrder);

// Cập nhật trạng thái đơn hàng (yêu cầu quyền Admin hoặc Staff)
router.put('/:id/status', authenticateJWT, requireRole(['ADMIN', 'STAFF']), updateOrderStatus);

export default router;
