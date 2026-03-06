"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { newsService, NewsItem } from '@/app/services/NewsService';
import { NewsCard } from '@/app/Components/Common/NewsCard/NewsCard';

export default function SearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q') || '';

    const [results, setResults] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const performSearch = useCallback(async (pageNum: number) => {
        if (!query) return;
        setLoading(true);
        try {
            const res = await newsService.searchNews(query, pageNum, 12);
            if (res.success && res.news) {
                setResults(res.news);
                setTotal(res.pagination?.total || 0);
                setTotalPages(res.pagination?.totalPages || 1);
            }
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        setPage(1);
        performSearch(1);
    }, [query, performSearch]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        performSearch(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!query) {
        return (
            <div className="max-w-[1200px] mx-auto my-10 px-5 min-h-[60vh]">
                <div className="text-center py-24 text-[1.2rem] text-gray-600">
                    <h1 className="text-[2rem] text-gray-800 mb-2">Search Results</h1>
                    <p>Enter a keyword to search for news.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto my-10 px-5 min-h-[60vh]">
            <div className="mb-10 border-b-2 border-gray-100 pb-5">
                <h1 className="text-[2rem] text-gray-800 mb-2">Search Results for: <span className="text-[#dc2626]">"{query}"</span></h1>
                <p className="text-gray-600 text-[1.1rem]">{total} articles found</p>
            </div>

            {loading ? (
                <div className="text-center py-24 text-[1.2rem] text-gray-600 animate-pulse">Searching...</div>
            ) : results.length > 0 ? (
                <>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[30px]">
                        {results.map((item) => (
                            <NewsCard key={item.slug} item={item} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-5 mt-[50px] pt-[30px] border-t border-gray-100">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="px-5 py-2.5 border border-gray-200 bg-white rounded-md cursor-pointer transition-all duration-200 hover:not-disabled:bg-gray-100 hover:not-disabled:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="font-medium text-gray-700">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className="px-5 py-2.5 border border-gray-200 bg-white rounded-md cursor-pointer transition-all duration-200 hover:not-disabled:bg-gray-100 hover:not-disabled:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-24 text-[1.2rem] text-gray-600">
                    <p>No results found for your search query.</p>
                    <button onClick={() => router.push('/')} className="mt-5 px-[30px] py-3 bg-[#dc2626] text-white border-none rounded-md cursor-pointer font-semibold hover:bg-[#b91c1c] transition-colors">
                        Back to Home
                    </button>
                </div>
            )}
        </div>
    );
}
