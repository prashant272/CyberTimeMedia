"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNewsContext } from '@/app/context/NewsContext';
import { formatDateTime } from '@/Utils/Utils';
import SidebarAds from '../../Common/SidebarAds/SidebarAds';
import SidebarWidgets from '../../Common/SidebarWidgets/SidebarWidgets';

interface RawNewsItem {
  slug: string;
  title: string;
  summary?: string;
  content?: string;
  image?: string;
  category: string;
  subCategory?: string;
  tags?: string[];
  isTrending?: boolean;
  isLatest?: boolean;
}

interface NewsArticle {
  id: string;
  category: string;
  subCategory?: string;
  title: string;
  image: string;
  slug: string;
  isOpinion: boolean;
  isVideo: boolean;
  date?: string;
}

interface TrendingItem {
  id: string;
  title: string;
  image: string;
  slug: string;
  category: string;
  subCategory?: string;
  date?: string;
}

const NewsList: React.FC = () => {
  const { allNews, loading } = useNewsContext();
  const router = useRouter();

  const getImageSrc = (img?: string): string => {
    if (!img) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80';
    if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/')) return img;
    return `/uploads/${img}`;
  };

  const handleCardClick = (slug: string, category: string, subCategory?: string) => {
    const cat = category || 'news';
    const subCat = subCategory || 'general';
    router.push(`/Pages/${cat}/${subCat}/${slug}`);
  };

  const newsArticles: NewsArticle[] = useMemo(() => {
    if (!allNews || allNews.length === 0) return [];

    const sortedNews = [...allNews].sort((a, b) => {
      if (a.isLatest && !b.isLatest) return -1;
      if (!a.isLatest && b.isLatest) return 1;
      if (a.isTrending && !b.isTrending) return -1;
      if (!a.isTrending && b.isTrending) return 1;
      return 0;
    });

    const selected = sortedNews.slice(0, 21);

    const articles: NewsArticle[] = selected.map((item, idx) => ({
      id: `div-${item.slug}-${idx}`,
      category: item.category || 'News',
      subCategory: item.subCategory,
      title: item.title,
      image: getImageSrc(item.image),
      slug: item.slug,
      isOpinion: item.tags?.includes('opinion') ?? false,
      isVideo: item.tags?.includes('video') ?? false,
      date: item.publishedAt || item.date || item.createdAt,
    }));

    return articles;
  }, [allNews]);

  const trendingItems: TrendingItem[] = useMemo(() => {
    if (!allNews) return [];

    const trending = allNews.filter((item) => item.isTrending === true);
    const fallback = allNews.slice(0, 12);
    const finalTrending = trending.length >= 6 ? trending : fallback;

    return finalTrending
      .slice(0, 12)
      .map((item, index) => ({
        id: `${index}-${item.slug}`,
        title: item.title,
        image: getImageSrc(item.image),
        slug: item.slug,
        category: item.category,
        subCategory: item.subCategory,
        date: item.publishedAt || item.date || item.createdAt,
      }));
  }, [allNews]);

  if (loading) {
    return (
      <section className="min-h-screen bg-[#f8fafc] py-12 px-8 md:px-6 relative transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-8">
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <article key={i} className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm animate-pulse">
                  <div className="bg-gray-200 h-40 w-full"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <aside className="flex flex-col gap-10">
            <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 shadow-md animate-pulse">
              <div className="h-8 bg-gray-200 w-32 rounded mb-8"></div>
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex gap-4 mb-5">
                  <div className="w-11 h-11 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2 flex flex-col justify-center">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--background)] py-12 px-8 md:px-6 relative transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-8 transition-all duration-300">
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-6 transition-all duration-300">
            {newsArticles.length === 0 ? (
              <p className="font-['Inter',sans-serif] text-gray-500 text-center py-12 col-span-full">No recent news available</p>
            ) : (
              newsArticles.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-sm transition-all duration-400 cubic-bezier(0.4,0,0.2,1) cursor-pointer hover:-translate-y-1 hover:border-[#7c3aed] hover:shadow-2xl"
                  onClick={() => handleCardClick(article.slug, article.category, article.subCategory)}
                >
                  <div className="relative w-full h-50 overflow-hidden bg-[#f1f5f9]">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 cubic-bezier(0.4,0,0.2,1) group-hover:scale-[1.06]" />
                    {article.isVideo && (
                      <div className="absolute top-3 right-3 z-[2] drop-shadow-[0_4px_12px_rgba(239,68,68,0.4)] animate-pulse-slow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="12" fill="rgba(255, 68, 68, 0.95)" />
                          <path d="M9 6L17 12L9 18V6Z" fill="#fff" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 flex-wrap mb-4">
                      <span className="font-['Inter',sans-serif] font-semibold text-[0.75rem] tracking-widest uppercase text-[#dc2626] px-4 py-2 bg-[#dc2626]/[0.05] border border-[#dc2626] rounded-full transition-all duration-300">{article.category}</span>
                      {article.isOpinion && (
                        <span className="flex items-center gap-1.5 font-['Inter',sans-serif] font-semibold text-[0.7rem] tracking-widest uppercase text-[#ef4444] px-4 py-2 bg-[#ef4444]/[0.08] border border-[#ef4444]/20 rounded-full">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          OPINION
                        </span>
                      )}
                    </div>
                    <h3 className="font-['Lora',serif] font-semibold text-[1.125rem] leading-relaxed text-[#0f172a] line-clamp-3 transition-colors duration-300 group-hover:text-[#dc2626] tracking-tight">{article.title}</h3>
                    {article.date && (
                      <span className="block font-['Inter',sans-serif] text-[0.7rem] font-medium text-[#94a3b8] uppercase tracking-widest mt-2 opacity-80">{formatDateTime(article.date)}</span>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-10">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300">
            <div className="mb-8 relative">
              <h2 className="font-['Lora',serif] font-bold text-[2rem] text-[#0f172a] tracking-tight">Trending</h2>
              <div className="w-[60px] h-1 bg-gradient-to-r from-[#dc2626] to-[#7c3aed] rounded-full mt-3"></div>
            </div>

            <div className="flex flex-col gap-5">
              {trendingItems.map((item, index) => (
                <article
                  key={item.id}
                  className="group relative grid grid-cols-[45px_85px_1fr] gap-4 items-start p-4 bg-[#dc2626]/[0.05] rounded-xl border border-[#e2e8f0] transition-all duration-300 cubic-bezier(0.4,0,0.2,1) cursor-pointer hover:border-[#dc2626] hover:translate-x-1 hover:shadow-lg"
                  onClick={() => handleCardClick(item.slug, item.category, item.subCategory)}
                >
                  <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#dc2626]/[0.05] border-2 border-[#dc2626] rounded-xl font-['Lora',serif] font-bold text-xl text-[#dc2626] group-hover:bg-[#dc2626] group-hover:text-white transition-all duration-300">
                    <span>{index + 1}</span>
                  </div>
                  <div className="w-[85px] h-[64px] rounded-lg overflow-hidden border border-[#e2e8f0] bg-[#f1f5f9] flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-['Inter',sans-serif] font-medium text-[0.9375rem] leading-snug text-[#0f172a] line-clamp-3 transition-colors duration-300 group-hover:text-[#dc2626]">{item.title}</h4>
                    {item.date && (
                      <span className="font-['Inter',sans-serif] text-[0.65rem] font-semibold text-[#dc2626] uppercase tracking-widest mt-1 opacity-80">{formatDateTime(item.date)}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <SidebarWidgets />

          <SidebarAds count={5} />
        </aside>
      </div>
    </section>
  );
};

export default NewsList;
