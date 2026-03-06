"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useNewsContext } from '@/app/context/NewsContext';
import { getImageSrc } from '@/Utils/imageUtils';

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

export default function TagPage() {
    const params = useParams();
    const context = useNewsContext();
    const tagSlug = params?.tagSlug as string;

    const tagName = useMemo(() => {
        if (!tagSlug) return '';
        return decodeURIComponent(tagSlug)
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }, [tagSlug]);

    const filteredNews = useMemo(() => {
        if (!tagSlug || !context?.allNews) return [];
        const normTag = normalize(tagSlug);
        return context.allNews.filter((news) => {
            const tags = news.tags || [];
            return tags.some((t) => normalize(t) === normTag);
        });
    }, [tagSlug, context?.allNews]);

    if (!context || context.loading) {
        return (
            <div className="py-16 px-8 text-center animate-pulse">
                <h2 className="text-xl font-semibold text-gray-500">Loading articles...</h2>
            </div>
        );
    }

    if (context.error) {
        return (
            <div className="py-16 px-8 text-center text-red-500">
                <h2 className="text-xl font-bold">Error: {context.error}</h2>
            </div>
        );
    }

    return (
        <div className="min-h-[60vh] py-8 px-4 bg-[var(--background)] transition-colors duration-300">
            <div className="max-w-[1200px] mx-auto">
                <div className="mb-10 border-b-2 border-red-600 pb-6">
                    <span className="text-[0.75rem] font-semibold tracking-widest uppercase text-red-600 block mb-1">Tag</span>
                    <h1 className="text-[2rem] font-extrabold text-gray-900 m-0 mb-2 dark:text-gray-100">#{tagName}</h1>
                    <p className="text-[0.9rem] text-gray-500 m-0">{filteredNews.length} article{filteredNews.length !== 1 ? 's' : ''} found</p>
                </div>

                {filteredNews.length === 0 ? (
                    <div className="text-center py-16 px-8 text-gray-500">
                        <p className="text-lg">No articles found for &ldquo;{tagName}&rdquo;</p>
                        <Link href="/" className="inline-block mt-4 text-red-600 font-semibold no-underline hover:underline">← Go back to Home</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNews.map((news, index) => {
                            const section = news.category?.toLowerCase() || 'india';
                            const subCat = news.subCategory || 'general';
                            const href = news.slug
                                ? `/Pages/${section}/${encodeURIComponent(subCat)}/${encodeURIComponent(news.slug)}`
                                : '#';
                            return (
                                <Link key={news._id || index} href={href} className="group flex flex-col rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-[#1e2533] dark:border-gray-800">
                                    <div className="relative w-full aspect-video overflow-hidden">
                                        <img
                                            src={getImageSrc(news.image || '')}
                                            alt={news.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {news.category && (
                                            <span className="absolute top-2 left-2 bg-red-600 text-white text-[0.7rem] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{news.category}</span>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1">
                                        <p className="text-[0.95rem] font-bold leading-relaxed m-0 mb-2 text-gray-900 line-clamp-3 dark:text-gray-100 transition-colors duration-200 group-hover:text-red-600">{news.title}</p>
                                        {news.summary && (
                                            <p className="text-[0.8rem] text-gray-500 leading-relaxed m-0">{news.summary.slice(0, 100)}...</p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
