'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNewsContext } from '@/app/context/NewsContext';
import { useActiveAds, Ad } from '@/app/hooks/useAds';
import { formatDateTime } from '@/Utils/Utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, TrendingUp } from 'lucide-react';

interface LifestyleArticle {
  id: string;
  slug: string;
  category: string;
  title: string;
  image: string;
  date?: string;
}

interface ArticleCardProps {
  article: LifestyleArticle;
  onClick: () => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=500&q=80';
const MAX_ARTICLES_PER_CATEGORY = 8;

const getImageSrc = (img?: string): string => {
  if (!img) return FALLBACK_IMAGE;
  if (img.startsWith('http') || img.startsWith('data:')) return img;
  if (img.startsWith('/')) return img;
  return `/uploads/${img}`;
};

const ArticleCard: React.FC<ArticleCardProps> = React.memo(({ article, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="group"
    onClick={onClick}
  >
    <div className="bg-white rounded-[32px] p-2 border border-gray-200 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:border-[#dc2626]/20 cursor-pointer h-full flex flex-col">
      <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden mb-5 bg-gray-50 border border-gray-50">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="px-4 pb-4 flex flex-col flex-1">
        <span className="text-[#dc2626] font-black text-[10px] uppercase tracking-[0.2em] mb-3 block">
          {article.category}
        </span>
        <h3 className="font-['Lora',serif] font-bold text-[17px] leading-[1.4] text-[#0f172a] mb-4 line-clamp-2 group-hover:text-[#dc2626] transition-colors duration-300">
          {article.title}
        </h3>
        {article.date && (
          <div className="mt-auto flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Calendar size={12} className="text-[#dc2626]" />
            {formatDateTime(article.date).split('at')[0]}
          </div>
        )}
      </div>
    </div>
  </motion.div>
));

ArticleCard.displayName = 'ArticleCard';

const LifestyleSection: React.FC = () => {
  const router = useRouter();
  const { lifestyleNews, loading } = useNewsContext();

  const { data: adsData, loading: adsLoading } = useActiveAds();

  // Updated ad filtering logic for sidebar priority
  const activeAds = useMemo(() => {
    const allActive = (adsData || []).filter((ad: Ad) => ad.isActive);
    const sidebarSpecific = allActive.filter((ad: Ad) => ad.sidebarImageUrl || ad.placement === 'sidebar');
    return sidebarSpecific.length > 0 ? sidebarSpecific : allActive;
  }, [adsData]);

  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (activeAds.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % activeAds.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeAds.length]);

  const availableCategories = useMemo(() => {
    if (!lifestyleNews?.length) return [];

    const categoryCount = lifestyleNews.reduce((acc, item: any) => {
      const subCat = item.subCategory;
      if (subCat) acc[subCat] = (acc[subCat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCount)
      .filter(([_, count]) => (count as number) > 0)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5) // <--- Limit to 5 categories
      .map(([name]) => name);
  }, [lifestyleNews]);

  const [activeTab, setActiveTab] = useState<string>(() =>
    availableCategories[0] || 'Fashion'
  );

  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(activeTab)) {
      setActiveTab(availableCategories[0]);
    }
  }, [availableCategories, activeTab]);

  const filteredArticles = useMemo(() => {
    if (!lifestyleNews) return [];

    return lifestyleNews
      .filter((item: any) => item.subCategory?.toLowerCase() === activeTab.toLowerCase())
      .slice(0, MAX_ARTICLES_PER_CATEGORY);
  }, [lifestyleNews, activeTab]);

  const lifestyleArticles: LifestyleArticle[] = useMemo(() =>
    filteredArticles.map((item: any, index: number) => ({
      id: `${activeTab.toLowerCase()}-${item.slug}-${index}`,
      slug: item.slug,
      category: item.subCategory || item.category || 'Lifestyle',
      title: item.title,
      image: getImageSrc(item.image),
      date: item.publishedAt || item.date || item.createdAt,
    })),
    [filteredArticles, activeTab]
  );

  const handleTabChange = useCallback((category: string) => {
    setActiveTab(category);
  }, []);

  const handleArticleClick = useCallback((slug: string, category: string) => {
    router.push(`/Pages/lifestyle/${category}/${slug}`);
  }, [router]);

  const handleReadMoreClick = useCallback(() => {
    router.push('/Pages/lifestyle');
  }, [router]);

  const renderAd = () => {
    if (adsLoading) {
      return (
        <div className="w-full min-h-[150px] flex items-center justify-center bg-black/5 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm animate-pulse">
          <span>Loading...</span>
        </div>
      );
    }

    if (activeAds.length === 0) {
      return (
        <div className="w-full min-h-[150px] flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="text-center text-gray-300">
            <span className="font-bold text-[0.8rem] block mb-1 uppercase tracking-widest">AD SPACE</span>
            <small className="text-[0.6rem]">Promoted Spot</small>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full rounded-2xl overflow-hidden border border-gray-100 bg-[#f8fafc] flex flex-col group/ad cursor-pointer">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAdIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full flex flex-col"
          >
            <a
              href={activeAds[currentAdIndex % activeAds.length].link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full overflow-hidden bg-white p-2"
            >
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-inner">
                <img
                  src={activeAds[currentAdIndex % activeAds.length].sidebarImageUrl || activeAds[currentAdIndex % activeAds.length].imageUrl || activeAds[currentAdIndex % activeAds.length].headerImageUrl}
                  alt={activeAds[currentAdIndex % activeAds.length].title || 'Advertisement'}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover/ad:scale-110"
                  loading="lazy"
                />
              </div>
            </a>
            <div className="p-5 text-center bg-gray-50/80 border-t border-gray-100">
              <h4 className="text-[#0f172a] font-bold text-[13px] mb-1 line-clamp-1">{activeAds[currentAdIndex % activeAds.length].title || 'Spotlight'}</h4>
              <p className="text-gray-400 text-[10px] italic mb-4">Featured Collection</p>
              <button className="w-full py-2.5 bg-[#0f172a] text-white font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-[#dc2626] transition-all transform active:scale-95">
                Explore Now
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {activeAds.length > 1 && (
          <div className="absolute top-4 right-4 flex gap-1.5 z-10">
            {activeAds.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentAdIndex % activeAds.length ? 'bg-[#dc2626] w-4' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="bg-white py-12 px-4 md:px-8">
        <div className="max-w-[1440px] mx-auto animate-pulse">
          <div className="h-10 w-48 bg-gray-100 rounded-full mx-auto mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[4/5] bg-gray-50 rounded-[32px]" />
              ))}
            </div>
            <div className="bg-gray-50 rounded-[32px] h-[400px]" />
          </div>
        </div>
      </section>
    );
  }

  if (!lifestyleNews?.length) return null;

  return (
    <section className="bg-white pt-10 pb-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div className="text-left">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#dc2626]"></span>
              <span className="text-[#dc2626] font-black text-[12px] uppercase tracking-[0.3em]">The Collection</span>
            </div>
            <h2 className="font-['Lora',serif] font-bold text-[clamp(2.5rem,5vw,3.5rem)] text-black mb-0 tracking-tighter leading-tight">
              Fashion
            </h2>
          </div>

          <nav className="flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-100 rounded-full overflow-x-auto no-scrollbar max-w-full lg:max-w-fit">
            {availableCategories.map((category) => (
              <button
                key={category}
                className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-500 whitespace-nowrap active:scale-95 ${activeTab === category
                  ? 'bg-[#dc2626] text-white shadow-[0_10px_25_rgba(220,38,38,0.25)]'
                  : 'text-gray-400 hover:text-[#0f172a] hover:bg-white'
                  }`}
                onClick={() => handleTabChange(category)}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                {lifestyleArticles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-10">
                    {lifestyleArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onClick={() => handleArticleClick(article.slug, article.category)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No stories in {activeTab}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-3 sticky top-24">
            <div className="flex items-center gap-2 mb-4 px-2">
              <TrendingUp size={16} className="text-[#dc2626]" />
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Partner Content</span>
            </div>
            {renderAd()}
          </aside>
        </div>

        {lifestyleArticles.length > 0 && (
          <div className="mt-20 flex justify-center">
            <button
              onClick={handleReadMoreClick}
              className="inline-flex items-center gap-4 px-12 py-5 bg-[#dc2626] text-white rounded-full font-black text-[14px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(220,38,38,0.25)] hover:bg-[#b91c1c] hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(220,38,38,0.35)] transition-all duration-500 group active:scale-95"
            >
              Discover More Fashion
              <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LifestyleSection;