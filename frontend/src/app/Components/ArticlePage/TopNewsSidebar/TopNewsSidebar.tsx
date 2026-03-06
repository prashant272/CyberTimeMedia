import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface TopNewsItem {
  id: string | number;
  title: string;
  image: string;
  slug: string;
  section: string;
  category?: string;
}

interface TopNewsSidebarProps {
  news: TopNewsItem[];
}

export default function TopNewsSidebar({ news }: TopNewsSidebarProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6 mb-6 shadow-[0_4px_20px_rgb(0,0,0,0.06)] transition-all duration-300">
      <h2 className="relative font-['Lora',serif] text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-transparent bg-linear-to-r bg-no-repeat bg-[length:80px_2px] bg-left-bottom from-[#dc2626] to-[#b91c1c] tracking-tight transition-colors duration-300 before:content-['🔥'] before:mr-2 before:text-[22px] before:animate-pulse">Top News</h2>
      <div className="flex flex-col gap-5">
        {news.map((item) => {
          const sectionSlug = item.section.toLowerCase();

          const categoryValue = item.category || 'general';
          const categorySlug = categoryValue
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

          const href = `/Pages/${sectionSlug}/${categorySlug}/${item.slug}`;

          return (
            <Link
              key={item.id}
              href={href}
              className="group relative flex gap-3.5 p-3 -m-3 rounded-[16px] no-underline transition-all duration-300 cubic-bezier(0.4,0,0.2,1) hover:translate-x-1.5 before:absolute before:inset-0 before:bg-gray-50 before:opacity-0 before:transition-opacity before:duration-300 before:rounded-[16px] hover:before:opacity-100"
            >
              <div className="relative flex-shrink-0 w-[120px] h-20 rounded-[12px] overflow-hidden bg-gray-100 border border-gray-200 transition-all duration-300 group-hover:border-[#dc2626] after:absolute after:inset-0 after:bg-black/5 after:opacity-0 after:transition-opacity after:duration-300 group-hover:after:opacity-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={120}
                  height={80}
                  className="w-full h-full object-cover transition-transform duration-500 cubic-bezier(0.4,0,0.2,1) group-hover:scale-110"
                  sizes="120px"
                />
              </div>
              <h3 className="relative flex-1 font-['Lora',serif] text-[15px] font-semibold leading-relaxed text-gray-800 line-clamp-3 tracking-tight transition-colors duration-300 group-hover:text-[#dc2626]">{item.title}</h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}