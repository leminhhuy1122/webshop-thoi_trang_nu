import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
}

interface ProductCardProps {
  key?: string | number;
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart, setQuickViewProduct, toggleWishlist, wishlistItems } = useStore();

  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <div className="flex gap-6 group">
        <div className="relative aspect-[3/4] w-48 overflow-hidden bg-[#F3F2F0] rounded-xl flex-shrink-0 cursor-pointer" onClick={() => setQuickViewProduct(product)}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-[9px] font-bold uppercase text-[#1A1A1A]">Mới</span>
          )}
          {product.salePrice && (
            <span className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest">Sale</span>
          )}
        </div>
        <div className="flex flex-col justify-center py-4 flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1 font-bold">{product.category}</p>
              <Link to={`/product/${product.id}`} className="text-lg font-serif italic hover:text-black/70 transition-colors">
                {product.name}
              </Link>
            </div>
            <button 
              onClick={() => toggleWishlist(product)}
              className={`transition-colors ${isWishlisted ? 'text-red-500' : 'text-black/40 hover:text-red-500'}`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-lg font-bold">{formatPrice(product.salePrice || product.price)}</span>
            {product.salePrice && (
              <span className="text-xs line-through opacity-40">{formatPrice(product.price)}</span>
            )}
          </div>
          <p className="text-sm text-black/60 mb-6 line-clamp-2 max-w-lg">
            Thiết kế thanh lịch, tinh tế, phù hợp cho mọi dịp. Chất liệu cao cấp mang lại cảm giác thoải mái khi mặc.
          </p>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => addToCart(product)}
              className="w-fit flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-3 px-8 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Thêm vào giỏ
            </button>
            <button 
              onClick={() => setQuickViewProduct(product)}
              className="w-12 h-12 flex items-center justify-center bg-white border border-black/10 rounded-full hover:border-black transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col relative h-full">
      <Link to={`/product/${product.id}`} className="absolute inset-0 z-0"></Link>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3F2F0] rounded-2xl mb-3 cursor-pointer">
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-[9px] font-bold uppercase text-[#1A1A1A] z-10">Mới</span>
        )}
        {product.salePrice && (
          <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest z-10">Sale</span>
        )}
        
        {/* Quick actions on hover (Desktop) - Hidden on Mobile */}
        <div className="hidden md:flex absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2 translate-y-4 group-hover:translate-y-0 z-20">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
            className="flex-1 bg-white/90 backdrop-blur-sm text-[#1A1A1A] py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Thêm
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
            className={`w-12 bg-white/90 backdrop-blur-sm py-3 rounded-xl flex items-center justify-center hover:bg-white transition-colors ${isWishlisted ? 'text-red-500' : 'text-[#1A1A1A] hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 justify-between z-10 pointer-events-none">
        <div>
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-black/40 mb-1 font-bold">{product.category}</p>
          <h3 className="text-sm md:text-base font-serif italic mb-1 text-black line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
            <span className="text-sm md:text-base font-bold text-black">{formatPrice(product.salePrice || product.price)}</span>
            {product.salePrice && (
              <span className="text-[10px] md:text-xs line-through opacity-40">{formatPrice(product.price)}</span>
            )}
          </div>
          {/* Mobile Quick Add Button (Bottom Right) */}
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
            className="md:hidden w-11 h-11 flex-shrink-0 bg-black text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 pointer-events-auto"
            aria-label="Thêm vào giỏ"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
