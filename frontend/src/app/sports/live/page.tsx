"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, MapPin, Activity, X, Clock } from 'lucide-react';
import CricketScorecard from '@/app/Components/T20-world-cup/Scorecard/Scorecard';
import CricketPointsTable from '@/app/Components/T20-world-cup/PointsTable/PointsTable';

const LiveScorePage = () => {
    const [matchData, setMatchData] = useState<any>({ live: [], upcoming: [], recent: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'recent'>('live');
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
    const [activeSeriesId, setActiveSeriesId] = useState<string>("");

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.primetimemedia.in";

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/live/settings`);
                const data = await res.json();
                if (data.success) setActiveSeriesId(data.data.activeSeriesId);
            } catch (err) {
                console.error("Failed to fetch cricket settings", err);
            }
        };

        fetchSettings();

        const eventSource = new EventSource(`${API_BASE}/api/live/live-stream`);
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setMatchData(data || { live: [], upcoming: [], recent: [] });
                setLoading(false);
            } catch (err) {
                console.error("SSE Error", err);
            }
        };

        return () => eventSource.close();
    }, [API_BASE]);

    const activeMatches = matchData[activeTab] || [];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-[#cc0000] rounded-full animate-spin mb-5"></div>
                <p className="text-gray-500 font-medium">Fetching Live Match Data...</p>
            </div>
        );
    }

    const formatTime = (dateStr: string, timeStr?: string) => {
        if (timeStr) return timeStr;
        try {
            return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        } catch {
            return '';
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto my-10 px-5 min-h-[80vh]">
            {/* Scorecard Modal */}
            {selectedMatchId && (
                <div className="fixed inset-0 z-[1000] bg-black/55 flex justify-center items-start p-[40px_16px_40px] overflow-y-auto animate-fade-in" onClick={() => setSelectedMatchId(null)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-[900px] relative shadow-[0_20px_60px_rgba(0,0,0,0.25)] mb-10 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-3.5 right-3.5 bg-gray-100 border-none rounded-full w-9 h-9 flex items-center justify-center cursor-pointer text-gray-500 transition-all duration-200 hover:bg-[#cc0000] hover:text-white" onClick={() => setSelectedMatchId(null)}>
                            <X size={22} />
                        </button>
                        <CricketScorecard matchId={selectedMatchId} />
                    </div>
                </div>
            )}

            <header className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-[#cc0000] text-white px-4 py-1.5 rounded-full font-extrabold text-[0.9rem] mb-4">
                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
                    LIVE CRICKET
                </div>
                <h1 className="text-[2.5rem] font-black text-gray-900 tracking-tight md:text-3xl">Real-Time Match Updates</h1>
                <div className="flex justify-center gap-3 mt-6 flex-wrap">
                    <button className={`bg-gray-100 border border-gray-200 px-[22px] py-[9px] rounded-full font-bold text-[0.85rem] text-gray-600 cursor-pointer transition-all duration-250 flex items-center gap-2 hover:bg-gray-200 ${activeTab === 'live' ? '!bg-[#cc0000] !text-white !border-[#cc0000] shadow-[0_4px_14px_rgba(204,0,0,0.25)]' : ''}`} onClick={() => setActiveTab('live')}>
                        Live {matchData.live.length > 0 && <span className="bg-white/35 px-2 py-0.5 rounded-xl text-[0.72rem]">{matchData.live.length}</span>}
                    </button>
                    <button className={`bg-gray-100 border border-gray-200 px-[22px] py-[9px] rounded-full font-bold text-[0.85rem] text-gray-600 cursor-pointer transition-all duration-250 flex items-center gap-2 hover:bg-gray-200 ${activeTab === 'recent' ? '!bg-[#cc0000] !text-white !border-[#cc0000] shadow-[0_4px_14px_rgba(204,0,0,0.25)]' : ''}`} onClick={() => setActiveTab('recent')}>
                        Recent
                    </button>
                    <button className={`bg-gray-100 border border-gray-200 px-[22px] py-[9px] rounded-full font-bold text-[0.85rem] text-gray-600 cursor-pointer transition-all duration-250 flex items-center gap-2 hover:bg-gray-200 ${activeTab === 'upcoming' ? '!bg-[#cc0000] !text-white !border-[#cc0000] shadow-[0_4px_14px_rgba(204,0,0,0.25)]' : ''}`} onClick={() => setActiveTab('upcoming')}>
                        Upcoming
                    </button>
                    <button className="bg-gray-100 border border-gray-200 px-[22px] py-[9px] rounded-full font-bold text-[0.85rem] text-gray-600 cursor-pointer transition-all duration-250 hover:bg-gray-200" onClick={() => document.getElementById('standings')?.scrollIntoView({ behavior: 'smooth' })}>
                        Standings
                    </button>
                </div>
            </header>

            {activeMatches.length === 0 ? (
                <div className="text-center py-24 text-gray-400">
                    <Activity size={48} className="mx-auto" />
                    <p className="mt-4 text-[1.1rem]">No {activeTab} matches found at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] gap-6 md:grid-cols-1">
                    {activeMatches.map((match: any) => (
                        <div key={match.id} className={`group bg-white border border-gray-100 rounded-2xl p-[20px_22px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col transition-all duration-250 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 ${activeTab === 'live' ? 'border-t-4 border-t-[#cc0000]' : ''}`}>
                            {/* Card Header */}
                            <div className="flex justify-between items-center mb-2.5 text-[0.75rem] font-bold tracking-wider">
                                <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full text-[0.7rem]">{match.matchType?.toUpperCase() || 'T20'}</span>
                                <span className={`text-gray-400 text-[0.72rem] font-bold uppercase ${activeTab === 'live' ? '!text-[#cc0000] animate-pulse' : ''}`}>
                                    {activeTab === 'live' ? '🔴 LIVE' : match.status}
                                </span>
                            </div>

                            {/* Match Name */}
                            <h2 className="text-[1.05rem] font-extrabold mb-3.5 leading-relaxed text-gray-900">{match.name}</h2>

                            {/* Score Section */}
                            <div className="bg-gray-50 border border-gray-200 p-[14px_16px] rounded-xl mb-3.5 flex-1">
                                {match.score && match.score.length > 0 ? (
                                    match.score.map((s: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                            <span className="text-[0.82rem] font-semibold text-gray-700 flex-1 pr-2.5">{s.inning}</span>
                                            <span className="text-[1.1rem] font-black text-[#cc0000] whitespace-nowrap">
                                                {s.r}/{s.w} <small className="text-[0.75rem] text-gray-400 font-medium ml-1">({s.o} ov)</small>
                                            </span>
                                        </div>
                                    ))
                                ) : activeTab === 'upcoming' ? (
                                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-[0.9rem] justify-center py-1.5">
                                        <Clock size={15} />
                                        <span>
                                            {formatTime(match.date, match.startTime)}
                                            {match.date && ` • ${new Date(match.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-300 italic text-[0.85rem] py-2">Details pending...</div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex gap-4 flex-wrap border-t border-gray-100 pt-3 mb-3.5">
                                {match.venue && (
                                    <div className="flex items-center gap-1 text-[0.76rem] text-gray-400 flex-1 min-w-0">
                                        <MapPin size={13} />
                                        <span className="truncate whitespace-nowrap">{match.venue}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1 text-[0.76rem] text-gray-400 flex-1 min-w-0">
                                    <Calendar size={13} />
                                    <span className="truncate whitespace-nowrap">{new Date(match.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>

                            {/* Scorecard Button — ONLY this triggers the modal */}
                            {activeTab !== 'upcoming' && (
                                <button
                                    className="w-full p-2.5 bg-white border-[1.5px] border-[#cc0000] rounded-xl text-[#cc0000] font-bold text-[0.82rem] cursor-pointer transition-all duration-200 text-center hover:bg-[#cc0000] hover:text-white hover:shadow-[0_4px_14px_rgba(204,0,0,0.25)]"
                                    onClick={() => setSelectedMatchId(match.id)}
                                >
                                    📊 View Full Scorecard
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div id="standings" className="mt-15 max-w-[1000px] mx-auto">
                <CricketPointsTable seriesId={activeSeriesId} />
            </div>
        </div>
    );
};

export default LiveScorePage;
