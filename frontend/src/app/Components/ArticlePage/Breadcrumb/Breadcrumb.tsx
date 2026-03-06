import React from 'react';
import Link from 'next/link';

interface BreadcrumbProps {
  section: string;
  category: string;
  title: string;
}

export default function Breadcrumb({ section, category, title }: BreadcrumbProps) {
  const sectionSlug = encodeURIComponent(section.toLowerCase().replace(/\s+/g, '-'));
  const categorySlug = encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'));

  return (
    <nav className="flex items-center flex-wrap gap-2 py-4 font-['Inter',sans-serif] text-sm sm:text-xs text-gray-500 border-b border-gray-200 mb-6 transition-all duration-300">
      <Link href="/" className="relative font-medium text-gray-600 hover:text-[#dc2626] transition-all duration-300 after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#dc2626] after:transition-[width] after:duration-300 hover:after:w-full">News</Link>
      <span className="text-gray-400 font-normal transition-colors duration-300 select-none">/</span>
      <span className="text-gray-400 font-normal transition-colors duration-300 select-none">Pages</span>

      <span className="text-gray-400 font-normal transition-colors duration-300 select-none">/</span>
      <Link href={`/Pages/${sectionSlug}`} className="relative font-medium text-gray-600 hover:text-[#dc2626] transition-all duration-300 after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#dc2626] after:transition-[width] after:duration-300 hover:after:w-full">
        {section}
      </Link>
      <span className="text-gray-400 font-normal transition-colors duration-300 select-none">/</span>
      <Link href={`/Pages/${sectionSlug}/${categorySlug}`} className="relative font-medium text-gray-600 hover:text-[#dc2626] transition-all duration-300 after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#dc2626] after:transition-[width] after:duration-300 hover:after:w-full">
        {category}
      </Link>
      <span className="text-gray-400 font-normal transition-colors duration-300 select-none">/</span>
      <span className="font-semibold text-gray-900 truncate max-w-[500px] md:max-w-[300px] sm:max-w-[200px] transition-colors duration-300">{title}</span>
    </nav>
  );
}
