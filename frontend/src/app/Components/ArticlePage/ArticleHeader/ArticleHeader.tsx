import React from 'react';
import Image from 'next/image';
import { formatDateTime, calculateReadingTime } from '@/Utils/Utils';
import { CheckCircle, ShieldCheck, Clock } from 'lucide-react';

interface ArticleHeaderProps {
  article: {
    title: string;
    subtitle: string;
    image: string;
    date: string;
    author?: string;
    readTime?: string;
    content?: string;
  };
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const formattedDate = formatDateTime(article.date);

  return (
    <div className="mb-10 lg:mb-12">
      <div className="mb-6 flex gap-3 items-center">
        <div className="w-12 h-1 bg-[#dc2626] rounded-full"></div>
        <span className="text-[#dc2626] text-sm font-bold tracking-[0.2em] font-['Inter',sans-serif] uppercase">Report</span>
      </div>

      <h1 className="font-['Lora',serif] text-[46px] md:text-[36px] sm:text-[30px] font-extrabold leading-[1.15] text-gray-900 mb-6 tracking-tight">
        {article.title}
      </h1>

      <p className="font-['Lora',serif] text-[22px] md:text-[20px] sm:text-[18px] leading-[1.6] text-gray-600 mb-8 font-medium italic border-l-4 border-[#dc2626] pl-6 ml-1">
        {article.subtitle}
      </p>

      <div className="flex items-center gap-y-4 gap-x-8 flex-wrap font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-widest text-gray-500 py-6 border-y border-gray-100 mb-10 bg-gray-50/50 px-4 rounded-xl">
        <div className="flex items-center gap-3 text-gray-900">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#fef2f2] to-[#fee2e2] flex items-center justify-center border border-[#fecaca] shadow-sm">
            <ShieldCheck size={18} className="text-[#dc2626]" />
          </div>
          <div>
            <span className="block text-[10px] text-gray-400 mb-0.5">Author</span>
            <span className="font-bold">{article.author || 'TIME CYBERMEDIA'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[#dc2626]" />
          <span className="pt-0.5">{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <span className="pt-0.5">{calculateReadingTime(article.content || article.title)} read</span>
        </div>

        <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-white text-[#dc2626] rounded-full border border-gray-200 shadow-sm transition-transform hover:-translate-y-0.5">
          <CheckCircle size={14} />
          <span className="text-[10px] font-black tracking-[0.15em] pt-0.5">Fact Checked</span>
        </div>
      </div>

      <div className="w-full relative rounded-[32px] md:rounded-[24px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] group">
        <div className="absolute inset-0 border border-black/5 z-10 rounded-[32px] md:rounded-[24px] pointer-events-none"></div>
        <Image
          src={article.image}
          alt={article.title}
          width={1200}
          height={675}
          className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          priority
        />
      </div>
    </div>
  );
}
