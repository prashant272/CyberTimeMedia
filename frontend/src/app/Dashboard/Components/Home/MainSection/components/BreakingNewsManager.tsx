"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Power, PowerOff, ListPlus } from "lucide-react";
import { toast } from "react-toastify";

interface BreakingNewsItem {
    _id: string;
    title: string;
    link?: string;
    source?: string;
    scheduledAt?: string;
    isActive: boolean;
    createdAt: string;
}

const BreakingNewsManager: React.FC = () => {
    const [news, setNews] = useState<BreakingNewsItem[]>([]);
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.primetimemedia.in";

    const fetchNews = async () => {
        try {
            const response = await axios.get(`${API_BASE}/api/breaking-news?all=true`);
            if (response.data.success) {
                setNews(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to fetch breaking news");
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return toast.warning("Title is required");

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE}/api/breaking-news`, {
                title: title.trim(),
                link: link.trim() || null
            });

            if (response.data.success) {
                toast.success("Breaking news added");
                setTitle("");
                setLink("");
                fetchNews();
            }
        } catch (error) {
            console.error("Add Error:", error);
            toast.error("Failed to add breaking news");
        } finally {
            setLoading(false);
        }
    };

    const handleScrape = async () => {
        if (!window.confirm("Scrape real breaking news from live sources?")) return;
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE}/api/breaking-news/scrape`);
            if (response.data.success) {
                toast.success(response.data.message || "News scraped successfully");
                fetchNews();
            }
        } catch (error) {
            toast.error("Scraping failed");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            const response = await axios.put(`${API_BASE}/api/breaking-news/${id}`, {
                isActive: !currentStatus
            });
            if (response.data.success) {
                toast.success(`News ${!currentStatus ? 'activated' : 'deactivated'}`);
                fetchNews();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this news?")) return;

        try {
            const response = await axios.delete(`${API_BASE}/api/breaking-news/${id}`);
            if (response.data.success) {
                toast.success("Deleted successfully");
                fetchNews();
            }
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-8">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <ListPlus className="w-8 h-8 text-blue-500" /> Breaking News Manager
                </h2>
                <p className="text-gray-500 dark:text-gray-400 ml-11">Live ticker updates on your homepage</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Headline Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. India marks a historic win against Australia..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Link (Optional)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="https://..."
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2 flex gap-4">
                        <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50" disabled={loading}>
                            <Plus size={18} /> {loading ? "Adding..." : "Add Breaking News"}
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                            onClick={handleScrape}
                            disabled={loading}
                        >
                            <Plus size={18} /> {loading ? "Scraping..." : "Scrape Real News"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-4">Today's Headlines ({news.length})</h2>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Headline</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Scheduled At</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {news.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-gray-500 dark:text-gray-400">
                                            No breaking news headlines found
                                        </td>
                                    </tr>
                                ) : (
                                    news.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 max-w-md">
                                                <div className="font-semibold text-gray-900 dark:text-white truncate">{item.title}</div>
                                                {item.link && (
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline inline-block truncate max-w-full">
                                                        {item.link}
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.source || "Global"}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    <span>{new Date(item.scheduledAt || item.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                {new Date(item.scheduledAt || item.createdAt) > new Date() && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 uppercase mt-1">
                                                        QUEUED
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}>
                                                    {item.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end items-center gap-2">
                                                    <button
                                                        onClick={() => handleToggle(item._id, item.isActive)}
                                                        className={`p-2 rounded-lg transition-colors ${item.isActive ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30" : "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"}`}
                                                        title={item.isActive ? "Deactivate" : "Activate"}
                                                    >
                                                        {item.isActive ? <Power size={18} /> : <PowerOff size={18} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BreakingNewsManager;

