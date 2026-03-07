"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, RotateCcw } from "lucide-react";
import { FaFacebook, FaWhatsapp, FaXTwitter } from "react-icons/fa6";

interface BreakingNewsItem {
    _id: string;
    title: string;
    link?: string;
    source?: string;
    createdAt: string;
}

const BreakingNewsPage = () => {
    const [news, setNews] = useState<BreakingNewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.timecybermedia.com";

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/api/breaking-news`);
            if (response.data.success) {
                setNews(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [API_BASE]);

    const handleScrape = async () => {
        if (!window.confirm("Do you want to scrape real breaking news from live sources?")) return;
        setSeeding(true);
        try {
            const response = await axios.post(`${API_BASE}/api/breaking-news/scrape`);
            if (response.data.success) {
                alert(response.data.message || "Real news scraped! Refreshing...");
                fetchNews();
            }
        } catch (error) {
            alert("Scraping failed: " + (error as any).message);
        } finally {
            setSeeding(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    };

    if (loading) {
        return (
            <div className="max-w-[900px] mx-auto px-5 my-10 min-h-[80vh] bg-white flex items-center justify-center">
                <div className="text-gray-500 font-medium animate-pulse">Updating live headlines...</div>
            </div>
        );
    }

    return (
        <div className="max-w-[900px] mx-auto px-5 my-10 min-h-[80vh] bg-white">
            <header className="mb-10 border-b border-gray-100 pb-5 bg-none shadow-none">
                <div className="flex flex-col gap-4 items-start">
                    <div className="flex items-center gap-1.5 text-[0.9rem] font-medium">
                        <span className="text-gray-500">News</span>
                        <span className="text-gray-300">/</span>
                        <span className="bg-[#cc0000] text-white px-2 py-0.5 rounded-sm text-[0.85rem] font-bold">Breaking News</span>
                    </div>
                    <div className="flex items-center justify-between w-full gap-4">
                        <h1 className="m-0 text-2xl font-extrabold text-gray-900 flex items-center gap-2.5 shadow-none">
                            News Flash {formatDate(new Date().toISOString())}
                            <RotateCcw
                                size={20}
                                className="text-[#cc0000] cursor-pointer transition-transform duration-300 hover:rotate-[-180deg]"
                                onClick={() => fetchNews()}
                            />
                        </h1>
                        <button
                            className="bg-[#e10000] text-white border-none px-4 py-2 rounded font-bold cursor-pointer text-[0.9rem] transition-all duration-200 uppercase tracking-wider hover:not-disabled:bg-[#cc0000] hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_4px_12px_rgba(225,0,0,0.2)] active:translate-y-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            onClick={handleScrape}
                            disabled={seeding}
                        >
                            {seeding ? "Loading..." : "Latest News"}
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-col">
                {news.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                        <AlertCircle size={48} />
                        <p className="text-lg font-medium">No breaking news at the moment. Check back later!</p>
                    </div>
                ) : (
                    news.map((item, index) => (
                        <div key={item._id} className={`group flex gap-8 items-center py-8 border-b border-gray-100 bg-none shadow-none rounded-none border-l-0 transition-colors duration-200 last:border-b-0 hover:border-gray-100 md:gap-2.5 md:flex-wrap md:py-5 ${index === 0 ? 'flex-col items-start pb-10 gap-4' : ''}`}>
                            {index !== 0 && (
                                <div className="min-w-[100px] border-r-0 pr-0 block md:order-1">
                                    <span className="text-[1.25rem] font-bold text-gray-900">{formatTime(item.createdAt)}</span>
                                </div>
                            )}
                            <div className={`flex-1 md:order-3 md:w-full md:flex-none ${index === 0 ? 'order-1' : ''}`}>
                                {item.source && <span className="inline-block bg-gray-100 text-gray-600 px-2 py-0.5 text-xs font-bold uppercase mb-2 rounded-sm">{item.source}</span>}
                                <h2 className={`m-0 text-2xl font-semibold text-gray-900 leading-relaxed transition-colors duration-300 group-hover:text-[#cc0000] ${index === 0 ? '!text-[2.8rem] !font-black !text-black tracking-tight leading-tight md:!text-[1.75rem]' : ''}`}>{item.title}</h2>
                            </div>
                            <div className={`flex gap-5 opacity-80 transition-opacity duration-200 hover:opacity-100 group-hover:opacity-100 md:order-2 md:ml-auto md:opacity-100 ${index === 0 ? 'order-2 mt-2.5' : ''}`}>
                                <button
                                    onClick={() => {
                                        const url = window.location.href;
                                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(item.title)}`, '_blank');
                                    }}
                                    className="bg-none border-none p-0 cursor-pointer flex items-center justify-center w-auto h-auto rounded-none transition-transform duration-200 hover:scale-110 text-[#1877F2]"
                                    title="Share on Facebook"
                                >
                                    <FaFacebook size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        const url = window.location.href;
                                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title)}&url=${encodeURIComponent(url)}`, '_blank');
                                    }}
                                    className="bg-none border-none p-0 cursor-pointer flex items-center justify-center w-auto h-auto rounded-none transition-transform duration-200 hover:scale-110 text-black"
                                    title="Share on X (Twitter)"
                                >
                                    <FaXTwitter size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        const url = window.location.href;
                                        window.open(`https://wa.me/?text=${encodeURIComponent(item.title + " " + url)}`, '_blank');
                                    }}
                                    className="bg-none border-none p-0 cursor-pointer flex items-center justify-center w-auto h-auto rounded-none transition-transform duration-200 hover:scale-110 text-[#25D366]"
                                    title="Share on WhatsApp"
                                >
                                    <FaWhatsapp size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BreakingNewsPage;
