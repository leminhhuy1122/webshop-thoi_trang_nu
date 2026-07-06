import { Link } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { useStore } from '../store/useStore';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Copy } from 'lucide-react';

export function Home() {
  const { products, banners, flashSale, vouchers, addToast } = useStore();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [showVoucherPopup, setShowVoucherPopup] = useState(false);

  const welcomeVoucher = vouchers?.find((v: any) => v.status === 'active' && v.isWelcome);

  useEffect(() => {
    if (welcomeVoucher) {
      const timer = setTimeout(() => {
        setShowVoucherPopup(true);
      }, 1500); // Show popup after 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [welcomeVoucher]);

  const handleCloseVoucher = () => {
    setShowVoucherPopup(false);
  };

  const copyVoucherCode = () => {
    if (welcomeVoucher) {
      navigator.clipboard.writeText(welcomeVoucher.code);
      addToast('Đã sao chép mã giảm giá', 'success');
      handleCloseVoucher();
    }
  };

  let newArrivals = products.filter(p => p.isNew);
  if (newArrivals.length === 0) {
    newArrivals = products.slice(0, 4);
  }

  const activeBanners = banners?.filter(b => b.status !== 'hidden') || [];
  
  let heroBanners = activeBanners.filter(b => b.tags?.toLowerCase().includes('hero'));
  if (heroBanners.length === 0 && activeBanners.length > 0) {
    heroBanners = activeBanners.filter(b => !b.tags?.toLowerCase().includes('promo'));
    if (heroBanners.length === 0) heroBanners = activeBanners;
  }

  const displayBanners = heroBanners.length > 0 ? heroBanners : [{
    id: 'default',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
    title: 'Thanh lịch & Hiện đại',
    subtitle: 'Xuân Hè 2026',
    link: '/category',
    textColor: 'light',
    textAlign: 'center'
  }];

  const promoBanners = activeBanners.filter(b => b.tags?.toLowerCase().includes('promo'));

  useEffect(() => {
    if (displayBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % displayBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayBanners.length]);

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % displayBanners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev === 0 ? displayBanners.length - 1 : prev - 1));
  };

  const heroBanner = displayBanners[currentBannerIndex];

  const currentFlashSale = flashSale?.isActive ? flashSale.products : [];

  return (
    <div className="w-full flex-1 flex flex-col gap-12 sm:gap-20 pb-20">
      
      {/* Modern Hero Carousel - Full Width */}
      <div className="relative h-[85vh] min-h-[600px] md:min-h-[700px] md:rounded-[40px] overflow-hidden group">
        {displayBanners.map((banner, index) => (
          <div 
            key={banner.id || index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentBannerIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
          >
            <div className="absolute inset-0">
              <img 
                src={banner.image} 
                alt="Hero Banner" 
                className={`w-full h-full object-cover object-center ${index === currentBannerIndex ? 'transition-transform duration-[15000ms] ease-out scale-110' : ''}`}
              />
            </div>
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(banner.overlayOpacity !== undefined ? banner.overlayOpacity : 30) / 100})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center sm:justify-start px-6 sm:px-16 md:px-24 pb-10">
               <div className={`w-full max-w-4xl flex flex-col mt-20 ${banner.textColor === 'dark' ? 'text-black' : 'text-white'} ${
                 banner.textAlign === 'center' ? 'items-center text-center mx-auto' : 
                 banner.textAlign === 'right' ? 'items-end text-right ml-auto' : 'items-start text-left'
               }`}>
                 <div className="overflow-hidden mb-4">
                   <p className={`text-xs sm:text-sm font-bold tracking-[0.4em] uppercase drop-shadow-md transform transition-transform duration-1000 delay-300 ${index === currentBannerIndex ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>{banner.subtitle}</p>
                 </div>
                 <div className="overflow-hidden mb-10">
                   <h1 
                    className={`text-5xl sm:text-7xl md:text-[5.5rem] font-serif font-light leading-[1.05] drop-shadow-xl transform transition-all duration-1000 delay-500 ${index === currentBannerIndex ? 'translate-y-0 opacity-100' : 'translate-y-[30%] opacity-0'}`} 
                    dangerouslySetInnerHTML={{ __html: banner.title.replace('&', '&amp;').replace('\n', '<br/>') }}
                   ></h1>
                 </div>
                 
                 <div className={`flex flex-wrap gap-4 transform transition-all duration-1000 delay-700 ${index === currentBannerIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                   {banner.buttonText && (
                     <Link 
                       to={banner.link || "/category"} 
                       className={`w-fit px-10 py-4 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:scale-105 shadow-xl ${
                         banner.buttonStyle === 'outline' 
                           ? (banner.textColor === 'dark' ? 'border-2 border-black text-black hover:bg-black hover:text-white' : 'border-2 border-white text-white hover:bg-white hover:text-black') 
                           : banner.buttonStyle === 'glass'
                           ? (banner.textColor === 'dark' ? 'bg-white/30 backdrop-blur-md text-black hover:bg-white/50' : 'bg-black/30 backdrop-blur-md text-white hover:bg-black/50')
                           : (banner.textColor === 'dark' ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200')
                       }`}
                     >
                       {banner.buttonText}
                     </Link>
                   )}
                   
                   {banner.secondaryButtonText && (
                     <Link 
                       to={banner.secondaryButtonLink || "/category"} 
                       className={`w-fit px-10 py-4 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm ${
                         banner.textColor === 'dark' ? 'bg-black/5 border border-black/20 hover:border-black text-black' : 'bg-white/10 border border-white/30 hover:border-white text-white'
                       }`}
                     >
                       {banner.secondaryButtonText}
                     </Link>
                   )}
                 </div>
               </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Controls */}
        {displayBanners.length > 1 && (
          <>
            <button 
              onClick={prevBanner}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextBanner}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Progress indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
              {displayBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className="relative h-1 rounded-full overflow-hidden transition-all duration-300 bg-white/30"
                  style={{ width: idx === currentBannerIndex ? '48px' : '16px' }}
                >
                  <div 
                    className={`absolute inset-y-0 left-0 bg-white transition-all duration-[5000ms] ease-linear`}
                    style={{ width: idx === currentBannerIndex ? '100%' : '0%' }}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* 4 Feature/Stats Cards - Grid 2x2 on Mobile, 4 cols on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-0 mt-8 mb-4">
        <Link to="/category" className="bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow border border-black/5 aspect-square lg:aspect-auto min-h-[160px] md:min-h-[220px]">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F3F2F0] rounded-full flex items-center justify-center mb-3 md:mb-4">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
          <p className="text-2xl md:text-3xl font-serif font-bold text-black mb-1">150+</p>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black/40">Sản phẩm mới</p>
          <p className="hidden md:block mt-3 text-sm text-black/60">Khám phá các thiết kế mới nhất mùa này.</p>
        </Link>
        
        <Link to="/category" className="bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow border border-black/5 aspect-square lg:aspect-auto min-h-[160px] md:min-h-[220px]">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F3F2F0] rounded-full flex items-center justify-center mb-3 md:mb-4">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p className="text-2xl md:text-3xl font-serif font-bold text-black mb-1">24h</p>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black/40">Flash Sale</p>
          <p className="hidden md:block mt-3 text-sm text-black/60">Ưu đãi giảm giá có hạn mỗi ngày.</p>
        </Link>

        <Link to="/category" className="bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow border border-black/5 aspect-square lg:aspect-auto min-h-[160px] md:min-h-[220px]">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F3F2F0] rounded-full flex items-center justify-center mb-3 md:mb-4">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
          </div>
          <p className="text-2xl md:text-3xl font-serif font-bold text-black mb-1">99%</p>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black/40">Hài lòng</p>
          <p className="hidden md:block mt-3 text-sm text-black/60">Cam kết chất lượng trên từng sản phẩm.</p>
        </Link>

        <Link to="/category" className="bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow border border-black/5 aspect-square lg:aspect-auto min-h-[160px] md:min-h-[220px]">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F3F2F0] rounded-full flex items-center justify-center mb-3 md:mb-4">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
          </div>
          <p className="text-2xl md:text-3xl font-serif font-bold text-black mb-1">0đ</p>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black/40">Giao hàng</p>
          <p className="hidden md:block mt-3 text-sm text-black/60">Miễn phí giao hàng cho đơn trên 500k.</p>
        </Link>
      </div>

      {/* Featured Categories & Flash Sale Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {/* Flash Sale Highlight */}
        {flashSale?.isActive && currentFlashSale.length > 0 ? (
          <Link to={`/product/${currentFlashSale[0]?.id}`} className="col-span-1 rounded-[32px] bg-[#9C3131] text-white p-8 flex flex-col justify-between overflow-hidden relative min-h-[320px] group shadow-xl">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-white text-[#9C3131] text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> Flash Sale
                </span>
                <div className="flex gap-2">
                  <div className="bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl text-center min-w-[48px] border border-white/10">
                    <p className="text-xl font-bold font-mono">04</p>
                  </div>
                  <div className="text-xl font-bold font-mono py-2">:</div>
                  <div className="bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl text-center min-w-[48px] border border-white/10">
                    <p className="text-xl font-bold font-mono">22</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-serif italic mb-2 text-white group-hover:text-white/80 transition-colors drop-shadow-md">{currentFlashSale[0]?.name || 'Sản phẩm mới'}</h3>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentFlashSale[0]?.salePrice || 0)}
                </span>
                <span className="text-sm line-through opacity-50">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentFlashSale[0]?.originalPrice || 0)}
                </span>
              </div>
            </div>
            
            <div className="relative z-10 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="flex justify-between text-[10px] uppercase tracking-wider mb-3 font-medium opacity-80">
                <span>Đã bán: 42</span>
                <span>Còn lại: 8</span>
              </div>
              <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden shadow-inner">
                <div className="h-full w-[80%] bg-white rounded-full relative">
                  <div className="absolute inset-0 bg-white/50 animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-full h-full opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 pointer-events-none">
              <img src={products.find((p: any) => p.id === currentFlashSale[0]?.id)?.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop'} alt="Flash Sale" className="w-full h-full object-cover object-right-top rounded-tl-[120px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#9C3131] via-[#9C3131]/60 to-transparent mix-blend-multiply"></div>
            </div>
          </Link>
        ) : (
          <div className="col-span-1 rounded-[32px] bg-[#1A1A1A] text-white p-8 flex flex-col justify-center items-center text-center overflow-hidden min-h-[320px] shadow-xl">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
               <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             <h3 className="text-2xl font-serif italic mb-3">Chưa có sự kiện</h3>
             <p className="text-xs text-white/50 uppercase tracking-widest font-medium">Vui lòng quay lại sau</p>
          </div>
        )}

        {/* Featured Category 1 */}
        <Link to="/category" className="col-span-1 rounded-[32px] bg-[#E8CFCF] p-8 flex flex-col items-start justify-end group cursor-pointer min-h-[320px] relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
             <img src="/hero_paner.jpg" className="w-full h-full object-cover mix-blend-multiply" />
          </div>
          <div className="absolute top-8 right-8 w-12 h-12 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-300 z-10 shadow-sm">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </div>
          <div className="relative z-10 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 mb-2">Bộ sưu tập</p>
            <h3 className="text-3xl font-serif italic text-black group-hover:text-black/80 transition-colors">Phụ Kiện Tinh Tế</h3>
          </div>
        </Link>

        {/* Featured Category 2 */}
        <Link to="/category" className="col-span-1 rounded-[32px] bg-[#DED9D2] p-8 flex flex-col items-start justify-end group cursor-pointer min-h-[320px] relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-700">
             <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover mix-blend-multiply" />
          </div>
          <div className="absolute top-8 right-8 w-12 h-12 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-black transition-all duration-300 z-10 text-white shadow-sm border border-white/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </div>
          <div className="relative z-10 w-full bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 mb-1">Dòng cao cấp</p>
            <h3 className="text-xl font-serif italic text-black mb-1">Lụa Tơ Tằm</h3>
            <p className="text-[11px] text-black/70 font-medium">12 Sản phẩm mới</p>
          </div>
        </Link>
      </div>

      {/* Dynamic Promo Banners */}
      {promoBanners.length > 0 && (
        <section className={`grid grid-cols-1 ${promoBanners.length > 1 ? 'md:grid-cols-2' : ''} gap-4 mb-10`}>
          {promoBanners.map((banner) => (
            <div key={banner.id} className="relative overflow-hidden rounded-3xl min-h-[300px] md:min-h-[400px] flex items-center group">
              <img src={banner.image} alt="Promo Banner" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(banner.overlayOpacity !== undefined ? banner.overlayOpacity : 60) / 100})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
              </div>
              <div className={`relative z-10 p-8 sm:p-12 w-full flex flex-col ${banner.textAlign === 'center' ? 'items-center text-center' : banner.textAlign === 'right' ? 'items-end text-right' : 'items-start text-left'} ${banner.textColor === 'dark' ? 'text-black' : 'text-white'}`}>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 drop-shadow-md">{banner.subtitle}</p>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif italic mb-6" dangerouslySetInnerHTML={{ __html: banner.title.replace('&', '&amp;').replace('\n', '<br/>') }}></h3>
                <div className="flex flex-wrap gap-3">
                  {banner.buttonText && (
                    <Link to={banner.link || '#'} className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      banner.buttonStyle === 'outline' ? (banner.textColor === 'dark' ? 'border-2 border-black hover:bg-black hover:text-white' : 'border-2 border-white hover:bg-white hover:text-black') :
                      banner.buttonStyle === 'glass' ? (banner.textColor === 'dark' ? 'bg-black/10 backdrop-blur-md hover:bg-black/20' : 'bg-white/20 backdrop-blur-md hover:bg-white/30') :
                      (banner.textColor === 'dark' ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200')
                    }`}>
                      {banner.buttonText}
                    </Link>
                  )}
                  {banner.secondaryButtonText && (
                    <Link to={banner.secondaryButtonLink || '#'} className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      banner.textColor === 'dark' ? 'bg-black/5 border border-black/10 hover:bg-black/10' : 'bg-white/10 border border-white/20 hover:bg-white/20'
                    } backdrop-blur-sm`}>
                      {banner.secondaryButtonText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Product Slider Section - Sản phẩm mới */}
      <section className="pt-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-black/40 mb-3">Cập nhật xu hướng</p>
            <h2 className="text-4xl md:text-5xl font-serif italic">Sản Phẩm Mới</h2>
          </div>
          <Link to="/category" className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-black/60 transition-colors">
            Xem tất cả <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>
        
        {/* Simple Horizontal Scroll for Products */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {newArrivals.map(product => (
            <div key={product.id} className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] flex-shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
          {/* View More Card */}
          <Link to="/category" className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] flex-shrink-0 snap-start bg-[#F3F2F0] rounded-2xl flex flex-col items-center justify-center text-center p-8 group hover:bg-[#EBE9E4] transition-colors mb-20">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
            <h3 className="text-xl font-serif italic mb-2">Xem Thêm</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Khám phá toàn bộ BST</p>
          </Link>
        </div>
      </section>

      {/* Brand Story (Asymmetric Grid & Color Blocking) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:min-h-[600px] mb-20">
        <div className="bg-[#1A1A1A] rounded-3xl p-10 md:p-16 flex flex-col justify-center text-[#F3F2F0]">
          <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-60 mb-6">Câu chuyện thương hiệu</p>
          <h2 className="text-4xl md:text-6xl font-serif italic mb-8 leading-[1.2]">
            Tôn vinh vẻ đẹp <br /> độc bản của bạn.
          </h2>
          <p className="text-sm md:text-base font-serif opacity-80 mb-10 max-w-lg leading-relaxed">
            Tại AURA, chúng tôi tin rằng thời trang không chỉ là những gì bạn khoác lên người, mà là cách bạn kể câu chuyện của chính mình. Những thiết kế của chúng tôi được dệt nên từ sự tỉ mỉ, chất liệu tinh tuyển và khao khát mang đến sự tự tin tuyệt đối cho người mặc.
          </p>
          <Link to="/blog" className="w-fit border-b border-[#F3F2F0] pb-1 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-2">
            Khám phá thêm <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>
        <div className="rounded-3xl overflow-hidden bg-[#DED9D2] relative min-h-[400px] lg:min-h-0">
          <img 
            src="https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=2000&auto=format&fit=crop" 
            alt="Brand Story" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 hover:scale-105 transition-transform duration-1000"
          />
        </div>
      </section>

      {/* Editor's Pick Banner */}
      <section className="bg-[#E8CFCF] rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-20 relative overflow-hidden group">
        <div className="relative z-10 w-full md:w-[40%] flex flex-col items-start text-[#1A1A1A] max-w-md">
          <span className="bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6 shadow-sm">
            Editor's Pick
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic mb-6 leading-tight">
            Điểm nhấn <br /> thanh lịch
          </h2>
          <p className="text-sm font-serif mb-8 max-w-sm opacity-80">
            Tuyển tập những phụ kiện tinh tế nhất, giúp hoàn thiện phong cách cá nhân của bạn mỗi ngày.
          </p>
          <Link to="/category" className="px-8 py-4 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black transition-colors shadow-xl shadow-black/10">
            Xem Bộ Sưu Tập
          </Link>
        </div>
        <div className="w-full md:w-[55%] h-[350px] md:h-[500px] relative z-10">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl md:rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
          <img 
            src="/paner_section.png" 
            alt="Editor's Pick" 
            className="absolute inset-0 w-full h-full object-cover rounded-2xl md:rounded-3xl shadow-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500"
          />
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-white/20 to-transparent pointer-events-none"></div>
      </section>

      {/* Welcome Voucher Popup */}
      {showVoucherPopup && welcomeVoucher && (
        <div 
          onClick={handleCloseVoucher}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#FAF9F6] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 cursor-default"
          >
            <button 
              onClick={handleCloseVoucher}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4 text-black" />
            </button>
            <div className="h-32 bg-black relative">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Welcome" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold uppercase tracking-[0.3em] drop-shadow-md">Ưu Đãi Đặc Quyền</span>
              </div>
            </div>
            <div className="p-8 text-center flex flex-col items-center">
              <h3 className="text-3xl font-serif italic mb-2">Chào bạn mới!</h3>
              <p className="text-xs text-black/60 mb-6 max-w-xs">Nhận ngay ưu đãi đặc biệt cho đơn hàng đầu tiên của bạn tại AURA.</p>
              
              <div className="w-full bg-white border border-black/10 rounded-2xl p-6 mb-6 shadow-sm">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {welcomeVoucher.type === 'percent' ? `${welcomeVoucher.value}%` : 
                   welcomeVoucher.type === 'fixed' ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(welcomeVoucher.value) : 'FREE SHIP'}
                </div>
                <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-4">
                  {welcomeVoucher.minOrder > 0 ? `Cho đơn từ ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(welcomeVoucher.minOrder)}` : 'Không yêu cầu đơn tối thiểu'}
                </p>
                <div className="flex items-center gap-2 bg-[#F3F2F0] p-2 rounded-xl">
                  <div className="flex-1 font-mono font-bold text-lg tracking-wider text-black">{welcomeVoucher.code}</div>
                  <button onClick={copyVoucherCode} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
              </div>
              
              <p className="text-[9px] text-black/40 uppercase tracking-widest">
                HSD: {new Date(welcomeVoucher.expiresAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
