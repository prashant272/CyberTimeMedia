"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/Utils/Utils';
import { useNewsContext } from '@/app/context/NewsContext';
import { useNewsSectionData, LatestItem } from '@/app/hooks/useNewsSectionData';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Calendar, Info, ExternalLink } from 'lucide-react';


interface LatestNewsSectionProps {
  sectionTitle: string;
  overrideSection?: string;
  showReadMore?: boolean;
  readMoreLink?: string;
  columns?: 2 | 3 | 4;
  limit?: number;
  newsData?: LatestItem[];
}


export default function LatestNewsSection({
  sectionTitle,
  overrideSection,
  newsData,
  showReadMore = true,
  readMoreLink,
  columns = 3,
  limit = 6,
}: LatestNewsSectionProps) {
  const { items: allItems, section, isLoading } = useNewsSectionData<LatestItem>({
    variant: 'latest',
    overrideSection,
    limit,
  });
  const router = useRouter();

  const items = useMemo(() => {
    const latestItems = allItems.filter((item: any) => item.isLatest === true);
    return latestItems.length >= 3 ? latestItems : allItems;
  }, [allItems]);


  const dynamicReadMoreLink = readMoreLink || `/Pages/${section}`;

  if (isLoading) {
    return (
      <section className="bg-[var(--background)] py-16 px-8 relative overflow-hidden transition-colors duration-300 after:content-[''] after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 after:w-px after:h-full after:bg-linear-to-b after:from-transparent after:via-[var(--border)] after:to-transparent after:pointer-events-none md:py-12 md:px-6 sm:py-8 sm:px-4">
        <div className="max-w-[1400px] mx-auto relative z-1">
          <div className="text-center mb-12 md:mb-8">
            <h2 className="font-['Lora',serif] font-bold text-[clamp(2rem,5vw,3rem)] text-[var(--heading-color)] mb-4 tracking-tight transition-colors duration-300 md:text-[1.75rem]">{sectionTitle}</h2>
            <div className="w-[120px] h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] mx-auto rounded-[2px] shadow-[0_2px_12px_var(--primary)]"></div>
          </div>
          <div className={`grid grid-cols-1 gap-0 bg-[var(--card-bg)] rounded-[20px] border border-[var(--card-border)] overflow-hidden shadow-[0_4px_12px_var(--shadow-color)] transition-all duration-300 ${columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} animate-pulse`}>
            {Array(columns).fill(0).map((_, i) => (
              <div key={i} className="grid grid-cols-[1fr_140px] gap-5 p-6 border-b border-[var(--border)] md:grid-cols-[1fr_120px] md:p-5 sm:grid-cols-[1fr_100px] sm:p-4">
                <div className="flex flex-col gap-3 justify-center space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="w-[140px] h-[90px] rounded-[10px] bg-gray-200 shrink-0 md:w-[120px] md:h-20 sm:w-[100px] sm:h-[70px]"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-[var(--background)] py-16 px-8 relative overflow-hidden transition-colors duration-300 after:content-[''] after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 after:w-px after:h-full after:bg-linear-to-b after:from-transparent after:via-[var(--border)] after:to-transparent after:pointer-events-none md:py-12 md:px-6 sm:py-8 sm:px-4">
        <div className="max-w-[1400px] mx-auto relative z-1">
          <div className="text-center mb-12 md:mb-8">
            <h2 className="font-['Lora',serif] font-bold text-[clamp(2rem,5vw,3rem)] text-[var(--heading-color)] mb-4 tracking-tight transition-colors duration-300 md:text-[1.75rem]">{sectionTitle}</h2>
            <div className="w-[120px] h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] mx-auto rounded-[2px] shadow-[0_2px_12px_var(--primary)]"></div>
          </div>
          <p className="text-center text-gray-500 py-12">
            No latest news available right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-left">
            <h2 className="font-['Lora',serif] font-bold text-[clamp(2rem,5vw,3.2rem)] text-[#0f172a] mb-4 tracking-tighter leading-tight">{sectionTitle}</h2>
            <div className="w-24 h-1.5 bg-[#dc2626] rounded-full shadow-[0_4px_12px_rgba(220,38,38,0.2)]"></div>
          </div>

          {showReadMore && (
            <Link
              href={dynamicReadMoreLink}
              className="group flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#dc2626] transition-colors duration-300"
            >
              View All {sectionTitle}
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <div className={`grid gap-8 ${columns === 2 ? 'grid-cols-1 md:grid-cols-2' : columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {items.map((item, index) => {
            const href = item.slug ? item.href : '#';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className="group bg-white rounded-[32px] p-2 border border-gray-100 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:border-[#dc2626]/20 cursor-pointer h-full flex flex-col"
                  onClick={() => {
                    if (href && href !== '#') {
                      router.push(href);
                    }
                  }}
                >
                  {/* Image Holder */}
                  <div className="relative aspect-[16/10] rounded-[24px] overflow-hidden mb-6 bg-gray-50 border border-gray-50">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-[#dc2626] border border-white/20 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                        {item.category || 'Latest'}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="px-5 pb-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {item.date && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                          <Calendar size={13} className="text-[#dc2626]" />
                          {formatDateTime(item.date)}
                        </div>
                      )}
                    </div>

                    <h3 className="font-['Lora',serif] font-bold text-[20px] leading-[1.3] text-[#0f172a] mb-6 line-clamp-2 group-hover:text-[#dc2626] transition-colors duration-300">
                      {item.title}
                    </h3>

                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                      {(overrideSection?.toLowerCase() === "awards" || item.category?.toUpperCase() === "AWARDS") ? (
                        <div className="flex gap-2 w-full">
                          {(item as any).targetLink && (
                            <a
                              href={(item as any).targetLink.startsWith('http') ? (item as any).targetLink : `https://${(item as any).targetLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-gray-50 text-gray-700 border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Info size={14} />
                              Details
                            </a>
                          )}
                          {(item as any).nominationLink && (
                            <a
                              href={(item as any).nominationLink.startsWith('http') ? (item as any).nominationLink : `https://${(item as any).nominationLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-[#dc2626] text-white shadow-lg shadow-red-200 hover:bg-[#b91c1c] hover:-translate-y-0.5 transition-all duration-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={14} />
                              Nominate
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/more">
                          <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#dc2626] transition-colors">
                            Full Story
                          </span>
                          <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#dc2626] group-hover:border-[#dc2626] group-hover:text-white transition-all duration-300 group-hover:rotate-[-45deg]">
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {showReadMore && (
          <div className="mt-20 flex justify-center">
            <Link
              href={dynamicReadMoreLink}
              className="inline-flex items-center gap-4 px-12 py-5 bg-[#dc2626] text-white rounded-full font-black text-[14px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(220,38,38,0.25)] hover:bg-[#b91c1c] hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(220,38,38,0.35)] transition-all duration-500 group"
            >
              Explore More {sectionTitle}
              <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
