import bcrypt from 'bcrypt';
import { RepositoryFactory } from '../repositories/RepositoryFactory';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export class AuthService {
  private static userRepo = RepositoryFactory.getUserRepository();

  static async register(name: string, email: string, password: string) {
    const emailLower = email.toLowerCase();
    const existing = await this.userRepo.findByEmail(emailLower);
    
    if (existing) {
      throw new Error('Email đã được đăng ký sử dụng');
    }

    if (process.env.DEMO_MODE === 'true') {
      // Demo mode: lưu trực tiếp vào JSON không cần mã hóa phức tạp
      return this.userRepo.create({
        name,
        email: emailLower,
        passwordHash: password, // Không hash để phục vụ demo nhanh
        role: 'CUSTOMER'
      });
    } else {
      // Production mode: Mã hóa bcrypt
      const passwordHash = await bcrypt.hash(password, 10);
      return this.userRepo.create({
        name,
        email: emailLower,
        passwordHash,
        role: 'CUSTOMER'
      });
    }
  }

  static async login(email: string, password: string) {
    const emailLower = email.toLowerCase();

    // 1. Chế độ DEMO_MODE
    if (process.env.DEMO_MODE === 'true') {
      // Hỗ trợ đăng nhập nhanh bằng tài khoản demo mà không check password
      if (emailLower === 'admin@demo.com' || emailLower === 'admin@aura.com') {
        const payload = { userId: 'admin-1', email: 'admin@demo.com', role: 'ADMIN' };
        return {
          accessToken: generateAccessToken(payload),
          refreshToken: generateRefreshToken(payload),
          user: { id: 'admin-1', name: 'Aura Admin (Demo)', email: 'admin@demo.com', role: 'ADMIN', points: 50000, totalSpent: 25000000 }
        };
      }
      
      if (emailLower === 'customer@demo.com') {
        const payload = { userId: 'cust-1', email: 'customer@demo.com', role: 'CUSTOMER' };
        return {
          accessToken: generateAccessToken(payload),
          refreshToken: generateRefreshToken(payload),
          user: { id: 'cust-1', name: 'Khách hàng Aura (Demo)', email: 'customer@demo.com', role: 'CUSTOMER', points: 15000, totalSpent: 5000000 }
        };
      }

      // Đọc từ file JSON nếu người dùng tự đăng ký trong Demo
      const user = await this.userRepo.findByEmail(emailLower);
      if (!user) {
        throw new Error('Tài khoản hoặc mật khẩu demo không chính xác');
      }

      const payload = { userId: user.id, email: user.email, role: user.role };
      return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
        user: { id: user.id, name: user.name, email: user.email, role: user.role, points: user.points || 0, totalSpent: user.totalSpent || 0 }
      };
    }

    // 2. Chế độ PRODUCTION_MODE
    const user = await this.userRepo.findByEmail(emailLower);
    if (!user || user.isDeleted) {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role, points: user.points || 0, totalSpent: user.totalSpent || 0 }
    };
  }

  static async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await this.userRepo.findById(decoded.userId);

      if (!user || user.isDeleted) {
        throw new Error('Tài khoản không tồn tại hoặc đã bị khóa');
      }

      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      return generateAccessToken(payload);
    } catch (err) {
      throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }
}
