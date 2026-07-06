import React, { useState } from 'react';
import { Save, Image as ImageIcon, Plus, Trash2, Clock, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function AdminStorefront() {
  const { products, addToast, banners: initialBanners, flashSale: initialFlashSale, updateStorefront } = useStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('banners');

  const [banners, setBanners] = useState(() => {
    return initialBanners.length > 0 ? initialBanners : [
      { 
        id: '1', 
        title: 'AURA ESSENTIALS', 
        subtitle: 'BỘ SƯU TẬP MỚI', 
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop', 
        link: '/category',
        status: 'active',
        textColor: 'light',
        textAlign: 'center',
        buttonText: 'Mua ngay',
        secondaryButtonText: 'Xem Lookbook',
        secondaryButtonLink: '/category',
        overlayOpacity: 60,
        buttonStyle: 'solid',
        campaign: 'Xuân Hè 2026',
        tags: 'hero, new-arrival'
      }
    ];
  });

  // Initialize flashSale products with actual products if not present
  const [flashSale, setFlashSale] = useState(() => {
    if (initialFlashSale.products.length > 0) return initialFlashSale;
    return {
      ...initialFlashSale,
      products: products.slice(0, 2).map(p => ({ id: p.id, name: p.name, originalPrice: p.price, salePrice: Math.floor(p.price * 0.7) }))
    };
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      updateStorefront(banners, flashSale);
      setIsUpdating(false);
      addToast('Đã lưu cấu hình giao diện', 'success');
    }, 1000);
  };

  const addBanner = () => {
    setBanners([...banners, { 
      id: Date.now().toString(), 
      title: 'Banner mới', 
      subtitle: '', 
      image: '', 
      link: '', 
      status: 'active', 
      textColor: 'light', 
      textAlign: 'center',
      buttonText: 'Mua ngay',
      secondaryButtonText: '',
      secondaryButtonLink: '',
      overlayOpacity: 60,
      buttonStyle: 'solid',
      campaign: '',
      tags: ''
    }]);
  };

  const removeBanner = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
  };

  const moveBannerUp = (index: number) => {
    if (index === 0) return;
    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[index - 1];
    newBanners[index - 1] = temp;
    setBanners(newBanners);
  };

  const moveBannerDown = (index: number) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[index + 1];
    newBanners[index + 1] = temp;
    setBanners(newBanners);
  };

  const updateBanner = (id: string, field: string, value: string) => {
    setBanners(banners.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const uniqueCampaigns = Array.from(new Set(banners.map(b => b.campaign).filter(Boolean)));
  const updateCampaignStatus = (campaign: string, status: string) => {
    setBanners(banners.map(b => b.campaign === campaign ? { ...b, status } : b));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-xl font-serif italic mb-1">Giao Diện & Chiến Dịch</h2>
        <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Tùy chỉnh trang chủ và các chương trình khuyến mãi</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('banners')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'banners' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
            >
              <ImageIcon className="w-4 h-4" /> Banners trang chủ
            </button>
            <button 
              onClick={() => setActiveTab('flashsale')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'flashsale' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
            >
              <Clock className="w-4 h-4" /> Flash Sale
            </button>
          </nav>
        </div>

        <div className="flex-1 bg-white p-8 rounded-3xl border border-black/5">
          <form onSubmit={handleSave}>
            {activeTab === 'banners' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-black/5 pb-4 mb-6">
                  <h3 className="text-lg font-serif italic">Quản Lý Banner</h3>
                  <button type="button" onClick={addBanner} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors">
                    <Plus className="w-4 h-4" /> Thêm Banner
                  </button>
                </div>

                {uniqueCampaigns.length > 0 && (
                  <div className="mb-8 p-6 bg-black/5 rounded-2xl">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/80 mb-4">Cập nhật nhanh theo chiến dịch</h4>
                    <div className="flex flex-wrap gap-4">
                      {uniqueCampaigns.map(campaign => (
                        <div key={campaign as string} className="flex items-center gap-4 bg-white px-4 py-3 rounded-xl border border-black/10">
                          <span className="text-xs font-bold">{campaign as string}</span>
                          <div className="h-4 w-px bg-black/10"></div>
                          <button type="button" onClick={() => updateCampaignStatus(campaign as string, 'active')} className="text-[10px] font-bold uppercase tracking-widest text-green-600 hover:underline">Hiển thị tất cả</button>
                          <button type="button" onClick={() => updateCampaignStatus(campaign as string, 'hidden')} className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:underline">Ẩn tất cả</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-8">
                  {banners.map((banner, index) => (
                    <div key={banner.id} className="relative p-6 border border-black/10 rounded-2xl bg-[#FAF9F6]">
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <button type="button" onClick={() => moveBannerUp(index)} disabled={index === 0} className="p-1.5 text-black/40 hover:bg-black/5 hover:text-black rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent">
                          ↑
                        </button>
                        <button type="button" onClick={() => moveBannerDown(index)} disabled={index === banners.length - 1} className="p-1.5 text-black/40 hover:bg-black/5 hover:text-black rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent">
                          ↓
                        </button>
                        <button type="button" onClick={() => removeBanner(banner.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mb-4 font-bold text-xs uppercase tracking-widest">Banner {index + 1}</div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 flex items-end gap-4">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Hình ảnh (URL hoặc Tải lên)</label>
                            <input type="url" value={banner.image} onChange={(e) => updateBanner(banner.id, 'image', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30" placeholder="https://..." />
                          </div>
                          <div>
                            <input 
                              type="file" 
                              accept="image/*"
                              id={`upload-${banner.id}`}
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = URL.createObjectURL(file);
                                  updateBanner(banner.id, 'image', url);
                                }
                              }}
                            />
                            <label 
                              htmlFor={`upload-${banner.id}`}
                              className="flex items-center justify-center px-4 py-2.5 border border-black/10 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-black/80 transition-colors"
                            >
                              Tải ảnh lên
                            </label>
                          </div>
                        </div>
                        {banner.image && (
                          <div className="md:col-span-2 rounded-xl overflow-hidden h-32 relative">
                            <img src={banner.image} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20"></div>
                          </div>
                        )}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Tiêu đề chính</label>
                          <input type="text" value={banner.title} onChange={(e) => updateBanner(banner.id, 'title', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Tiêu đề phụ</label>
                          <input type="text" value={banner.subtitle} onChange={(e) => updateBanner(banner.id, 'subtitle', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30" />
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Chiến dịch (Campaign)</label>
                            <input type="text" value={banner.campaign || ''} onChange={(e) => updateBanner(banner.id, 'campaign', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30" placeholder="VD: Mùa hè rực rỡ" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Thẻ (Tags - Cách nhau dấu phẩy)</label>
                            <input type="text" value={banner.tags || ''} onChange={(e) => updateBanner(banner.id, 'tags', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30" placeholder="hero, top-banner" />
                          </div>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-4 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Trạng thái</label>
                            <select value={banner.status || 'active'} onChange={(e) => updateBanner(banner.id, 'status', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30">
                              <option value="active">Hiển thị</option>
                              <option value="hidden">Đang ẩn</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Màu chữ</label>
                            <select value={banner.textColor || 'light'} onChange={(e) => updateBanner(banner.id, 'textColor', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30">
                              <option value="light">Sáng (Trắng)</option>
                              <option value="dark">Tối (Đen)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Căn lề (Text)</label>
                            <select value={banner.textAlign || 'center'} onChange={(e) => updateBanner(banner.id, 'textAlign', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30">
                              <option value="left">Trái</option>
                              <option value="center">Giữa</option>
                              <option value="right">Phải</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Độ mờ nền (%)</label>
                            <select value={banner.overlayOpacity !== undefined ? banner.overlayOpacity : 60} onChange={(e) => updateBanner(banner.id, 'overlayOpacity', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30">
                              <option value="0">0%</option>
                              <option value="20">20%</option>
                              <option value="40">40%</option>
                              <option value="60">60%</option>
                              <option value="80">80%</option>
                            </select>
                          </div>
                        </div>

                        <div className="md:col-span-2 border-t border-black/10 pt-4 mt-2">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/80 mb-4">Nút bấm chính</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Text nút chính</label>
                              <input type="text" value={banner.buttonText || ''} onChange={(e) => updateBanner(banner.id, 'buttonText', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30" placeholder="Mua ngay" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Liên kết chính</label>
                              <input type="text" value={banner.link || ''} onChange={(e) => updateBanner(banner.id, 'link', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30" placeholder="/category" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Kiểu nút</label>
                              <select value={banner.buttonStyle || 'solid'} onChange={(e) => updateBanner(banner.id, 'buttonStyle', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30">
                                <option value="solid">Đậm (Solid)</option>
                                <option value="outline">Viền (Outline)</option>
                                <option value="glass">Kính (Glass)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2 border-t border-black/10 pt-4 mt-2">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/80 mb-4">Nút bấm phụ (Tùy chọn)</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Text nút phụ</label>
                              <input type="text" value={banner.secondaryButtonText || ''} onChange={(e) => updateBanner(banner.id, 'secondaryButtonText', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30" placeholder="VD: Xem Lookbook" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Liên kết phụ</label>
                              <input type="text" value={banner.secondaryButtonLink || ''} onChange={(e) => updateBanner(banner.id, 'secondaryButtonLink', e.target.value)} className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-black/30" placeholder="/about" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'flashsale' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-black/5 pb-4 mb-6">
                  <h3 className="text-lg font-serif italic">Chiến Dịch Flash Sale</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-sm font-bold uppercase tracking-widest">Kích hoạt</span>
                    <input 
                      type="checkbox" 
                      checked={flashSale.isActive} 
                      onChange={(e) => setFlashSale({...flashSale, isActive: e.target.checked})}
                      className="w-4 h-4 accent-black" 
                    />
                  </label>
                </div>

                <div className={`transition-opacity ${!flashSale.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="mb-6">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Thời gian kết thúc</label>
                    <input 
                      type="datetime-local" 
                      value={flashSale.endTime}
                      onChange={(e) => setFlashSale({...flashSale, endTime: e.target.value})}
                      className="w-full bg-[#F3F2F0] rounded-xl py-3 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
                    />
                  </div>

                  <div className="mb-4 flex justify-between items-center">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60">Sản phẩm áp dụng</label>
                    <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-black underline">Chọn thêm sản phẩm</button>
                  </div>

                  <div className="space-y-3">
                    {flashSale.products.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 border border-black/10 rounded-xl bg-[#FAF9F6]">
                        <div className="font-bold text-xs">{p.name}</div>
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-[9px] uppercase text-black/40">Giá gốc</div>
                            <div className="text-xs line-through">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.originalPrice)}</div>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase text-black/40">Giá sale</div>
                            <input 
                              type="number" 
                              value={p.salePrice}
                              onChange={(e) => {
                                const newProds = flashSale.products.map(prod => prod.id === p.id ? {...prod, salePrice: Number(e.target.value)} : prod);
                                setFlashSale({...flashSale, products: newProds});
                              }}
                              className="w-24 bg-white border border-black/10 rounded py-1 px-2 text-xs font-bold text-red-600 outline-none" 
                            />
                          </div>
                          <button type="button" className="text-black/40 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-black/5">
              <button 
                type="submit" 
                disabled={isUpdating}
                className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-70"
              >
                {isUpdating ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                Lưu Cấu Hình
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
