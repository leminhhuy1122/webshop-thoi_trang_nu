import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, LayoutGrid } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function BottomNav() {
  const { cartCount, toggleSearch, toggleCart, user } = useStore();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-black/10 z-40 pb-safe">
      <div className="flex items-center justify-around h-16">
        <NavLink 
          to="/" 
          className={({isActive}) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-black' : 'text-black/40'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Trang chủ</span>
        </NavLink>
        
        <NavLink 
          to="/category" 
          className={({isActive}) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-black' : 'text-black/40'}`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Sản phẩm</span>
        </NavLink>

        <button 
          onClick={toggleSearch}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-black/40 hover:text-black"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Tìm kiếm</span>
        </button>

        <button 
          onClick={toggleCart}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-black/40 hover:text-black relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase">Giỏ hàng</span>
        </button>

        <NavLink 
          to={user ? "/account" : "/auth"} 
          className={({isActive}) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-black' : 'text-black/40'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Tài khoản</span>
        </NavLink>
      </div>
    </div>
  );
}
