"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useNewsSectionData, StoryItem } from '@/app/hooks/useNewsSectionData';

interface MoreStoriesSectionProps {
  title?: string;
  limit?: number;
  excludeSlug?: string;
  overrideSection?: string;
}

export default function MoreStoriesSection({
  title = 'MORE STORIES',
  limit = 3,
  excludeSlug,
  overrideSection,
}: MoreStoriesSectionProps) {
  const { items, isLoading } = useNewsSectionData<StoryItem>({
    variant: 'stories',
    overrideSection,
    limit,
    excludeSlug,
  });

  if (isLoading || items.length === 0) {
    return (
      <section className="bg-[var(--background)] py-12 px-8 md:px-6 sm:px-4 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex items-center gap-3.5 mb-10 relative">
            <div className="w-2.5 h-2.5 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-full shadow-[0_0_20px_var(--primary)] animate-pulse shrink-0"></div>
            <h2 className="font-['Lora',serif] text-[32px] font-extrabold text-[var(--heading-color)] m-0 tracking-[1.5px] sm:text-2xl">{title}</h2>
            <div className="flex-1 h-[2px] bg-gradient-to-r from-[var(--primary)] to-transparent opacity-30 ml-5"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm flex flex-col opacity-50">
                <div className="aspect-[16/10] bg-gray-200 animate-pulse"></div>
                <div className="p-[22px] flex flex-col gap-3.5 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--background)] py-12 px-8 md:px-6 sm:px-4 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex items-center gap-3.5 mb-10 relative">
          <div className="w-2.5 h-2.5 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-full shadow-[0_0_20px_var(--primary)] animate-pulse shrink-0"></div>
          <h2 className="font-['Lora',serif] text-[32px] font-extrabold text-[var(--heading-color)] m-0 tracking-[1.5px] sm:text-2xl">{title}</h2>
          <div className="flex-1 h-[2px] bg-gradient-to-r from-[var(--primary)] to-transparent opacity-30 ml-5"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {items.map((story, index) => (
            <Link
              key={story.id}
              href={story.href}
              className="group relative flex flex-col bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-[0_2px_8px_var(--shadow-color)] transition-all duration-500 cubic-bezier(0.4,0,0.2,1) hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_12px_28px_var(--shadow-color)] hover:border-[var(--accent)] hover:bg-[var(--nav-hover-bg)] animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Premium Shimmer Line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[#ec4899] bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2] animate-shimmer"></div>

              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--muted)]">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover transition-all duration-700 cubic-bezier(0.4,0,0.2,1) group-hover:scale-112 group-hover:brightness-[1.05]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 transition-colors duration-500 group-hover:bg-[var(--nav-hover-bg)]"></div>

                {/* Hover Arrow Button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.8] w-[60px] h-[60px] bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400 cubic-bezier(0.4,0,0.2,1) shadow-[0_8px_24px_var(--primary)] z-[3]">
                  <svg className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="p-[22px] flex flex-col gap-3.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-full shadow-[0_0_10px_var(--primary)] transition-shadow duration-300 group-hover:shadow-[0_0_16px_var(--primary)] shrink-0"></div>
                  <p className="font-['Inter',sans-serif] text-[11px] font-bold text-[var(--text-color)] m-0 leading-tight uppercase tracking-[0.5px] line-clamp-2 transition-colors duration-300 group-hover:text-[var(--accent)]">{story.category}</p>
                </div>

                <h3 className="font-['Lora',serif] text-[17px] font-bold leading-normal text-[var(--heading-color)] m-0 line-clamp-3 tracking-[-0.01em] transition-all duration-300 group-hover:text-[var(--accent)]">{story.title}</h3>

                <div className="mt-auto pt-3 border-t border-[var(--border)] transition-colors duration-300 group-hover:border-[var(--accent)/20] flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <svg className="text-[var(--primary)] shrink-0 transition-colors duration-300" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="font-['Inter',sans-serif] text-[12px] font-bold text-[var(--primary)] tracking-[0.3px] transition-colors duration-300">{story.timeAgo}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="text-[var(--primary)] shrink-0 transition-colors duration-300" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="font-['Inter',sans-serif] text-[12px] font-bold text-[var(--text-color)] tracking-[0.3px] transition-colors duration-300">{story.author}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}