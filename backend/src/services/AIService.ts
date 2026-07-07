import { GoogleGenAI } from '@google/genai';
import { RepositoryFactory } from '../repositories/RepositoryFactory';

export class AIService {
  private static productRepo = RepositoryFactory.getProductRepository();

  /**
   * Tư vấn mua sắm thời trang
   * @param userMessage Tin nhắn từ khách hàng
   * @param chatHistory Lịch sử hội thoại (dạng mảng tin nhắn)
   */
  static async consult(userMessage: string, chatHistory: any[] = []): Promise<string> {
    // 1. Chế độ DEMO_MODE
    if (process.env.DEMO_MODE === 'true') {
      console.log('[AI Demo] Trả lời tin nhắn trong chế độ Demo...');
      const msg = userMessage.toLowerCase();
      if (msg.includes('váy') || msg.includes('đầm')) {
        return 'Chào bạn! Aura đang có mẫu **Váy Lụa Midnight** dáng suông thanh lịch bằng lụa satin (890.000đ) và **Đầm Dạ Hội Cổ Điển** đính đá sang trọng (2.500.000đ). Bạn thích phom dáng thoải mái hay ôm dáng quyến rũ?';
      }
      if (msg.includes('áo') || msg.includes('blazer')) {
        return 'Chào bạn! Aura khuyên bạn nên thử mẫu **Blazer Linen Trắng** (1.200.000đ) đứng phom đứng rất tôn dáng và nhẹ mát. Bạn có thể phối cùng **Áo Sơ Mi Lụa** (850.000đ) để hoàn thiện phong cách công sở.';
      }
      return 'Cảm ơn bạn đã trò chuyện với AURA AI. Tôi có thể giúp bạn tìm các mẫu áo khoác blazer, chân váy lụa hoặc tư vấn size phù hợp nhất với chiều cao cân nặng của bạn. Hãy cho tôi biết nhu cầu của bạn nhé!';
    }

    // 2. Chế độ PRODUCTION_MODE (Google Gemini API)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      throw new Error('Chưa cấu hình GEMINI_API_KEY trong tệp môi trường .env');
    }

    try {
      // Lấy danh sách sản phẩm thực tế từ Database làm ngữ cảnh
      const { products } = await this.productRepo.findMany({ limit: 100 });
      
      const productContext = products.map((p: any) => {
        return `- Tên: ${p.name}, Giá: ${p.price}đ, Khuyến mãi: ${p.salePrice ? p.salePrice + 'đ' : 'Không'}, Danh mục: ${p.category?.name || 'Chưa phân loại'}, Size: ${p.sizes?.join(', ')}, Màu sắc: ${p.colors?.join(', ')}, Mô tả: ${p.description}`;
      }).join('\n');

      const systemInstruction = `
Bạn là Trợ lý Mua Sắm AI thông minh, nhiệt tình và thân thiện của cửa hàng thời trang cao cấp AURA.
Nhiệm vụ của bạn là hỗ trợ, tư vấn lựa chọn sản phẩm và giải đáp thắc mắc cho khách hàng.

Dưới đây là danh sách các sản phẩm ĐANG BÁN tại cửa hàng AURA:
${productContext}

QUY TẮC BẮT BUỘC:
1. Bạn CHỈ được phép tư vấn và khuyên dùng các sản phẩm có tên trong danh sách trên. Không được tự ý bịa đặt sản phẩm không có thật.
2. Trả lời bằng tiếng Việt lịch sự, nhã nhặn, mang phong thái thời trang cao cấp.
3. Không trả lời các câu hỏi ngoài phạm vi thời trang, mua sắm hoặc thông tin về cửa hàng AURA. Nếu khách hàng hỏi ngoài phạm vi, hãy từ chối khéo léo và hướng họ về các sản phẩm thời trang của AURA.
4. Ưu tiên đề xuất sản phẩm đang có giá khuyến mãi (salePrice).
`;

      const ai = new GoogleGenAI({ apiKey });
      
      // Xây dựng format contents và history theo chuẩn API mới của @google/genai
      const contents = [
        { role: 'user', parts: [{ text: userMessage }] }
      ];

      // Thêm lịch sử trò chuyện nếu có
      if (chatHistory && chatHistory.length > 0) {
        const formattedHistory = chatHistory.map((chat: any) => ({
          role: chat.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: chat.text || chat.content }]
        }));
        contents.unshift(...formattedHistory);
      }

      console.log('[AI Production] Gửi yêu cầu tới mô hình Gemini...');
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction
        }
      });

      const replyText = response.text || '';
      return replyText;
    } catch (error) {
      console.error('Lỗi khi gọi Google Gemini API:', error);
      throw new Error('Lỗi khi kết nối tới trợ lý thông minh Google Gemini AI');
    }
  }
}
