"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useNewsSectionData, MoreFromItem } from '@/app/hooks/useNewsSectionData';
import { formatDateTime } from '@/Utils/Utils';
import { motion } from 'framer-motion';
import { ArrowRight, Info, ExternalLink } from 'lucide-react';

interface MoreFromSectionProps {
  sectionTitle: string;
  overrideSection?: string;
  columns?: 2 | 3 | 4;
  limit?: number;
  excludeSlug?: string;
}

export default function MoreFromSection({
  sectionTitle,
  overrideSection,
  columns = 3,
  limit = 6,
  excludeSlug,
}: MoreFromSectionProps) {
  const { items, isLoading } = useNewsSectionData<MoreFromItem>({
    variant: 'more-from',
    overrideSection,
    limit,
    excludeSlug,
  });
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-[var(--background)] py-16 px-8 relative overflow-hidden transition-colors duration-300">
        <div className={`grid gap-6 relative z-[1] max-w-[1400px] mx-auto animate-pulse ${columns === 2 ? 'grid-cols-1 md:grid-cols-2' : columns === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
          {Array(columns * 2).fill(0).map((_, i) => (
            <div key={i} className={`flex flex-col gap-4 p-4 border border-[var(--card-border)] rounded-xl`}>
              <div className="bg-linear-to-r from-gray-200 to-gray-300 h-64 rounded-xl"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--background)] py-16 px-8 relative overflow-hidden transition-colors duration-300 after:absolute after:inset-0 after:bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,var(--border)_2px,var(--border)_4px)] after:opacity-30 after:pointer-events-none">
      <div className="text-center mb-12 relative z-[1]">
        <h2 className="font-['Lora',serif] text-[clamp(1.75rem,4vw,2.625rem)] font-bold text-[var(--heading-color)] m-0 mb-4 capitalize tracking-wider relative inline-block transition-colors duration-300 before:absolute before:-top-2.5 before:-left-5 before:w-2.5 before:h-2.5 before:bg-linear-to-br before:from-[var(--primary)] before:to-[var(--accent)] before:rounded-full before:shadow-[0_0_20px_var(--primary)] before:animate-pulse after:absolute after:-top-2.5 after:-right-5 after:w-2.5 after:h-2.5 after:bg-linear-to-br after:from-[var(--accent)] after:to-[var(--primary)] after:rounded-full after:shadow-[0_0_20px_var(--accent)] after:animate-pulse after:delay-1000">
          {sectionTitle}
        </h2>
        <div className="w-[120px] h-1 bg-linear-to-r from-transparent via-[var(--primary)] to-transparent mx-auto rounded-sm shadow-[0_0_15px_var(--primary)]"></div>
      </div>

      <div className={`grid gap-8 relative z-[1] max-w-[1400px] mx-auto ${columns === 2 ? 'grid-cols-1 md:grid-cols-2' : columns === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
        {items.map((item, index) => {
          const href = item.slug ? item.href : '#';

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col sm:flex-row items-center p-4 cursor-pointer gap-5"
              onClick={() => {
                if (href && href !== '#') {
                  router.push(href);
                }
              }}
            >
              {/* Image Container */}
              <div className="relative w-full sm:w-[180px] aspect-[4/3] rounded-xl overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content Container */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {item.date && (
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-inter">
                        {formatDateTime(item.date)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-['Lora',serif] text-[17px] font-bold leading-[1.4] text-[#0f172a] line-clamp-2 group-hover:text-[#dc2626] transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {(overrideSection?.toLowerCase() === "awards" || item.category?.toUpperCase() === "AWARDS") ? (
                    <div className="flex gap-2 w-full">
                      {(item as any).targetLink && (
                        <a
                          href={(item as any).targetLink.startsWith('http') ? (item as any).targetLink : `https://${(item as any).targetLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-gray-50 text-gray-700 border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
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
                          className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-[#dc2626] text-white shadow-lg shadow-red-200 hover:bg-[#b91c1c] hover:-translate-y-0.5 transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} />
                          Nominate
                        </a>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-[#dc2626] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                      READ MORE <ArrowRight size={14} />
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}