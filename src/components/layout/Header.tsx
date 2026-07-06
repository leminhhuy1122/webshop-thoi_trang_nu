import { Search, Heart, ShoppingBag, User, Menu } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export function Header() {
  const { cartCount, wishlistCount, toggleCart, toggleSearch, toggleMobileMenu, user } = useStore();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 flex flex-col bg-white/80 backdrop-blur-md">
        {/* Top Bar - Announcement */}
        <div className="bg-[#1A1A1A] text-white text-[10px] sm:text-xs text-center py-2 px-4 uppercase font-bold tracking-widest">
          Miễn phí vận chuyển cho mọi đơn hàng từ 500k. <a href="#" className="underline ml-2">Mua ngay</a>
        </div>

        {/* Main Navigation */}
        <div className="px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Nav Container */}
            <div className="flex items-center gap-8 flex-1">
              {/* Mobile Menu Button - Hidden to prefer BottomNav */}
              <div className="hidden items-center lg:hidden">
                <button onClick={toggleMobileMenu} className="text-black/60 hover:text-black p-2 -ml-2">
                  <Menu className="h-5 w-5" />
                </button>
              </div>

              {/* Logo */}
              <Link to="/" className="flex flex-col flex-shrink-0">
                <span className="text-3xl font-serif font-black tracking-tighter uppercase italic bg-gradient-to-r from-black via-neutral-600 to-black bg-clip-text text-transparent drop-shadow-sm">
                  AURA.
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.3em] text-black/50 -mt-1">
                  Tôn vinh vẻ đẹp độc bản
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex gap-6 text-xs font-semibold uppercase tracking-widest">
                <NavLink to="/" end className={({isActive}) => `transition-colors pb-0.5 ${isActive ? 'text-black border-b border-black' : 'text-black/40 hover:text-black'}`}>Trang chủ</NavLink>
                <NavLink to="/category" className={({isActive}) => `transition-colors pb-0.5 ${isActive ? 'text-black border-b border-black' : 'text-black/40 hover:text-black'}`}>Sản phẩm</NavLink>
                <NavLink to="/blog" className={({isActive}) => `transition-colors pb-0.5 ${isActive ? 'text-black border-b border-black' : 'text-black/40 hover:text-black'}`}>Tạp chí</NavLink>
                <NavLink to="/contact" className={({isActive}) => `transition-colors pb-0.5 ${isActive ? 'text-black border-b border-black' : 'text-black/40 hover:text-black'}`}>Liên hệ</NavLink>
              </nav>
            </div>

            {/* Icons & Search */}
            <div className="flex items-center gap-3 sm:gap-5 justify-end">
              <div className="hidden md:flex relative group cursor-pointer" onClick={toggleSearch}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                <input type="text" placeholder="Tìm kiếm..." readOnly className="bg-[#F3F2F0] rounded-full py-2 pl-9 pr-4 text-xs w-48 outline-none cursor-pointer group-hover:bg-[#EBE9E4] transition-colors" />
              </div>
              
              <div className="flex gap-2 sm:gap-4 items-center">
                <button onClick={toggleSearch} className="md:hidden text-black/60 hover:text-black">
                  <Search className="h-5 w-5" />
                </button>

                <Link to={user ? "/account" : "/auth"} className="hidden sm:block text-black/60 hover:text-black">
                  <User className="h-5 w-5" />
                </Link>

                
                <Link to="/account" className="text-black/60 hover:text-black relative">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E8CFCF] rounded-full text-[8px] flex items-center justify-center font-bold text-black">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                
                <button 
                  onClick={toggleCart}
                  className="text-black/60 hover:text-black relative"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-black text-white rounded-full text-[8px] flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </header>
      {/* Spacer for fixed header (Announcement: ~32px, Nav: 64px = 96px total approx) */}
      <div className="h-[96px]"></div>
    </>
  );
}
