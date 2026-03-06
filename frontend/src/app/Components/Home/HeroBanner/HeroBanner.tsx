"use client";

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useNewsContext } from '@/app/context/NewsContext';
import { formatDateTime, calculateReadingTime } from '@/Utils/Utils';
import { ChevronRight, Clock, TrendingUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroBanner: React.FC = () => {
    const { allNews, loading } = useNewsContext();
    const [activeIndex, setActiveIndex] = useState(0);

    const getImageSrc = (img?: string): string => {
        if (!img) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80';
        if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/')) return img;
        return `/uploads/${img}`;
    };

    const heroData = useMemo(() => {
        if (!allNews || allNews.length === 0) return { featuredList: [], trending: [] };

        const sorted = [...allNews].sort((a, b) => {
            const dateA = new Date(a.publishedAt || a.date || a.createdAt || 0).getTime();
            const dateB = new Date(b.publishedAt || b.date || b.createdAt || 0).getTime();
            return dateB - dateA;
        });

        return {
            featuredList: sorted.slice(0, 5),
            trending: sorted.slice(5, 9)
        };
    }, [allNews]);

    useEffect(() => {
        if (heroData.featuredList.length <= 1) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % heroData.featuredList.length);
        }, 120000); // 2 minutes

        return () => clearInterval(interval);
    }, [heroData.featuredList.length]);

    if (loading || heroData.featuredList.length === 0) {
        return (
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 animate-pulse">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
                    <div className="lg:col-span-8 bg-gray-100 rounded-3xl" />
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <div className="flex-1 bg-gray-100 rounded-2xl" />
                        <div className="flex-1 bg-gray-100 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    // Ensure we don't go out of bounds if the data changes
    const safeIndex = activeIndex >= heroData.featuredList.length ? 0 : activeIndex;
    const featured = heroData.featuredList[safeIndex];
    const { trending } = heroData;

    const getHref = (item: any) => {
        const section = item.category?.toLowerCase() || 'news';
        const sub = item.subCategory?.toLowerCase() || 'general';
        return `/Pages/${section}/${sub}/${item.slug}`;
    };

    return (
        <section className="max-w-[1440px] mx-auto px-4 lg:px-8 pt-2 pb-8 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[700px]">

                {/* Main Featured Card (Left) with Auto-Rotation */}
                <div className="lg:col-span-8 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={featured.slug}
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="h-full"
                        >
                            <Link
                                href={getHref(featured)}
                                className="block relative h-[450px] lg:h-full overflow-hidden rounded-[40px] shadow-2xl bg-[#0f172a] border border-white/10"
                            >
                                <img
                                    src={getImageSrc(featured.image)}
                                    alt={featured.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] cubic-bezier(0.4, 0, 0.2, 1) group-hover:scale-110 opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />

                                <div className="absolute bottom-0 left-0 p-8 lg:p-16 w-full z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="px-5 py-2 bg-[#dc2626] text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(220,38,38,0.3)] border border-white/10">
                                            {featured.category || 'Featured'}
                                        </span>
                                        <span className="flex items-center gap-2 text-white/90 text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
                                            <Clock size={14} className="text-[#dc2626]" />
                                            {calculateReadingTime(featured.content || featured.title)}
                                        </span>
                                    </div>

                                    <h1 className="font-['Lora',serif] text-[clamp(1.8rem,4.5vw,3.5rem)] font-bold text-white leading-[1.1] mb-8 tracking-tight drop-shadow-2xl transition-all duration-500 group-hover:text-red-50 line-clamp-3">
                                        {featured.title}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-8 text-white/60 text-[11px] font-bold uppercase tracking-[0.2em]">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-[#dc2626]" />
                                            <span>
                                                {formatDateTime(featured.publishedAt || featured.date || featured.createdAt || '')}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-1.5 bg-[#dc2626] rounded-full" />
                                        <div className="flex items-center gap-2 group/btn cursor-pointer">
                                            <span className="text-white group-hover:text-[#dc2626] transition-colors">Read Full Story</span>
                                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#dc2626] group-hover:bg-[#dc2626] transition-all duration-300">
                                                <ChevronRight size={18} className="text-white group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </AnimatePresence>

                    <div className="absolute top-8 right-8 flex gap-2 z-20">
                        {heroData.featuredList.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === safeIndex ? 'w-8 bg-[#dc2626]' : 'w-2 bg-white/30'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={20} className="text-[#dc2626]" />
                        <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-gray-400">Trending Now</h2>
                    </div>
                    {trending.map((item: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + (idx * 0.1) }}
                            className="flex-1"
                        >
                            <Link
                                href={getHref(item)}
                                className="group h-full relative overflow-hidden rounded-[24px] bg-white border border-gray-200 p-4 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#dc2626]/30 flex gap-5"
                            >
                                <div className="relative w-32 h-full lg:w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-50">
                                    <img
                                        src={getImageSrc(item.image)}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="flex flex-col justify-center flex-1 py-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[9px] font-black text-[#dc2626] uppercase tracking-[0.2em]">
                                            {item.category || 'Latest'}
                                        </span>
                                    </div>
                                    <h3 className="font-['Lora',serif] text-[15px] lg:text-[16px] font-bold text-gray-900 leading-[1.3] line-clamp-2 group-hover:text-[#dc2626] transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                            {formatDateTime(item.publishedAt || item.date || item.createdAt || '')}
                                        </span>
                                        <ChevronRight size={14} className="text-gray-300 group-hover:text-[#dc2626] transition-all transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;
