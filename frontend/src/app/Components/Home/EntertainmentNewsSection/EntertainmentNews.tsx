'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useNewsContext } from '@/app/context/NewsContext';
import { formatDateTime } from '@/Utils/Utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, PlayCircle } from 'lucide-react';

interface EntArticle {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: string;
  date?: string;
}

const Entertainment: React.FC = () => {
  const router = useRouter();
  const { entertainmentNews, loading } = useNewsContext();

  const availableCategories = useMemo(() => {
    if (!entertainmentNews || entertainmentNews.length === 0) return [];

    const categoryCount: Record<string, number> = {};

    entertainmentNews.forEach(item => {
      const subCat = item.subCategory;
      if (subCat) {
        categoryCount[subCat] = (categoryCount[subCat] || 0) + 1;
      }
    });

    return Object.entries(categoryCount)
      .filter(([_, count]) => (count as number) > 0)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([name]) => name);
  }, [entertainmentNews]);

  const [activeCategory, setActiveCategory] = useState(() =>
    availableCategories.length > 0 ? availableCategories[0] : 'Bollywood'
  );

  useMemo(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(activeCategory)) {
      setActiveCategory(availableCategories[0]);
    }
  }, [availableCategories, activeCategory]);

  const getImageSrc = (img?: string): string => {
    if (!img) {
      return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80';
    }
    if (img.startsWith('http') || img.startsWith('data:')) {
      return img;
    }
    if (img.startsWith('/')) {
      return img;
    }
    return `/uploads/${img}`;
  };

  const filteredEntNews = useMemo(() => {
    if (!entertainmentNews) return [];

    return entertainmentNews.filter(item =>
      item.subCategory?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [entertainmentNews, activeCategory]);

  const entertainmentArticles: EntArticle[] = useMemo(() => {
    if (!filteredEntNews.length) return [];

    return filteredEntNews.slice(0, 6).map((item, index) => ({
      id: `${activeCategory.toLowerCase()}-${item.slug}-${index}`,
      slug: item.slug,
      title: item.title,
      image: getImageSrc(item.image),
      category: activeCategory,
      date: item.publishedAt || item.date || item.createdAt,
    }));
  }, [filteredEntNews, activeCategory]);

  const handleArticleClick = (slug: string, category: string) => {
    router.push(`/Pages/entertainment/${category}/${slug}`);
  };

  const handleReadMoreClick = () => {
    router.push('/Pages/entertainment');
  };

  if (loading) {
    return (
      <section className="bg-white py-20 px-4 md:px-8">
        <div className="max-w-[1440px] mx-auto animate-pulse">
          <div className="h-10 w-48 bg-gray-100 rounded-full mx-auto mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="h-80 bg-gray-50 rounded-[40px]" />
              <div className="h-80 bg-gray-50 rounded-[40px]" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-50 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!entertainmentNews?.length) return null;

  return (
    <section className="bg-white py-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="text-left">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#dc2626]"></span>
              <span className="text-[#dc2626] font-black text-[12px] uppercase tracking-[0.3em]">Lights, Camera, Action</span>
            </div>
            <h2 className="font-['Lora',serif] font-bold text-[clamp(2.5rem,5vw,3.5rem)] text-black mb-0 tracking-tighter leading-tight">
              Entertainment
            </h2>
          </div>

          <nav className="flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-100 rounded-full overflow-x-auto no-scrollbar max-w-full lg:max-w-fit shadow-sm">
            {availableCategories.map((category) => (
              <button
                key={category}
                className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-500 whitespace-nowrap active:scale-95 ${activeCategory === category
                  ? 'bg-[#dc2626] text-white shadow-[0_10px_25px_rgba(220,38,38,0.25)]'
                  : 'text-gray-400 hover:text-[#0f172a] hover:bg-white'
                  }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Featured Articles - Left Side (2 stacked banners) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-8">
            {entertainmentArticles.slice(0, 2).map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="w-full"
              >
                <article
                  className="group relative rounded-[40px] overflow-hidden bg-[#f1f5f9] cursor-pointer w-full transition-all duration-700 shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] border border-gray-100 hover:border-[#dc2626]/30 active:scale-[0.99]"
                  onClick={() => handleArticleClick(article.slug, article.category)}
                >
                  <div className="relative w-full aspect-video lg:aspect-auto lg:h-[320px] overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>

                    {/* Floating Badge */}
                    <div className="absolute top-6 left-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl">
                        <PlayCircle size={14} className="text-white fill-[#dc2626]" />
                        <span className="text-white font-black text-[9px] uppercase tracking-[0.2em]">Featured Story</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 z-[1] transform transition-transform duration-500">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-[#dc2626] text-white font-black text-[9px] uppercase tracking-widest rounded-full">{article.category}</span>
                      <div className="h-1 w-1 bg-white/40 rounded-full" />
                      <span className="text-white/60 font-bold text-[10px] uppercase tracking-widest">
                        {article.date ? formatDateTime(article.date) : ''}
                      </span>
                    </div>
                    <h3 className="font-['Lora',serif] font-bold text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.2] text-white tracking-tight group-hover:text-red-50 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </article>
              </motion.div>
            ))}
          </div>

          {/* Regular List Articles - Right Side */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {entertainmentArticles.slice(2).map((article, idx) => (
                <motion.article
                  key={article.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative grid grid-cols-[1fr_180px] sm:grid-cols-[1fr_140px] gap-6 p-4 bg-white rounded-[32px] border border-gray-100 transition-all duration-500 cursor-pointer hover:border-[#dc2626]/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] active:scale-[0.98]"
                  onClick={() => handleArticleClick(article.slug, article.category)}
                >
                  <div className="flex flex-col justify-center px-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#dc2626] font-black text-[10px] uppercase tracking-widest">{article.category}</span>
                    </div>
                    <h4 className="font-['Lora',serif] font-bold text-[16px] md:text-[15px] leading-snug text-[#0f172a] transition-colors duration-300 group-hover:text-[#dc2626] line-clamp-2 mb-3">
                      {article.title}
                    </h4>
                    {article.date ? (
                      <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 lg:group-hover:text-gray-500 uppercase tracking-widest transition-colors">
                        <Calendar size={12} className="text-[#dc2626]/60 group-hover:text-[#dc2626]" />
                        {formatDateTime(article.date)}
                      </div>
                    ) : null}
                  </div>
                  <div className="w-[180px] sm:w-[140px] h-[120px] sm:h-[100px] rounded-[24px] overflow-hidden border border-gray-50 flex-shrink-0 bg-gray-50 group-hover:shadow-lg transition-shadow duration-500">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    />
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>

            <div className="mt-4 px-2">
              {/* Added spacer to maintain layout */}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-20">
          <button
            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-[#0f172a] rounded-full font-black text-[14px] uppercase tracking-[0.2em] text-white transition-all duration-500 shadow-xl hover:bg-[#dc2626] hover:shadow-[#dc2626]/40 hover:-translate-y-1 active:scale-95"
            onClick={handleReadMoreClick}
          >
            All Entertainment
            <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Entertainment;
