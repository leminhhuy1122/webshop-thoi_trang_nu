import { X, Search, Heart, User, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export function MobileMenu() {
  const { isMobileMenuOpen, toggleMobileMenu, toggleSearch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isMobileMenuOpen) return null;

  const navigateTo = (path: string) => {
    toggleMobileMenu();
    navigate(path);
  };
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity lg:hidden" 
        onClick={toggleMobileMenu}
      />
      <div className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-50 flex flex-col shadow-2xl transition-transform transform translate-x-0 lg:hidden overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <Link to="/" onClick={toggleMobileMenu} className="text-2xl font-serif font-black italic tracking-tighter">AURA</Link>
          <button onClick={toggleMobileMenu} className="p-2 hover:bg-[#F3F2F0] rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Mobile */}
        <div className="p-6 pb-0">
          <div 
            className="flex items-center gap-3 bg-[#F3F2F0] rounded-xl px-4 py-3 cursor-text"
            onClick={() => {
              toggleMobileMenu();
              toggleSearch();
            }}
          >
            <Search className="w-4 h-4 text-black/40" />
            <span className="text-xs text-black/40 font-bold uppercase tracking-widest">Tìm kiếm...</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-6 gap-2 flex-1">
          <button onClick={() => navigateTo('/')} className="flex items-center justify-between py-4 text-left group">
            <span className={`text-lg font-serif italic transition-colors ${isActive('/') ? 'text-black' : 'group-hover:text-black/60'}`}>Trang chủ</span>
            <ArrowRight className={`w-4 h-4 transition-all ${isActive('/') ? 'text-black translate-x-1' : 'text-black/20 group-hover:text-black/60 group-hover:translate-x-1'}`} />
          </button>
          
          <button onClick={() => navigateTo('/category')} className="flex items-center justify-between py-4 text-left group">
            <span className={`text-lg font-serif italic transition-colors ${isActive('/category') ? 'text-black' : 'group-hover:text-black/60'}`}>Sản phẩm</span>
            <ArrowRight className={`w-4 h-4 transition-all ${isActive('/category') ? 'text-black translate-x-1' : 'text-black/20 group-hover:text-black/60 group-hover:translate-x-1'}`} />
          </button>
          
          <button onClick={() => navigateTo('/blog')} className="flex items-center justify-between py-4 text-left group">
            <span className={`text-lg font-serif italic transition-colors ${isActive('/blog') ? 'text-black' : 'group-hover:text-black/60'}`}>Tạp chí</span>
            <ArrowRight className={`w-4 h-4 transition-all ${isActive('/blog') ? 'text-black translate-x-1' : 'text-black/20 group-hover:text-black/60 group-hover:translate-x-1'}`} />
          </button>
          
          <button onClick={() => navigateTo('/contact')} className="flex items-center justify-between py-4 text-left group border-b border-black/5 pb-8 mb-4">
            <span className={`text-lg font-serif italic transition-colors ${isActive('/contact') ? 'text-black' : 'group-hover:text-black/60'}`}>Liên hệ</span>
            <ArrowRight className={`w-4 h-4 transition-all ${isActive('/contact') ? 'text-black translate-x-1' : 'text-black/20 group-hover:text-black/60 group-hover:translate-x-1'}`} />
          </button>

          <button onClick={() => navigateTo('/auth')} className="flex items-center gap-3 py-3 text-sm font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors">
            <User className="w-5 h-5" /> Đăng nhập / Đăng ký
          </button>
          
          <button onClick={() => navigateTo('/account')} className="flex items-center gap-3 py-3 text-sm font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors">
            <Heart className="w-5 h-5" /> Yêu thích
          </button>
        </nav>
        
        {/* Footer */}
        <div className="p-6 bg-[#FAF9F6] text-[10px] text-black/40 uppercase tracking-widest font-bold text-center">
          © 2026 AURA. All rights reserved.
        </div>
      </div>
    </>
  );
}
