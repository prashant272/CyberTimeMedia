"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useNewsContext } from '@/app/context/NewsContext';
import { formatDateTime } from '@/Utils/Utils';
import {
    TrendingUp,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    ChevronRight,
    BarChart3
} from 'lucide-react';

const SidebarWidgets: React.FC = () => {
    const { allNews } = useNewsContext();
    const [email, setEmail] = useState('');
    const [voted, setVoted] = useState(false);

    const trendingItems = (allNews || [])
        .filter(item => item.isTrending)
        .slice(0, 5);

    const mostReadItems = (allNews || [])
        .slice(5, 10); // Mocking most read with offset

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            alert('Subscribed successfully!');
            setEmail('');
        }
    };

    return (
        <div className="flex flex-col gap-8">

            {/* Trending Now Widget */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                        <TrendingUp size={20} />
                    </div>
                    <h2 className="font-['Lora',serif] font-bold text-xl text-gray-900 tracking-tight">Trending Now</h2>
                </div>

                <div className="flex flex-col gap-4">
                    {trendingItems.map((item, idx) => (
                        <Link
                            key={idx}
                            href={`/Pages/${item.category?.toLowerCase() || 'news'}/general/${item.slug}`}
                            className="flex gap-4 group cursor-pointer"
                        >
                            <span className="text-2xl font-black text-gray-100 group-hover:text-blue-600 transition-colors shrink-0 tabular-nums">
                                {String(idx + 1).padStart(2, '0')}
                            </span>
                            <div className="flex flex-col gap-1">
                                <h3 className="font-['Inter',sans-serif] font-semibold text-sm text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {item.category || 'Trending'}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Newsletter Widget */}
            <div className="bg-blue-600 rounded-[24px] p-6 text-white shadow-xl shadow-blue-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Mail size={20} />
                    </div>
                    <h2 className="font-['Lora',serif] font-bold text-xl tracking-tight">Stay Updated</h2>
                </div>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                    Get the latest news and trending stories delivered straight to your inbox every morning.
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:bg-white/20 transition-all font-medium text-sm"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 active:scale-95 transition-all shadow-lg shadow-blue-900/20"
                    >
                        Subscribe Now
                    </button>
                </form>
            </div>

            {/* Poll Widget (Mock) */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <BarChart3 size={20} />
                    </div>
                    <h2 className="font-['Lora',serif] font-bold text-xl text-gray-900 tracking-tight">Reader Poll</h2>
                </div>
                <p className="text-gray-900 font-bold text-sm mb-6 leading-snug">
                    Do you think AI-generated news will replace traditional journalism in the next 5 years?
                </p>
                {!voted ? (
                    <div className="flex flex-col gap-3">
                        {['Yes, definitely', 'No, never', 'Maybe, depends'].map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => setVoted(true)}
                                className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 text-gray-700 font-semibold text-sm transition-all group flex justify-between items-center"
                            >
                                {option}
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                <span>Yes, definitely</span>
                                <span>42%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-600 rounded-full" style={{ width: '42%' }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                <span>No, never</span>
                                <span>38%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-600 rounded-full" style={{ width: '38%' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Social Follow Widget */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
                <h2 className="font-['Lora',serif] font-bold text-xl text-gray-900 tracking-tight mb-6">Follow Us</h2>
                <div className="grid grid-cols-2 gap-3">
                    <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all group">
                        <Facebook size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Facebook</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white transition-all group">
                        <Twitter size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Twitter</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition-all group">
                        <Instagram size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Instagram</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all group">
                        <Youtube size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Youtube</span>
                    </a>
                </div>
            </div>

        </div>
    );
};

export default SidebarWidgets;
