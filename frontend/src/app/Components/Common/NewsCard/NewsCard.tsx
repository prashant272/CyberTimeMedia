import React, { useMemo } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNewsContext } from '@/app/context/NewsContext';
import { getImageSrc } from '@/Utils/imageUtils';
import { formatDateTime, calculateReadingTime } from '@/Utils/Utils';
import { NewsItem as SharedNewsItem } from '@/app/services/NewsService';
import { ChevronRight } from 'lucide-react';

// --- SINGULAR NEWS CARD COMPONENT (Used in Search, NewsSection, etc.) ---

export interface NewsCardProps {
  id?: string | number;
  image?: string;
  title?: string;
  slug?: string;
  category?: string;
  subCategory?: string;
  displaySubCategory?: string;
  isTrending?: boolean;
  date?: string;
  targetLink?: string;
  nominationLink?: string;
  currentSection?: string;
  item?: SharedNewsItem; // Option 1: Support passing the whole item
}

export const NewsCard: React.FC<NewsCardProps> = (props) => {
  const pathname = usePathname();
  const router = useRouter();

  // Extract data from either individual props or the 'item' prop
  const { item } = props;

  const title = item?.title || props.title || '';
  const image = item?.image || props.image || '';
  const slug = item?.slug || props.slug;
  const category = item?.category || props.category;
  const subCategory = item?.subCategory || props.subCategory || '';
  const isTrending = item?.isTrending || props.isTrending;
  const date = item?.date || props.date;
  const targetLink = item?.targetLink || props.targetLink;
  const nominationLink = item?.nominationLink || props.nominationLink;

  // currentSection logic (simplified from your NewsSection version)
  const getSectionFromUrl = (path: string): string => {
    const parts = path.split('/').filter(Boolean);
    const pagesIndex = parts.indexOf('Pages');
    if (pagesIndex !== -1 && parts[pagesIndex + 1]) {
      return parts[pagesIndex + 1];
    }
    return 'india';
  };

  const section = props.currentSection || getSectionFromUrl(pathname);
  const displayImage = getImageSrc(image);

  const cleanSubCategory = (text: string): string => {
    return decodeURIComponent(text)
      .replace(/%26/g, '&')
      .replace(/%20/g, ' ')
      .replace(/%2B/g, '+')
      .trim();
  };

  const displaySubCategory = props.displaySubCategory || (subCategory ? cleanSubCategory(subCategory) : '');

  const href = slug ? `/Pages/${section}/${encodeURIComponent(subCategory || 'general')}/${encodeURIComponent(slug)}` : undefined;

  const handleCardClick = () => {
    if (href) {
      router.push(href);
    }
  };

  const cardContent = (
    <>
      <div className="relative w-full pb-[60%] overflow-hidden bg-[var(--muted)] shrink-0 group-hover:shadow-lg transition-shadow duration-300">
        <Image
          src={displayImage}
          alt={title}
          fill
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.1]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[rgba(0,0,0,0.02)] to-[rgba(0,0,0,0.5)] opacity-80 z-[1] transition-opacity duration-300"></div>

        {/* Category Badge */}
        {category && (
          <span className="absolute top-4 left-4 px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-white/20 font-['Inter',sans-serif] font-bold text-[10px] text-[#dc2626] uppercase tracking-widest shadow-xl z-[2] transition-all duration-300 group-hover:bg-[#dc2626] group-hover:text-white">
            {category}
          </span>
        )}

        {/* Live/Trending Badge */}
        {isTrending && (
          <span className="absolute top-4 right-4 px-3 py-1.5 bg-red-600 backdrop-blur-md rounded-lg border border-red-400/30 font-['Inter',sans-serif] font-bold text-[10px] text-white uppercase tracking-wider shadow-lg z-[2] flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-blink"></span>
            Trending
          </span>
        )}

        {/* Reading Time Overlay */}
        <div className="absolute bottom-4 left-4 z-[2] flex items-center gap-2 text-white/90 text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {calculateReadingTime(item?.content || title)}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          {displaySubCategory && (
            <span className="font-['Inter',sans-serif] text-[11px] font-extrabold text-[#dc2626] uppercase tracking-widest bg-red-50 px-2 py-1 rounded-md">
              {displaySubCategory}
            </span>
          )}
          {date && (
            <span className="font-['Inter',sans-serif] text-[11px] text-gray-400 font-bold uppercase tracking-tight">
              {formatDateTime(date)}
            </span>
          )}
        </div>

        <h3 className="font-['Lora',serif] text-[1.25rem] font-bold leading-[1.3] text-gray-900 tracking-tight m-0 line-clamp-2 transition-colors duration-300 group-hover:text-[#dc2626]">
          {title}
        </h3>

        {(section?.toLowerCase() === "awards" || category?.toUpperCase() === "AWARDS") && (
          <div className="flex gap-3 pt-2">
            {targetLink && (
              <a
                href={targetLink.startsWith('http') ? targetLink : `https://${targetLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gray-50 text-gray-900 border border-gray-200 font-bold text-[11px] uppercase tracking-widest text-center transition-all hover:bg-black hover:text-white hover:border-black"
                onClick={(e) => e.stopPropagation()}
              >
                More Info
              </a>
            )}
            {nominationLink && (
              <a
                href={nominationLink.startsWith('http') ? nominationLink : `https://${nominationLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-bold text-[11px] uppercase tracking-widest text-center transition-all hover:bg-red-700 shadow-md"
                onClick={(e) => e.stopPropagation()}
              >
                Nominate
              </a>
            )}
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50 group/more">
          <div className="flex items-center gap-2 text-[#dc2626] font-black text-[11px] uppercase tracking-widest opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <span>Read Story</span>
            <svg className="transition-transform duration-300 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-all duration-300 group-hover:bg-[#dc2626] group-hover:text-white">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </>
  );

  if (!href) {
    return <div className="group bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--card-border)] shadow-sm transition-all duration-300 flex flex-col h-full relative">{cardContent}</div>;
  }

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] hover:border-[#dc2626]/20 transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] flex flex-col h-full relative cursor-pointer"
    >
      {cardContent}
    </div>
  );
};

// --- PLURAL NEWS CARDS COMPONENT (For category sections) ---

export interface NewsItem {
  id: string | number;
  title: string;
  image?: string;
  category?: string;
  isLive?: boolean;
  isVideo?: boolean;
  isPhoto?: boolean;
  slug?: string;
  date?: string;
  relatedLinks?: string[];
  targetLink?: string;
  nominationLink?: string;
}

export interface CategorySection {
  categoryName: any;
  items: NewsItem[];
  subcategories?: string[];
}

interface NewsCardsProps {
  data?: CategorySection[];
  columns?: 2 | 3 | 4;
  showSubcategories?: boolean;
  animationEnabled?: boolean;
  showViewMore?: boolean;
  maxHeadlines?: number;
  overrideSection?: 'india' | 'sports' | 'business' | 'entertainment' | 'lifestyle' | 'all';
}

const NewsCards: React.FC<NewsCardsProps> = ({
  data,
  columns = 3,
  showSubcategories = false,
  animationEnabled = true,
  showViewMore = true,
  maxHeadlines = 4,
  overrideSection
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { allNews, indiaNews, sportsNews, businessNews, entertainmentNews, lifestyleNews } = useNewsContext();

  const section = useMemo(() => {
    if (overrideSection) return overrideSection;

    const parts = pathname.split('/').filter(Boolean);
    const pagesIndex = parts.indexOf('Pages');

    if (pagesIndex !== -1 && parts[pagesIndex + 1]) {
      const candidate = parts[pagesIndex + 1];
      if (['india', 'sports', 'business', 'entertainment', 'lifestyle'].includes(candidate)) {
        return candidate;
      }
    }

    return 'india';
  }, [pathname, overrideSection]);

  const sectionData = useMemo(() => {
    switch (section) {
      case 'india': return indiaNews || [];
      case 'sports': return sportsNews || [];
      case 'business': return businessNews || [];
      case 'entertainment': return entertainmentNews || [];
      case 'lifestyle': return lifestyleNews || [];
      default: return allNews || [];
    }
  }, [section, allNews, indiaNews, sportsNews, businessNews, entertainmentNews, lifestyleNews]);

  const contextData: CategorySection[] = useMemo(() => {
    if (!sectionData || sectionData.length === 0) return [];

    const grouped: Record<string, NewsItem[]> = {};

    sectionData.forEach((item: any) => {
      const category = item.category || section.toUpperCase();
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push({
        id: item._id || item.id || item.slug,
        title: item.title,
        image: item.image,
        category: item.category,
        slug: item.slug,
        date: item.date,
        isLive: item.isLive,
        isVideo: item.isVideo,
        isPhoto: item.isPhoto,
        targetLink: item.targetLink,
        nominationLink: item.nominationLink
      });
    });

    return Object.entries(grouped).map(([categoryName, items]) => ({
      categoryName,
      items: items.slice(0, maxHeadlines + 1),
      subcategories: []
    }));
  }, [sectionData, section, maxHeadlines]);

  const displayData = contextData;

  const CATEGORY_TO_SECTION_MAP: Record<string, string> = {
    'Cricket': 'sports',
    'Football': 'sports',
    'Tennis': 'sports',
    'Badminton': 'sports',
    'Hockey': 'sports',
    'Athletics': 'sports',
    'Wrestling': 'sports',
    'IPL': 'sports',
    'Olympics': 'sports',
    'Market': 'business',
    'Personal Finance': 'business',
    'Income Tax': 'business',
    'Travel': 'lifestyle',
    'Food': 'lifestyle',
    'Beauty': 'lifestyle',
    'Maharashtra': 'india',
    'Uttar Pradesh': 'india',
    'Odisha': 'india',
    'Bihar': 'india',
    'Madhya Pradesh': 'india',
    'Karnataka': 'india',
    'Tamil Nadu': 'india',
    'West Bengal': 'india',
    'USA': 'world',
    'Europe': 'world',
    'Asia Pacific': 'world',
    'Middle East': 'world',
  };

  const getSectionFromCategory = (categoryName: string): string => {
    return CATEGORY_TO_SECTION_MAP[categoryName] || section;
  };

  const getItemLink = (item: NewsItem, categoryName: string): string => {
    if (!item.slug) {
      return `/news/${item.id}`;
    }

    const itemCategory = item.category || categoryName;
    const itemSection = getSectionFromCategory(itemCategory);
    const itemCategorySlug = encodeURIComponent(itemCategory.toLowerCase().replace(/\s+/g, '-'));

    const expectedPath = `/Pages/${itemSection}/${itemCategorySlug}`;
    const normalizedPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

    if (normalizedPathname === expectedPath) {
      return `${expectedPath}/${encodeURIComponent(item.slug || '')}`;
    }

    return `/Pages/${itemSection}/${itemCategorySlug}/${encodeURIComponent(item.slug || '')}`;
  };

  const getCategoryLink = (categoryName: string): string => {
    const categorySection = getSectionFromCategory(categoryName);
    const categorySlug = encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'));
    return `/Pages/${categorySection}/${categorySlug}`;
  };

  const columnClass = useMemo(() => {
    switch (columns) {
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      default: return 'grid-cols-3';
    }
  }, [columns]);

  if (displayData.length === 0) {
    return (
      <div className="relative overflow-hidden bg-[var(--background)] px-8 py-12 transition-colors duration-300 md:px-6 sm:px-3 after:absolute after:left-1/2 after:top-0 after:h-full after:w-[1px] after:-translate-x-1/2 after:bg-gradient-to-b after:from-transparent after:via-[var(--border)] after:to-transparent after:pointer-events-none">
        <div className={`relative z-[1] mx-auto grid max-w-[1400px] gap-5 ${columnClass} lg:grid-cols-2 md:grid-cols-1`}>
          {Array(columns).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] opacity-50 shadow-sm p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-4 animate-pulse"></div>
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[var(--background)] px-8 py-12 transition-colors duration-300 md:px-6 sm:px-3 after:absolute after:left-1/2 after:top-0 after:h-full after:w-[1px] after:-translate-x-1/2 after:bg-gradient-to-b after:from-transparent after:via-[var(--border)] after:to-transparent after:pointer-events-none">
      <div className={`relative z-[1] mx-auto grid max-w-[1400px] gap-5 ${columnClass} lg:grid-cols-2 md:grid-cols-1`}>
        {displayData.map((categorySection, index) => {
          const featuredItem = categorySection.items[0];
          const headlineItems = categorySection.items.slice(1, maxHeadlines + 1);

          if (!featuredItem) return null;

          return (
            <div
              key={categorySection.categoryName}
              className={`group/card relative flex flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#dc2626]/20 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] after:absolute after:left-0 after:right-0 after:top-0 after:h-[4px] after:bg-[#dc2626] after:opacity-0 after:transition-opacity after:duration-500 hover:after:opacity-100 ${animationEnabled ? 'animate-fade-in-up' : 'opacity-100'}`}
              style={animationEnabled ? { animationDelay: `${index * 0.1}s` } : undefined}
            >
              <div className="relative border-b border-gray-50 bg-gray-50/30 px-6 py-6 pb-5 transition-all duration-300 sm:px-5">
                <h2 className="m-0 flex items-center gap-3 font-['Lora'] text-[1.4rem] font-bold leading-tight tracking-tight text-[#0f172a] transition-colors duration-300 uppercase sm:text-[1.125rem]">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#dc2626] shadow-[0_0_12px_rgba(220,38,38,0.5)] animate-pulse"></span>
                  {categorySection.categoryName}
                </h2>

                {showSubcategories && categorySection.subcategories && categorySection.subcategories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {categorySection.subcategories.map((subcat, idx) => {
                      const subcatSection = getSectionFromCategory(categorySection.categoryName);
                      const subcatSlug = encodeURIComponent(subcat.toLowerCase().replace(/\s+/g, '-'));

                      return (
                        <Link
                          key={`${subcat}-${idx}`}
                          href={`/Pages/${subcatSection}/${subcatSlug}`}
                          className="inline-block rounded-full border border-gray-100 bg-white px-3 py-1.5 font-['Inter'] text-[10px] font-black uppercase leading-tight tracking-widest text-gray-400 no-underline transition-all duration-300 hover:-translate-y-px hover:border-[#dc2626] hover:text-[#dc2626] hover:shadow-sm"
                        >
                          {subcat}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-b border-[var(--border)]">
                <div
                  className="group/featured block text-inherit no-underline cursor-pointer"
                  onClick={() => {
                    const fLink = getItemLink(featuredItem, categorySection.categoryName);
                    if (fLink) router.push(fLink);
                  }}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100 before:absolute before:inset-0 before:z-[1] before:bg-gradient-to-b before:from-transparent before:via-black/20 before:to-black/60 before:opacity-60 before:transition-opacity before:duration-300 before:pointer-events-none group-hover/featured:before:opacity-40">
                    {featuredItem.image ? (
                      <>
                        <Image
                          src={featuredItem.image}
                          alt={featuredItem.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover/featured:scale-[1.06]"
                          onError={(e) => {
                            (e.currentTarget as any).src = '/images/placeholder-news.jpg';
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>

                        {featuredItem.isLive && (
                          <span className="z-[2] absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-gradient-to-br from-red-500/95 to-red-600/95 px-3 py-1.5 text-white backdrop-blur shadow-[0_2px_8px_rgba(239,68,68,0.4)] font-['Inter'] text-[0.625rem] font-bold uppercase tracking-wider animate-live-pulse">
                            <span className="h-1.5 w-1.5 rounded-full bg-white"></span> LIVE
                          </span>
                        )}

                        {featuredItem.isVideo && (
                          <span className="z-[2] absolute left-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/75 text-white backdrop-blur shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-110 hover:bg-gradient-to-br hover:from-[var(--primary)] hover:to-[var(--accent)]">
                            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        )}

                        {featuredItem.isPhoto && (
                          <span className="z-[2] absolute left-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/75 text-white backdrop-blur shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-110 hover:bg-gradient-to-br hover:from-[var(--primary)] hover:to-[var(--accent)]">
                            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--muted)]">
                        <svg className="h-12 w-12 text-[var(--muted-foreground)]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <h3 className="m-0 px-6 py-5 pb-2 font-['Lora'] text-[1.1rem] font-bold leading-snug tracking-tight text-[#0f172a] transition-colors duration-300 line-clamp-2 md:text-[0.875rem] group-hover/featured:text-[#dc2626]">{featuredItem.title}</h3>

                  <span className="block px-6 pb-4 font-['Inter'] text-[10px] font-black uppercase leading-tight tracking-widest text-[#dc2626]/60 transition-colors duration-300 sm:px-5">
                    {featuredItem.date ? formatDateTime(featuredItem.date) : 'Just now'}
                  </span>
                </div>

                {(categorySection.categoryName === "AWARDS" || section === "awards") && (
                  <div className="flex gap-2 px-6 pb-4 sm:px-5">
                    {featuredItem.targetLink && (
                      <a
                        href={featuredItem.targetLink.startsWith('http') ? featuredItem.targetLink : `https://${featuredItem.targetLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-full border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-center font-['Inter'] text-[0.7rem] font-bold text-[var(--heading-color)] no-underline transition-all duration-300 hover:bg-[var(--nav-hover-bg)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        More Info
                      </a>
                    )}
                    {featuredItem.nominationLink && (
                      <a
                        href={featuredItem.nominationLink.startsWith('http') ? featuredItem.nominationLink : `https://${featuredItem.nominationLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-2 text-center font-['Inter'] text-[0.7rem] font-bold text-white no-underline shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md hover:brightness-110"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Nomination
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col">
                {headlineItems.length > 0 ? (
                  <div className="flex flex-col gap-0 px-6 py-2 pb-3 sm:px-5">
                    {headlineItems.map((item, idx) => (
                      <div
                        key={`${categorySection.categoryName}-${idx}-${item.id}`}
                        className={`group/headline relative flex items-start gap-4 border-b border-[var(--border)] py-4 text-inherit no-underline transition-all duration-300 opacity-0 last:border-none hover:pl-2 before:absolute before:-left-6 before:-right-6 before:top-0 before:bottom-0 before:bg-[var(--nav-hover-bg)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 ${animationEnabled ? 'animate-fade-in-up' : 'opacity-100'}`}
                        style={{
                          cursor: 'pointer',
                          ...(animationEnabled ? { animationDelay: `${(index * 0.1) + ((idx + 1) * 0.05)}s` } : {})
                        }}
                        onClick={() => {
                          const hLink = getItemLink(item, categorySection.categoryName);
                          if (hLink) router.push(hLink);
                        }}
                      >
                        <span className="z-[1] mt-1 h-4 w-[3.5px] shrink-0 rounded-[3px] bg-[#dc2626] opacity-30 transition-all duration-300 group-hover/headline:h-full group-hover/headline:opacity-100 group-hover/headline:shadow-[0_0_8px_rgba(220,38,38,0.5)]"></span>
                        <div className="z-[1] flex flex-1 flex-col gap-1.5">
                          <p className="m-0 font-['Lora'] text-[0.9rem] font-semibold leading-normal tracking-tight text-[#0f172a] transition-colors duration-300 line-clamp-2 md:text-[0.78125rem] group-hover/headline:text-[#dc2626]">{item.title}</p>
                          {item.date && (
                            <span className="font-['Inter'] text-[9px] font-black uppercase tracking-[0.1em] text-[#dc2626]/50 sm:text-[0.5625rem]">{formatDateTime(item.date)}</span>
                          )}
                        </div>

                        {(categorySection.categoryName === "AWARDS" || section === "awards") && (
                          <div className="z-[1] flex gap-1.5 shrink-0 ml-auto">
                            {item.targetLink && (
                              <a
                                href={item.targetLink.startsWith('http') ? item.targetLink : `https://${item.targetLink}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-center font-['Inter'] text-[0.6rem] font-bold text-[var(--heading-color)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Info
                              </a>
                            )}
                            {item.nominationLink && (
                              <a
                                href={item.nominationLink.startsWith('http') ? item.nominationLink : `https://${item.nominationLink}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-orange-500 px-3 py-1 text-center font-['Inter'] text-[0.6rem] font-bold text-white transition-all hover:scale-105"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Nominate
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8 font-['Inter'] text-[0.875rem] italic text-[var(--muted-foreground)]">
                    <p>No additional headlines</p>
                  </div>
                )}
              </div>

              {featuredItem.relatedLinks && featuredItem.relatedLinks.length > 0 && (
                <div className="border-t border-gray-50 bg-gray-50/20 p-5 px-6 sm:px-5">
                  <h4 className="mb-3 font-['Inter'] text-[9px] font-black uppercase tracking-[0.2em] text-[#dc2626]">Related Stories</h4>
                  <ul className="m-0 flex flex-col list-none gap-3 p-0">
                    {featuredItem.relatedLinks.slice(0, 3).map((link, idx) => (
                      <li key={idx} className="group/related flex items-start gap-2 font-['Lora'] text-[13px] leading-snug text-gray-600 cursor-pointer transition-all hover:text-[#dc2626] hover:pl-1">
                        <span className="font-bold text-[#dc2626] transition-transform group-hover/related:translate-x-0.5">→</span>
                        <span className="line-clamp-2">{link}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {showViewMore && (
                <div className="mt-auto border-t border-gray-50 bg-gray-50/30 p-5 px-6 sm:px-5">
                  <Link
                    href={getCategoryLink(categorySection.categoryName)}
                    className="group/btn relative flex w-full items-center justify-between overflow-hidden rounded-full bg-[#0f172a] px-6 py-4 font-['Inter'] text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-500 hover:bg-[#dc2626] hover:-translate-y-1 hover:shadow-[#dc2626]/20"
                  >
                    <span>Explore {categorySection.categoryName}</span>
                    <svg className="h-5 w-5 shrink-0 transition-transform duration-500 group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div >
    </div >
  );
};

export default NewsCards;
