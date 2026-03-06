'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNewsContext } from '@/app/context/NewsContext';
import { getImageSrc } from '@/Utils/imageUtils';
import { useActiveAds } from '@/app/hooks/useAds';
import { formatDateTime } from '@/Utils/Utils';
import { useState, useEffect, useMemo } from 'react';
import SidebarAds from '../SidebarAds/SidebarAds';
import { NewsCard } from '../NewsCard/NewsCard';
import Image from 'next/image';

export interface NewsGridItem {
  id: string | number;
  image: string;
  title: string;
  slug?: string;
  category?: string;
  subCategory: string;
  displaySubCategory?: string;
  isTrending?: boolean;
  date?: string;
  targetLink?: string;
  nominationLink?: string;
}

export interface TopNewsItem {
  id: string | number;
  title: string;
  image: string;
  slug?: string;
  subCategory?: string;
  displaySubCategory?: string;
  publishedAt?: string;
  date?: string;
  createdAt?: string;
}

interface NewsSectionProps {
  sectionTitle: string;
  subCategories?: string[];
  mainNews?: NewsGridItem[];
  topNews?: TopNewsItem[];
  showSidebar?: boolean;
  gridColumns?: 2 | 3 | 4;
  currentSection?: string;
}

const CATEGORY_TO_SECTION_MAP: Record<string, string> = {
  'Cricket': 'sports', 'Football': 'sports', 'Tennis': 'sports',
  'Badminton': 'sports', 'Hockey': 'sports', 'Athletics': 'sports',
  'Markets': 'business', 'Economy': 'business', 'Banking': 'business',
  'Startups': 'business', 'Cryptocurrency': 'business',
  'AI': 'tech', 'Smartphones': 'tech', 'Gadgets': 'tech',
  'Bollywood': 'entertainment', 'Hollywood': 'entertainment',
  'TV': 'entertainment', 'OTT': 'entertainment',
  'Food': 'lifestyle', 'Travel': 'lifestyle', 'Beauty': 'lifestyle',
  'Maharashtra': 'india', 'National': 'india', 'Politics': 'india',
};

const getSectionFromUrl = (pathname: string): string => {
  const parts = pathname.split('/').filter(Boolean);
  const pagesIndex = parts.indexOf('Pages');
  if (pagesIndex !== -1 && parts[pagesIndex + 1]) {
    return parts[pagesIndex + 1];
  }
  return 'india';
};

const getSection = (
  pathname: string,
  category?: string,
  fallback: string = 'india'
): string => {
  const fromUrl = getSectionFromUrl(pathname);
  if (['india', 'sports', 'business', 'entertainment', 'lifestyle', 'tech'].includes(fromUrl)) {
    return fromUrl;
  }
  if (category && CATEGORY_TO_SECTION_MAP[category]) {
    return CATEGORY_TO_SECTION_MAP[category];
  }
  return fallback;
};

const cleanDisplayText = (text: string): string => {
  return decodeURIComponent(text)
    .replace(/%26/g, '&')
    .replace(/%20/g, ' ')
    .replace(/%2B/g, '+')
    .trim();
};

const NewsSection: React.FC<NewsSectionProps> = ({
  sectionTitle,
  subCategories = [],
  mainNews: providedMainNews,
  topNews: providedTopNews,
  showSidebar = true,
  gridColumns = 3,
}) => {
  const pathname = usePathname();
  const section = getSectionFromUrl(pathname);
  const { allNews, indiaNews, sportsNews, businessNews, entertainmentNews, lifestyleNews } = useNewsContext();

  const sectionNews = (() => {
    switch (section) {
      case 'india': return indiaNews || [];
      case 'sports': return sportsNews || [];
      case 'business': return businessNews || [];
      case 'entertainment': return entertainmentNews || [];
      case 'lifestyle': return lifestyleNews || [];
      default: return allNews || [];
    }
  })();

  const mainNews: NewsGridItem[] = useMemo(() => {
    const newsToMap = providedMainNews || sectionNews.slice(0, 12);
    return newsToMap.map((item, index) => ({
      id: (item as any)._id || (item as any).id || `${section}-${item.slug || 'no-slug'}-${index}`,
      image: getImageSrc(item.image),
      title: item.title,
      slug: item.slug,
      category: item.category,
      subCategory: item.subCategory || '',
      displaySubCategory: cleanDisplayText(item.subCategory || ''),
      isTrending: item.isTrending,
      date: item.date,
      targetLink: (item as any).targetLink,
      nominationLink: (item as any).nominationLink
    }));
  }, [providedMainNews, sectionNews, section]);

  const topNews: TopNewsItem[] = useMemo(() => {
    if (providedTopNews) {
      return providedTopNews.map(item => ({
        ...item,
        image: getImageSrc(item.image)
      }));
    }
    const trendingNews = sectionNews.filter(item => item.isTrending === true);
    const newsToShow = trendingNews.length >= 10 ? trendingNews : sectionNews;
    return newsToShow.slice(0, 10).map((item, index) => ({
      id: item._id || `${section}-top-${index}`,
      title: item.title,
      image: getImageSrc(item.image),
      slug: item.slug,
      subCategory: item.subCategory,
      displaySubCategory: cleanDisplayText(item.subCategory || ''),
      date: item.publishedAt || item.date || (item as any).createdAt
    }));
  }, [providedTopNews, sectionNews, section]);



  if (!sectionNews.length && !providedMainNews) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-8 md:px-4 md:py-12 sm:px-3 sm:py-8">
        <section className="max-w-[1400px] mx-auto">
          <div className={`grid gap-7 animate-pulse ${gridColumns === 2 ? 'grid-cols-1 sm:grid-cols-2' : gridColumns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {Array(gridColumns * 4).fill(0).map((_, i) => (
              <div key={i} className="bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--card-border)] shadow-sm flex flex-col h-full relative p-4">
                <div className="bg-gray-200 h-48 rounded-lg"></div>
                <div className="mt-3 h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const hasTrendingNews = sectionNews.some(item => item.isTrending === true);

  return (
    <div className="min-h-screen bg-[var(--background)] p-8 md:px-4 md:py-12 sm:px-3 sm:py-8">
      <section className="max-w-[1400px] mx-auto">
        <div className="mb-12 pb-8 border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left">
            <h2 className="font-['Lora',serif] text-[clamp(2rem,5vw,3.5rem)] font-bold text-[#0f172a] mb-5 tracking-tighter leading-tight relative inline-block">{sectionTitle}</h2>
            <div className="w-24 h-1.5 bg-[#dc2626] rounded-full shadow-[0_4px_12px_rgba(220,38,38,0.2)]"></div>
          </div>
          {subCategories.length > 0 && (
            <nav className="flex flex-wrap gap-3 mt-4">
              {subCategories.map((cat) => {
                const cleanCat = cleanDisplayText(cat);
                const slug = encodeURIComponent(
                  cleanCat.toLowerCase().replace(/\s+/g, '-')
                );

                const pathParts = pathname.split('/').filter(Boolean);
                const pagesIndex = pathParts.indexOf('Pages');
                const isSectionPage = pagesIndex !== -1 && pathParts.length === pagesIndex + 2;

                const linkHref = isSectionPage
                  ? `/Pages/${section}/${slug}`
                  : `/tag/${slug}`;

                return (
                  <Link
                    key={cat}
                    href={linkHref}
                    className="px-6 py-2.5 bg-gray-50 border border-gray-100 rounded-full font-['Inter',sans-serif] text-[11px] font-black uppercase tracking-widest text-gray-400 no-underline transition-all duration-500 hover:bg-[#dc2626] hover:text-white hover:border-transparent hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(220,38,38,0.2)] active:scale-95"
                  >
                    {cleanCat}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className={showSidebar ? "grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-10" : "w-full"}>
          <div className={`grid gap-7 ${gridColumns === 2 ? 'grid-cols-1 sm:grid-cols-2' : gridColumns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {mainNews.map((news) => (
              <NewsCard
                key={news.id}
                currentSection={section}
                {...news}
              />
            ))}
          </div>

          {showSidebar && (
            <aside className="lg:w-[320px]">
              <SidebarAds count={4} />

              {topNews.length > 0 && (
                <>
                  <h3 className="font-['Lora',serif] text-xl font-bold text-[var(--heading-color)] mb-5 tracking-tight border-b border-[var(--border)] pb-3 mt-8">
                    {hasTrendingNews ? 'Trending News' : 'Top News'}
                  </h3>
                  <div className="flex flex-col gap-0">
                    {topNews.map((news) => (
                      <Link
                        key={news.id}
                        href={news.slug ? `/Pages/${section}/${encodeURIComponent(news.subCategory || 'general')}/${encodeURIComponent(news.slug || '')}` : '#'}
                        className="flex gap-4 p-4 border-b border-[var(--border)] transition-all duration-300 hover:bg-[var(--nav-hover-bg)] hover:pl-5 group first:pt-0 last:border-none"
                      >
                        <div className="flex-1">
                          <p className="m-0 font-['Lora',serif] text-[1rem] font-semibold leading-[1.4] text-[var(--heading-color)] line-clamp-2 transition-colors group-hover:text-[var(--primary)]">{news.title}</p>
                          {news.date && (
                            <span className="text-[0.7rem] text-[var(--muted-foreground)] block mt-1 font-medium italic">
                              {formatDateTime(news.date)}
                            </span>
                          )}
                        </div>
                        <div className="relative w-20 h-20 shrink-0">
                          <Image
                            src={news.image}
                            alt={news.title}
                            fill
                            className="rounded-lg object-cover shadow-sm transition-transform group-hover:scale-105"
                            sizes="80px"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </aside>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsSection;
