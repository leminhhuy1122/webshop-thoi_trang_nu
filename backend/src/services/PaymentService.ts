export class PaymentService {
  /**
   * Tạo yêu cầu thanh toán
   * @param orderId ID của đơn hàng cần thanh toán
   * @param amount Số tiền giao dịch
   * @param recipientEmail Email nhận hóa đơn
   */
  static async createPaymentRequest(orderId: string, amount: number, recipientEmail: string): Promise<{ paymentUrl: string; redirect: boolean }> {
    if (process.env.DEMO_MODE === 'true') {
      console.log(`[Payment Demo] Tạo giao dịch ảo thành công cho đơn hàng: ${orderId}, Số tiền: ${amount}đ`);
      // Demo mode: trả về trực tiếp trang đặt hàng thành công của client
      return {
        paymentUrl: `/checkout?status=success&orderId=${orderId}`,
        redirect: false
      };
    }

    // Production mode: Tích hợp với cổng thanh toán Sandbox (Ví dụ Momo / ZaloPay)
    console.log(`[Payment Production] Đang kết nối cổng thanh toán cho đơn hàng: ${orderId}, Số tiền: ${amount}đ`);
    
    // Giả lập tích hợp ZaloPay Sandbox
    const payUrl = `https://sandbox.zalopay.com.vn/pay?orderId=${orderId}&amount=${amount}`;
    return {
      paymentUrl: payUrl,
      redirect: true
    };
  }

  /**
   * Xử lý Webhook (IPN) phản hồi kết quả từ cổng thanh toán
   */
  static async verifyPaymentWebhook(payload: any): Promise<{ orderId: string; status: 'PAID' | 'FAILED' }> {
    if (process.env.DEMO_MODE === 'true') {
      return {
        orderId: payload.orderId || '',
        status: 'PAID'
      };
    }

    // Production mode: Xác thực chữ ký mã hóa (Signature/Checksum verification)
    console.log('[Payment Production] Xác thực chữ ký số webhook IPN...');
    // Giả lập kiểm tra checksum thành công
    return {
      orderId: payload.orderId || '',
      status: payload.status === 'success' ? 'PAID' : 'FAILED'
    };
  }
}
