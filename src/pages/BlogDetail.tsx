import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Facebook, Twitter, Instagram } from 'lucide-react';
import { articles } from '../data/mockData';

export function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const article = articles.find(a => a.id === Number(id));

  if (!article) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
        <h2 className="text-3xl font-serif italic mb-4">Không tìm thấy bài viết</h2>
        <button 
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại tạp chí
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex-1">
      {/* Article Header */}
      <div className="max-w-3xl mx-auto text-center pt-8 md:pt-16 pb-12">
        <div className="inline-block bg-[#F3F2F0] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-black/60 mb-6">
          {article.category}
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic mb-6 leading-tight">{article.title}</h1>
        <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-black/40 mb-8">
          <span>{article.date}</span>
          <span>•</span>
          <span>Bởi Aura Team</span>
        </div>
        <p className="text-base md:text-xl font-serif text-black/70 italic leading-relaxed max-w-2xl mx-auto">
          {article.excerpt}
        </p>
      </div>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto mb-16 px-4 md:px-0">
        <div className="aspect-video w-full rounded-3xl overflow-hidden bg-[#F3F2F0]">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-2xl mx-auto px-4 md:px-0 mb-20">
        <div 
          className="max-w-none text-base md:text-lg font-serif text-black/80
          [&>h3]:font-serif [&>h3]:italic [&>h3]:font-normal [&>h3]:text-2xl [&>h3]:md:text-3xl [&>h3]:mb-4 [&>h3]:mt-8 [&>h3]:text-black
          [&>p]:leading-loose [&>p]:mb-6
          [&>img]:rounded-2xl [&>img]:my-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        {/* Share Section */}
        <div className="flex items-center justify-between py-8 mt-12 border-t border-black/10">
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Tạp chí
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Chia sẻ:</span>
            <button className="w-8 h-8 rounded-full bg-[#F3F2F0] flex items-center justify-center hover:bg-black hover:text-white transition-colors">
              <Facebook className="w-3.5 h-3.5" />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#F3F2F0] flex items-center justify-center hover:bg-black hover:text-white transition-colors">
              <Twitter className="w-3.5 h-3.5" />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#F3F2F0] flex items-center justify-center hover:bg-black hover:text-white transition-colors">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* More Articles */}
      <div className="bg-[#FAF9F6] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif italic">Bài viết liên quan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.filter(a => a.id !== article.id).slice(0, 3).map(related => (
              <article key={related.id} className="group cursor-pointer" onClick={() => navigate(`/blog/${related.id}`)}>
                <div className="aspect-[4/5] bg-[#F3F2F0] rounded-2xl overflow-hidden mb-6 relative">
                  <img src={related.image} alt={related.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="text-xl font-serif italic mb-3 group-hover:opacity-70 transition-opacity line-clamp-2">{related.title}</h3>
                <p className="text-sm text-black/60 line-clamp-2 font-serif">{related.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
