"use client";
import React, { useState, useEffect, useCallback } from "react";
import { API } from "@/Utils/Utils";

interface CategoryStat {
    category: string;
    count: number;
    titles: string[];
}

interface EmployeeStat {
    authorId: string;
    author: string;
    total: number;
    categories: CategoryStat[];
}

const CATEGORY_COLORS: Record<string, string> = {
    india: "#ef4444",
    sports: "#f97316",
    business: "#eab308",
    technology: "#3b82f6",
    entertainment: "#a855f7",
    lifestyle: "#ec4899",
    world: "#06b6d4",
    health: "#22c55e",
    awards: "#f59e0b",
};

const CATEGORY_ICONS: Record<string, string> = {
    india: "🇮🇳",
    sports: "⚽",
    business: "📈",
    technology: "💻",
    entertainment: "🎬",
    lifestyle: "✨",
    world: "🌍",
    health: "🏥",
    awards: "🏆",
};

export default function EmployeeReports() {
    // Get today's date in IST (UTC+5:30)
    const getISTToday = () => {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istNow = new Date(now.getTime() + istOffset);
        return istNow.toISOString().split("T")[0];
    };
    const today = getISTToday();
    const [selectedDate, setSelectedDate] = useState(today);
    const [report, setReport] = useState<EmployeeStat[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);

    const fetchReport = useCallback(async (date: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get(`/news/employee-report?date=${date}`);
            if (res.data.success) {
                setReport(res.data.report);
            } else {
                setError("Failed to load report");
            }
        } catch (err: any) {
            setError(err.response?.data?.msg || "Error loading report");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReport(selectedDate);
    }, [selectedDate, fetchReport]);

    const totalPublished = report.reduce((sum, emp) => sum + emp.total, 0);

    const allCategoryTotals: Record<string, number> = {};
    report.forEach((emp) => {
        emp.categories.forEach((cat) => {
            allCategoryTotals[cat.category] = (allCategoryTotals[cat.category] || 0) + cat.count;
        });
    });

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    };

    return (
        <div className="p-6 max-w-full font-sans">
            {/* Header */}
            <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
                <div className="flex flex-col">
                    <h2 className="text-[1.5rem] m-0 mb-1 text-slate-800 font-bold">👥 Employee Daily Reports</h2>
                    <p className="m-0 text-slate-500 text-[0.9rem]">Track how many news articles each employee published per day</p>
                </div>
                <div className="flex items-center gap-2.5">
                    <input
                        type="date"
                        value={selectedDate}
                        max={today}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="p-[8px_12px] border border-slate-200 rounded-lg text-[0.9rem] text-slate-800 bg-white cursor-pointer focus:outline-none focus:border-blue-500"
                    />
                    <button onClick={() => fetchReport(selectedDate)} className="p-[8px_16px] bg-blue-500 text-white border-none rounded-lg cursor-pointer text-[0.9rem] whitespace-nowrap hover:bg-blue-600">
                        🔄 Refresh
                    </button>
                </div>
            </div>

            <p className="text-slate-500 text-[0.9rem] m-0 mb-5">📅 Showing report for: <strong>{formatDate(selectedDate)}</strong></p>

            {/* Summary Cards */}
            <div className="flex gap-4 mb-6 flex-wrap">
                <div className="bg-white border border-slate-200 rounded-xl p-[16px_24px] flex flex-col items-center min-w-[120px] shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
                    <span className="text-[2rem] font-extrabold text-slate-800">{report.length}</span>
                    <span className="text-[0.8rem] text-slate-500 mt-1 uppercase tracking-wider">Active Employees</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-[16px_24px] flex flex-col items-center min-w-[120px] shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
                    <span className="text-[2rem] font-extrabold text-slate-800">{totalPublished}</span>
                    <span className="text-[0.8rem] text-slate-500 mt-1 uppercase tracking-wider">Total Published</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-[16px_24px] flex flex-col items-center min-w-[120px] shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
                    <span className="text-[2rem] font-extrabold text-slate-800">{Object.keys(allCategoryTotals).length}</span>
                    <span className="text-[0.8rem] text-slate-500 mt-1 uppercase tracking-wider">Categories Covered</span>
                </div>
            </div>

            {/* Category Totals Bar */}
            {Object.keys(allCategoryTotals).length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-[16px_20px] mb-6 shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
                    <h3 className="m-0 mb-3 text-[1rem] text-slate-800 font-semibold">📊 Category Summary</h3>
                    <div className="flex flex-wrap gap-2.5">
                        {Object.entries(allCategoryTotals)
                            .sort(([, a], [, b]) => b - a)
                            .map(([cat, count]) => (
                                <div
                                    key={cat}
                                    className="flex items-center gap-1.5 p-[6px_12px] border-2 border-slate-200 rounded-full bg-white text-[0.85rem]"
                                    style={{ borderColor: CATEGORY_COLORS[cat] || "#e2e8f0" }}
                                >
                                    <span>{CATEGORY_ICONS[cat] || "📰"}</span>
                                    <span className="capitalize font-medium text-slate-600">{cat}</span>
                                    <span
                                        className="text-white font-bold text-[0.8rem] p-[2px_8px] rounded-lg"
                                        style={{ background: CATEGORY_COLORS[cat] || "#94a3b8" }}
                                    >
                                        {count}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Loading / Error */}
            {loading && <div className="text-center p-12 text-slate-500 text-[1rem]">⏳ Loading report...</div>}
            {error && <div className="text-center p-12 text-red-500 text-[1rem]">❌ {error}</div>}

            {/* No Data */}
            {!loading && !error && report.length === 0 && (
                <div className="text-center p-12 text-slate-500 text-[1rem]">
                    <span className="text-[2.5rem] block mb-3">📭</span>
                    <p>No news was published on this date.</p>
                </div>
            )}

            {/* Employee Table */}
            {!loading && report.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
                    <table className="w-full border-collapse bg-white text-[0.9rem]">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="p-[12px_14px] text-center font-semibold text-slate-600 border-b-2 border-slate-200 whitespace-nowrap capitalize w-12">#</th>
                                <th className="p-[12px_14px] text-left font-semibold text-slate-600 border-b-2 border-slate-200 whitespace-nowrap capitalize">Employee</th>
                                {Object.keys(allCategoryTotals)
                                    .sort()
                                    .map((cat) => (
                                        <th key={cat} className="p-[12px_14px] text-center font-semibold text-slate-600 border-b-2 border-slate-200 whitespace-nowrap capitalize">
                                            {CATEGORY_ICONS[cat] || "📰"} {cat}
                                        </th>
                                    ))}
                                <th className="p-[12px_14px] text-center font-semibold text-slate-600 border-b-2 border-slate-200 whitespace-nowrap capitalize">Total</th>
                                <th className="p-[12px_14px] text-center font-semibold text-slate-600 border-b-2 border-slate-200 whitespace-nowrap capitalize">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((emp, idx) => {
                                const catMap: Record<string, CategoryStat> = {};
                                emp.categories.forEach((c) => (catMap[c.category] = c));
                                const isExpanded = expandedEmployee === emp.author;

                                return (
                                    <React.Fragment key={emp.author}>
                                        <tr className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                                            <td className="p-[12px_14px] text-center border-b border-slate-100 align-middle text-[1.2rem] font-bold">
                                                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                                            </td>
                                            <td className="p-[12px_14px] text-center border-b border-slate-100 align-middle">
                                                <div className="flex items-center gap-2.5 text-left font-semibold text-slate-800 whitespace-nowrap">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white flex items-center justify-center font-bold text-[0.9rem] shrink-0">
                                                        {emp.author?.charAt(0).toUpperCase() || "?"}
                                                    </div>
                                                    {emp.author}
                                                </div>
                                            </td>
                                            {Object.keys(allCategoryTotals)
                                                .sort()
                                                .map((cat) => (
                                                    <td
                                                        key={cat}
                                                        className={`p-[12px_14px] text-center border-b border-slate-100 align-middle ${catMap[cat] ? "" : "text-slate-400 font-medium"}`}
                                                        style={catMap[cat] ? { color: CATEGORY_COLORS[cat] || "#333", fontWeight: 700 } : {}}
                                                    >
                                                        {catMap[cat] ? catMap[cat].count : "-"}
                                                    </td>
                                                ))}
                                            <td className="p-[12px_14px] text-center border-b border-slate-100 align-middle font-bold text-slate-800 text-[1rem]">{emp.total}</td>
                                            <td className="p-[12px_14px] text-center border-b border-slate-100 align-middle">
                                                <button
                                                    className="p-[5px_12px] border border-slate-200 rounded-md bg-white cursor-pointer text-[0.8rem] text-blue-500 whitespace-nowrap hover:bg-blue-50 hover:border-blue-500"
                                                    onClick={() => setExpandedEmployee(isExpanded ? null : emp.author)}
                                                >
                                                    {isExpanded ? "▲ Hide" : "▼ Show"}
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Expanded article titles */}
                                        {isExpanded && (
                                            <tr className="bg-sky-50 border-b-2 border-sky-200">
                                                <td colSpan={Object.keys(allCategoryTotals).length + 4} className="p-[12px_14px] text-center border-b border-slate-100 align-middle">
                                                    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 p-2 text-left">
                                                        {emp.categories.map((cat) => (
                                                            <div key={cat.category} className="flex flex-col gap-1">
                                                                <h4 className="m-0 mb-2 text-[0.9rem] font-bold" style={{ color: CATEGORY_COLORS[cat.category] || "#333" }}>
                                                                    {CATEGORY_ICONS[cat.category] || "📰"} {cat.category} ({cat.count})
                                                                </h4>
                                                                <ul className="m-0 pl-4 list-disc">
                                                                    {cat.titles.map((title, ti) => (
                                                                        <li key={ti} className="text-[0.82rem] text-slate-600 mb-1 leading-relaxed">{title}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                        {/* Total row */}
                        <tfoot>
                            <tr className="bg-slate-100 border-t-2 border-slate-300 text-[1rem] font-bold">
                                <td colSpan={2} className="p-[12px_14px] text-left">📊 Total</td>
                                {Object.keys(allCategoryTotals)
                                    .sort()
                                    .map((cat) => (
                                        <td key={cat} className="p-[12px_14px] text-center">
                                            {allCategoryTotals[cat] || 0}
                                        </td>
                                    ))}
                                <td className="p-[12px_14px] text-center">{totalPublished}</td>
                                <td />
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}
