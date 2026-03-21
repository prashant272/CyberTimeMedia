"use client";

import React from 'react';
import Link from 'next/link';
import { useNewsContext } from '@/app/context/NewsContext';
import { formatDateTime } from '@/Utils/Utils';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ChevronRight } from 'lucide-react';

interface DisplayItem {
  id: string;
  title: string;
  image: string;
  category: string;
  section: string;
  subCategory?: string;
  slug: string;
  href: string;
  date?: string;
}

const LatestNews: React.FC = () => {
  const { allNews, loading } = useNewsContext();

  const displayNews: DisplayItem[] = (() => {
    if (!allNews || !Array.isArray(allNews) || allNews.length === 0) {
      return [];
    }

    const seen = new Set<string>();
    const uniqueNews = allNews.filter((item: any) => {
      const key = item._id || item.slug;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const latestItems = uniqueNews
      .filter((item: any) => item.isLatest === true)
      .slice(0, 12);

    const itemsToMap = latestItems.length > 0 ? latestItems : uniqueNews.slice(0, 6);

    return itemsToMap.map((item: any, idx: number) => {
      const section = item.section || 'news';
      const sub = item.subCategory || section;
      const catSlug = sub.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      return {
        id: `latest-${item._id || item.slug || idx}`,
        title: item.title || 'Untitled',
        image: item.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        category: item.category || section.charAt(0).toUpperCase() + section.slice(1),
        section,
        subCategory: item.subCategory,
        slug: item.slug || '',
        href: item.slug ? `/Pages/${section}/${catSlug}/${item.slug}` : '#',
        date: item.publishedAt || item.date || item.createdAt,
      };
    });
  })();

  if (loading) {
    return (
      <section className="bg-[var(--background)] py-16 px-8 md:px-6 sm:px-4 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto relative z-[1]">
          <div className="grid grid-cols-1 md:grid-cols-3 bg-[var(--card-bg)] rounded-[20px] border border-[var(--card-border)] overflow-hidden shadow-md">
            {[0, 1, 2].map((i) => (
              <article key={i} className="grid grid-cols-[1fr_140px] gap-5 p-6 border-b border-r border-[var(--border)] last:border-r-0 md:last:border-b-0 animate-pulse">
                <div className="flex flex-col gap-3 justify-center">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="bg-gray-200 h-24 w-[140px] rounded-lg"></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayNews.length === 0) {
    return (
      <section className="bg-[var(--background)] py-16 px-8 md:px-6 sm:px-4 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto relative z-[1]">
          <div className="text-center mb-12">
            <h2 className="font-['Lora',serif] font-bold text-[clamp(2rem,5vw,3rem)] text-[var(--heading-color)] mb-4 tracking-tight">Latest News</h2>
            <div className="w-[120px] h-1 bg-linear-to-r from-[var(--primary)] to-[var(--accent)] mx-auto rounded-full shadow-[0_2px_12px_rgba(59,130,246,0.3)]"></div>
          </div>
          <p className="text-center text-gray-500 py-12 font-['Inter',sans-serif]">
            No breaking/latest news available right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="text-left">
            <span className="text-[#dc2626] font-black text-[12px] uppercase tracking-[0.3em] mb-3 block">Real-time Feed</span>
            <h2 className="font-['Lora',serif] font-bold text-[clamp(2rem,5vw,3.2rem)] text-[#0f172a] mb-4 tracking-tighter leading-tight">Latest News</h2>
            <div className="w-24 h-1.5 bg-[#dc2626] rounded-full shadow-[0_4px_12px_rgba(220,38,38,0.2)]"></div>
          </div>

          <Link
            href="/Pages/all"
            className="group flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#dc2626] transition-colors duration-300"
          >
            View Full Feed
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayNews.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <article
                className="group bg-white rounded-[32px] p-2 border border-gray-100 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:border-[#dc2626]/20 cursor-pointer h-full flex flex-col"
                onClick={() => {
                  if (item.href && item.href !== '#') {
                    window.location.href = item.href;
                  }
                }}
              >
                {/* Image Holder */}
                <div className="relative aspect-[16/10] rounded-[24px] overflow-hidden mb-4 bg-gray-50 border border-gray-50">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-[#dc2626] border border-white/20 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="px-5 pb-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {item.date && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <Calendar size={13} className="text-[#dc2626]" />
                        {formatDateTime(item.date).split('at')[0]}
                      </div>
                    )}
                  </div>

                  <h3 className="font-['Lora',serif] font-bold text-[20px] leading-[1.3] text-[#0f172a] mb-6 line-clamp-2 group-hover:text-[#dc2626] transition-colors duration-300">
                    {item.title}
                  </h3>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between group/more">
                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#dc2626] transition-colors">
                      Full Story
                    </span>
                    <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#dc2626] group-hover:border-[#dc2626] group-hover:text-white transition-all duration-300 group-hover:rotate-[-45deg]">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </article>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/Pages/all"
            className="inline-flex items-center gap-4 px-12 py-5 bg-[#dc2626] text-white rounded-full font-black text-[14px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(220,38,38,0.25)] hover:bg-[#b91c1c] hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(220,38,38,0.35)] transition-all duration-500 group"
          >
            Read More News
            <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;