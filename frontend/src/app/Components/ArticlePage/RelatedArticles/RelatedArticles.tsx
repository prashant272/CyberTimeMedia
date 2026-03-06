import React from 'react';
import Link from 'next/link';

interface RelatedArticle {
  id: string | number;
  title: string;
  slug: string;
  section?: string;
  category?: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="my-12 pt-8 border-t border-[var(--border)] transition-colors duration-300">
      <h2 className="relative font-['Lora',serif] text-2xl font-bold text-gray-900 mb-6 tracking-tight pl-4 transition-colors duration-300 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-linear-to-b before:from-[#dc2626] before:to-[#b91c1c] before:rounded-sm before:shadow-[0_0_8px_#dc2626]">Also Read</h2>
      <div className="flex flex-col gap-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/Pages/${article.section || 'india'}/${article.category || 'general'}/${article.slug}`}
            className="group relative flex items-center gap-3 p-4.5 bg-white border border-gray-100 rounded-[20px] text-gray-800 font-['Lora',serif] text-base font-semibold leading-normal no-underline shadow-[0_4px_16px_rgb(0,0,0,0.04)] transition-all duration-300 cubic-bezier(0.4,0,0.2,1) hover:bg-gray-50 hover:border-[#dc2626] hover:text-[#dc2626] hover:translate-x-2 hover:shadow-md before:absolute before:left-0 before:top-0 before:w-[3px] before:h-0 before:bg-linear-to-b before:from-[#dc2626] before:to-[#b91c1c] before:transition-[height] before:duration-300 hover:before:height-full after:content-['→'] after:ml-auto after:text-[#dc2626] after:text-lg after:font-bold after:opacity-0 after:translate-x-[-10px] after:transition-all after:duration-300 hover:after:opacity-100 hover:after:translate-x-0 overflow-hidden"
          >
            {article.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
