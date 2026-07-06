import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { User, Package, Heart, LogOut, Settings } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export function Account() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { user, login, logout, wishlistItems, addToast } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileUpdate = (e: FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      // Simulate user update
      const form = e.target as HTMLFormElement;
      const newName = (form.elements.namedItem('name') as HTMLInputElement).value;
      if (user) {
        login({ ...user, name: newName });
      }
      addToast('Cập nhật thông tin thành công', 'success');
    }, 1000);
  };

  const handlePasswordUpdate = (e: FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      addToast('Cập nhật mật khẩu thành công', 'success');
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  const handleSettingsUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      addToast('Đã đăng ký nhận email khuyến mãi', 'success');
    } else {
      addToast('Đã hủy đăng ký email khuyến mãi', 'info');
    }
  };

  const handleRedeemPoints = (points: number) => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      addToast(`Đổi thành công mã giảm giá với ${points.toLocaleString('vi-VN')} điểm!`, 'success');
    }, 1000);
  };

  const wishlist = wishlistItems;
  const orders = [
    { id: '#AURA-2607', date: '05/07/2026', total: 1450000, status: 'Đang giao hàng', items: 2 },
    { id: '#AURA-2501', date: '12/06/2026', total: 890000, status: 'Hoàn thành', items: 1 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-serif italic mb-2">Tài Khoản</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Quản lý thông tin cá nhân & đơn hàng</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border border-black/5">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black/5">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-serif text-xl italic">{user?.name?.charAt(0) || 'U'}</div>
            <div>
              <h3 className="text-sm font-bold">{user?.name || 'Người Dùng'}</h3>
              <p className="text-[10px] text-black/40 uppercase tracking-widest">Thành viên</p>
            </div>
          </div>
          
          {/* VIP Tier Card */}
          <div 
            onClick={() => setActiveTab('membership')}
            className="bg-gradient-to-br from-[#E8CFCF] to-[#d8b8b8] p-4 rounded-xl mb-8 relative overflow-hidden shadow-inner cursor-pointer hover:shadow-md transition-shadow group"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-black/80">Thành Viên Bạc</h4>
                <span className="text-[10px] bg-white/40 px-2 py-0.5 rounded-full text-black/60 group-hover:bg-white/60 transition-colors">Chi tiết</span>
              </div>
              <p className="text-[10px] text-black/60 mb-3">Tích lũy thêm 2.500.000đ để lên hạng Vàng</p>
              <div className="w-full bg-white/40 h-1.5 rounded-full overflow-hidden">
                <div className="bg-black h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'profile' ? 'bg-[#F3F2F0] text-black' : 'text-black/60 hover:bg-[#F3F2F0]/50 hover:text-black'}`}
            >
              <User className="w-4 h-4" /> Hồ sơ
            </button>
            <button 
              onClick={() => setActiveTab('membership')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'membership' ? 'bg-[#F3F2F0] text-black' : 'text-black/60 hover:bg-[#F3F2F0]/50 hover:text-black'}`}
            >
              <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[8px] font-bold">V</div> Hạng thành viên
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'orders' ? 'bg-[#F3F2F0] text-black' : 'text-black/60 hover:bg-[#F3F2F0]/50 hover:text-black'}`}
            >
              <Package className="w-4 h-4" /> Đơn hàng
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'wishlist' ? 'bg-[#F3F2F0] text-black' : 'text-black/60 hover:bg-[#F3F2F0]/50 hover:text-black'}`}
            >
              <Heart className="w-4 h-4" /> Wishlist
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'settings' ? 'bg-[#F3F2F0] text-black' : 'text-black/60 hover:bg-[#F3F2F0]/50 hover:text-black'}`}
            >
              <Settings className="w-4 h-4" /> Cài đặt
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 mt-4 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Đăng xuất
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 w-full bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-black/5 border border-black/5 min-h-[400px]">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-serif italic mb-6">Thông Tin Cá Nhân</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleProfileUpdate}>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Họ và tên</label>
                  <input name="name" type="text" defaultValue={user?.name || ''} required className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Email</label>
                  <input type="email" defaultValue={user?.email || ''} disabled className="w-full bg-[#F3F2F0]/50 text-black/50 rounded-xl py-3.5 px-4 text-xs outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Số điện thoại</label>
                  <input type="tel" defaultValue="0901234567" required className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Ngày sinh</label>
                  <input type="date" required className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" />
                </div>
                <div className="md:col-span-2 mt-4">
                  <button type="submit" disabled={isUpdating} className="px-8 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                    {isUpdating ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : null}
                    Cập nhật thông tin
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-serif italic mb-6">Lịch Sử Đơn Hàng</h2>
              
              {selectedOrder ? (
                <div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black mb-6 flex items-center gap-1"
                  >
                    &larr; Quay lại danh sách
                  </button>
                  <div className="border border-black/10 rounded-2xl p-6 bg-[#FAF9F6]">
                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-black/5">
                      <div>
                        <h3 className="text-lg font-bold">{selectedOrder.id}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-black/60 mt-1">Ngày đặt: {selectedOrder.date}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest ${selectedOrder.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-widest">Sản phẩm ({selectedOrder.items})</h4>
                      <div className="flex gap-4 p-4 border border-black/5 rounded-xl bg-white">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                        <div>
                          <p className="text-sm font-bold">Áo Hoodie Aura Mẫu A</p>
                          <p className="text-[10px] text-black/60 mt-1">Màu: Đen / Size: L / SL: 1</p>
                        </div>
                      </div>
                      {selectedOrder.items > 1 && (
                        <div className="flex gap-4 p-4 border border-black/5 rounded-xl bg-white">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                          <div>
                            <p className="text-sm font-bold">Quần Jogger Aura Mẫu B</p>
                            <p className="text-[10px] text-black/60 mt-1">Màu: Trắng / Size: M / SL: 1</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center pt-6 border-t border-black/5">
                      <span className="text-xs font-bold uppercase tracking-widest">Tổng tiền</span>
                      <span className="text-xl font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((order, idx) => (
                    <div key={idx} className="border border-black/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-black/30 transition-colors bg-[#FAF9F6]">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-sm font-bold uppercase">{order.id}</h4>
                          <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${order.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-black/60">Ngày đặt: {order.date} • {order.items} sản phẩm</p>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0">
                        <span className="text-lg font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</span>
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="px-6 py-2 bg-white border border-black text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'membership' && (
            <div>
              <h2 className="text-xl font-serif italic mb-6">Hạng Thành Viên</h2>
              
              {/* Current Tier Overview */}
              <div className="bg-gradient-to-br from-[#E8CFCF] to-[#d8b8b8] rounded-3xl p-8 mb-8 text-black shadow-inner">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">Hạng Hiện Tại</h3>
                    <h2 className="text-4xl font-serif italic mb-4">Thành Viên Bạc</h2>
                    <p className="text-sm opacity-80 max-w-sm">
                      Bạn cần chi tiêu thêm <strong className="font-bold">2.500.000đ</strong> để thăng hạng Vàng và nhận thêm nhiều ưu đãi.
                    </p>
                  </div>
                  <div className="w-full md:w-64">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span>Bạc</span>
                      <span>Vàng</span>
                    </div>
                    <div className="w-full bg-white/40 h-2 rounded-full overflow-hidden mb-2">
                      <div className="bg-black h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="text-[10px] text-right opacity-80 uppercase tracking-widest">
                      5.000.000đ / 7.500.000đ
                    </div>
                  </div>
                </div>
              </div>

              {/* Tiers & Benefits */}
              <div className="mb-10">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Đặc Quyền Hạng Thẻ</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-black/10 rounded-2xl p-6 opacity-50 bg-gray-50">
                    <h4 className="text-lg font-serif italic mb-2">Đồng</h4>
                    <p className="text-[10px] uppercase tracking-widest text-black/40 mb-6">Chi tiêu 0đ</p>
                    <ul className="text-xs space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-black mt-1.5 flex-shrink-0"></div>
                        <span>Nhận thông tin ưu đãi mới nhất</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-black mt-1.5 flex-shrink-0"></div>
                        <span>Giảm 5% tháng sinh nhật</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border border-black rounded-2xl p-6 bg-white relative shadow-lg shadow-black/5">
                    <div className="absolute -top-3 left-6 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Hiện tại</div>
                    <h4 className="text-lg font-serif italic mb-2 mt-2">Bạc</h4>
                    <p className="text-[10px] uppercase tracking-widest text-black/40 mb-6">Chi tiêu 5.000.000đ</p>
                    <ul className="text-xs space-y-3 font-medium">
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-black mt-1.5 flex-shrink-0"></div>
                        <span>Tích lũy 1% giá trị đơn hàng</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-black mt-1.5 flex-shrink-0"></div>
                        <span>Giảm 10% tháng sinh nhật</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-black mt-1.5 flex-shrink-0"></div>
                        <span>Freeship mọi đơn hàng</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-black/10 rounded-2xl p-6 bg-[#FAF9F6]">
                    <h4 className="text-lg font-serif italic mb-2 text-[#D4AF37]">Vàng</h4>
                    <p className="text-[10px] uppercase tracking-widest text-black/40 mb-6">Chi tiêu 15.000.000đ</p>
                    <ul className="text-xs space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0"></div>
                        <span>Tích lũy 3% giá trị đơn hàng</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0"></div>
                        <span>Giảm 15% tháng sinh nhật</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0"></div>
                        <span>Freeship mọi đơn hàng</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0"></div>
                        <span>Ưu tiên chăm sóc khách hàng</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Point Redemption */}
              <div>
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Đổi Điểm Thưởng</h3>
                    <p className="text-[10px] uppercase tracking-widest text-black/60">Sử dụng điểm tích lũy để đổi mã giảm giá</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-black/60 block mb-1">Điểm hiện tại</span>
                    <span className="text-2xl font-serif italic font-bold">15.000</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { pts: 5000, value: '50.000đ', color: 'bg-white border-black/10' },
                    { pts: 10000, value: '100.000đ', color: 'bg-[#FAF9F6] border-black/10' },
                    { pts: 20000, value: '250.000đ', color: 'bg-gradient-to-br from-[#E8CFCF] to-[#d8b8b8] border-transparent' },
                  ].map((reward, i) => (
                    <div key={i} className={`border rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm ${reward.color}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-bold block mb-1">Giảm {reward.value}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{reward.pts.toLocaleString('vi-VN')} điểm</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold">₫</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRedeemPoints(reward.pts)}
                        className={`w-full py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                          15000 >= reward.pts 
                            ? 'bg-black text-white hover:bg-neutral-800' 
                            : 'bg-black/5 text-black/40 cursor-not-allowed'
                        }`}
                        disabled={15000 < reward.pts || isUpdating}
                      >
                        {isUpdating && 15000 >= reward.pts ? <span className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin"></span> : null}
                        {15000 >= reward.pts ? 'Đổi ngay' : 'Chưa đủ điểm'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif italic">Sản Phẩm Yêu Thích</h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">{wishlist.length} mục</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {wishlist.map(product => (
                  <ProductCard key={product.id} product={product} viewMode="grid" />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-serif italic mb-6">Cài Đặt Tài Khoản</h2>
              <div className="space-y-6 max-w-md">
                <div className="flex items-center justify-between p-4 bg-[#F3F2F0] rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold">Nhận email khuyến mãi</h4>
                    <p className="text-[10px] text-black/60 mt-1">Thông tin ưu đãi và BST mới</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked onChange={handleSettingsUpdate} />
                    <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
                
                <div className="pt-4 border-t border-black/5">
                  <h4 className="text-xs font-bold mb-4">Đổi mật khẩu</h4>
                  <form className="space-y-4" onSubmit={handlePasswordUpdate}>
                    <input type="password" required placeholder="Mật khẩu hiện tại" className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" />
                    <input type="password" required minLength={6} placeholder="Mật khẩu mới" className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" />
                    <button type="submit" disabled={isUpdating} className="px-6 py-3 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-70 flex items-center gap-2">
                      {isUpdating ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : null}
                      Cập nhật mật khẩu
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
