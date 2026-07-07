import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Package, LayoutDashboard, ShoppingCart, LogOut, Tags, Users, Settings, Newspaper, Warehouse, Star, LayoutTemplate, Menu, X, Bell, Check, Trash2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export function AdminLayout() {
  const { user, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Đơn hàng mới #1234', message: 'Nguyễn Văn A vừa đặt một đơn hàng trị giá 1.200.000đ', isRead: false, time: '5 phút trước' },
    { id: 2, title: 'Sản phẩm sắp hết hàng', message: 'Áo thun Polo (Size M) chỉ còn 2 sản phẩm trong kho.', isRead: false, time: '1 giờ trước' },
    { id: 3, title: 'Đánh giá mới', message: 'Trần Thị B đã để lại đánh giá 5 sao cho sản phẩm Váy hoa nhí.', isRead: true, time: '2 giờ trước' },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotificationsOpen(false);
  }, [location.pathname]);

  // Handle click outside for notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Tổng quan' },
    { path: '/admin/products', icon: Package, label: 'Sản phẩm' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng' },
    { path: '/admin/vouchers', icon: Tags, label: 'Mã giảm giá' },
    { path: '/admin/blog', icon: Newspaper, label: 'Bài viết' },
    { path: '/admin/inventory', icon: Warehouse, label: 'Kho hàng' },
    { path: '/admin/storefront', icon: LayoutTemplate, label: 'Giao diện' },
    { path: '/admin/reviews', icon: Star, label: 'Đánh giá' },
    { path: '/admin/users', icon: Users, label: 'Khách hàng' },
    { path: '/admin/settings', icon: Settings, label: 'Cài đặt' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F2F0] flex pb-16 md:pb-0">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-black/5 flex-col fixed inset-y-0 z-20">
        <div className="h-20 flex items-center px-8 border-b border-black/5">
          <Link to="/" className="text-2xl font-serif tracking-tighter">AURA<span className="text-[10px] uppercase tracking-widest text-black/40 ml-2">Admin</span></Link>
        </div>
        
        <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${isActive(item.path) ? 'bg-black text-white' : 'text-black/60 hover:bg-black/5 hover:text-black'}`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-black/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="text-xs font-bold line-clamp-1">{user?.name}</div>
              <div className="text-[10px] text-black/40 line-clamp-1">{user?.email}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col h-[calc(100vh-4rem)] md:h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 md:h-20 bg-white border-b border-black/5 flex items-center px-4 md:px-8 flex-shrink-0 justify-between sticky top-0 z-30">
          <h1 className="text-lg md:text-xl font-serif italic">Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center relative transition-colors"
              >
                <Bell className="w-5 h-5 text-black" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden z-50">
                  <div className="p-4 border-b border-black/5 flex items-center justify-between bg-[#F3F2F0]/50">
                    <h3 className="font-serif italic font-bold">Thông báo</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] uppercase tracking-widest font-bold text-black/60 hover:text-black transition-colors"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                    {notifications.length > 0 ? (
                      <div className="flex flex-col divide-y divide-black/5">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-4 hover:bg-[#F3F2F0] transition-colors relative group ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-xs font-bold uppercase tracking-widest ${!notification.isRead ? 'text-black' : 'text-black/60'}`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-black/40">{notification.time}</span>
                                {notification.isRead && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeNotification(notification.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-black/40 hover:text-red-500"
                                    title="Xóa thông báo"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-black/60 line-clamp-2 pr-6">
                              {notification.message}
                            </p>
                            {!notification.isRead && (
                              <div className="absolute top-1/2 -translate-y-1/2 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-black/40 text-xs font-bold uppercase tracking-widest">
                        Không có thông báo nào
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-black/5 text-center bg-[#F3F2F0]/50">
                    <button className="text-[10px] uppercase tracking-widest font-bold text-black hover:opacity-70 transition-opacity">
                      Xem tất cả
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] uppercase tracking-widest font-bold text-black/40 flex items-center gap-2">
              <span className="hidden sm:inline">{new Date().toLocaleDateString('vi-VN')}</span>
              <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black md:hidden">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 no-scrollbar bg-[#F3F2F0]">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-black/10 z-40 pb-safe">
        <div className="flex items-center justify-around h-16">
          <Link 
            to="/admin" 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/admin') ? 'text-black' : 'text-black/40'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
          </Link>
          <Link 
            to="/admin/products" 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/admin/products') ? 'text-black' : 'text-black/40'}`}
          >
            <Package className="w-6 h-6" />
          </Link>
          <Link 
            to="/admin/orders" 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/admin/orders') ? 'text-black' : 'text-black/40'}`}
          >
            <ShoppingCart className="w-6 h-6" />
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isMobileMenuOpen ? 'text-black' : 'text-black/40'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Full Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-black/5 shrink-0">
            <span className="text-lg font-serif italic">Menu</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-11 h-11 flex items-center justify-center bg-black/5 rounded-full"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 py-6 grid grid-cols-2 gap-4 content-start">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex flex-col items-center justify-center p-4 rounded-2xl gap-3 transition-colors ${isActive(item.path) ? 'bg-black text-white' : 'bg-[#F3F2F0] text-black hover:bg-black/10'}`}
              >
                <item.icon className="w-8 h-8" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-center">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="p-6 shrink-0 border-t border-black/5">
            <button 
              onClick={handleLogout}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-red-50 text-red-600 font-bold uppercase tracking-widest text-xs"
            >
              <LogOut className="w-5 h-5" /> Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
