'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useNewsContext } from '@/app/context/NewsContext';
import { formatDateTime } from '@/Utils/Utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, ChevronRight, Activity, Trophy } from 'lucide-react';

interface RawSportsItem {
  slug: string;
  title: string;
  image?: string;
  category: string;
  tags?: string[];
  subCategory?: string;
  publishedAt?: string;
  date?: string;
  createdAt?: string;
}

interface SportsArticle {
  id: string;
  slug: string;
  title: string;
  image: string;
  isFeatured: boolean;
  subCategory: string;
  date?: string;
}

const Sports: React.FC = () => {
  const router = useRouter();
  const { sportsNews, loading } = useNewsContext();

  const availableCategories = useMemo(() => {
    if (!sportsNews || sportsNews.length === 0) return [];

    const categoryCount: Record<string, number> = {};

    sportsNews.forEach(item => {
      const subCat = item.subCategory;
      if (subCat) {
        categoryCount[subCat] = (categoryCount[subCat] || 0) + 1;
      }
    });

    const categories = Object.entries(categoryCount)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return categories.map(c => c.name);
  }, [sportsNews]);

  const [activeCategory, setActiveCategory] = useState(() =>
    availableCategories.length > 0 ? availableCategories[0] : 'Cricket'
  );

  useMemo(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(activeCategory)) {
      setActiveCategory(availableCategories[0]);
    }
  }, [availableCategories, activeCategory]);

  const getImageSrc = (img?: string): string => {
    if (!img) {
      return 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80';
    }
    if (img.startsWith('http') || img.startsWith('data:')) {
      return img;
    }
    if (img.startsWith('/')) {
      return img;
    }
    return `/uploads/${img}`;
  };

  const filteredSportsNews = useMemo(() => {
    if (!sportsNews) return [];

    return sportsNews.filter(item =>
      item.subCategory?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [sportsNews, activeCategory]);

  const sportsArticles: SportsArticle[] = useMemo(() => {
    if (!filteredSportsNews.length) return [];

    return filteredSportsNews.slice(0, 6).map((item, index) => ({
      id: `${activeCategory.toLowerCase()}-${item.slug}-${index}`,
      slug: item.slug,
      title: item.title,
      image: getImageSrc(item.image),
      isFeatured: index === 0,
      subCategory: item.subCategory || activeCategory,
      date: item.publishedAt || item.date || item.createdAt,
    }));
  }, [filteredSportsNews, activeCategory]);

  const handleArticleClick = (slug: string, subCategory: string) => {
    router.push(`/Pages/sports/${subCategory}/${slug}`);
  };

  const handleReadMoreClick = () => {
    router.push('/Pages/sports');
  };

  if (loading) {
    return (
      <section className="bg-[var(--background)] py-16 px-8 md:px-6 relative overflow-hidden transition-colors duration-300 after:absolute after:right-1/2 after:top-0 after:h-full after:w-[1px] after:translate-x-1/2 after:bg-linear-to-b after:from-transparent after:via-[var(--border)] after:to-transparent after:pointer-events-none">
        <div className="max-w-[1400px] mx-auto relative z-[1]">
          <div className="text-center mb-12">
            <h2 className="font-['Lora',serif] font-bold text-[clamp(2rem,5vw,3rem)] text-[var(--heading-color)] mb-6 tracking-tight">Sports</h2>
            <div className="flex justify-center flex-wrap gap-2">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="bg-[var(--card-bg)] rounded-[20px] border border-[var(--card-border)] p-8 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <article className="relative rounded-2xl overflow-hidden bg-[var(--muted)] animate-pulse border border-[var(--card-border)] h-[400px]">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-full"></div>
              </article>
              <div className="flex flex-col gap-6">
                {Array(5).fill(0).map((_, i) => (
                  <article key={i} className="grid grid-cols-[1fr_180px] gap-6 p-6 bg-[var(--nav-hover-bg)] rounded-xl border border-[var(--border)] animate-pulse">
                    <div className="space-y-2 flex flex-col justify-center">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="bg-gray-200 h-[120px] w-[180px] rounded-lg"></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!sportsNews || sportsNews.length === 0) {
    return (
      <section className="bg-[var(--background)] py-16 px-8 md:px-6 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto relative z-[1]">
          <div className="text-center mb-12">
            <h2 className="font-['Lora',serif] font-bold text-[clamp(2rem,5vw,3rem)] text-[var(--heading-color)] mb-6 tracking-tight">Sports</h2>
          </div>
          <div className="bg-[var(--card-bg)] rounded-[20px] border border-[var(--card-border)] p-8 shadow-md">
            <p className="text-center text-gray-500 py-8 font-['Inter',sans-serif]">No sports news available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50/50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="text-left">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#dc2626]"></span>
              <span className="text-[#dc2626] font-black text-[12px] uppercase tracking-[0.3em]">The Arena</span>
            </div>
            <h2 className="font-['Lora',serif] font-bold text-[clamp(2.5rem,6vw,3.8rem)] text-[#0f172a] mb-0 tracking-tighter leading-[0.9]">
              Sports <span className="text-[#dc2626]">Pulse</span>
            </h2>
          </div>

          <nav className="flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-100 rounded-full overflow-x-auto no-scrollbar max-w-full">
            {availableCategories.map((category) => (
              <button
                key={category}
                className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${activeCategory === category
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

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white"
          >
            {sportsArticles.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Featured Column (2 Banners Stacked) */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                  {sportsArticles.slice(0, 2).map((article, idx) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="group relative h-[320px] rounded-[40px] overflow-hidden cursor-pointer border border-gray-100 shadow-xl transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] hover:border-[#dc2626]/20"
                      onClick={() => handleArticleClick(article.slug, article.subCategory)}
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-90" />

                      {/* Floating Badge */}
                      <div className="absolute top-6 left-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#dc2626] text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl">
                          <Activity size={12} />
                          {idx === 0 ? 'Top Pick' : 'Must Read'}
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex items-center gap-3 mb-4">
                          {article.date && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/70 uppercase tracking-widest bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-lg">
                              <Calendar size={12} className="text-[#dc2626]" />
                              {formatDateTime(article.date).split('at')[0]}
                            </div>
                          )}
                        </div>
                        <h3 className="font-['Lora',serif] font-bold text-[22px] md:text-[24px] leading-tight text-white mb-6 group-hover:text-[#dc2626] transition-colors duration-300 line-clamp-2">
                          {article.title}
                        </h3>

                        <div className="flex items-center gap-2 text-white font-black text-[11px] uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                          Full Coverage
                          <ArrowRight size={14} className="text-[#dc2626]" />
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Sidebar List */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {sportsArticles.slice(2).map((article, idx) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group p-5 bg-white rounded-[32px] border border-gray-200 flex items-center gap-6 cursor-pointer transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#dc2626]/20 hover:-translate-y-1"
                      onClick={() => handleArticleClick(article.slug, article.subCategory)}
                    >
                      <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0 rounded-[24px] overflow-hidden bg-gray-50 border border-gray-50">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      <div className="flex flex-col py-2">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#dc2626] opacity-80">{activeCategory}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {article.date ? formatDateTime(article.date).split('at')[0] : 'Just In'}
                          </span>
                        </div>
                        <h4 className="font-['Lora',serif] font-bold text-[18px] md:text-[16px] leading-tight text-[#0f172a] line-clamp-2 group-hover:text-[#dc2626] transition-colors duration-300">
                          {article.title}
                        </h4>
                        <div className="mt-4 flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          View details
                          <ArrowRight size={12} className="text-[#dc2626]" />
                        </div>
                      </div>
                    </motion.article>
                  ))}

                  {/* Category View All Prompt */}
                </div>
              </div>
            ) : (
              <div className="text-center py-24 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Activity size={32} className="text-gray-300" />
                </div>
                <h3 className="text-[#0f172a] font-bold text-xl mb-2">No news in {activeCategory}</h3>
                <p className="text-gray-400 text-[14px]">Update the filters or check back later for new content.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-20 flex justify-center">
          <button
            onClick={handleReadMoreClick}
            className="inline-flex items-center gap-4 px-12 py-5 bg-[#dc2626] text-white rounded-full font-black text-[14px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(220,38,38,0.25)] hover:bg-[#b91c1c] hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(220,38,38,0.35)] transition-all duration-500 group"
          >
            Access All Sports
            <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Sports;
