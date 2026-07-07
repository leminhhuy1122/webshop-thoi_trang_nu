import { Router } from 'express';
import { register, login, refresh, logout, redeemPoints } from '../controllers/authController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/redeem-points', authenticateJWT, redeemPoints);

export default router;
