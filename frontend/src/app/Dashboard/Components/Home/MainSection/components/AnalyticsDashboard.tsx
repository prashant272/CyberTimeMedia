"use client";
import React, { useState, useEffect, useCallback, FC } from "react";
import { API } from "@/Utils/Utils";

interface AnalyticsDashboardProps {
    isSuperAdmin: boolean;
}

const AnalyticsDashboard: FC<AnalyticsDashboardProps> = ({ isSuperAdmin }) => {
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchAnalytics = useCallback(async () => {
        if (!isSuperAdmin) return;
        setLoading(true);
        try {
            const res = await API.get(`/news/analytics`);
            if (res.data.success) {
                setAnalyticsData(res.data.data);
            }
        } catch (err) {
            console.error("Fetch analytics error:", err);
        } finally {
            setLoading(false);
        }
    }, [isSuperAdmin]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (!isSuperAdmin) return null;

    return (
        <div className="p-4 md:p-6">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 grayscale brightness-90">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Loading analytics...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <span className="text-4xl">📈</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Articles</span>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData?.totalNews || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Articles by Category</h3>
                            <div className="flex flex-col gap-5">
                                {Object.entries(analyticsData?.analyticsByCategory || {}).map(([cat, count]: any) => (
                                    <div key={cat} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="text-gray-700 dark:text-gray-300">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                                            <span className="text-indigo-600 dark:text-indigo-400">{count}</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${((count as number) / (analyticsData?.totalNews || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Contributor Performance</h3>
                            <div className="flex flex-col gap-5">
                                {Object.entries(analyticsData?.analyticsByAuthor || {}).map(([author, count]: any) => (
                                    <div key={author} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="text-gray-700 dark:text-gray-300">{author}</span>
                                            <span className="text-indigo-600 dark:text-indigo-400">{count}</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${((count as number) / (analyticsData?.totalNews || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
