import { useState, useEffect, useRef } from 'react';
import { Filter, Grid, List as ListIcon, ChevronDown, X, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { colors, sizes } from '../data/mockData';
import { useStore } from '../store/useStore';

export function Category() {
  const { products, categories: storeCategories } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Mới nhất');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number>(5000000);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Pagination / Infinite Scroll
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, priceRange, selectedColor, selectedSize, sortBy]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);

  // Quick mobile filter toggle
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterOpen]);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const filteredProducts = products.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    const currentPrice = product.salePrice || product.price;
    if (currentPrice > priceRange) return false;
    // Simple mock filters for colors and sizes since data model doesn't have it deeply embedded
    if (selectedColor && !colors.includes(selectedColor)) return false; 
    if (selectedSize && !sizes.includes(selectedSize)) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Giá tăng dần') return (a.salePrice || a.price) - (b.salePrice || b.price);
    if (sortBy === 'Giá giảm dần') return (b.salePrice || b.price) - (a.salePrice || a.price);
    if (sortBy === 'Bán chạy') return (b.sold || 0) - (a.sold || 0);
    return 0; // Mới nhất (default)
  });

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setPriceRange(5000000);
    setSelectedColor(null);
    setSelectedSize(null);
    if (window.innerWidth < 1024) toggleFilter();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Category Banner */}
      <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-12 lg:mb-16">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
          alt="Collection Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Bộ Sưu Tập</p>
          <h1 className="text-4xl md:text-6xl font-serif italic mb-4">Tất Cả Sản Phẩm</h1>
          <p className="text-sm max-w-xl mx-auto opacity-90 font-serif">
            Khám phá những thiết kế mới nhất mang đậm dấu ấn cá nhân, tôn vinh vẻ đẹp tự nhiên và sự tự tin của phái nữ.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Desktop Sidebar Filter / Mobile Drawer */}
        <div className={`
          fixed inset-0 z-50 bg-white lg:sticky lg:top-[120px] lg:h-[calc(100vh-140px)] lg:self-start lg:bg-transparent lg:w-64 lg:block flex-shrink-0 lg:z-10
          transition-transform duration-300 ease-in-out transform
          ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full overflow-y-auto p-6 lg:p-0 flex flex-col gap-8 no-scrollbar">
            <div className="flex justify-between items-center lg:hidden pb-4 border-b border-black/5">
              <h2 className="text-sm font-bold uppercase tracking-widest">Bộ lọc</h2>
              <button onClick={toggleFilter} className="p-2 -mr-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">Danh Mục</h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center text-sm font-medium">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`transition-colors ${selectedCategory === null ? 'text-black font-bold' : 'hover:opacity-60 text-black/60'}`}
                  >Tất cả</button>
                  <span className="text-[10px] text-black/40">{products.length}</span>
                </li>
                {storeCategories.map((cat: any) => (
                  <li key={cat.id} className="flex justify-between items-center text-sm">
                    <button 
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`transition-colors ${selectedCategory === cat.name ? 'text-black font-bold' : 'hover:text-black text-black/60'}`}
                    >{cat.name}</button>
                    <span className="text-[10px] text-black/40">{products.filter(p => p.category === cat.name).length}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="border-t border-black/5 pt-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">Mức Giá</h3>
              <div className="space-y-4">
                <input 
                  type="range" 
                  className="w-full accent-black touch-none" 
                  min="0" 
                  max="5000000" 
                  step="10000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                />
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-[#F3F2F0] px-3 py-2 rounded text-xs text-center">0đ</div>
                  <span className="text-black/40">-</span>
                  <div className="flex-1 bg-[#F3F2F0] px-3 py-2 rounded text-xs text-center">{formatPrice(priceRange)}</div>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="border-t border-black/5 pt-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">Màu Sắc</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedColor(selectedColor === 'Đen' ? null : 'Đen')}
                  className={`w-6 h-6 rounded-full bg-black ring-1 ring-black/10 transition-all ${selectedColor === 'Đen' ? 'ring-offset-2' : ''}`}
                ></button>
                <button 
                  onClick={() => setSelectedColor(selectedColor === 'Trắng' ? null : 'Trắng')}
                  className={`w-6 h-6 rounded-full bg-white ring-1 ring-black/10 transition-all ${selectedColor === 'Trắng' ? 'ring-offset-2' : ''}`}
                ></button>
                <button 
                  onClick={() => setSelectedColor(selectedColor === 'Be' ? null : 'Be')}
                  className={`w-6 h-6 rounded-full bg-[#E5E0D8] ring-1 ring-black/10 transition-all ${selectedColor === 'Be' ? 'ring-offset-2' : ''}`}
                ></button>
                <button 
                  onClick={() => setSelectedColor(selectedColor === 'Xanh Navy' ? null : 'Xanh Navy')}
                  className={`w-6 h-6 rounded-full bg-[#1C2C42] ring-1 ring-black/10 transition-all ${selectedColor === 'Xanh Navy' ? 'ring-offset-2' : ''}`}
                ></button>
                <button 
                  onClick={() => setSelectedColor(selectedColor === 'Đỏ' ? null : 'Đỏ')}
                  className={`w-6 h-6 rounded-full bg-[#8B2323] ring-1 ring-black/10 transition-all ${selectedColor === 'Đỏ' ? 'ring-offset-2' : ''}`}
                ></button>
              </div>
            </div>

            {/* Sizes */}
            <div className="border-t border-black/5 pt-6 mb-20 lg:mb-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">Kích Cỡ</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button 
                    key={size} 
                    onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                    className={`w-10 h-10 rounded border flex items-center justify-center text-xs transition-colors ${selectedSize === size ? 'border-black bg-black text-white' : 'border-black/10 hover:border-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile Filter Actions */}
          <div className="lg:hidden absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-black/5 flex gap-4">
            <button 
              onClick={handleClearFilters}
              className="flex-1 py-3 border border-black text-xs font-bold uppercase tracking-widest rounded-full"
            >
              Xóa bộ lọc
            </button>
            <button className="flex-1 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full" onClick={toggleFilter}>
              Áp dụng
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Floating Filter Button (Thumb Zone) */}
          <div className="lg:hidden fixed bottom-20 right-4 z-30">
            <button 
              className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
              onClick={toggleFilter}
              aria-label="Bộ lọc"
            >
              <Filter className="w-6 h-6" />
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between lg:justify-between pb-4 border-b border-black/5 mb-6">
            <div className="hidden lg:block text-xs text-black/60">
              Hiển thị {filteredProducts.length} sản phẩm
            </div>

            <div className="flex items-center gap-6">
              {/* View Toggle */}
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#F3F2F0] text-black' : 'text-black/40 hover:text-black'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#F3F2F0] text-black' : 'text-black/40 hover:text-black'}`}
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                >
                  Sắp xếp: {sortBy} <ChevronDown className="w-4 h-4" />
                </button>
                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-black/5 shadow-xl rounded-xl z-10 py-2">
                    {['Mới nhất', 'Giá tăng dần', 'Giá giảm dần', 'Bán chạy'].map((option) => (
                      <button 
                        key={option}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-[#F3F2F0] transition-colors ${sortBy === option ? 'font-bold' : ''}`}
                        onClick={() => {
                          setSortBy(option);
                          setIsSortOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Promotional Banner (Small) */}
          <div className="bg-[#EBE9E4] rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="relative z-10 flex-1">
              <span className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
                Ưu Đãi Đặc Quyền
              </span>
              <h3 className="text-xl md:text-2xl font-serif italic mb-2">Giảm 20% cho đơn hàng đầu tiên</h3>
              <p className="text-xs text-black/60 max-w-md">Sử dụng mã <strong className="text-black uppercase tracking-widest">AURA20</strong> tại trang thanh toán.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop" alt="Promo" className="absolute top-0 right-0 w-1/3 h-full object-cover mix-blend-overlay opacity-30 md:opacity-50" />
          </div>

          {/* Product Grid/List */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            : "flex flex-col gap-6"
          }>
            {filteredProducts.length > 0 ? (
              filteredProducts.slice(0, page * ITEMS_PER_PAGE).map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                <p className="text-black/60 mb-4">Không tìm thấy sản phẩm phù hợp.</p>
                <button onClick={handleClearFilters} className="px-6 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Infinite Scroll Observer Target */}
          {filteredProducts.length > 0 && page * ITEMS_PER_PAGE < filteredProducts.length && (
            <div ref={observerTarget} className="w-full flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-black/40" />
            </div>
          )}
          
          {filteredProducts.length > 0 && page * ITEMS_PER_PAGE >= filteredProducts.length && (
            <div className="w-full text-center py-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Bạn đã xem hết sản phẩm</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
