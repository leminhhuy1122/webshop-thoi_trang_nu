import { Request, Response } from 'express';
import { AIService } from '../services/AIService';

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Vui lòng điền nội dung tin nhắn message' });
    }

    const reply = await AIService.consult(message, history || []);
    res.json({ reply });
  } catch (error: any) {
    console.error('Lỗi khi gọi API Trợ lý AI:', error);
    res.status(500).json({ message: error.message || 'Lỗi kết nối Trợ lý AI' });
  }
};
