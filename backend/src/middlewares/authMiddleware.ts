import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';

// Mở rộng kiểu Request của Express để chứa trường user
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Định dạng "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: 'Định dạng token không đúng (Yêu cầu: Bearer <token>)' });
    }

    try {
      const decoded = verifyAccessToken(token);
      (req as AuthenticatedRequest).user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  } else {
    return res.status(401).json({ message: 'Yêu cầu token xác thực trong Header Authorization' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({ message: 'Không thể xác định thông tin người dùng' });
    }

    if (allowedRoles.includes(user.role)) {
      next();
    } else {
      return res.status(403).json({ message: 'Tài khoản không đủ quyền truy cập tài nguyên này' });
    }
  };
};
