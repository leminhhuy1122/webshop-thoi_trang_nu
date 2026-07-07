import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Link, useNavigate } from 'react-router-dom';

export function CartDrawer() {
  const { isCartOpen, toggleCart, cartCount, cartItems, updateCartQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();

  const isEmpty = cartItems.length === 0;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.salePrice || item.product.price) * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" 
        onClick={toggleCart}
      />
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col shadow-2xl transition-transform transform translate-x-0">
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h2 className="text-xl font-serif italic">Giỏ Hàng <span className="text-sm font-sans not-italic text-black/40">({cartCount})</span></h2>
          <button onClick={toggleCart} className="p-2 hover:bg-[#F3F2F0] rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-[#F3F2F0] rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-black/20" />
            </div>
            <h3 className="text-lg font-serif italic mb-2">Giỏ hàng trống</h3>
            <p className="text-sm text-black/60 mb-8 max-w-[250px]">Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các bộ sưu tập của chúng tôi.</p>
            <button 
              onClick={() => {
                toggleCart();
                navigate('/category');
              }}
              className="px-8 h-14 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-lg shadow-black/20"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex gap-4 group">
                  <div className="w-24 h-32 bg-[#F3F2F0] rounded-xl overflow-hidden flex-shrink-0 relative">
                    <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col flex-1 py-1">
                    <div className="flex justify-between items-start mb-1">
                      <Link to={`/product/${item.product.id}`} onClick={toggleCart} className="text-sm font-bold hover:opacity-70 line-clamp-1">{item.product.name}</Link>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-black/40 hover:text-red-500 transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-black/60 mb-2">{item.color} / {item.size}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center border border-black/10 rounded-full h-8 bg-white">
                        <button 
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-8 h-full flex items-center justify-center hover:bg-black/5 rounded-l-full transition-colors"
                        >-</button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center hover:bg-black/5 rounded-r-full transition-colors"
                        >+</button>
                      </div>
                      <span className="text-sm font-bold">{formatPrice(item.product.salePrice || item.product.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-black/5 bg-[#FAF9F6]">
              <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-black/60">Tạm tính</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center mb-6 text-sm">
                <span className="text-black/60">Vận chuyển</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-bold">Tổng cộng</span>
                <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
              </div>
              <button 
                onClick={() => {
                  toggleCart();
                  navigate('/checkout');
                }}
                className="w-full h-14 bg-black text-white rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-lg shadow-black/20"
              >
                Thanh toán <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={toggleCart}
                className="w-full h-14 mt-3 bg-white border border-black/10 text-black rounded-full flex items-center justify-center text-xs font-bold uppercase tracking-widest hover:border-black transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
