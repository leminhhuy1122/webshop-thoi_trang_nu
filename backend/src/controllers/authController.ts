import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin name, email, password' });
    }

    const newUser = await AuthService.register(name, email, password);
    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error: any) {
    console.error('Lỗi đăng ký:', error);
    res.status(400).json({ message: error.message || 'Lỗi khi đăng ký tài khoản' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ email và password' });
    }

    const { accessToken, refreshToken, user } = await AuthService.login(email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });

    res.json({
      message: 'Đăng nhập thành công',
      accessToken,
      user
    });
  } catch (error: any) {
    console.error('Lỗi đăng nhập:', error);
    res.status(401).json({ message: error.message || 'Tài khoản hoặc mật khẩu không chính xác' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Không tìm thấy refresh token' });
    }

    const accessToken = await AuthService.refreshAccessToken(refreshToken);
    res.json({ accessToken });
  } catch (error: any) {
    console.error('Lỗi gia hạn token:', error);
    res.status(403).json({ message: error.message || 'Refresh token không hợp lệ hoặc đã hết hạn' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    console.error('Lỗi đăng xuất:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

export const redeemPoints = async (req: Request, res: Response) => {
  try {
    const userPayload = (req as any).user;
    if (!userPayload) {
      return res.status(401).json({ message: 'Người dùng chưa xác thực' });
    }

    const { points } = req.body;
    if (!points || typeof points !== 'number' || points <= 0) {
      return res.status(400).json({ message: 'Vui lòng cung cấp số điểm hợp lệ' });
    }

    // 1. Lấy thông tin user hiện tại từ repo
    const userRepo = RepositoryFactory.getUserRepository();
    const user = await userRepo.findById(userPayload.userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const userPoints = user.points !== undefined ? user.points : 0;
    if (userPoints < points) {
      return res.status(400).json({ message: 'Tài khoản không đủ điểm tích lũy' });
    }

    // 2. Xác định giá trị Voucher dựa trên số điểm quy đổi
    let discountValue = 0;
    if (points === 5000) {
      discountValue = 50000;
    } else if (points === 10000) {
      discountValue = 100000;
    } else if (points === 20000) {
      discountValue = 250000;
    } else {
      return res.status(400).json({ message: 'Mức quy đổi điểm không hợp lệ (Chấp nhận: 5000, 10000, 20000)' });
    }

    // 3. Trừ điểm người dùng
    const updatedUser = await userRepo.update(user.id, {
      points: userPoints - points
    });

    // 4. Tạo Voucher mới cho người dùng
    const voucherRepo = RepositoryFactory.getVoucherRepository();
    const voucherCode = `AURA-REDEEM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    await voucherRepo.create({
      code: voucherCode,
      type: 'FIXED',
      value: discountValue,
      minOrder: points === 5000 ? 300000 : points === 10000 ? 500000 : 1000000,
      usageLimit: 1,
      usedCount: 0,
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 ngày sử dụng
      isWelcome: false
    });

    res.json({
      message: 'Đổi điểm thành công',
      voucherCode,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        points: updatedUser.points,
        totalSpent: updatedUser.totalSpent
      }
    });

  } catch (error: any) {
    console.error('Lỗi quy đổi điểm:', error);
    res.status(500).json({ message: error.message || 'Lỗi hệ thống khi quy đổi điểm' });
  }
};
