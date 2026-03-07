"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useNewsContext } from '@/app/context/NewsContext';
import { useInfiniteNews } from '@/app/hooks/NewsApi';
import LatestNewsSection from '@/app/Components/Common/LatestNewsSection/LatestNewsSection';
import MoreFromSection from '@/app/Components/Common/MoreFromSection/MoreFromSection';
import NewsSection from '@/app/Components/Common/NewsSection/NewsSection';
import { PhotosSection } from '@/app/Components/Common/PhotosSection/Photos';
import { VideosSection } from '@/app/Components/Common/VideosSection/VideosSection';
import SocialShare from '@/app/Components/Common/SocialShare/SocialShare';

interface WorldSubPageProps {
    category: string;
    subCategory: string;
}

export default function WorldSubPage({ category, subCategory }: WorldSubPageProps) {
    const context = useNewsContext();
    const [currentUrl, setCurrentUrl] = useState<string>('');

    const normalize = (str: string | undefined) =>
        str
            ? decodeURIComponent(str)
                .toLowerCase()
                .replace(/&/g, 'and')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
                .trim()
            : '';

    const cleanDisplay = (text: string | undefined): string => {
        if (!text) return '';
        return decodeURIComponent(text)
            .replace(/%26/g, '&')
            .replace(/%20/g, ' ')
            .replace(/%2B/g, '+')
            .replace(/&amp;/g, '&')
            .trim();
    };

    const toTitleCase = (str: string) =>
        str
            .split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

    const pageTitle = toTitleCase(cleanDisplay(category));
    const subPageTitle = toTitleCase(cleanDisplay(subCategory));

    const urlSection = decodeURIComponent(category || '').toLowerCase();

    // Infinite Scroll Logic
    const {
        items: infiniteNews,
        loading: infiniteLoading,
        hasMore,
        fetchNextPage,
        hasDataChecked,
        isInitialLoading
    } = useInfiniteNews(urlSection || '', [], 20);

    // Filter for our specific subcategory
    const subFilteredNews = useMemo(() => {
        const normCategory = normalize(category);
        const normSubCategory = normalize(subCategory);

        return infiniteNews.filter((news) => {
            const newsCat = normalize(news.category);
            const newsSub = normalize(news.subCategory);
            return newsCat === normCategory && newsSub === normSubCategory;
        });
    }, [infiniteNews, category, subCategory]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (infiniteLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [infiniteLoading, hasMore, fetchNextPage]);

    useEffect(() => {
        if (!infiniteLoading && hasMore && subFilteredNews.length < 6 && infiniteNews.length > 0) {
            const timer = setTimeout(() => {
                fetchNextPage();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [subFilteredNews.length, infiniteLoading, hasMore, fetchNextPage, infiniteNews.length]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []);

    const trendingNews = useMemo(() => subFilteredNews.filter(news => news.isTrending === true), [subFilteredNews]);

    const topTags = useMemo(() => {
        const tagCount: Record<string, number> = {};
        subFilteredNews.forEach((news) => {
            const tags = (news as any).tags as string[] | undefined;
            if (Array.isArray(tags)) {
                tags.forEach((tag) => {
                    if (tag && tag.trim()) {
                        const t = tag.trim();
                        tagCount[t] = (tagCount[t] || 0) + 1;
                    }
                });
            }
        });
        return Object.entries(tagCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tag]) => tag);
    }, [subFilteredNews]);

    const transformedNews = subFilteredNews.map((news, index) => ({
        id: (news as any)._id || news.slug || `news-${index}`,
        image: news.image || '',
        title: news.title,
        slug: news.slug,
        category: news.category,
        subCategory: cleanDisplay(news.subCategory) || '',
        content: (news as any).content || '',
        date: news.publishedAt || news.date || (news as any).createdAt,
        isTrending: (news as any).isTrending || false,
        targetLink: (news as any).targetLink,
        nominationLink: (news as any).nominationLink
    }));

    if (!context) return <div className="p-20 text-center"><h2>Context not available</h2></div>;

    if (isInitialLoading) {
        return (
            <div className="p-20 text-center flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <h2 className="text-xl font-bold">Searching in {pageTitle}...</h2>
                <p className="text-gray-500">Retrieving the latest news for {subPageTitle}.</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />

            {/* Hero / Featured section if there's news */}
            {transformedNews.length > 0 && (
                <section className="max-w-[1400px] mx-auto px-4 md:px-8 pt-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-10 h-[2px] bg-[#dc2626]"></span>
                        <span className="text-[#dc2626] font-black text-[12px] uppercase tracking-[0.3em]">{pageTitle} Special</span>
                    </div>
                    <h1 className="font-['Lora',serif] font-bold text-[clamp(2.5rem,5vw,4rem)] text-black mb-12 tracking-tighter leading-tight">
                        {subPageTitle} <span className="text-gray-300">Digest</span>
                    </h1>
                </section>
            )}

            <NewsSection
                sectionTitle={`${subPageTitle} Headlines`}
                subCategories={topTags}
                mainNews={transformedNews}
                topNews={trendingNews.slice(0, 5).map((news, index) => ({
                    id: (news as any)._id || news.slug || `trending-${index}`,
                    title: news.title,
                    image: news.image || '',
                    slug: news.slug,
                    subCategory: cleanDisplay(news.subCategory)
                }))}
                showSidebar={true}
                gridColumns={3}
            />

            <div ref={lastElementRef} className="py-10 text-center flex flex-col items-center justify-center">
                {infiniteLoading && (
                    <div className="flex items-center gap-2 text-primary">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Searching for more {subPageTitle} news...
                    </div>
                )}
                {!hasMore && subFilteredNews.length > 0 && (
                    <p className="text-gray-500 italic">No more stories in this subcategory.</p>
                )}
            </div>

            <SocialShare
                url={currentUrl || `https://www.timecybermedia.com/Pages/${category.toLowerCase()}/${subCategory.toLowerCase()}`}
                title={`${subPageTitle} - ${pageTitle} | Latest News`}
                description={`Explore the latest ${subPageTitle} news from ${pageTitle} section.`}
                image={subFilteredNews[0]?.image || ''}
                isArticle={false}
            />

            <div className="bg-gray-50/50 py-16">
                <LatestNewsSection
                    sectionTitle={`Latest ${subPageTitle} News`}
                    showReadMore={true}
                    readMoreLink={`/Pages/${category.toLowerCase()}/${subCategory.toLowerCase()}`}
                    columns={3}
                />
            </div>

            <VideosSection />

            <div className="bg-white py-16">
                <MoreFromSection
                    sectionTitle={`More From ${pageTitle}`}
                    overrideSection={category.toLowerCase() as any}
                    columns={2}
                    limit={8}
                />
            </div>
        </div>
    );
}
