import React, { useState } from 'react';
import { Search, Package, AlertTriangle, Edit2, Filter, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ConfirmPasswordModal } from '../../components/admin/ConfirmPasswordModal';

export function AdminInventory() {
  const { products, clearProducts, addToast } = useStore();
  const [filter, setFilter] = useState('all'); // all, low, out
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  // Mock inventory variants per product
  const inventoryData = products.flatMap(p => [
    { id: `${p.id}-S`, productId: p.id, name: p.name, image: p.image, variant: 'Size S', stock: 45, threshold: 10 },
    { id: `${p.id}-M`, productId: p.id, name: p.name, image: p.image, variant: 'Size M', stock: 8, threshold: 15 }, // low stock
    { id: `${p.id}-L`, productId: p.id, name: p.name, image: p.image, variant: 'Size L', stock: 0, threshold: 10 }, // out of stock
  ]);

  const filteredInventory = inventoryData.filter(item => {
    if (filter === 'low') return item.stock > 0 && item.stock <= item.threshold;
    if (filter === 'out') return item.stock === 0;
    return true;
  });

  const handleClearInventory = () => {
    clearProducts();
    addToast('Đã xóa tất cả thông tin kho (sản phẩm)', 'info');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-serif italic mb-1">Quản Lý Kho Hàng</h2>
          <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Kiểm soát tồn kho theo phân loại</p>
        </div>
        <button 
          onClick={() => setIsDeleteAllOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-black/5 flex items-center justify-between cursor-pointer hover:border-black/20 transition-colors" onClick={() => setFilter('all')}>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-1">Tổng phân loại</div>
            <div className="text-2xl font-bold">{inventoryData.length}</div>
          </div>
          <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-orange-500/20 flex items-center justify-between cursor-pointer hover:border-orange-500/40 transition-colors" onClick={() => setFilter('low')}>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-orange-600/60 font-bold mb-1">Sắp hết hàng</div>
            <div className="text-2xl font-bold text-orange-600">{inventoryData.filter(i => i.stock > 0 && i.stock <= i.threshold).length}</div>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-red-500/20 flex items-center justify-between cursor-pointer hover:border-red-500/40 transition-colors" onClick={() => setFilter('out')}>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-red-600/60 font-bold mb-1">Hết hàng</div>
            <div className="text-2xl font-bold text-red-600">{inventoryData.filter(i => i.stock === 0).length}</div>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
        <div className="p-6 border-b border-black/5 bg-[#FAF9F6] flex justify-between items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
            <input type="text" placeholder="Tìm kiếm sản phẩm..." className="w-full sm:w-64 bg-white border border-black/10 rounded-full py-2.5 pl-10 pr-4 text-xs outline-none focus:border-black/30 transition-colors" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-black/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black hover:border-black/30 transition-colors">
            <Filter className="w-3 h-3" /> Lọc
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF9F6] text-[10px] font-bold uppercase tracking-widest text-black/60">
              <tr>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Phân loại</th>
                <th className="px-6 py-4">Tồn kho</th>
                <th className="px-6 py-4">Cảnh báo (Dưới)</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredInventory.map((item) => (
                <tr key={item.id} className={`hover:bg-[#FAF9F6] transition-colors ${item.stock === 0 ? 'bg-red-50/30' : item.stock <= item.threshold ? 'bg-orange-50/30' : ''}`}>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-bold line-clamp-1">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="px-2 py-1 bg-black/5 rounded font-bold">{item.variant}</span>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    <span className={item.stock === 0 ? 'text-red-600' : item.stock <= item.threshold ? 'text-orange-600' : ''}>{item.stock}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-black/40">{item.threshold}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${
                      item.stock === 0 ? 'bg-red-100 text-red-700' : 
                      item.stock <= item.threshold ? 'bg-orange-100 text-orange-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.stock === 0 ? 'Hết hàng' : item.stock <= item.threshold ? 'Sắp hết' : 'Đang bán'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[10px] font-bold uppercase tracking-widest text-black hover:underline">
                      Cập nhật
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
        onConfirm={handleClearInventory}
        title="Xóa tất cả kho hàng"
        description="Bạn có chắc chắn muốn xóa tất cả thông tin sản phẩm và kho hàng? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
