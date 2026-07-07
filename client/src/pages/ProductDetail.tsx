import { useState, MouseEvent, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Share2, Ruler, Truck, ShieldCheck, ChevronRight, RotateCcw, Shield, X, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { sizes } from '../data/mockData';
import { ProductCard } from '../components/product/ProductCard';

const mockColors = [
  { name: 'Đen', hex: '#1A1A1A' },
  { name: 'Trắng', hex: '#FFFFFF' },
  { name: 'Be', hex: '#E5E0D8' },
];

export function ProductDetail() {
  const { id } = useParams();
  const { products, addToCart, toggleWishlist, wishlistItems } = useStore();
  const product = products.find(p => p.id === id) || products[0];
  const relatedProducts = products.filter(p => p.id !== product?.id).slice(0, 4);
  const crossSellProducts = products.filter(p => p.id !== product?.id).reverse().slice(0, 4);
  
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  
  const [mainImage, setMainImage] = useState(product?.image);

  // Initialize selected values when product loads
  useEffect(() => {
    if (product) {
      setMainImage(product.image);
      const productColors = product.colors && product.colors.length > 0 ? product.colors : mockColors.map(c => c.name);
      
      let initialSize = sizes[0];
      if (product.sizes && product.sizes.length > 0) {
        const firstSize = product.sizes[0];
        initialSize = typeof firstSize === 'object' ? firstSize.name : firstSize;
      }
      setSelectedColor(productColors[0]);
      setSelectedSize(initialSize);
    }
  }, [product]);

  if (!product) {
    return <div className="py-20 text-center flex-1 w-full">Loading...</div>;
  }

  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const gallery = [
    product.image,
    ...(product.images || [])
  ];
  if (gallery.length === 1 && (!product.images || product.images.length === 0)) {
      // Fallback mockup gallery
      gallery.push(
        'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1972&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=1962&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594938328870-985fa7ab9bfa?q=80&w=2000&auto=format&fit=crop'
      );
  }

  const productColors = product.colors && product.colors.length > 0 ? product.colors : mockColors.map(c => c.name);
  const productSizesRaw = product.sizes && product.sizes.length > 0 ? product.sizes : sizes;
  const productSizes = productSizesRaw.map((s: any) => typeof s === 'object' ? s : { name: s, stock: null });

  // Get stock for currently selected size
  const selectedSizeData = productSizes.find((s: any) => s.name === selectedSize);
  const isOutOfStock = selectedSizeData?.stock === 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleZoom = (e: MouseEvent<HTMLDivElement>) => {
    const img = e.currentTarget.querySelector('img');
    if (!img) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <div className="w-full mx-auto flex-1 flex flex-col gap-12 sm:gap-20 pb-20 mt-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40">
        <Link to="/" className="hover:text-black transition-colors">Trang chủ</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/category" className="hover:text-black transition-colors">{product.category}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-black line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Product Gallery */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:h-[700px]">
          {/* Thumbnail Strip */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:w-24 scrollbar-hide">
            {gallery.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={`flex-shrink-0 w-20 h-24 lg:w-full lg:h-32 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-black' : 'border-transparent hover:border-black/20'}`}
              >
                <img src={img} alt={`Thumb ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Image with Zoom */}
          <div 
            className="flex-1 bg-[#F3F2F0] rounded-3xl overflow-hidden relative group cursor-zoom-in"
            onMouseMove={handleZoom}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transformOrigin = 'center';
            }}
          >
            <img 
              src={mainImage} 
              alt={product.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-150"
            />
            {product.isNew && (
              <span className="absolute top-6 left-6 bg-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase text-[#1A1A1A] z-10 shadow-sm">Mới</span>
            )}
            {product.salePrice && (
              <span className="absolute top-6 right-6 bg-red-600 text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest z-10 shadow-sm">Sale</span>
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-black/40 mb-3">{product.category}</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-1 text-black">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 text-black/20" />
                  <span className="text-xs font-bold ml-2">(4.2)</span>
                </div>
                <span className="text-xs text-black/40 uppercase tracking-widest font-bold">Đã bán: {product.sold}</span>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold">{formatPrice(product.salePrice || product.price)}</span>
                {product.salePrice && (
                  <span className="text-lg line-through opacity-40">{formatPrice(product.price)}</span>
                )}
              </div>
            </div>
            
            <button className="w-10 h-10 rounded-full bg-[#F3F2F0] flex items-center justify-center hover:bg-[#EBE9E4] transition-colors text-black/60 hover:text-black">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="h-px w-full bg-black/5 mb-8"></div>

          {/* Color Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">Màu sắc: {selectedColor}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {productColors.map((colorName: string) => {
                const isMock = mockColors.find(c => c.name === colorName);
                const bgStyle = isMock ? { backgroundColor: isMock.hex } : {};
                return (
                  <button 
                    key={colorName}
                    onClick={() => setSelectedColor(colorName)}
                    className={`w-auto min-w-10 h-10 px-3 rounded-full flex items-center justify-center transition-all text-xs font-bold ${selectedColor === colorName ? 'ring-2 ring-black ring-offset-2' : 'ring-1 ring-black/10 hover:ring-black/50'}`}
                    style={bgStyle}
                    title={colorName}
                  >
                    {!isMock && colorName}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">Kích cỡ: {selectedSize}</span>
              <button onClick={() => setShowSizeGuide(true)} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors">
                <Ruler className="w-3 h-3" /> Hướng dẫn chọn size
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {productSizes.map((sizeObj: any) => {
                const isSizeOutOfStock = sizeObj.stock === 0;
                return (
                  <button 
                    key={sizeObj.name}
                    onClick={() => !isSizeOutOfStock && setSelectedSize(sizeObj.name)}
                    disabled={isSizeOutOfStock}
                    className={`min-w-12 h-12 px-3 rounded-xl flex flex-col items-center justify-center transition-colors relative overflow-hidden
                      ${isSizeOutOfStock ? 'opacity-50 cursor-not-allowed border border-black/10 text-black/40' : 
                        selectedSize === sizeObj.name ? 'bg-black text-white' : 'border border-black/10 hover:border-black'}`}
                  >
                    <span className="text-xs font-bold">{sizeObj.name}</span>
                    {isSizeOutOfStock && (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                        <div className="w-full h-px bg-red-500/50 rotate-45"></div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions - Desktop / Inline Mobile */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center border border-black/10 rounded-full h-14 bg-white ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-full flex items-center justify-center text-lg hover:bg-black/5 rounded-l-full transition-colors"
              >-</button>
              <span className="w-12 text-center text-sm font-bold">{quantity}</span>
              <button 
                onClick={() => {
                  if (selectedSizeData?.stock != null && quantity >= selectedSizeData.stock) return;
                  setQuantity(quantity + 1);
                }}
                className="w-12 h-full flex items-center justify-center text-lg hover:bg-black/5 rounded-r-full transition-colors"
              >+</button>
            </div>
            
            <button 
              onClick={() => addToCart(product, quantity, selectedSize, selectedColor)}
              disabled={isOutOfStock}
              className={`hidden md:flex flex-1 h-14 rounded-full items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors shadow-lg
                ${isOutOfStock ? 'bg-black/10 text-black/40 cursor-not-allowed shadow-none' : 'bg-black text-white hover:bg-neutral-800 shadow-black/20'}`}
            >
              {isOutOfStock ? 'Hết hàng' : <><ShoppingBag className="w-4 h-4" /> Thêm vào giỏ</>}
            </button>
            
            <button 
              onClick={() => toggleWishlist(product)}
              className={`hidden md:flex w-14 h-14 rounded-full border border-black/10 items-center justify-center hover:border-black transition-colors bg-white flex-shrink-0 ${isWishlisted ? 'text-red-500' : 'hover:text-red-500'}`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Mobile Fixed Bottom Action Bar */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-black/10 z-40 flex items-center gap-3">
            <button 
              onClick={() => toggleWishlist(product)}
              className={`w-12 h-12 rounded-full border border-black/10 flex items-center justify-center bg-white flex-shrink-0 ${isWishlisted ? 'text-red-500' : 'text-black hover:text-red-500'}`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => addToCart(product, quantity, selectedSize, selectedColor)}
              disabled={isOutOfStock}
              className={`flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest shadow-lg
                ${isOutOfStock ? 'bg-black/10 text-black/40 cursor-not-allowed shadow-none' : 'bg-black text-white'}`}
            >
              {isOutOfStock ? 'Hết hàng' : <><ShoppingBag className="w-4 h-4" /> Thêm vào giỏ</>}
            </button>
          </div>

          {/* Brand Guarantees */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 py-6 border-y border-black/5">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-[#F3F2F0] rounded-full flex items-center justify-center"><Truck className="w-4 h-4 text-black/60" /></div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-black/60">Giao hàng 2-3 ngày</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-[#F3F2F0] rounded-full flex items-center justify-center"><RotateCcw className="w-4 h-4 text-black/60" /></div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-black/60">Đổi trả 7 ngày</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 col-span-2 md:col-span-1">
              <div className="w-10 h-10 bg-[#F3F2F0] rounded-full flex items-center justify-center"><Shield className="w-4 h-4 text-black/60" /></div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-black/60">Bảo hành 1 năm</p>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-[#F3F2F0] p-4 rounded-2xl flex gap-3 items-center hover:bg-[#EBE9E4] transition-colors cursor-default">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                <Truck className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest">Miễn phí ship</p>
                <p className="text-[10px] text-black/60">Từ 500k</p>
              </div>
            </div>
            <div className="bg-[#F3F2F0] p-4 rounded-2xl flex gap-3 items-center hover:bg-[#EBE9E4] transition-colors cursor-default">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest">Đổi trả 30 ngày</p>
                <p className="text-[10px] text-black/60">Dễ dàng</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Product Info Tabs */}
      <div className="mt-10 lg:mt-20">
        <div className="flex items-center gap-8 border-b border-black/10 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('desc')}
            className={`pb-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors relative ${activeTab === 'desc' ? 'text-black' : 'text-black/40 hover:text-black'}`}
          >
            Mô tả sản phẩm
            {activeTab === 'desc' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors relative ${activeTab === 'specs' ? 'text-black' : 'text-black/40 hover:text-black'}`}
          >
            Thông số chi tiết
            {activeTab === 'specs' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('guide')}
            className={`pb-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors relative ${activeTab === 'guide' ? 'text-black' : 'text-black/40 hover:text-black'}`}
          >
            Hướng dẫn bảo quản
            {activeTab === 'guide' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors relative ${activeTab === 'reviews' ? 'text-black' : 'text-black/40 hover:text-black'}`}
          >
            Nhận xét ({product.reviews?.length || 0})
            {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></span>}
          </button>
        </div>
        
        <div className="py-10 max-w-3xl">
          {activeTab === 'desc' && (
            <div className="prose prose-sm md:prose-base text-black/70 space-y-4 font-serif whitespace-pre-wrap">
              {product.description || (
                <>
                  <p>Một thiết kế kinh điển vượt thời gian, chiếc váy mang đậm phong cách thanh lịch với đường cắt may tinh tế, tôn lên đường cong tự nhiên của phái nữ. Được làm từ chất liệu cao cấp, mềm mại và thoáng mát, mang lại cảm giác thoải mái tuyệt đối khi mặc.</p>
                  <p>Thích hợp cho những buổi tiệc tối sang trọng, dạo phố hay thậm chí là những cuộc họp quan trọng, giúp bạn luôn tự tin và nổi bật trong mọi hoàn cảnh.</p>
                  <ul className="list-disc pl-5 font-sans text-sm mt-4">
                    <li>Thiết kế cổ V thanh lịch</li>
                    <li>Phần eo chiết tinh tế tôn dáng</li>
                    <li>Chất liệu mềm mại, ít nhăn</li>
                    <li>Đường may thủ công tỉ mỉ</li>
                  </ul>
                </>
              )}
            </div>
          )}
          {activeTab === 'specs' && (
            <div className="text-sm text-black/70 grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.materials && product.materials.length > 0 && (
                <div className="flex border-b border-black/5 py-3">
                  <span className="w-32 font-bold uppercase text-[10px] tracking-widest text-black/60">Chất liệu</span>
                  <span>{product.materials.join(', ')}</span>
                </div>
              )}
              {product.stock !== undefined && (
                <div className="flex border-b border-black/5 py-3">
                  <span className="w-32 font-bold uppercase text-[10px] tracking-widest text-black/60">Tồn kho</span>
                  <span>{product.stock} sản phẩm</span>
                </div>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="flex border-b border-black/5 py-3 md:col-span-2">
                  <span className="w-32 font-bold uppercase text-[10px] tracking-widest text-black/60">Thẻ</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-black/5 rounded text-[10px] font-bold uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex border-b border-black/5 py-3">
                <span className="w-32 font-bold uppercase text-[10px] tracking-widest text-black/60">Danh mục</span>
                <span>{product.category}</span>
              </div>
              <div className="flex border-b border-black/5 py-3">
                <span className="w-32 font-bold uppercase text-[10px] tracking-widest text-black/60">SKU</span>
                <span>{product.id}</span>
              </div>
            </div>
          )}
          {activeTab === 'guide' && (
            <div className="prose prose-sm text-black/70 space-y-4 font-serif whitespace-pre-wrap">
              {product.careInstructions || (
                <ul className="list-disc pl-5 space-y-2">
                  <li>Giặt tay hoặc giặt máy ở chế độ nhẹ nhàng với nước lạnh.</li>
                  <li>Không sử dụng hóa chất tẩy rửa mạnh.</li>
                  <li>Phơi trong bóng râm, tránh ánh nắng trực tiếp để giữ màu bền lâu.</li>
                  <li>Ủi ở nhiệt độ thấp, nên lộn trái sản phẩm khi ủi.</li>
                  <li>Khuyến khích giặt khô để giữ form dáng tốt nhất.</li>
                </ul>
              )}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Form submit review */}
              <div className="bg-[#F3F2F0] p-6 rounded-2xl">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Viết nhận xét của bạn</h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setReviewRating(star)}>
                      <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-black text-black' : 'text-black/20'}`} />
                    </button>
                  ))}
                </div>
                <textarea 
                  rows={3} 
                  placeholder="Bạn nghĩ gì về sản phẩm này?" 
                  className="w-full bg-white rounded-xl py-3 px-4 text-xs outline-none focus:ring-1 ring-black/20 resize-none mb-4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Tên của bạn" 
                    className="flex-1 bg-white rounded-xl py-3 px-4 text-xs outline-none focus:ring-1 ring-black/20 mb-4"
                    id="reviewerName"
                  />
                  <button 
                    onClick={() => {
                      const nameInput = document.getElementById('reviewerName') as HTMLInputElement;
                      const name = nameInput.value.trim() || 'Người dùng ẩn danh';
                      if (!reviewText.trim()) return;
                      useStore.getState().addReview(product.id, {
                        name,
                        rating: reviewRating,
                        content: reviewText
                      });
                      setReviewText('');
                      nameInput.value = '';
                    }}
                    className="px-6 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-colors h-[40px]"
                  >
                    Gửi nhận xét
                  </button>
                </div>
              </div>

              {/* Real Reviews List */}
              <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? product.reviews.map((review: any, idx: number) => (
                  <div key={idx} className="border-b border-black/5 pb-6 last:border-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EBE9E4] flex items-center justify-center">
                          <User className="w-4 h-4 text-black/40" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">{review.name}</p>
                          <p className="text-[10px] text-black/40">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-black text-black' : 'text-black/20'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-black/70 font-serif pl-11 whitespace-pre-wrap">{review.content}</p>
                  </div>
                )) : (
                  <p className="text-sm text-black/40 font-serif italic text-center py-8">Chưa có nhận xét nào. Hãy là người đầu tiên nhận xét!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cross-selling / Lookbook */}
      <section className="pt-10 border-t border-black/5">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-2">Gợi ý phối đồ</p>
            <h2 className="text-3xl md:text-4xl font-serif italic">Trọn Bộ Trang Phục</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {crossSellProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} viewMode="grid" />
          ))}
        </div>
      </section>

      {/* Related Products */}
      <section className="pt-10 border-t border-black/5">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-2">Gợi ý cho bạn</p>
            <h2 className="text-3xl md:text-4xl font-serif italic">Sản Phẩm Tương Tự</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} viewMode="grid" />
          ))}
        </div>
      </section>

      {/* Size Guide Popup */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-black/5">
              <h3 className="text-xl font-serif italic">Hướng Dẫn Chọn Size</h3>
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="w-10 h-10 rounded-full bg-[#F3F2F0] flex items-center justify-center hover:bg-[#EBE9E4] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Cách Đo Cơ Thể</h4>
                  <ul className="space-y-4 text-sm text-black/70 font-serif">
                    <li><strong className="font-sans text-black">Vòng ngực:</strong> Đo ngang qua điểm nở nhất của ngực.</li>
                    <li><strong className="font-sans text-black">Vòng eo:</strong> Đo ngang qua vùng eo nhỏ nhất.</li>
                    <li><strong className="font-sans text-black">Vòng mông:</strong> Đo ngang qua vùng nở nhất của mông.</li>
                  </ul>
                </div>
                <div className="bg-[#F3F2F0] rounded-xl flex items-center justify-center p-4">
                  <img src="https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1000&auto=format&fit=crop" alt="Size Guide Illustration" className="h-full object-contain mix-blend-multiply opacity-50" />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-[#F3F2F0] text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Size</th>
                      <th className="px-4 py-3">Vòng ngực (cm)</th>
                      <th className="px-4 py-3">Vòng eo (cm)</th>
                      <th className="px-4 py-3 rounded-r-lg">Vòng mông (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    <tr>
                      <td className="px-4 py-4 font-bold">S</td>
                      <td className="px-4 py-4 text-black/70">80 - 84</td>
                      <td className="px-4 py-4 text-black/70">62 - 66</td>
                      <td className="px-4 py-4 text-black/70">86 - 90</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-bold">M</td>
                      <td className="px-4 py-4 text-black/70">84 - 88</td>
                      <td className="px-4 py-4 text-black/70">66 - 70</td>
                      <td className="px-4 py-4 text-black/70">90 - 94</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-bold">L</td>
                      <td className="px-4 py-4 text-black/70">88 - 92</td>
                      <td className="px-4 py-4 text-black/70">70 - 74</td>
                      <td className="px-4 py-4 text-black/70">94 - 98</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-bold">XL</td>
                      <td className="px-4 py-4 text-black/70">92 - 96</td>
                      <td className="px-4 py-4 text-black/70">74 - 78</td>
                      <td className="px-4 py-4 text-black/70">98 - 102</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-6 md:p-8 border-t border-black/5 bg-[#F3F2F0] flex justify-between items-center">
              <p className="text-xs text-black/60 font-serif">Bạn cần hỗ trợ thêm? <Link to="/contact" className="text-black font-sans font-bold hover:underline">Liên hệ tư vấn</Link></p>
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="px-6 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
