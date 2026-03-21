"use client";

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useNewsContext } from '@/app/context/NewsContext';
import { formatDateTime } from '@/Utils/Utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Play, ArrowRight, Share2, Star } from 'lucide-react';

interface NewsItem {
  slug: string;
  title: string;
  summary?: string;
  content?: string;
  image?: string;
  category?: string;
  subCategory?: string;
  tags?: string[];
  isLatest?: boolean;
  isTrending?: boolean;
  publishedAt?: string;
  date?: string;
  createdAt?: string;
  _id?: string;
}

interface DisplayNewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category?: string;
  subCategory?: string;
  slug: string;
  isVideo: boolean;
  date?: string;
  targetLink?: string;
  nominationLink?: string;
}

const NewsSection: React.FC = () => {
  const { allNews, loading } = useNewsContext();
  const router = useRouter();

  const getImageSrc = (img?: string): string => {
    if (!img) {
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80';
    }
    if (img.startsWith('http') || img.startsWith('data:')) {
      return img;
    }
    if (img.startsWith('/')) {
      return img;
    }
    return `/uploads/${img}`;
  };

  const handleCardClick = (item: DisplayNewsItem) => {
    const category = item.category || 'news';
    const subCategory = item.subCategory || 'general';
    const slug = item.slug;

    router.push(`/Pages/${category}/${subCategory}/${slug}`);
  };

  const liveNews = useMemo(() => {
    if (!allNews || loading) return [];

    const trendingOrLatest = allNews.filter((item) => item.isLatest === true || item.isTrending === true);

    const seen = new Set();
    const unique = [];

    for (const item of trendingOrLatest) {
      const uniqueId = item._id || item.slug;
      if (!seen.has(uniqueId)) {
        seen.add(uniqueId);
        unique.push(item);
      }
    }

    return unique
      .map((item) => ({
        id: item._id || item.slug || `item-${Math.random().toString(36).slice(2, 9)}`,
        title: item.title,
        description: item.summary || (item.content ? item.content.substring(0, 150) + '...' : ''),
        image: getImageSrc(item.image),
        category: item.category || 'Breaking News',
        subCategory: item.subCategory || 'General',
        slug: item.slug,
        isVideo: item.tags?.includes('video') || false,
        date: item.publishedAt || item.date || item.createdAt,
        targetLink: (item as any).targetLink,
        nominationLink: (item as any).nominationLink,
      }))
      .slice(0, 4);
  }, [allNews, loading]);

  if (loading && (!allNews || allNews.length === 0)) {
    return (
      <section className="bg-[var(--background)] py-16 px-8 md:px-6 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto relative z-[1]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-full bg-[var(--card-bg)] rounded-[20px] border border-[var(--card-border)] overflow-hidden shadow-md animate-pulse">
              <div className="h-[400px] bg-gray-200"></div>
              <div className="p-10">
                <div className="h-8 bg-gray-200 rounded-lg w-4/5 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded-lg w-3/5"></div>
              </div>
            </div>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] overflow-hidden animate-pulse">
                <div className="h-[240px] bg-gray-200"></div>
                <div className="p-7">
                  <div className="h-6 bg-gray-200 rounded-lg w-[90%] mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-[70%]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (liveNews.length === 0) {
    return null;
  }

  const featuredArticle = liveNews[0];
  const regularArticles = liveNews.slice(1);

  return (
    <section className="bg-white py-12 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      {/* Decorative Branding Text */}
      <div className="absolute top-0 left-12 h-full flex flex-col justify-center pointer-events-none opacity-[0.02]">
        <span className="text-[200px] font-black uppercase rotate-90 origin-left whitespace-nowrap">Trending Pulse</span>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#dc2626] flex items-center justify-center shadow-[0_10px_20px_rgba(220,38,38,0.2)]">
            <Star className="text-white" size={24} fill="white" />
          </div>
          <div>
            <span className="text-[#dc2626] font-black text-[12px] uppercase tracking-[0.3em] block mb-1">Editor's Choice</span>
            <h2 className="font-['Lora',serif] font-bold text-[clamp(2rem,5vw,3rem)] text-[#0f172a] leading-none tracking-tighter">
              Trending <span className="text-[#dc2626]">Now</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured Hero Article */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative lg:col-span-12 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] bg-white rounded-[48px] overflow-hidden border border-gray-100 shadow-[0_40px_80px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-700 hover:shadow-[0_50px_100px_rgba(0,0,0,0.1)] hover:border-[#dc2626]/20"
            onClick={() => handleCardClick(featuredArticle)}
          >
            <div className="relative h-[450px] lg:h-[600px] overflow-hidden">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] scale-105 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent lg:opacity-60" />

              <div className="absolute top-10 left-10">
                <div className="flex items-center gap-3 px-6 py-3 bg-[#dc2626] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Breaking News
                </div>
              </div>
            </div>

            <div className="p-8 md:p-6 flex flex-col justify-center bg-white">
              <div className="flex items-center gap-4 mb-8">
                <span className="px-4 py-1.5 bg-red-50 text-[#dc2626] rounded-xl font-black text-[10px] uppercase tracking-wider">
                  {featuredArticle.category}
                </span>
                {featuredArticle.date && (
                  <span className="flex items-center gap-2 text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                    <Calendar size={14} className="text-[#dc2626]" />
                    {formatDateTime(featuredArticle.date).split('at')[0]}
                  </span>
                )}
              </div>

              <h1 className="font-['Lora',serif] font-bold text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-[#0f172a] mb-4 tracking-tighter group-hover:text-[#dc2626] transition-colors duration-300">
                {featuredArticle.title}
              </h1>

              <p className="font-['Inter',sans-serif] text-[18px] md:text-base leading-relaxed text-gray-500 mb-6 line-clamp-3">
                {featuredArticle.description}
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <button
                  className="flex items-center gap-4 px-10 py-5 bg-[#dc2626] text-white rounded-full font-black text-[13px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(220,38,38,0.25)] hover:bg-[#b91c1c] hover:-translate-y-1 transition-all duration-300 group/btn"
                >
                  Explore Full Story
                  <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>

                <div className="flex items-center gap-3">
                  <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-[#dc2626] transition-all">
                    <Share2 size={18} />
                  </button>
                  {(featuredArticle as any).nominationLink && (
                    <button className="px-8 py-5 border-2 border-[#dc2626] text-[#dc2626] rounded-full font-black text-[12px] uppercase tracking-widest hover:bg-[#dc2626] hover:text-white transition-all">
                      Join Discussion
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.article>

          {/* Regular Article Grid */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {regularArticles.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group cursor-pointer"
                onClick={() => handleCardClick(item)}
              >
                <div className="bg-white rounded-[40px] p-2 border border-gray-200 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] hover:border-[#dc2626]/20 h-full flex flex-col">
                  <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden mb-4 bg-gray-50 border border-gray-50">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 scale-105 group-hover:scale-110"
                    />

                    {item.isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-white text-[#dc2626] flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                          <Play fill="#dc2626" size={24} className="ml-1" />
                        </div>
                      </div>
                    )}

                    <div className="absolute top-5 left-5">
                      <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-xl font-black text-[10px] uppercase tracking-widest text-[#dc2626] shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="px-5 pb-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {item.date ? formatDateTime(item.date).split('at')[0] : 'Today'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-red-200" />
                      <span className="text-[10px] font-black text-[#dc2626] uppercase tracking-widest opacity-80">
                        Trending
                      </span>
                    </div>

                    <h3 className="font-['Lora',serif] font-bold text-[20px] leading-tight text-[#0f172a] mb-4 group-hover:text-[#dc2626] transition-colors duration-300">
                      {item.title}
                    </h3>

                    <p className="font-['Inter',sans-serif] text-[14px] leading-relaxed text-gray-500 line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {item.description}
                    </p>

                    <div className="mt-auto flex items-center gap-2 text-[11px] font-black text-[#dc2626] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                      Read Analysis <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
