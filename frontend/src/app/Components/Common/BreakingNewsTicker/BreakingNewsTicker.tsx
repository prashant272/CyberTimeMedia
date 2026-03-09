"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface BreakingNewsItem {
    _id: string;
    title: string;
    link?: string;
    source?: string;
    createdAt: string;
    scheduledAt?: string;
}

const BreakingNewsTicker: React.FC = () => {
    const router = useRouter();
    const [news, setNews] = useState<BreakingNewsItem[]>([]);
    const [liveScores, setLiveScores] = useState<any>({ live: [], upcoming: [], recent: [] });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.timecybermedia.com";

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/breaking-news`);
                if (response.data.success) {
                    setNews(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch breaking news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
        const refreshInterval = setInterval(fetchNews, 600000);

        // SSE for Live Scores
        const eventSource = new EventSource(`${API_BASE}/api/live/live-stream`);
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setLiveScores(data || { live: [], upcoming: [], recent: [] });
            } catch (err) {
                console.error("SSE Parse Error", err);
            }
        };

        return () => {
            clearInterval(refreshInterval);
            eventSource.close();
        };
    }, [API_BASE]);

    // Combine for rotation: Live scores first
    const combinedItems = [
        ...(liveScores.live || []).map((m: any) => ({ _id: m.id, title: `${m.name}: ${m.status}`, isLive: true })),
        ...news
    ];

    useEffect(() => {
        if (combinedItems.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % combinedItems.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [combinedItems.length]);

    if (loading || (news.length === 0 && (!liveScores.live || liveScores.live.length === 0))) return null;


    const currentItem = combinedItems[currentIndex % combinedItems.length] as any;

    if (!currentItem) return null;

    return (
        <div className="w-full mt-1 mb-2 flex justify-center items-center z-[99]">
            <div
                className="bg-[#e10000] text-white h-9 sm:h-10 flex items-center rounded-full px-[10px] sm:px-[15px] w-[96%] max-w-[1200px] cursor-pointer shadow-md relative overflow-hidden group"
                onClick={() => router.push(currentItem.isLive ? "/sports/live" : "/breaking-news")}
            >
                <div className="flex items-center gap-1.5 sm:gap-[15px] font-black text-xs sm:text-base whitespace-nowrap pl-1 sm:pl-[15px] pr-2 sm:pr-[50px] tracking-widest sm:tracking-[3px] uppercase text-white font-['Georgia','Times_New_Roman',serif] italic shrink-0">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-[#f8f8f6] rounded-full animate-live-pulse shadow-[0_0_5px_rgba(255,255,255,0.8)]"></span>
                    <span className="hidden sm:inline">{currentItem.isLive ? "LIVE SCORE" : "BREAKING NEWS"}</span>
                    <span className="inline sm:hidden">{currentItem.isLive ? "LIVE" : "BREAKING"}</span>
                </div>
                <div className="w-px h-[14px] sm:h-[18px] bg-white/40 mr-2 sm:mr-[15px] shrink-0"></div>
                <div className="flex-1 flex items-center h-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentItem._id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-xs sm:text-[0.95rem] font-medium text-white whitespace-nowrap block w-full text-left overflow-hidden text-ellipsis pr-6 sm:pr-10 font-['Georgia','Times_New_Roman',serif] italic tracking-[0.2px] sm:tracking-[0.3px]"
                        >
                            {currentItem.isLive && <span className="text-[#f8f8f6] font-black mr-1 sm:mr-2">[LIVE]</span>}
                            {currentItem.scheduledAt && (
                                <span className="text-[#f8f8f6] font-bold mr-2 opacity-90">
                                    [{new Date(currentItem.scheduledAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })}]
                                </span>
                            )}
                            {currentItem.title}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <button
                    className="bg-transparent border-none text-white text-[1rem] sm:text-[1.1rem] cursor-pointer p-0.5 sm:p-1 flex items-center justify-center opacity-70 sm:opacity-80 absolute right-[10px] sm:right-[15px] top-1/2 -translate-y-1/2 transition-opacity duration-200 hover:opacity-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        const wrapper = e.currentTarget.closest('div.w-full');
                        if (wrapper) (wrapper as HTMLElement).style.display = 'none';
                    }}
                >
                    ✕
                </button>
            </div>
        </div>
    );
};


export default BreakingNewsTicker;
