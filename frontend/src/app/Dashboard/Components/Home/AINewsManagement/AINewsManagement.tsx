"use client";
import React, { useState, useEffect, useCallback } from "react";
import { API } from "@/Utils/Utils";
import { NewsItem } from "@/app/hooks/NewsApi";
import {
    RefreshCw, Cpu, Zap, Trash2, CheckCircle, XCircle,
    Edit2, Globe, Bot, AlertCircle, Loader2, BarChart3
} from "lucide-react";

interface AIDraft extends NewsItem {
    category: string;
    source?: string;
}

interface ScrapeStats {
    processed: number;
    duplicates: number;
    errors: number;
    articles: string[];
}

interface AINewsManagementProps {
    onEdit: (item: NewsItem) => void;
}

export default function AINewsManagement({ onEdit }: AINewsManagementProps) {
    const [drafts, setDrafts] = useState<AIDraft[]>([]);
    const [loading, setLoading] = useState(true);
    const [scraping, setScraping] = useState(false);
    const [scrapeResult, setScrapeResult] = useState<ScrapeStats | null>(null);
    const [scrapeError, setScrapeError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showNotif = (msg: string, type: 'success' | 'error') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchDrafts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await API.get("/api/auto-news/drafts");
            if (res.data.success) {
                setDrafts(res.data.drafts);
            }
        } catch (error) {
            console.error("Failed to fetch drafts", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDrafts(); }, [fetchDrafts]);

    // ─── Scrape News ─────────────────────────────────────────────────────────
    const handleScrape = async () => {
        if (!confirm("This will scrape the web and generate new AI drafts. Proceed?")) return;
        setScraping(true);
        setScrapeResult(null);
        setScrapeError(null);
        try {
            const res = await API.get("/api/auto-news/fetch-daily");
            if (res.data.success) {
                setScrapeResult(res.data.stats);
                showNotif(`✅ Scraping complete! ${res.data.stats.processed} articles generated.`, 'success');
                fetchDrafts(); // Refresh drafts
            } else {
                setScrapeError("Scraping failed.");
                showNotif("Scraping failed.", 'error');
            }
        } catch (err: any) {
            const msg = err?.response?.data?.error || err.message || "Scraping failed.";
            setScrapeError(msg);
            showNotif(msg, 'error');
        } finally {
            setScraping(false);
        }
    };

    // ─── Publish ──────────────────────────────────────────────────────────────
    const handlePublish = async (item: AIDraft) => {
        if (!confirm(`Publish "${item.title}"?`)) return;
        try {
            await API.put(`/news/updatenews/${item.category}/${item.slug}`, {
                status: "published",
                isHidden: false,
            });
            showNotif("News published successfully!", 'success');
            fetchDrafts();
        } catch (err) {
            showNotif("Failed to publish news.", 'error');
        }
    };

    // ─── Delete ───────────────────────────────────────────────────────────────
    const handleDelete = async (item: AIDraft) => {
        if (!confirm(`Delete "${item.title}"?`)) return;
        try {
            await API.delete(`/news/deletenews/${item.category}/${item.slug}`);
            showNotif("Draft deleted.", 'success');
            fetchDrafts();
        } catch (err) {
            showNotif("Failed to delete draft.", 'error');
        }
    };

    return (
        <div className="space-y-6 font-['Outfit']">

            {/* ── Notification Toast ── */}
            {notification && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold transition-all animate-in slide-in-from-top-4 ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {notification.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {notification.msg}
                </div>
            )}

            {/* ── Header + Action Buttons ── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                            <span className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                                <Bot size={20} className="text-violet-600" />
                            </span>
                            AI Generated Drafts
                            <span className="text-sm font-semibold text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 rounded-full">{drafts.length}</span>
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 ml-13">News articles scraped and generated by AI</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Refresh */}
                        <button
                            onClick={fetchDrafts}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>

                        {/* 🔥 Scrape News Button */}
                        <button
                            onClick={handleScrape}
                            disabled={scraping}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-500/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {scraping ? (
                                <><Loader2 size={16} className="animate-spin" /> Scraping...</>
                            ) : (
                                <><Zap size={16} /> Scrape News</>
                            )}
                        </button>
                    </div>
                </div>

                {/* ── Scrape Progress / Result ── */}
                {scraping && (
                    <div className="mt-4 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                        <div className="flex items-center gap-3 text-violet-700 dark:text-violet-300 font-semibold">
                            <Loader2 size={20} className="animate-spin" />
                            <span>Scraping AI news... This may take 1-2 minutes.</span>
                        </div>
                        <div className="mt-3 h-1.5 bg-violet-200 dark:bg-violet-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full animate-pulse w-3/4" />
                        </div>
                    </div>
                )}

                {scrapeResult && !scraping && (
                    <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700">
                        <p className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 mb-3">
                            <CheckCircle size={18} /> Scraping Complete!
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Generated', value: scrapeResult.processed, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: <BarChart3 size={16} /> },
                                { label: 'Duplicates Skipped', value: scrapeResult.duplicates, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: <AlertCircle size={16} /> },
                                { label: 'Errors', value: scrapeResult.errors, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', icon: <XCircle size={16} /> },
                            ].map(stat => (
                                <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center`}>
                                    <div className={`${stat.color} flex items-center justify-center gap-1 text-2xl font-black`}>{stat.value}</div>
                                    <div className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                        {scrapeResult.articles.length > 0 && (
                            <div className="mt-3 space-y-1">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Generated Articles:</p>
                                {scrapeResult.articles.map((title, i) => (
                                    <p key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                        <CheckCircle size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                                        {title}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {scrapeError && !scraping && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700 flex items-center gap-3 text-red-600 dark:text-red-400 font-medium">
                        <XCircle size={18} /> {scrapeError}
                    </div>
                )}
            </div>

            {/* ── Drafts Grid ── */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-violet-100 rounded-full" />
                        <div className="absolute inset-0 border-4 border-transparent border-t-violet-600 rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-500 font-medium">Loading AI Drafts...</p>
                </div>
            ) : drafts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-20 text-center">
                    <div className="w-16 h-16 bg-violet-50 dark:bg-violet-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bot size={32} className="text-violet-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No AI Drafts Found</h3>
                    <p className="text-gray-400 text-sm mb-6">Click "Scrape News" above to scrape the web and generate AI drafts.</p>
                    <button
                        onClick={handleScrape}
                        disabled={scraping}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-violet-500/20 hover:from-violet-700 hover:to-indigo-700 transition-all active:scale-95 disabled:opacity-60"
                    >
                        <Zap size={18} /> Scrape News
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {drafts.map((draft, index) => (
                        <div
                            key={`${draft.slug}-${index}`}
                            className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative w-full h-44 overflow-hidden shrink-0 bg-gray-50 dark:bg-gray-700">
                                {draft.image ? (
                                    <img
                                        src={draft.image}
                                        alt={draft.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20">
                                        <Bot size={36} className="text-violet-300" />
                                    </div>
                                )}
                                {/* AI Badge */}
                                <div className="absolute top-2 left-2 flex items-center gap-1 bg-violet-600/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">
                                    <Cpu size={9} /> AI Draft
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-1 gap-2">
                                {/* Meta */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="flex items-center gap-1 text-[11px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-semibold capitalize">
                                        <Globe size={10} /> {draft.category}
                                    </span>
                                    <span className="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                                        {draft.source || "AI"}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-violet-600 transition-colors flex-1">
                                    {draft.title}
                                </h3>

                                {/* Summary */}
                                {(draft.summary || draft.content) && (
                                    <p className="text-xs text-gray-400 line-clamp-2">
                                        {(draft.summary || draft.content.replace(/<[^>]*>/g, '')).substring(0, 100)}...
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={() => onEdit(draft)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold transition-all active:scale-95"
                                    >
                                        <Edit2 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handlePublish(draft)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-all active:scale-95 shadow-sm shadow-emerald-500/20"
                                    >
                                        <CheckCircle size={12} /> Publish
                                    </button>
                                    <button
                                        onClick={() => handleDelete(draft)}
                                        className="px-3 py-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-xs transition-all active:scale-95"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
