import { Response } from 'express';
import { RepositoryFactory } from '../../repositories/RepositoryFactory';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';
import { getIo } from '../socket';

const orderRepo = RepositoryFactory.getOrderRepository();
const productRepo = RepositoryFactory.getProductRepository();
const voucherRepo = RepositoryFactory.getVoucherRepository();

export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Không thể xác định danh tính' });
    }

    let orders;
    if (user.role === 'ADMIN' || user.role === 'STAFF') {
      // Admin/Staff lấy toàn bộ đơn hàng
      orders = await orderRepo.findMany();
    } else {
      // Khách hàng thông thường chỉ lấy đơn của mình
      orders = await orderRepo.findManyByUserId(user.userId);
    }

    res.json(orders);
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Không thể xác định danh tính' });
    }

    const {
      cartItems,
      shippingAddress,
      recipientName,
      recipientPhone,
      recipientEmail,
      notes,
      paymentMethod = 'COD',
      voucherCode,
      shippingFee = 30000
    } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống hoặc không hợp lệ' });
    }

    if (!shippingAddress || !recipientName || !recipientPhone || !recipientEmail) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin giao nhận' });
    }

    // 1. Tính toán giá tiền từ database thực tế hoặc tệp JSON (chống giả mạo giá tiền từ Client)
    let subtotal = 0;
    const itemsDataToCreate = [];

    for (const item of cartItems) {
      const dbProduct = await productRepo.findById(item.product.id);

      if (!dbProduct) {
        return res.status(404).json({ message: `Sản phẩm ${item.product.name} không tồn tại` });
      }

      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({ message: `Sản phẩm ${dbProduct.name} không đủ số lượng tồn kho (Còn lại: ${dbProduct.stock})` });
      }

      const itemPrice = dbProduct.salePrice || dbProduct.price;
      subtotal += itemPrice * item.quantity;

      itemsDataToCreate.push({
        productId: dbProduct.id,
        quantity: item.quantity,
        size: item.size || 'M',
        color: item.color || 'Đen',
        price: itemPrice
      });
    }

    // 2. Tính toán mã giảm giá Voucher
    let discountAmount = 0;
    if (voucherCode) {
      const dbVoucher = await voucherRepo.findByCode(voucherCode.toUpperCase());

      if (dbVoucher && dbVoucher.status === 'active' && new Date(dbVoucher.expiresAt) > new Date() && dbVoucher.usedCount < dbVoucher.usageLimit) {
        if (subtotal >= dbVoucher.minOrder) {
          if (dbVoucher.type === 'FREESHIP') {
            discountAmount = Math.min(shippingFee, dbVoucher.value);
          } else if (dbVoucher.type === 'FIXED') {
            discountAmount = dbVoucher.value;
          } else if (dbVoucher.type === 'PERCENT') {
            discountAmount = Math.floor(subtotal * (dbVoucher.value / 100));
          }
        }
      }
    }

    const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

    // 3. Ghi nhận đơn hàng
    const newOrder = await orderRepo.create({
      userId: user.userId,
      subtotal,
      shippingFee,
      discountAmount,
      finalTotal,
      voucherCode: voucherCode ? voucherCode.toUpperCase() : null,
      paymentMethod,
      shippingAddress,
      recipientName,
      recipientPhone,
      recipientEmail,
      notes,
      items: itemsDataToCreate
    });

    // 4. Phát sự kiện realtime đồng bộ sang Dashboard Admin
    const allOrders = await orderRepo.findMany();
    getIo().emit('orders_updated', allOrders);

    res.status(201).json({
      message: 'Đặt hàng thành công',
      order: newOrder
    });
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Vui lòng cung cấp trạng thái status mới' });
    }

    const order = await orderRepo.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    const updatedOrder = await orderRepo.updateStatus(id, status);

    // Phát sự kiện realtime đồng bộ
    const allOrders = await orderRepo.findMany();
    getIo().emit('orders_updated', allOrders);

    res.json(updatedOrder);
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};
