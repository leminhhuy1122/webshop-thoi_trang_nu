import React, { useState } from 'react';
import { Plus, X, Search, Image as ImageIcon, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ConfirmPasswordModal } from '../../components/admin/ConfirmPasswordModal';

export function AdminBlog() {
  const { addToast } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [posts, setPosts] = useState([
    { id: '1', title: 'Xu Hướng Thời Trang Xuân Hè 2026', category: 'Fashion', author: 'Aura Team', publishedAt: '2026-07-01', status: 'published', views: 1250 },
    { id: '2', title: 'Cách Phối Đồ Với Áo Hoodie Minimal', category: 'Style Guide', author: 'Aura Stylist', publishedAt: '2026-06-25', status: 'published', views: 890 },
    { id: '3', title: 'Chất Liệu Bền Vững Trong Ngành Thời Trang', category: 'Sustainability', author: 'Aura Team', publishedAt: '', status: 'draft', views: 0 },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: '',
    status: 'draft'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPosts([{
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category || 'Tin tức',
      author: 'Aura Admin',
      publishedAt: formData.status === 'published' ? new Date().toISOString().split('T')[0] : '',
      status: formData.status,
      views: 0
    }, ...posts]);
    setIsAdding(false);
    setFormData({ title: '', category: '', content: '', image: '', status: 'draft' });
    addToast('Lưu bài viết thành công', 'success');
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
    addToast('Đã xóa bài viết', 'info');
  };

  const handleClearPosts = () => {
    setPosts([]);
    addToast('Đã xóa tất cả bài viết', 'info');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-serif italic mb-1">Quản Lý Bài Viết</h2>
          <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">{posts.length} bài viết trên Blog</p>
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
            <Plus className="w-4 h-4" /> Viết Bài Mới
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
          <h3 className="text-lg font-serif italic mb-6">Tạo Bài Viết</h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Tiêu đề bài viết</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Chuyên mục</label>
                <input 
                  type="text" 
                  list="blog-categories"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
                />
                <datalist id="blog-categories">
                  <option value="Fashion" />
                  <option value="Style Guide" />
                  <option value="Sustainability" />
                </datalist>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20"
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Xuất bản ngay</option>
                </select>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Ảnh bìa (URL hoặc Tải lên)</label>
                <input 
                  type="url" 
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
                />
              </div>
              <div>
                <input 
                  type="file" 
                  accept="image/*"
                  id="blog-image-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setFormData({...formData, image: url});
                    }
                  }}
                />
                <label 
                  htmlFor="blog-image-upload"
                  className="flex items-center justify-center px-6 py-3.5 border border-black/10 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-black/80 transition-colors"
                >
                  Tải ảnh lên
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Nội dung</label>
              <textarea 
                required
                rows={8}
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20 resize-y" 
                placeholder="Nội dung bài viết hỗ trợ Markdown..."
              ></textarea>
            </div>

            <div className="pt-4 flex gap-4">
              <button type="submit" className="px-8 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors">
                Lưu Bài Viết
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
        <div className="p-6 border-b border-black/5 bg-[#FAF9F6] relative">
          <Search className="w-4 h-4 absolute left-10 top-1/2 -translate-y-1/2 text-black/40" />
          <input type="text" placeholder="Tìm kiếm bài viết..." className="w-full sm:w-64 bg-white border border-black/10 rounded-full py-2.5 pl-10 pr-4 text-xs outline-none focus:border-black/30 transition-colors" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF9F6] text-[10px] font-bold uppercase tracking-widest text-black/60">
              <tr>
                <th className="px-6 py-4 w-2/5">Tiêu đề</th>
                <th className="px-6 py-4">Chuyên mục</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ngày đăng</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold line-clamp-1">{post.title}</div>
                    <div className="text-[10px] text-black/40 mt-1 flex gap-2">
                      <span>Tác giả: {post.author}</span>
                      <span>•</span>
                      <span>Lượt xem: {post.views}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 bg-black/5 rounded text-[10px] font-bold uppercase tracking-widest`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">{post.publishedAt || '--/--/----'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="p-1.5 text-black/60 hover:text-black hover:bg-black/5 rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deletePost(post.id)} className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors">
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
        onConfirm={handleClearPosts}
        title="Xóa tất cả bài viết"
        description="Bạn có chắc chắn muốn xóa tất cả bài viết trên blog? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
