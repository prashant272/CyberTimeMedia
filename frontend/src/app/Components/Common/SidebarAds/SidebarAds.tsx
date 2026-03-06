'use client';

import React, { useState, useEffect } from 'react';
import { useActiveAds } from '@/app/hooks/useAds';

interface SidebarAdsProps {
    count?: number;
}

const SidebarAds: React.FC<SidebarAdsProps> = ({ count = 5 }) => {
    const { data: ads, loading: adsLoading } = useActiveAds();
    const sidebarAds = (ads || []).filter(ad => ad.isActive && (ad.sidebarImageUrl || ad.placement === 'sidebar'));

    const [adIndices, setAdIndices] = useState<number[]>(Array(count).fill(0).map((_, i) => i));

    useEffect(() => {
        if (sidebarAds.length <= 1) return;

        const interval = setInterval(() => {
            setAdIndices(prev => prev.map(idx => (idx + 1) % sidebarAds.length));
        }, 5000 + Math.random() * 2000);

        return () => clearInterval(interval);
    }, [sidebarAds.length]);

    const renderAd = (containerIndex: number) => {
        if (adsLoading) {
            return (
                <div className="w-full min-h-[150px] bg-[var(--nav-hover-bg)] border-2 border-dashed border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--muted-foreground)] font-['Inter',sans-serif] text-sm">
                    <span>Loading advertisement...</span>
                </div>
            );
        }

        if (sidebarAds.length === 0) {
            return (
                <div className="w-full min-h-[150px] bg-[var(--nav-hover-bg)] border-2 border-dashed border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--muted-foreground)] font-['Inter',sans-serif] text-sm animate-in-slide-up">
                    <div className="flex flex-col items-center gap-1">
                        <span className="font-bold tracking-wider">AD SPACE</span>
                        <small className="text-[0.7rem] opacity-70">Sidebar Ad Position {containerIndex + 1}</small>
                    </div>
                </div>
            );
        }

        const currentAdIndex = adIndices[containerIndex] % sidebarAds.length;
        const currentAd = sidebarAds[currentAdIndex];

        return (
            <div className="group relative w-full rounded-xl overflow-hidden border border-[var(--border)] bg-transparent leading-none transition-transform duration-300 animate-slide-up hover:scale-105" key={currentAdIndex}>
                <a
                    href={currentAd.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block leading-none"
                >
                    <img
                        src={currentAd.sidebarImageUrl || currentAd.imageUrl}
                        alt={currentAd.title || "Advertisement"}
                        className="w-full h-auto block object-contain"
                        loading="lazy"
                    />
                </a>
            </div>
        );
    };

    return (
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] shadow-[var(--shadow-color)] p-8 mb-8 w-full">
            <span className="font-['Inter',sans-serif] font-semibold text-[12px] tracking-widest uppercase text-gray-400 block text-center mb-5">ADVERTISEMENT</span>
            <div className="flex flex-col gap-6 w-full">
                {Array.from({ length: count }).map((_, i) => (
                    <React.Fragment key={i}>
                        {renderAd(i)}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default SidebarAds;
