import React, { useState } from 'react';
import { Search, Star, MessageCircle, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ConfirmPasswordModal } from '../../components/admin/ConfirmPasswordModal';

export function AdminReviews() {
  const { products, addToast } = useStore();
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [reviews, setReviews] = useState([
    { id: '1', productId: products[0]?.id, productName: products[0]?.name, user: 'Nguyễn Văn A', rating: 5, content: 'Chất lượng áo rất tốt, form dáng chuẩn.', date: '2026-07-01', status: 'pending' },
    { id: '2', productId: products[1]?.id, productName: products[1]?.name, user: 'Trần B', rating: 4, content: 'Giao hàng nhanh, đóng gói cẩn thận. Tuy nhiên màu hơi khác so với ảnh.', date: '2026-06-28', status: 'approved' },
    { id: '3', productId: products[0]?.id, productName: products[0]?.name, user: 'Le C', rating: 1, content: 'Không hài lòng với thái độ phục vụ của shipper.', date: '2026-06-25', status: 'rejected' },
  ]);

  const updateStatus = (id: string, status: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
    addToast(`Đã ${status === 'approved' ? 'duyệt' : 'từ chối'} đánh giá`, status === 'approved' ? 'success' : 'info');
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
    addToast('Đã xóa đánh giá', 'info');
  };

  const handleClearReviews = () => {
    setReviews([]);
    addToast('Đã xóa tất cả đánh giá', 'info');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-serif italic mb-1">Quản Lý Đánh Giá</h2>
          <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">{reviews.length} đánh giá từ khách hàng</p>
        </div>
        <button 
          onClick={() => setIsDeleteAllOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Xóa tất cả
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
        <div className="p-6 border-b border-black/5 bg-[#FAF9F6] flex justify-between items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
            <input type="text" placeholder="Tìm kiếm đánh giá..." className="w-full sm:w-64 bg-white border border-black/10 rounded-full py-2.5 pl-10 pr-4 text-xs outline-none focus:border-black/30 transition-colors" />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Tất cả</button>
            <button className="px-4 py-2 bg-white border border-black/10 text-black/60 rounded-full text-[10px] font-bold uppercase tracking-widest">Chờ duyệt</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF9F6] text-[10px] font-bold uppercase tracking-widest text-black/60">
              <tr>
                <th className="px-6 py-4 w-1/4">Sản phẩm</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Đánh giá</th>
                <th className="px-6 py-4 w-1/3">Nội dung</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {reviews.map((review) => (
                <tr key={review.id} className={`hover:bg-[#FAF9F6] transition-colors ${review.status === 'rejected' ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <span className="font-bold line-clamp-2 text-xs">{review.productName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-xs">{review.user}</div>
                    <div className="text-[9px] text-black/40 mt-0.5">{review.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs line-clamp-2">{review.content}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${
                      review.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      review.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {review.status === 'approved' ? 'Đã duyệt' : review.status === 'rejected' ? 'Đã ẩn' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {review.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(review.id, 'approved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Duyệt">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => updateStatus(review.id, 'rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Từ chối">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => deleteReview(review.id)} className="p-1.5 text-black/40 hover:text-black hover:bg-black/5 rounded transition-colors" title="Xóa">
                        <Trash2 className="w-4 h-4" />
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
        onConfirm={handleClearReviews}
        title="Xóa tất cả đánh giá"
        description="Bạn có chắc chắn muốn xóa tất cả đánh giá của khách hàng? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
