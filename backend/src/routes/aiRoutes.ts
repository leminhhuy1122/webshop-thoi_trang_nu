import { Router } from 'express';
import { chatWithAI } from '../controllers/aiController';

const router = Router();

// Endpoint trò chuyện tư vấn thời trang với AI
router.post('/chat', chatWithAI);

export default router;
