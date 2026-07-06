import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, X, Search, Image as ImageIcon, Trash2 } from 'lucide-react';
import { ConfirmPasswordModal } from '../../components/admin/ConfirmPasswordModal';

export function AdminProducts() {
  const { products, categories, createProduct, updateProduct, deleteProduct, clearProducts } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    image: '',
    images: '',
    colors: '',
    sizes: '',
    stock: '',
    materials: '',
    careInstructions: '',
    tags: '',
    isNew: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse sizes with stock format "S:10, M:5" -> [{ name: 'S', stock: 10 }, ...]
    const parsedSizes = formData.sizes.split(',').map(s => {
      const parts = s.split(':');
      if (parts.length === 2) {
        return { name: parts[0]?.trim(), stock: Number(parts[1]?.trim()) || 0 };
      }
      return { name: s.trim(), stock: Number(formData.stock) || 0 };
    }).filter(s => s.name);

    const productData = {
      ...formData,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
      stock: Number(formData.stock),
      colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
      sizes: parsedSizes,
      images: formData.images ? formData.images.split(',').map(i => i.trim()).filter(Boolean) : [],
      materials: formData.materials ? formData.materials.split(',').map(m => m.trim()).filter(Boolean) : [],
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      createProduct(productData);
    }
    
    setIsAdding(false);
    setEditingId(null);
    setFormData({ 
      name: '', description: '', price: '', salePrice: '', category: '', 
      image: '', images: '', colors: '', sizes: '', stock: '', 
      materials: '', careInstructions: '', tags: '', isNew: false 
    });
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price ? product.price.toString() : '',
      salePrice: product.salePrice ? product.salePrice.toString() : '',
      category: product.category || '',
      image: product.image || '',
      images: Array.isArray(product.images) ? product.images.join(', ') : '',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      sizes: Array.isArray(product.sizes) ? product.sizes.map((s: any) => typeof s === 'object' ? `${s.name}:${s.stock}` : s).join(', ') : '',
      stock: product.stock ? product.stock.toString() : '',
      materials: Array.isArray(product.materials) ? product.materials.join(', ') : '',
      careInstructions: product.careInstructions || '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      isNew: product.isNew || false
    });
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      deleteProduct(id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-serif italic mb-1">Quản Lý Sản Phẩm</h2>
          <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">{products.length} sản phẩm hiện có</p>
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
            <Plus className="w-4 h-4" /> Thêm Sản Phẩm
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
          <h3 className="text-lg font-serif italic mb-6">Thêm Sản Phẩm Mới</h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Tên sản phẩm</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Mô tả sản phẩm</label>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20 resize-none" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Giá gốc (VNĐ)</label>
              <input 
                type="number" 
                required
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Giá khuyến mãi (VNĐ - Không bắt buộc)</label>
              <input 
                type="number" 
                value={formData.salePrice}
                onChange={e => setFormData({...formData, salePrice: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Danh mục</label>
              <input 
                type="text" 
                required
                placeholder="Nhập để chọn hoặc tạo mới..."
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
                list="categories-list"
              />
              <datalist id="categories-list">
                {categories.map((c: any) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Tồn kho</label>
              <input 
                type="number" 
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Màu sắc (Cách nhau bằng dấu phẩy)</label>
              <input 
                type="text" 
                placeholder="VD: Đen, Trắng, Đỏ"
                value={formData.colors}
                onChange={e => setFormData({...formData, colors: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Kích thước và Số lượng tồn kho (VD: S:10, M:5, L:0)</label>
              <input 
                type="text" 
                placeholder="VD: S:10, M:5, L:0"
                value={formData.sizes}
                onChange={e => setFormData({...formData, sizes: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Chất liệu (Cách nhau bằng dấu phẩy)</label>
              <input 
                type="text" 
                placeholder="VD: 100% Cotton, Vải thô"
                value={formData.materials}
                onChange={e => setFormData({...formData, materials: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Hướng dẫn bảo quản</label>
              <input 
                type="text" 
                placeholder="VD: Giặt máy nước lạnh, không dùng thuốc tẩy..."
                value={formData.careInstructions}
                onChange={e => setFormData({...formData, careInstructions: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Thẻ Tags (Cách nhau bằng dấu phẩy)</label>
              <input 
                type="text" 
                placeholder="VD: Mùa hè, Công sở, Đi tiệc"
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isNew"
                checked={formData.isNew}
                onChange={e => setFormData({...formData, isNew: e.target.checked})}
                className="w-4 h-4 rounded border-black/20 text-black focus:ring-black"
              />
              <label htmlFor="isNew" className="text-xs font-bold uppercase tracking-widest text-black/80">Sản phẩm mới</label>
            </div>

            <div className="md:col-span-2 flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Hình ảnh chính (URL hoặc Tải lên)</label>
                <input 
                  type="url" 
                  required
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20" 
                />
              </div>
              <div>
                <input 
                  type="file" 
                  accept="image/*"
                  id="product-image-upload"
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
                  htmlFor="product-image-upload"
                  className="flex items-center justify-center px-6 py-3.5 border border-black/10 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-black/80 transition-colors"
                >
                  Tải ảnh lên
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Thư viện ảnh (Các URL phụ cách nhau bằng dấu phẩy)</label>
              <textarea 
                rows={2}
                value={formData.images}
                onChange={e => setFormData({...formData, images: e.target.value})}
                className="w-full bg-[#F3F2F0] rounded-xl py-3.5 px-4 text-xs outline-none focus:ring-1 ring-black/20 resize-none mb-4" 
              />
              
              {/* Image preview and reordering */}
              {formData.images.trim() && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {formData.images.split(',').map(i => i.trim()).filter(Boolean).map((imgUrl, index, arr) => (
                    <div 
                      key={index}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', index.toString());
                      }}
                      onDragOver={(e) => {
                        e.preventDefault(); // Necessary to allow dropping
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                        if (draggedIndex === index) return;
                        const newArr = [...arr];
                        const draggedItem = newArr[draggedIndex];
                        newArr.splice(draggedIndex, 1);
                        newArr.splice(index, 0, draggedItem);
                        setFormData({...formData, images: newArr.join(', ')});
                      }}
                      className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-black/10 cursor-move group"
                      title="Kéo thả để sắp xếp"
                    >
                      <img src={imgUrl} alt={`Preview ${index}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Error')} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="text-white text-[10px] font-bold">Kéo thả</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 pt-4">
              <button type="submit" className="px-8 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors">
                Lưu Sản Phẩm
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
        <div className="p-6 border-b border-black/5 flex justify-between items-center bg-[#FAF9F6]">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
            <input type="text" placeholder="Tìm kiếm sản phẩm..." className="w-full bg-white border border-black/10 rounded-full py-2.5 pl-10 pr-4 text-xs outline-none focus:border-black/30 transition-colors" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF9F6] text-[10px] font-bold uppercase tracking-widest text-black/60">
              <tr>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Giá</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-black/20">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold">{product.name}</div>
                        <div className="text-[10px] uppercase tracking-widest text-black/40 mt-1">{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      {product.salePrice ? (
                        <>
                          <span className="font-bold text-red-600">{formatPrice(product.salePrice)}</span>
                          <span className="text-[10px] line-through text-black/40">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        <span className="font-bold">{formatPrice(product.price)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleEdit(product)} className="text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors">
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-black/40">
                    Chưa có sản phẩm nào
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
        onConfirm={clearProducts}
        title="Xóa tất cả sản phẩm"
        description="Bạn có chắc chắn muốn xóa tất cả sản phẩm? Hành động này sẽ xóa toàn bộ danh mục sản phẩm và không thể hoàn tác."
      />
    </div>
  );
}
