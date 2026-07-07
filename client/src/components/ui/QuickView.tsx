import { X, ShoppingBag } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

export function QuickView() {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useStore();
  const navigate = useNavigate();

  if (!quickViewProduct) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleClose = () => {
    setQuickViewProduct(null);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-in fade-in"
        onClick={handleClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white z-50 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh]">
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="w-full md:w-1/2 h-64 md:h-[600px] bg-[#F3F2F0]">
          <img src={quickViewProduct.image} alt={quickViewProduct.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3">{quickViewProduct.category}</p>
          <h2 className="text-3xl font-serif italic mb-4">{quickViewProduct.name}</h2>
          
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-2xl font-bold">{formatPrice(quickViewProduct.salePrice || quickViewProduct.price)}</span>
            {quickViewProduct.salePrice && (
              <span className="text-sm line-through opacity-40">{formatPrice(quickViewProduct.price)}</span>
            )}
          </div>

          <p className="text-sm text-black/60 font-serif mb-8 line-clamp-3">
            Thiết kế thanh lịch với chất liệu cao cấp, mang đến vẻ đẹp tự nhiên và cảm giác thoải mái tuyệt đối cho người mặc. Phù hợp cho mọi dịp từ công sở đến những buổi tiệc tối.
          </p>

          <div className="mt-auto flex flex-col gap-3">
            <button 
              onClick={() => {
                addToCart(quickViewProduct);
                handleClose();
              }}
              className="w-full h-14 bg-black text-white rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-lg shadow-black/20"
            >
              <ShoppingBag className="w-4 h-4" /> Thêm vào giỏ
            </button>
            <button 
              onClick={() => {
                handleClose();
                navigate(`/product/${quickViewProduct.id}`);
              }}
              className="w-full h-14 bg-white border border-black/10 text-black rounded-full flex items-center justify-center text-xs font-bold uppercase tracking-widest hover:border-black transition-colors"
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
