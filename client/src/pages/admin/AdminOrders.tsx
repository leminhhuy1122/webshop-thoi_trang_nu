import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, Trash2 } from 'lucide-react';
import { ConfirmPasswordModal } from '../../components/admin/ConfirmPasswordModal';

export function AdminOrders() {
  const { orders } = useStore();
  const [filter, setFilter] = useState('all');
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  
  const [ordersList, setOrdersList] = useState(() => {
    return orders.length > 0 ? orders : [
      { id: '#AURA-2608', date: '05/07/2026', total: 1450000, status: 'Đang xử lý', customer: 'Nguyen Van A', items: 2 },
      { id: '#AURA-2607', date: '04/07/2026', total: 850000, status: 'Đang giao hàng', customer: 'Tran Thi B', items: 1 },
      { id: '#AURA-2606', date: '01/07/2026', total: 2450000, status: 'Hoàn thành', customer: 'Le Van C', items: 4 },
    ];
  });
  
  const { addToast, clearOrders } = useStore();

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrdersList(ordersList.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    addToast('Cập nhật trạng thái thành công', 'success');
  };

  const handleClearOrders = () => {
    setOrdersList([]);
    clearOrders();
    addToast('Đã xóa tất cả đơn hàng', 'info');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredOrders = filter === 'all' 
    ? ordersList 
    : ordersList.filter(o => o.status.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-serif italic mb-1">Quản Lý Đơn Hàng</h2>
          <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">{ordersList.length} đơn hàng</p>
        </div>
        <button 
          onClick={() => setIsDeleteAllOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Xóa tất cả
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
        <div className="p-6 border-b border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FAF9F6]">
          <div className="flex gap-2">
            {['all', 'Đang xử lý', 'Đang giao hàng', 'Hoàn thành'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f === 'all' ? 'all' : f)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  (filter === f || (filter === 'all' && f === 'all'))
                    ? 'bg-black text-white'
                    : 'bg-black/5 hover:bg-black/10 text-black/60'
                }`}
              >
                {f === 'all' ? 'Tất cả' : f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
            <input type="text" placeholder="Tìm kiếm đơn hàng..." className="w-full bg-white border border-black/10 rounded-full py-2.5 pl-10 pr-4 text-xs outline-none focus:border-black/30 transition-colors" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF9F6] text-[10px] font-bold uppercase tracking-widest text-black/60">
              <tr>
                <th className="px-6 py-4">Mã Đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Ngày đặt</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredOrders.map((order: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="px-6 py-4 font-bold">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4 text-black/60">{order.date}</td>
                  <td className="px-6 py-4 font-bold">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer border-none appearance-none ${
                      order.status === 'Hoàn thành' 
                        ? 'bg-green-100 text-green-700' 
                        : order.status === 'Đang xử lý'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đang giao hàng">Đang giao hàng</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[10px] font-bold uppercase tracking-widest hover:text-black/60 transition-colors">
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-black/40">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <ConfirmPasswordModal 
        isOpen={isDeleteAllOpen} 
        onClose={() => setIsDeleteAllOpen(false)} 
        onConfirm={handleClearOrders}
        title="Xóa tất cả đơn hàng"
        description="Bạn có chắc chắn muốn xóa tất cả đơn hàng? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
