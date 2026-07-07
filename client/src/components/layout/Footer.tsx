import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand & Contact */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-serif font-bold tracking-tight uppercase italic text-[#1A1A1A]">
              AURA.
            </Link>
            <p className="text-black/60 text-[11px] leading-relaxed max-w-xs">
              Thương hiệu thời trang nữ cao cấp, định hình phong cách thanh lịch và hiện đại cho phái đẹp.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-[11px] text-black/60">
                <MapPin className="h-3 w-3 mr-3 text-black/40" />
                123 Đường Fashion, Quận 1, TP.HCM
              </div>
              <div className="flex items-center text-[11px] text-black/60">
                <Phone className="h-3 w-3 mr-3 text-black/40" />
                0123 456 789
              </div>
              <div className="flex items-center text-[11px] text-black/60">
                <Mail className="h-3 w-3 mr-3 text-black/40" />
                hello@aura.com
              </div>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-6">Chính sách</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-[11px] text-black/60 hover:text-black transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="text-[11px] text-black/60 hover:text-black transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="text-[11px] text-black/60 hover:text-black transition-colors">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="text-[11px] text-black/60 hover:text-black transition-colors">Hình thức thanh toán</a></li>
              <li><a href="#" className="text-[11px] text-black/60 hover:text-black transition-colors">Đơn vị vận chuyển</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-6">Hỗ trợ</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-[11px] text-black/60 hover:text-black transition-colors">FAQ</a></li>
              <li><a href="#" className="text-[11px] text-black/60 hover:text-black transition-colors">Hướng dẫn chọn size</a></li>
              <li><a href="#" className="text-[11px] text-black/60 hover:text-black transition-colors">Kiểm tra đơn hàng</a></li>
              <li><Link to="/contact" className="text-[11px] text-black/60 hover:text-black transition-colors">Liên hệ</Link></li>
              <li><Link to="/blog" className="text-[11px] text-black/60 hover:text-black transition-colors">Tạp chí Aura</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-6">Đăng ký nhận tin</h3>
            <p className="text-[11px] text-black/60 mb-4">Nhận thông tin về sản phẩm mới và khuyến mãi sớm nhất.</p>
            <form className="relative mt-2">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="w-full bg-[#F3F2F0] rounded-full py-3 px-4 text-[10px] outline-none text-[#1A1A1A]"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 bottom-2 bg-black text-white px-4 rounded-full text-[10px] font-bold uppercase hover:bg-neutral-800 transition-colors"
              >
                Gửi
              </button>
            </form>
            <div className="flex space-x-4 mt-8">
              <a href="#" className="text-black/40 hover:text-black transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-black/40 hover:text-black transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-black/40 hover:text-black transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>
        <div className="mt-12 pt-6 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-8 text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Mở cửa: 09:00 - 21:00</span>
          </div>
          <p className="text-[9px] text-black/40 uppercase tracking-widest font-bold">© 2026 AURA Fashion.</p>
          <div className="flex items-center gap-3 opacity-40">
            <span className="text-[9px] font-bold uppercase">VN</span>
            <span className="text-[9px] font-bold uppercase">VND</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
