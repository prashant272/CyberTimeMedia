import React from 'react';
import Link from 'next/link';

interface ArticleTagsProps {
  tags: string[];
}

export default function ArticleTags({ tags }: ArticleTagsProps) {
  return (
    <div className="my-12 pt-8 border-t border-[var(--border)] transition-colors duration-300">
      <div className="flex flex-wrap gap-2.5 mb-8">
        {tags.map((tag) => {
          const tagSlug = encodeURIComponent(
            tag.toLowerCase().trim()
              .replace(/&/g, 'and')
              .replace(/\s+/g, '-')
          );
          return (
            <Link
              key={tag}
              href={`/tag/${tagSlug}`}
              className="group inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-gray-50 text-gray-700 font-['Inter',sans-serif] text-sm font-medium rounded-full border border-gray-200 transition-all duration-300 cubic-bezier(0.4,0,0.2,1) hover:bg-linear-to-br hover:from-[#dc2626] hover:to-[#b91c1c] hover:text-white hover:border-transparent hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(220,38,38,0.25)] active:translate-y-0 before:content-['#'] before:text-[#dc2626] before:font-semibold before:transition-colors hover:before:text-white"
            >
              {tag}
            </Link>
          );
        })}
      </div>

      <div className="relative mt-8 p-6 bg-linear-to-br from-[#dc2626] to-[#b91c1c] rounded-[24px] border border-[#dc2626] shadow-[0_8px_24px_rgba(220,38,38,0.2)] overflow-hidden transition-all duration-300 before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-linear-to-r before:from-transparent before:via-white/10 before:to-transparent before:transition-[left] before:duration-500 hover:before:left-[100%]">
        <p className="relative z-[1] m-0 font-['Inter',sans-serif] text-base leading-relaxed text-white md:text-[15px] sm:text-[14px]">
          Read all the <Link href="/Pages/all" className="font-semibold text-[#fecaca] border-b border-[#fecaca]/30 transition-all duration-300 hover:text-white hover:border-white">Breaking News</Link> Live on TIME CYBERMEDIA and Get <Link href="/Pages/all" className="font-semibold text-[#fecaca] border-b border-[#fecaca]/30 transition-all duration-300 hover:text-white hover:border-white">Latest English News</Link> & Updates from <Link href="/Pages/sports" className="font-semibold text-[#fecaca] border-b border-[#fecaca]/30 transition-all duration-300 hover:text-white hover:border-white">Sports</Link> Section
        </p>
      </div>
    </div>
  );
}
