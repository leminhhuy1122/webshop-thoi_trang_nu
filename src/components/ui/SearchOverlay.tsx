import { useEffect, useRef, useState } from 'react';
import { X, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { products } from '../../data/mockData';

export function SearchOverlay() {
  const { isSearchOpen, toggleSearch } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const popularSearches = ['Váy lụa', 'Áo sơ mi', 'Đầm dự tiệc', 'Quần ống rộng'];
  
  const searchResults = query.trim() === '' 
    ? products.slice(0, 3) 
    : products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())).slice(0, 6);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-in fade-in"
        onClick={toggleSearch}
      />
      
      <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-2xl animate-in slide-in-from-top-full duration-300 rounded-b-3xl overflow-hidden">
        
        {/* Search Input Area */}
        <div className="border-b border-black/5 bg-[#FAF9F6]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
            <SearchIcon className="w-6 h-6 text-black/40 flex-shrink-0" />
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Bạn đang tìm kiếm gì?" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-xl md:text-2xl font-serif italic outline-none placeholder:text-black/20"
            />
            <button 
              onClick={toggleSearch}
              className="p-3 hover:bg-black/5 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            
            {/* Quick Links */}
            <div className="md:col-span-4 flex flex-col gap-8">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-4">Tìm kiếm phổ biến</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map(term => (
                    <button 
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 bg-[#F3F2F0] hover:bg-black hover:text-white rounded-full text-xs font-bold transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-4">Danh mục gợi ý</h3>
                <div className="flex flex-col gap-3">
                  {['Tất cả sản phẩm', 'Bộ sưu tập Thu Đông', 'Sản phẩm Sale'].map(cat => (
                    <button 
                      key={cat}
                      className="flex items-center justify-between text-sm hover:text-black/60 transition-colors group"
                      onClick={() => {
                        toggleSearch();
                        navigate('/category');
                      }}
                    >
                      <span>{cat}</span>
                      <ArrowRight className="w-4 h-4 text-transparent group-hover:text-black/40 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggested Products */}
            <div className="md:col-span-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-6">
                {query.trim() === '' ? 'Sản phẩm gợi ý' : `Kết quả tìm kiếm cho "${query}"`}
              </h3>
              
              {searchResults.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-black/60">Không tìm thấy sản phẩm nào phù hợp.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {searchResults.map(product => (
                    <div 
                      key={product.id} 
                      className="group cursor-pointer flex flex-row sm:flex-col gap-4 items-start"
                      onClick={() => {
                        toggleSearch();
                        navigate(`/product/${product.id}`);
                      }}
                    >
                      <div className="w-24 sm:w-full aspect-[3/4] bg-[#F3F2F0] rounded-xl overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold line-clamp-2 mb-1 group-hover:opacity-70 transition-opacity">{product.name}</h4>
                        <p className="text-xs font-bold">{formatPrice(product.salePrice || product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
