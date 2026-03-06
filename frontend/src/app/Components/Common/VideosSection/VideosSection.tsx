"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveAds, Ad } from '@/app/hooks/useAds';
import {
  Play as LucidePlay,
  Calendar as LucideCalendar,
  ExternalLink as LucideExternalLink,
  Youtube as LucideYoutube,
  TrendingUp as LucideTrendingUp
} from 'lucide-react';

const categories = [
  'All', 'Awards', 'Excellence', 'Leadership', 'Healthcare', 'Education',
  'Business', 'Innovation', 'Events'
];

const videoData = [
  {
    id: '1',
    category: 'Leadership',
    title: "gets recognised at the India Brand Icon Awards, 2022  | TIME CYBERMEDIA Media",
    videoUrl: 'https://www.youtube.com/watch?v=Pcd6M9kxZT8&t=1s',
    image: 'https://img.youtube.com/vi/Pcd6M9kxZT8/maxresdefault.jpg',
    tag: 'India Brand Icon Awards',
    date: 'Jan 23, 2026'
  },
  {
    id: '2',
    category: 'Healthcare',
    title: "Healthcare Excellence Homeopathy of the Year 24-25",
    videoUrl: 'https://www.youtube.com/watch?v=ud3nEkSLVcI&t=2s',
    image: 'https://img.youtube.com/vi/ud3nEkSLVcI/maxresdefault.jpg',
    tag: 'India Brand Icon Awards',
    date: 'Jan 22, 2026'
  },
  {
    id: '3',
    category: 'Excellence',
    title: "Fighter Wings | India Excellence Award 2025 | TIME CYBERMEDIA Media",
    videoUrl: 'https://www.youtube.com/watch?v=6-rT2tInJEU&list=PLDcK2rcehryaRGEWEo0Se1WWi_YoB4Ifb&index=8',
    image: 'https://img.youtube.com/vi/6-rT2tInJEU/maxresdefault.jpg',
    tag: 'INDIA EXCELLENCE',
    date: 'Jan 23, 2026'
  },
  {
    id: '4',
    category: 'Education',
    title: "SEF's Suryadatta International Institute of Cyber Security honour in International Education Awards 2022",
    videoUrl: 'https://www.youtube.com/watch?v=PPTIQbXmU4U&list=PLDcK2rcehryaRGEWEo0Se1WWi_YoB4Ifb&index=9',
    image: 'https://img.youtube.com/vi/PPTIQbXmU4U/maxresdefault.jpg',
    tag: 'International Education Awards',
    date: '2022'
  },
  {
    id: '5',
    category: 'Education',
    title: "Subhash Bose Institute of Hotel recognized at the International Education Awards, 2022 in Mumbai",
    videoUrl: 'https://www.youtube.com/watch?v=lakjTXAQ0F0&list=PLDcK2rcehryaRGEWEo0Se1WWi_YoB4Ifb&index=12',
    image: 'https://img.youtube.com/vi/lakjTXAQ0F0/maxresdefault.jpg',
    tag: 'International Education Awards',
    date: '2022'
  },
  {
    id: '6',
    category: 'Education',
    title: "Bimla International Public School in International Education Awards By Time Cyber Media",
    videoUrl: 'https://www.youtube.com/shorts/y7ML7GLCWwI',
    image: 'https://img.youtube.com/vi/y7ML7GLCWwI/maxresdefault.jpg',
    tag: 'International Education Awards',
    date: '2022'
  },
  {
    id: '7',
    category: 'Healthcare',
    title: "Dr. Tapas sar gets recognised in International Healthcare Awards By Time Cyber Media",
    videoUrl: 'https://www.youtube.com/shorts/SuaFg_ac4Ws',
    image: 'https://img.youtube.com/vi/SuaFg_ac4Ws/maxresdefault.jpg',
    tag: 'International Healthcare Awards',
    date: '2023'
  },
  {
    id: '8',
    category: 'Awards',
    title: "Mr. Rahul Gujral at 'India Brand Icon Awards 2023' organised by TIME CyberMedia Pvt. Ltd.",
    videoUrl: 'https://www.youtube.com/watch?v=ah3wbynAqYs',
    image: 'https://img.youtube.com/vi/ah3wbynAqYs/maxresdefault.jpg',
    tag: 'India Brand Icon Awards',
    date: '2023'
  },
  {
    id: '9',
    category: 'Awards',
    title: "International Healthcare Awards TIME CyberMedia Pvt. Ltd.",
    videoUrl: 'https://www.youtube.com/shorts/f1hCBiFFKCU',
    image: 'https://img.youtube.com/vi/f1hCBiFFKCU/maxresdefault.jpg',
    tag: 'International Healthcare Awards',
    date: '2017'
  }
];

export const VideosSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const { data: ads, loading: adsLoading } = useActiveAds();

  // Filter for ads that have a sidebar image or are explicitly placed in the sidebar
  const activeAds = useMemo(() => {
    const allActive = (ads || []).filter((ad: Ad) => ad.isActive);
    const sidebarSpecific = allActive.filter((ad: Ad) => ad.sidebarImageUrl || ad.placement === 'sidebar');
    // Fallback to all active ads if no sidebar specific ads are found
    return sidebarSpecific.length > 0 ? sidebarSpecific : allActive;
  }, [ads]);

  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const filteredVideos = useMemo(() => {
    if (activeTab === 'All') return videoData;
    return videoData.filter(v => v.category === activeTab || v.tag.includes(activeTab.toUpperCase()));
  }, [activeTab]);

  useEffect(() => {
    if (activeAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % activeAds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeAds.length]);

  return (
    <section id="videos" className="relative bg-white py-24 overflow-hidden border-t border-gray-100 scroll-mt-20 px-4 md:px-0">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#dc2626]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-[2px] bg-[#dc2626]" />
              <span className="text-[#dc2626] font-black uppercase tracking-[0.3em] text-[12px]">Video Gallery</span>
            </div>
            <h2 className="font-['Lora',serif] text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#0f172a] leading-[1.1] tracking-tight">
              Excellence in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dc2626] to-red-600 italic">Motion</span>
            </h2>
          </div>

          <a
            href="https://www.youtube.com/@primetimermedia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-gray-50 border border-gray-100 rounded-full text-[#0f172a] font-bold text-[14px] uppercase tracking-widest hover:bg-[#dc2626] hover:border-[#dc2626] hover:text-white transition-all duration-500 group shadow-sm cursor-pointer active:scale-95"
          >
            <LucideYoutube size={18} className="text-[#dc2626] group-hover:text-white transition-colors" />
            Explore Channel
          </a>
        </div>

        <div className="mb-12 overflow-x-auto no-scrollbar py-4 -mx-4 px-4">
          <div className="flex items-center gap-3 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-8 py-3 rounded-full font-bold text-[13px] uppercase tracking-widest transition-all duration-500 border cursor-pointer active:scale-95 ${activeTab === cat
                  ? 'bg-[#dc2626] border-[#dc2626] text-white shadow-[0_10px_20px_rgba(220,38,38,0.2)]'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-[#dc2626] hover:text-[#dc2626]'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode='popLayout'>
                {filteredVideos.map((video, idx) => (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block relative bg-white border border-gray-100 rounded-[32px] overflow-hidden transition-all duration-700 hover:border-[#dc2626]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] shadow-sm cursor-pointer active:scale-[0.98]"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={video.image}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 group-hover:rotate-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = video.image.replace('maxresdefault', 'hqdefault');
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 transition-all duration-500 group-hover:bg-[#dc2626] group-hover:border-[#dc2626] group-hover:scale-110 shadow-2xl">
                            <LucidePlay fill="currentColor" size={24} className="text-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-[#dc2626] text-white font-black text-[9px] uppercase tracking-widest rounded-full shadow-lg">
                            {video.tag}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[#dc2626] font-black text-[10px] uppercase tracking-widest">
                            {video.category}
                          </span>
                          <div className="h-1 w-1 bg-gray-200 rounded-full" />
                          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                            <LucideCalendar size={12} className="text-gray-300" />
                            {video.date}
                          </div>
                        </div>
                        <h3 className="font-['Lora',serif] text-[18px] font-bold text-[#0f172a] leading-snug line-clamp-2 group-hover:text-[#dc2626] transition-colors">
                          {video.title}
                        </h3>
                        <div className="mt-5 flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] group-hover:text-[#dc2626] transition-colors">
                          <span>Watch on YouTube</span>
                          <LucideExternalLink size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <aside className="lg:col-span-3 sticky top-24">
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 lg:p-8 relative overflow-hidden group shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <LucideTrendingUp size={16} className="text-[#dc2626]" />
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Spotlight</span>
              </div>

              {adsLoading ? (
                <div className="aspect-[4/5] bg-gray-50 rounded-2xl animate-pulse border border-gray-100" />
              ) : activeAds.length > 0 ? (
                <div className="space-y-6">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gray-100 bg-[#f8fafc] flex items-center justify-center p-2 group/ad">
                    <a href={activeAds[currentAdIndex].link} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
                      <img
                        src={activeAds[currentAdIndex].sidebarImageUrl || activeAds[currentAdIndex].imageUrl || activeAds[currentAdIndex].headerImageUrl}
                        alt="Ad"
                        className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover/ad:scale-110"
                      />
                    </a>
                  </div>
                  <div className="text-center">
                    <h4 className="text-[#0f172a] font-bold text-[14px] mb-2">{activeAds[currentAdIndex].title || 'Excellence Highlight'}</h4>
                    <p className="text-gray-500 text-[11px] leading-relaxed mb-6 italic">Featured leadership highlights from across India.</p>
                    <button className="w-full py-3 bg-[#0f172a] text-white font-black text-[12px] uppercase tracking-widest rounded-full hover:bg-[#dc2626] transition-all transform hover:-translate-y-1 shadow-md cursor-pointer active:scale-95">
                      Learn More
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/5] bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-dashed border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                    <LucidePlay size={20} className="text-[#dc2626]" />
                  </div>
                  <span className="text-[#0f172a] font-black text-[12px] uppercase tracking-widest leading-tight">Featured Partner Spot</span>
                  <p className="text-gray-400 text-[10px] mt-2">Promote your brand here</p>
                </div>
              )}

              <div className="absolute top-0 right-0 p-4 opacity-5">
                <div className="grid grid-cols-4 gap-1">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-black rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="-mt-10 flex flex-col items-center">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#dc2626] to-transparent mb-8" />
          <a
            href="https://www.youtube.com/@primetimermedia"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-12 py-5 bg-[#0f172a] text-white font-black text-base uppercase tracking-[0.2em] rounded-full overflow-hidden hover:bg-[#dc2626] transition-all duration-500 shadow-xl hover:shadow-[#dc2626]/40 flex items-center gap-4 cursor-pointer"
          >
            <span>All Recordings</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <LucidePlay size={14} className="ml-0.5" />
            </div>
          </a>
          <p className="mt-8 text-gray-400 text-[11px] font-bold uppercase tracking-[0.3em]">Updates Every Sunday @ 10:00 AM</p>
        </div>
      </div>
    </section>
  );
};

export default VideosSection;