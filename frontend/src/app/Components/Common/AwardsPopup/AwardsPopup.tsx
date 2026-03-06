"use client";
import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useNewsContext } from '@/app/context/NewsContext';

const SHOW_INTERVAL_MS = 30 * 60 * 1000;
const FIRST_SHOW_DELAY_MS = 1000;

// Fallback data shown if no awards in DB
const FALLBACK_AWARDS = [
    {
        _id: 'f1',
        title: "Global Healthcare Excellence Awards ,2026 & Summit",
        subtitle: "Recognizing outstanding achievements in India's healthcare sector.",
        badge: "🏥 Healthcare",
        nominateUrl: "https://healthcareawards.primetimemedia.in/nominate",
        articleUrl: "https://healthcareawards.primetimemedia.in/",
    },
    {
        _id: 'f2',
        title: "Global Education Excellence Awards ,2026 & Summit",
        subtitle: "Celebrating visionaries shaping the future of education in India.",
        badge: "🎓 Education",
        nominateUrl: "https://education-awards.primetimemedia.in/nominate",
        articleUrl: "https://education-awards.primetimemedia.in/",
    },
    {
        _id: 'f3',
        title: "UK Busnieiness Leadership Awards ,2026 & Summit",
        subtitle: "Honoring India's most influential business leaders of the year.",
        badge: "💼 Business",
        nominateUrl: "https://business-leadership.primetimemedia.in/nominate",
        articleUrl: "https://business-leadership.primetimemedia.in/",
    },
];

const AwardsPopup: React.FC = () => {
    const pathname = usePathname();
    const { awardsNews } = useNewsContext();
    const [visible, setVisible] = useState(false);
    const [awardIndex, setAwardIndex] = useState(0);
    const indexRef = useRef(0);
    const timerRef = useRef<any>(null);
    const intervalRef = useRef<any>(null);

    const isAdmin = pathname?.startsWith('/Dashboard');

    useEffect(() => {
        if (isAdmin) return;

        // Show first popup
        timerRef.current = setTimeout(() => {
            setAwardIndex(0);
            indexRef.current = 0;
            setVisible(true);

            // Then cycle every 2 mins
            intervalRef.current = setInterval(() => {
                indexRef.current = indexRef.current + 1;
                setAwardIndex(indexRef.current);
                setVisible(true);
            }, SHOW_INTERVAL_MS);
        }, FIRST_SHOW_DELAY_MS);

        return () => {
            clearTimeout(timerRef.current);
            clearInterval(intervalRef.current);
        };
        // Only run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin]);

    if (isAdmin || !visible) return null;

    // Build awards list — use live data if available, else fallback
    const liveAwards = (awardsNews && awardsNews.length > 0) ? awardsNews : null;

    let award: any;
    let nominateUrl: string;
    let articleUrl: string;
    let badgeLabel: string;
    let titleText: string;
    let descText: string;

    if (liveAwards) {
        const idx = awardIndex % liveAwards.length;
        const item = liveAwards[idx] as any;
        articleUrl = item.targetLink
            ? (item.targetLink.startsWith('http') ? item.targetLink : `https://${item.targetLink}`)
            : `https://www.primetimemedia.in/Pages/awards/${item.category}/${item.slug}`;
        nominateUrl = item.nominationLink
            ? (item.nominationLink.startsWith('http') ? item.nominationLink : `https://${item.nominationLink}`)
            : articleUrl;
        badgeLabel = `🏆 ${item.subCategory || item.category || 'Awards'}`;
        titleText = item.title;
        descText = item.subtitle || "Recognizing excellence and leadership in India.";
    } else {
        const idx = awardIndex % FALLBACK_AWARDS.length;
        const fb = FALLBACK_AWARDS[idx];
        nominateUrl = fb.nominateUrl;
        articleUrl = fb.articleUrl;
        badgeLabel = fb.badge;
        titleText = fb.title;
        descText = fb.subtitle;
    }

    const totalCount = liveAwards ? liveAwards.length : FALLBACK_AWARDS.length;
    const currentPos = awardIndex % totalCount;

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/55 backdrop-blur-sm flex items-center justify-center p-5 animate-fade-in"
            onClick={() => setVisible(false)}
        >
            <div
                className="bg-[linear-gradient(150deg,#1a0000_0%,#3a0000_60%,#cc0000_100%)] rounded-[20px] p-9 pt-9 pb-7 max-w-[460px] w-full relative shadow-[0_24px_60px_rgba(0,0,0,0.5)] text-center animate-fade-in-up border-t-[5px] border-[#ffd700] md:p-7 md:pb-[22px]"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    className="absolute top-3.5 right-3.5 bg-white/15 border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-white transition-all duration-200 hover:bg-white/30"
                    onClick={() => setVisible(false)}
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                <span className="inline-block bg-[rgba(255,215,0,0.2)] text-[#ffd700] text-[0.72rem] font-bold px-3 py-[3px] rounded-full mb-3 tracking-[0.5px] uppercase border border-[rgba(255,215,0,0.4)]">
                    {badgeLabel}
                </span>
                <h2 className="text-[1.25rem] font-[900] text-white mb-2.5 leading-[1.3] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] md:text-[1.05rem]">
                    {titleText}
                </h2>
                <p className="text-[0.88rem] text-white/85 leading-[1.6] mb-6">
                    {descText}
                </p>

                <div className="flex gap-3 justify-center flex-wrap mb-5 md:flex-col">
                    <a
                        href={nominateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[linear-gradient(135deg,#cc0000_0%,#e60000_100%)] text-white px-6 py-3 rounded-full font-extrabold text-[0.88rem] no-underline transition-all duration-250 shadow-[0_4px_16px_rgba(204,0,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(204,0,0,0.4)] md:w-full md:justify-center"
                        onClick={() => setVisible(false)}
                    >
                        🏆 Nominate Now
                    </a>
                    <a
                        href={articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-white/10 text-white px-5 py-3 rounded-full font-bold text-[0.88rem] no-underline border-2 border-white/50 transition-all duration-250 hover:bg-white/25 hover:text-white hover:border-white md:w-full md:justify-center"
                        onClick={() => setVisible(false)}
                    >
                        <ExternalLink size={14} /> More Info
                    </a>
                </div>

                <div className="flex justify-center gap-1.5">
                    {Array.from({ length: Math.min(totalCount, 8) }).map((_, i) => (
                        <span
                            key={i}
                            className={`h-[7px] rounded-full bg-white/25 transition-all duration-300 ${i === currentPos % Math.min(totalCount, 8) ? 'bg-[#ffd700] w-[18px] rounded-[4px]' : 'w-[7px]'}`}
                        />
                    ))}
                </div>
                <p className="text-[0.72rem] text-white/50 mt-1.5">
                    {currentPos + 1} of {totalCount}
                </p>
            </div>
        </div>
    );
};

export default AwardsPopup;
