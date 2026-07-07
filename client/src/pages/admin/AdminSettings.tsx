import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Save, Shield, Settings, Store, Globe } from 'lucide-react';

export function AdminSettings() {
  const { addToast } = useStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      addToast('Đã lưu cấu hình cài đặt', 'success');
    }, 1000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-xl font-serif italic mb-1">Cài Đặt Hệ Thống</h2>
        <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Cấu hình chung và quản lý cửa hàng</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'general' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
            >
              <Store className="w-4 h-4" /> Thông tin chung
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'security' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
            >
              <Shield className="w-4 h-4" /> Bảo mật & Quyền
            </button>
            <button 
              onClick={() => setActiveTab('integration')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'integration' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
            >
              <Globe className="w-4 h-4" /> Tích hợp & API
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white p-8 rounded-3xl border border-black/5">
          <form onSubmit={handleSave}>
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-serif italic border-b border-black/5 pb-4 mb-6">Thông Tin Cửa Hàng</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Tên cửa hàng</label>
                    <input type="text" defaultValue="AURA Minimalist Fashion" className="w-full bg-[#F3F2F0] rounded-xl py-3 px-4 text-xs outline-none focus:ring-1 ring-black/20" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Email liên hệ</label>
                    <input type="email" defaultValue="hello@aura.com" className="w-full bg-[#F3F2F0] rounded-xl py-3 px-4 text-xs outline-none focus:ring-1 ring-black/20" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Mô tả ngắn gọn (SEO)</label>
                    <textarea rows={3} defaultValue="Aura - Thương hiệu thời trang theo phong cách tối giản." className="w-full bg-[#F3F2F0] rounded-xl py-3 px-4 text-xs outline-none focus:ring-1 ring-black/20"></textarea>
                  </div>
                </div>

                <h3 className="text-lg font-serif italic border-b border-black/5 pb-4 mb-6 mt-10">Mạng Xã Hội</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-[10px] font-bold uppercase tracking-widest text-black/60">Facebook</span>
                    <input type="url" defaultValue="https://facebook.com/aura" className="flex-1 bg-[#F3F2F0] rounded-xl py-2.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-[10px] font-bold uppercase tracking-widest text-black/60">Instagram</span>
                    <input type="url" defaultValue="https://instagram.com/aura.minimalist" className="flex-1 bg-[#F3F2F0] rounded-xl py-2.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-serif italic border-b border-black/5 pb-4 mb-6">Đổi Mật Khẩu Admin</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <input type="password" placeholder="Mật khẩu hiện tại" className="w-full bg-[#F3F2F0] rounded-xl py-3 px-4 text-xs outline-none focus:ring-1 ring-black/20" />
                  </div>
                  <div>
                    <input type="password" placeholder="Mật khẩu mới" className="w-full bg-[#F3F2F0] rounded-xl py-3 px-4 text-xs outline-none focus:ring-1 ring-black/20" />
                  </div>
                  <div>
                    <input type="password" placeholder="Xác nhận mật khẩu mới" className="w-full bg-[#F3F2F0] rounded-xl py-3 px-4 text-xs outline-none focus:ring-1 ring-black/20" />
                  </div>
                </div>

                <h3 className="text-lg font-serif italic border-b border-black/5 pb-4 mb-6 mt-10">Tùy Chọn Bảo Mật</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-black" />
                    <span className="text-sm">Bật xác thực 2 yếu tố (2FA)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-black" />
                    <span className="text-sm">Yêu cầu đổi mật khẩu định kỳ (90 ngày)</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'integration' && (
              <div className="space-y-6">
                <h3 className="text-lg font-serif italic border-b border-black/5 pb-4 mb-6">Cổng Thanh Toán</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-black/10 rounded-xl p-4 flex justify-between items-center bg-[#FAF9F6]">
                    <div>
                      <div className="font-bold text-sm">VNPay</div>
                      <div className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">Đã kết nối</div>
                    </div>
                    <button type="button" className="text-xs underline text-black/60">Cấu hình</button>
                  </div>
                  <div className="border border-black/10 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm">Momo</div>
                      <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Chưa kết nối</div>
                    </div>
                    <button type="button" className="text-xs font-bold uppercase tracking-widest bg-black text-white px-3 py-1.5 rounded-full">Kết nối</button>
                  </div>
                </div>

                <h3 className="text-lg font-serif italic border-b border-black/5 pb-4 mb-6 mt-10">Giao Hàng (Logistics)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-black/10 rounded-xl p-4 flex justify-between items-center bg-[#FAF9F6]">
                    <div>
                      <div className="font-bold text-sm">Giao Hàng Tiết Kiệm</div>
                      <div className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">Đã kết nối</div>
                    </div>
                    <button type="button" className="text-xs underline text-black/60">Cấu hình</button>
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
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
