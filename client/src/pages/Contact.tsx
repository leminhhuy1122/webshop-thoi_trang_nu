import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { FormEvent } from 'react';
import { useStore } from '../store/useStore';

export function Contact() {
  const { addToast } = useStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addToast('Tin nhắn của bạn đã được gửi. Chúng tôi sẽ phản hồi sớm nhất.', 'success');
  };

  return (
    <div className="w-full flex-1">
      <div className="text-center mb-12 lg:mb-20">
        <h1 className="text-3xl md:text-5xl font-serif italic mb-4">Liên Hệ</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Chúng tôi luôn lắng nghe bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
        
        {/* Info & Map */}
        <div className="flex flex-col gap-10">
          <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl shadow-black/5">
            <h2 className="text-xl font-serif italic mb-8">Thông Tin Cửa Hàng</h2>
            
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#F3F2F0] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Địa chỉ</h4>
                  <p className="text-sm">123 Đường Đồng Khởi, Bến Nghé<br/>Quận 1, Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#F3F2F0] rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Hotline</h4>
                  <p className="text-sm font-bold">1900 1122</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#F3F2F0] rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Email</h4>
                  <p className="text-sm">hello@aura.vn</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#F3F2F0] rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Giờ mở cửa</h4>
                  <p className="text-sm">Thứ 2 - Chủ Nhật: 09:00 - 22:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="aspect-video bg-[#EBE9E4] rounded-3xl overflow-hidden relative grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2965615707747!2d106.69975761480088!3d10.776632992321404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4762b9a733%3A0x89fc3ef5c83f982!2zxJDhu5NuZyBLaOG7n2ksIFF14bqtbiAxLCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1683884812345!5m2!1svi!2s" 
              className="absolute inset-0 w-full h-full border-0" 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-black/5 shadow-xl shadow-black/5">
          <h2 className="text-xl font-serif italic mb-8">Gửi Tin Nhắn</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Họ và tên *</label>
              <input type="text" className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" required />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Email *</label>
              <input type="email" className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" required />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Số điện thoại</label>
              <input type="tel" className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Chủ đề *</label>
              <select className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" required>
                <option value="support">Hỗ trợ đơn hàng</option>
                <option value="feedback">Góp ý</option>
                <option value="partnership">Hợp tác kinh doanh</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Nội dung *</label>
              <textarea className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20 h-32 resize-none" required></textarea>
            </div>

            <button type="submit" className="w-full h-14 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors mt-2">
              Gửi tin nhắn
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
