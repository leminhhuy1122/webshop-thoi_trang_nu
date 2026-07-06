import { useState } from 'react';
import { Search, UserCircle, Star, Ban, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ConfirmPasswordModal } from '../../components/admin/ConfirmPasswordModal';

export function AdminUsers() {
  const { addToast } = useStore();
  const [users, setUsers] = useState([
    { id: '1', name: 'Nguyen Van A', email: 'user@example.com', phone: '0901234567', totalSpent: 12500000, tier: 'Vàng', orders: 8, registeredAt: '2025-10-15', status: 'active' },
    { id: '2', name: 'Tran Thi B', email: 'tranb@example.com', phone: '0912345678', totalSpent: 5200000, tier: 'Bạc', orders: 3, registeredAt: '2026-02-20', status: 'active' },
    { id: '3', name: 'Le Van C', email: 'lec@example.com', phone: '0987654321', totalSpent: 850000, tier: 'Đồng', orders: 1, registeredAt: '2026-06-10', status: 'active' },
    { id: '4', name: 'Phạm D', email: 'phamd@example.com', phone: '0933334444', totalSpent: 0, tier: 'Đồng', orders: 0, registeredAt: '2026-07-01', status: 'banned' },
  ]);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'active' ? 'banned' : 'active';
        addToast(`Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản`, newStatus === 'active' ? 'success' : 'info');
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleClearUsers = () => {
    setUsers([]);
    addToast('Đã xóa tất cả khách hàng', 'info');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-serif italic mb-1">Quản Lý Khách Hàng</h2>
          <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">{users.length} tài khoản</p>
        </div>
        <button 
          onClick={() => setIsDeleteAllOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Xóa tất cả
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
        <div className="p-6 border-b border-black/5 bg-[#FAF9F6] relative flex justify-between items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
            <input type="text" placeholder="Tìm kiếm Email / SĐT..." className="w-full sm:w-64 bg-white border border-black/10 rounded-full py-2.5 pl-10 pr-4 text-xs outline-none focus:border-black/30 transition-colors" />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Tất cả</button>
            <button className="px-4 py-2 bg-white border border-black/10 text-black/60 rounded-full text-[10px] font-bold uppercase tracking-widest">VIP</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF9F6] text-[10px] font-bold uppercase tracking-widest text-black/60">
              <tr>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Hạng thành viên</th>
                <th className="px-6 py-4">Tổng chi tiêu</th>
                <th className="px-6 py-4">Số đơn</th>
                <th className="px-6 py-4">Ngày đăng ký</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {users.map((user) => (
                <tr key={user.id} className={`hover:bg-[#FAF9F6] transition-colors ${user.status === 'banned' ? 'opacity-50 grayscale' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                        <UserCircle className="w-5 h-5 text-black/40" />
                      </div>
                      <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-[10px] text-black/60">{user.email} • {user.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-max ${
                      user.tier === 'Vàng' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 
                      user.tier === 'Bạc' ? 'bg-gray-200 text-gray-700' : 
                      'bg-[#cd7f32]/20 text-[#cd7f32]'
                    }`}>
                      {user.tier === 'Vàng' && <Star className="w-3 h-3" />}
                      {user.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user.totalSpent)}
                  </td>
                  <td className="px-6 py-4">{user.orders}</td>
                  <td className="px-6 py-4 text-xs">{new Date(user.registeredAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleStatus(user.id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors"
                    >
                      {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <ConfirmPasswordModal 
        isOpen={isDeleteAllOpen} 
        onClose={() => setIsDeleteAllOpen(false)} 
        onConfirm={handleClearUsers}
        title="Xóa tất cả khách hàng"
        description="Bạn có chắc chắn muốn xóa tất cả thông tin khách hàng? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
