import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { articles } from '../data/mockData';

export function Blog() {
  return (
    <div className="w-full flex-1">
      {/* Hero */}
      <section className="relative h-[400px] rounded-3xl overflow-hidden mb-12 lg:mb-20">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop" 
          alt="Blog Cover" 
          className="w-full h-full object-cover mix-blend-overlay opacity-80"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Tạp chí Aura</p>
          <h1 className="text-4xl md:text-6xl font-serif italic mb-6 max-w-2xl">Câu Chuyện Phong Cách</h1>
        </div>
      </section>

      {/* Categories */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 mb-12">
        {['Tất cả', 'Phong cách', 'Bộ sưu tập', 'Hướng dẫn', 'Sự kiện'].map((cat, idx) => (
          <button 
            key={cat}
            className={`text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors pb-2 border-b-2 ${idx === 0 ? 'border-black text-black' : 'border-transparent text-black/40 hover:text-black'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
        {articles.map((article) => (
          <article key={article.id} className="group cursor-pointer">
            <div className="aspect-[4/5] bg-[#F3F2F0] rounded-2xl overflow-hidden mb-6 relative">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest">
                {article.category}
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3">
              <span>{article.date}</span>
            </div>
            <h2 className="text-xl font-serif italic mb-3 group-hover:opacity-70 transition-opacity line-clamp-2">{article.title}</h2>
            <p className="text-sm text-black/60 line-clamp-3 font-serif mb-4">{article.excerpt}</p>
            <Link to={`/blog/${article.id}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all">
              Đọc tiếp <ArrowRight className="w-4 h-4" />
            </Link>
          </article>
        ))}
      </div>
      
      {/* Newsletter simple block */}
      <div className="bg-[#EBE9E4] rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto mb-10">
        <h2 className="text-2xl md:text-3xl font-serif italic mb-4">Nhận Bản Tin Hàng Tuần</h2>
        <p className="text-sm text-black/60 mb-8 max-w-md mx-auto">Đăng ký để không bỏ lỡ những bài viết mới nhất về thời trang và phong cách sống.</p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" placeholder="Email của bạn" className="flex-1 bg-white rounded-full py-4 px-6 text-xs outline-none focus:ring-1 ring-black/20" required />
          <button type="submit" className="px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors">
            Đăng ký
          </button>
        </form>
      </div>

    </div>
  );
}
