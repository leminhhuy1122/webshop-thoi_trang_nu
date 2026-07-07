import React, { useState } from 'react';
import { Plus, Search, Tag, X, Check, Copy, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ConfirmPasswordModal } from '../../components/admin/ConfirmPasswordModal';

export function AdminVouchers() {
  const { addToast, vouchers: initialVouchers, updateVouchers, clearVouchers } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    type: 'fixed',
    value: '',
    minOrder: '',
    usageLimit: '',
    expiresAt: '',
    isWelcome: false
  });

  React.useEffect(() => {
    updateVouchers(vouchers);
  }, [vouchers, updateVouchers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setVouchers(vouchers.map(v => v.id === editingId ? {
        ...v,
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: Number(formData.value),
        minOrder: Number(formData.minOrder),
        usageLimit: Number(formData.usageLimit),
        expiresAt: formData.expiresAt,
        isWelcome: formData.isWelcome
      } : (formData.isWelcome && v.isWelcome ? { ...v, isWelcome: false } : v)));
      setEditingId(null);
      addToast('Cập nhật mã giảm giá thành công', 'success');
    } else {
      setVouchers([{
        id: Date.now().toString(),
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: Number(formData.value),
        minOrder: Number(formData.minOrder),
        usageLimit: Number(formData.usageLimit),
        usedCount: 0,
        status: 'active',
        expiresAt: formData.expiresAt,
        isWelcome: formData.isWelcome
      }, ...vouchers.map(v => formData.isWelcome && v.isWelcome ? { ...v, isWelcome: false } : v)]);
      addToast('Thêm mã giảm giá thành công', 'success');
    }
    setIsAdding(false);
    setFormData({ code: '', type: 'fixed', value: '', minOrder: '', usageLimit: '', expiresAt: '', isWelcome: false });
  };

  const handleEdit = (voucher: any) => {
    setFormData({
      code: voucher.code,
      type: voucher.type,
      value: voucher.value.toString(),
      minOrder: voucher.minOrder.toString(),
      usageLimit: voucher.usageLimit.toString(),
      expiresAt: voucher.expiresAt,
      isWelcome: voucher.isWelcome || false
    });
    setEditingId(voucher.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setVouchers(vouchers.filter(v => v.id !== id));
    addToast('Đã xóa mã giảm giá', 'info');
  };

  const handleClearVouchers = () => {
    setVouchers([]);
    clearVouchers();
    addToast('Đã xóa tất cả mã giảm giá', 'info');
  };

  const formatValue = (type: string, value: number) => {
    if (type === 'fixed' || type === 'freeship') {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }
    return `${value}%`;
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast('Đã sao chép mã', 'success');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-serif italic mb-1">Quản Lý Mã Giảm Giá</h2>
          <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">{vouchers.length} mã giảm giá</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsDeleteAllOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Xóa tất cả
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-lg shadow-black/10"
          >
            <Plus className="w-4 h-4" /> Thêm Mã
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl shadow-black/5 mb-8 relative">
          <button 
            onClick={() => setIsAdding(false)}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="text-lg font-serif italic mb-6">Thêm Mã Giảm Giá Mới</h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Mã code</label>
              <input 
                type="text" 
                required
                placeholder="VD: SUMMER20"
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20 uppercase" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Loại giảm giá</label>
              <select
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20"
              >
                <option value="fixed">Giảm tiền mặt (VNĐ)</option>
                <option value="percent">Giảm phần trăm (%)</option>
                <option value="freeship">Miễn phí vận chuyển</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Giá trị ưu đãi</label>
              <input 
                type="number" 
                required
                placeholder={formData.type === 'percent' ? "VD: 10" : "VD: 50000"}
                value={formData.value}
                onChange={e => setFormData({...formData, value: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Giá trị đơn hàng tối thiểu (VNĐ)</label>
              <input 
                type="number" 
                required
                value={formData.minOrder}
                onChange={e => setFormData({...formData, minOrder: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Giới hạn số lần sử dụng</label>
              <input 
                type="number" 
                required
                value={formData.usageLimit}
                onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Ngày hết hạn</label>
              <input 
                type="date" 
                required
                value={formData.expiresAt}
                onChange={e => setFormData({...formData, expiresAt: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <input 
                type="checkbox" 
                id="isWelcome" 
                checked={formData.isWelcome}
                onChange={e => setFormData({...formData, isWelcome: e.target.checked})}
                className="w-4 h-4 rounded border-black/20 text-black focus:ring-black"
              />
              <label htmlFor="isWelcome" className="text-xs font-bold uppercase tracking-widest text-black/80">
                Hiển thị popup cho người dùng mới (Chỉ 1 mã được kích hoạt)
              </label>
            </div>

            <div className="md:col-span-2 pt-4">
              <button type="submit" className="px-8 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors">
                {editingId ? 'Cập Nhật Mã' : 'Tạo Mã'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
        <div className="p-6 border-b border-black/5 bg-[#FAF9F6] relative">
          <Search className="w-4 h-4 absolute left-10 top-1/2 -translate-y-1/2 text-black/40" />
          <input type="text" placeholder="Tìm kiếm mã code..." className="w-full sm:w-64 bg-white border border-black/10 rounded-full py-2.5 pl-10 pr-4 text-xs outline-none focus:border-black/30 transition-colors" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF9F6] text-[10px] font-bold uppercase tracking-widest text-black/60">
              <tr>
                <th className="px-6 py-4">Mã Code</th>
                <th className="px-6 py-4">Giá trị</th>
                <th className="px-6 py-4">Đơn tối thiểu</th>
                <th className="px-6 py-4">Đã dùng / Giới hạn</th>
                <th className="px-6 py-4">Ngày hết hạn</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {vouchers.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-black/40" />
                      <span className="font-bold uppercase">{voucher.code}</span>
                      <button onClick={() => copyCode(voucher.code)} className="p-1 hover:bg-black/5 rounded text-black/40 hover:text-black transition-colors">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    {voucher.isWelcome && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-black text-white text-[8px] font-bold uppercase tracking-widest rounded">
                        Popup Welcome
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-red-600">
                    {formatValue(voucher.type, voucher.value)}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.minOrder)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>{voucher.usedCount}</span>
                        <span>{voucher.usageLimit}</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: `${(voucher.usedCount / voucher.usageLimit) * 100}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">{new Date(voucher.expiresAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                      voucher.status === 'active' && voucher.usedCount < voucher.usageLimit
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {voucher.status === 'active' && voucher.usedCount < voucher.usageLimit ? 'Hoạt động' : 'Hết hạn'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleEdit(voucher)} className="text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors">
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(voucher.id)} className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors">
                        Xóa
                      </button>
                    </div>
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
        onConfirm={handleClearVouchers}
        title="Xóa tất cả mã giảm giá"
        description="Bạn có chắc chắn muốn xóa tất cả mã giảm giá? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
