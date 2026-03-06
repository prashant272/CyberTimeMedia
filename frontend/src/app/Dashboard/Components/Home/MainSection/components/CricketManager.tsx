"use client";
import React, { useEffect, useState } from 'react';
import { cricketService, LiveMatch } from '@/app/services/CricketService';
import CricketScorecard from '@/app/Components/T20-world-cup/Scorecard/Scorecard';
import CricketPointsTable from '@/app/Components/T20-world-cup/PointsTable/PointsTable';

const CricketManager: React.FC = () => {
    const [matches, setMatches] = useState<LiveMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [matchInput, setMatchInput] = useState('');
    const [adding, setAdding] = useState(false);
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

    // Dynamic Tournament Settings
    const [tournament, setTournament] = useState('T20 World Cup');
    const [seriesId, setSeriesId] = useState('');
    const [autoTrack, setAutoTrack] = useState(true);
    const [updatingSettings, setUpdatingSettings] = useState(false);

    const [searching, setSearching] = useState(false);
    const [seriesSearchQuery, setSeriesSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    // Manual Match State
    const [manualMatch, setManualMatch] = useState({
        name: '',
        teams: ['', ''],
        date: new Date().toISOString().split('T')[0],
        startTime: '14:30',
        venue: '',
        category: 'upcoming' as 'live' | 'upcoming' | 'recent',
        matchType: 'T20'
    });
    const [creatingManual, setCreatingManual] = useState(false);

    // Manual Points Table State — multi-group
    type PointsGroup = { groupName: string; rows: any[] };
    const [pointsGroups, setPointsGroups] = useState<PointsGroup[]>([
        { groupName: 'Group 1', rows: [] }
    ]);
    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [isManualPoints, setIsManualPoints] = useState(false);
    const [savingPoints, setSavingPoints] = useState(false);
    const [hasFetchedPoints, setHasFetchedPoints] = useState(false);

    // Convenience: rows of active group
    const pointsRows = pointsGroups[activeGroupIndex]?.rows || [];


    const fetchMatches = async () => {
        setLoading(true);
        try {
            const response = await cricketService.getAllDiscovered();
            if (response.success) {
                setMatches(response.data);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await cricketService.getSettings();
            if (res.success) {
                setTournament(res.data.activeTournament);
                setSeriesId(res.data.activeSeriesId);
                setAutoTrack(res.data.autoTrackEnabled);
            }
        } catch (err) {
            console.error("Failed to fetch cricket settings", err);
        }
    };

    useEffect(() => {
        fetchMatches();
        fetchSettings();
    }, []);

    const handleUpdateSettings = async () => {
        setUpdatingSettings(true);
        try {
            const res = await cricketService.updateSettings({
                activeTournament: tournament,
                activeSeriesId: seriesId,
                autoTrackEnabled: autoTrack
            });
            if (res.success) {
                alert("Settings updated successfully! New matches will be filtered by: " + tournament);
                fetchMatches(); // Refresh list to see filtering change
            }
        } catch (err: any) {
            alert("Failed to update settings: " + err.message);
        } finally {
            setUpdatingSettings(false);
        }
    };

    const handleAddMatch = async () => {
        if (!matchInput.trim()) return;

        setAdding(true);
        try {
            // Extract ID from Cricbuzz URL if necessary
            let matchId = matchInput.trim();
            if (matchId.includes('cricbuzz.com')) {
                const parts = matchId.split('/');
                const scoreIndex = parts.indexOf('live-cricket-scores') !== -1 ?
                    parts.indexOf('live-cricket-scores') :
                    parts.indexOf('live-cricket-score');
                if (scoreIndex !== -1 && parts[scoreIndex + 1]) {
                    matchId = parts[scoreIndex + 1];
                }
            }

            // Clean matchId: only take the numeric part or alphanumeric if it's a valid ID
            // Most Cricbuzz IDs are just numbers. Let's strip anything that's not alphanumeric.
            matchId = matchId.replace(/[^a-zA-Z0-9-]/g, '');

            if (!matchId) {
                alert("Invalid Match ID or URL");
                setAdding(false);
                return;
            }

            const response = await cricketService.addMatch(matchId);
            if (response.success) {
                setMatchInput('');
                fetchMatches(); // Refresh list
                alert("Match added successfully!");
            }
        } catch (err: any) {
            alert("Error adding match: " + err.message);
        } finally {
            setAdding(false);
        }
    };

    const handleToggleStatus = async (id: string, field: string, currentValue: boolean) => {
        try {
            const response = await cricketService.toggleStatus(id, field, !currentValue);
            if (response.success) {
                setMatches(prev => prev.map(m => m.id === id ? response.data : m));
            }
        } catch (err: any) {
            alert("Error updating status: " + err.message);
        }
    };

    const handleCreateManualMatch = async () => {
        if (!manualMatch.name || !manualMatch.teams[0] || !manualMatch.teams[1]) {
            alert("Please fill match name and both teams");
            return;
        }
        setCreatingManual(true);
        try {
            const res = await cricketService.createManualMatch({
                ...manualMatch,
                status: manualMatch.category === 'upcoming' ? 'Upcoming' : (manualMatch.category === 'live' ? 'Live' : 'Match Finished')
            });
            if (res.success) {
                alert("Manual match created!");
                fetchMatches();
                setManualMatch({
                    name: '',
                    teams: ['', ''],
                    date: new Date().toISOString().split('T')[0],
                    startTime: '14:30',
                    venue: '',
                    category: 'upcoming',
                    matchType: 'T20'
                });
            }
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setCreatingManual(false);
        }
    };

    const fetchPointsTable = async () => {
        if (!seriesId) return;
        try {
            const res = await cricketService.getPointsTable(seriesId);
            if (res.success) {
                // If manual data: { isManual: true, groups: [...] }
                if (res.data?.isManual && Array.isArray(res.data?.groups)) {
                    setPointsGroups(res.data.groups);
                    setActiveGroupIndex(0);
                    setIsManualPoints(true);
                } else {
                    // API data — wrap in single group
                    const rows = res.data?.data || res.data || [];
                    setPointsGroups([{ groupName: 'Group 1', rows: Array.isArray(rows) ? rows : [] }]);
                    setActiveGroupIndex(0);
                    setIsManualPoints(false);
                }
            }
        } catch (err) {
            console.error("Points Table Error:", err);
        }
    };

    // Only auto-fetch once when seriesId is first loaded from settings
    useEffect(() => {
        if (seriesId && !hasFetchedPoints) {
            fetchPointsTable();
            setHasFetchedPoints(true);
        }
    }, [seriesId]);

    const handleSavePoints = async () => {
        if (!seriesId) return;
        setSavingPoints(true);
        try {
            const res = await cricketService.saveManualPoints(seriesId, tournament, pointsGroups as any);
            if (res.success) {
                alert("Points Table saved!");
                setIsManualPoints(true);
                fetchPointsTable();
            }
        } catch (err: any) {
            alert("Error saving points: " + err.message);
        } finally {
            setSavingPoints(false);
        }
    };

    const addGroup = () => {
        const newName = `Group ${pointsGroups.length + 1}`;
        setPointsGroups(prev => [...prev, { groupName: newName, rows: [] }]);
        setActiveGroupIndex(pointsGroups.length);
    };

    const removeGroup = (idx: number) => {
        if (pointsGroups.length === 1) return alert("At least one group is required.");
        setPointsGroups(prev => prev.filter((_, i) => i !== idx));
        setActiveGroupIndex(0);
    };

    const renameGroup = (idx: number, name: string) => {
        setPointsGroups(prev => prev.map((g, i) => i === idx ? { ...g, groupName: name } : g));
    };

    const addPointsRow = () => {
        setPointsGroups(prev => prev.map((g, i) =>
            i === activeGroupIndex
                ? { ...g, rows: [...g.rows, { teamname: '', matches: 0, wins: 0, loss: 0, ties: 0, nr: 0, pts: 0, nrr: '0.000' }] }
                : g
        ));
    };

    const updatePointsRow = (index: number, field: string, value: any) => {
        setPointsGroups(prev => prev.map((group, gIdx) => {
            if (gIdx !== activeGroupIndex) return group;

            const updatedRows = [...group.rows];
            const updatedRow = { ...updatedRows[index], [field]: value };

            // Auto-calculate points if wins/ties/nr change
            if (field === 'wins' || field === 'nr' || field === 'ties') {
                const w = parseInt(updatedRow.wins || '0', 10);
                const nr = parseInt(updatedRow.nr || '0', 10);
                const t = parseInt(updatedRow.ties || '0', 10);
                updatedRow.pts = (w * 2) + nr + t;
            }

            updatedRows[index] = updatedRow;
            return { ...group, rows: updatedRows };
        }));
    };

    const removePointsRow = (index: number) => {
        setPointsGroups(prev => prev.map((g, i) =>
            i === activeGroupIndex
                ? { ...g, rows: g.rows.filter((_, rIdx) => rIdx !== index) }
                : g
        ));
    };


    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 grayscale brightness-90">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium font-['Outfit']">Loading matches...</p>
        </div>
    );
    if (error) return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg m-6">
            Error: {error}
        </div>
    );

    return (
        <div className="p-4 md:p-6 space-y-8 font-['Outfit']">
            {/* Global Cricket Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">⚙️</span> Global Settings
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Filter & Series ID Row */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Active Tournament Filter (e.g. IPL, World Cup)
                            </label>
                            <input
                                type="text"
                                value={tournament}
                                onChange={(e) => setTournament(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Active Series ID (UUID for Points Table)
                            </label>
                            <input
                                type="text"
                                value={seriesId}
                                onChange={(e) => setSeriesId(e.target.value)}
                                placeholder="e.g. bbcaa2ce-be45-4541-9eb3-9828d8b13197"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                            <input
                                type="checkbox"
                                id="autoTrack"
                                checked={autoTrack}
                                onChange={(e) => setAutoTrack(e.target.checked)}
                                className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 transition-all cursor-pointer"
                            />
                            <label htmlFor="autoTrack" className="text-sm font-semibold text-emerald-900 dark:text-emerald-400 cursor-pointer">
                                Auto-track Live Scores
                            </label>
                        </div>
                    </div>

                    {/* Series Discovery Column */}
                    <div className="flex flex-col gap-4 lg:border-l lg:border-gray-100 dark:lg:border-gray-700 lg:pl-8">
                        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Series Discovery (Find IDs)
                        </h4>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={seriesSearchQuery}
                                onChange={(e) => setSeriesSearchQuery(e.target.value)}
                                placeholder="Search series (e.g. 'IPL 2024')"
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                            <button
                                onClick={async () => {
                                    if (!seriesSearchQuery) return;
                                    setSearching(true);
                                    try {
                                        const results = await cricketService.searchSeries(seriesSearchQuery);
                                        setSearchResults(results || []);
                                    } catch (err) {
                                        console.error("Search error:", err);
                                    } finally {
                                        setSearching(false);
                                    }
                                }}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                                disabled={searching}
                            >
                                {searching ? '...' : 'Search'}
                            </button>
                        </div>

                        {searchResults.length > 0 && (
                            <div className="max-h-[200px] overflow-y-auto bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Series</th>
                                            <th className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {searchResults.map((s) => (
                                            <tr key={s.id} className="hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-gray-900 dark:text-white text-sm">{s.name}</div>
                                                    <div className="text-[10px] text-gray-500 dark:text-gray-500 font-medium">
                                                        {s.startDate} to {s.endDate}
                                                    </div>
                                                    <div className="text-[10px] text-blue-500 font-mono mt-1 select-all">
                                                        {s.id}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setSeriesId(s.id);
                                                            setTournament(s.name);
                                                        }}
                                                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                                    >
                                                        Select
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Settings Actions Row */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4">
                    <button
                        onClick={handleUpdateSettings}
                        disabled={updatingSettings}
                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                        {updatingSettings ? 'Saving...' : 'Save All Settings'}
                    </button>
                    <button
                        onClick={fetchMatches}
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all"
                    >
                        🔄 Sync Data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Manual Match Creation Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="text-2xl">🔨</span> Create Manual Match
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Match Name</label>
                            <input
                                type="text" value={manualMatch.name}
                                onChange={(e) => setManualMatch({ ...manualMatch, name: e.target.value })}
                                placeholder="e.g. India vs Pakistan"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Team 1</label>
                            <input
                                type="text" value={manualMatch.teams[0]}
                                onChange={(e) => setManualMatch({ ...manualMatch, teams: [e.target.value, manualMatch.teams[1]] })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Team 2</label>
                            <input
                                type="text" value={manualMatch.teams[1]}
                                onChange={(e) => setManualMatch({ ...manualMatch, teams: [manualMatch.teams[0], e.target.value] })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                            <input
                                type="date" value={manualMatch.date}
                                onChange={(e) => setManualMatch({ ...manualMatch, date: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
                            <input
                                type="time" value={manualMatch.startTime}
                                onChange={(e) => setManualMatch({ ...manualMatch, startTime: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select
                                value={manualMatch.category}
                                onChange={(e) => setManualMatch({ ...manualMatch, category: e.target.value as any })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="live">Live</option>
                                <option value="recent">Recent</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Venue</label>
                            <input
                                type="text" value={manualMatch.venue}
                                onChange={(e) => setManualMatch({ ...manualMatch, venue: e.target.value })}
                                placeholder="e.g. Melbourne Cricket Ground"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={handleCreateManualMatch}
                            disabled={creatingManual}
                            className="sm:col-span-2 mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-md disabled:opacity-50"
                        >
                            {creatingManual ? 'Creating...' : 'Create Manual Match'}
                        </button>
                    </div>
                </div>

                {/* Manual Points Table Editor */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 font-['Outfit']">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-2xl">📝</span> Manual Points Table
                        </h3>
                        <div className="flex gap-2 items-center">
                            {isManualPoints && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 uppercase tracking-widest">
                                    MANUAL MODE
                                </span>
                            )}
                            <button
                                onClick={() => { setHasFetchedPoints(false); fetchPointsTable(); setHasFetchedPoints(true); }}
                                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                title="Reload from DB (will discard unsaved changes)"
                            >
                                🔄
                            </button>
                        </div>
                    </div>
                    {seriesId ? (
                        <div className="space-y-6">
                            {/* Group Tabs */}
                            <div className="flex flex-wrap gap-2 items-center">
                                {pointsGroups.map((g, idx) => (
                                    <div key={idx} className="flex items-center gap-1 group">
                                        <button
                                            onClick={() => setActiveGroupIndex(idx)}
                                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all border ${activeGroupIndex === idx ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-500'}`}
                                        >
                                            {g.groupName}
                                        </button>
                                        <button onClick={() => removeGroup(idx)} className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-1">
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button onClick={addGroup} className="px-4 py-1.5 text-xs font-bold rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all">
                                    + Add Group
                                </button>
                            </div>

                            {/* Rename active group */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Group Name</label>
                                <input
                                    type="text"
                                    value={pointsGroups[activeGroupIndex]?.groupName || ''}
                                    onChange={(e) => renameGroup(activeGroupIndex, e.target.value)}
                                    className="max-w-[200px] px-3 py-1.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="Group name"
                                />
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-700">
                                <table className="w-full text-left text-[11px] border-collapse">
                                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold uppercase">
                                        <tr>
                                            <th className="px-2 py-3">Team</th>
                                            <th className="px-1 py-3 text-center">P</th>
                                            <th className="px-1 py-3 text-center">W</th>
                                            <th className="px-1 py-3 text-center">L</th>
                                            <th className="px-1 py-3 text-center">NR</th>
                                            <th className="px-1 py-3 text-center text-emerald-600">Pts</th>
                                            <th className="px-2 py-3 text-center">NRR</th>
                                            <th className="px-2 py-3 opacity-0">.</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {pointsRows.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                                <td className="px-2 py-2">
                                                    <input type="text" value={row.teamname ?? ''} onChange={(e) => updatePointsRow(idx, 'teamname', e.target.value)} className="w-[100px] px-1 py-0.5 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-none text-gray-900 dark:text-white" />
                                                </td>
                                                <td className="px-1 py-2 text-center text-gray-900 dark:text-white">
                                                    <input type="number" value={row.matches ?? 0} onChange={(e) => updatePointsRow(idx, 'matches', parseInt(e.target.value, 10) || 0)} className="w-[30px] text-center bg-transparent outline-none" />
                                                </td>
                                                <td className="px-1 py-2 text-center text-emerald-600 font-bold leading-none">
                                                    <input type="number" value={row.wins ?? 0} onChange={(e) => updatePointsRow(idx, 'wins', parseInt(e.target.value, 10) || 0)} className="w-[30px] text-center bg-transparent outline-none" />
                                                </td>
                                                <td className="px-1 py-2 text-center text-red-500 leading-none">
                                                    <input type="number" value={row.loss ?? 0} onChange={(e) => updatePointsRow(idx, 'loss', parseInt(e.target.value, 10) || 0)} className="w-[30px] text-center bg-transparent outline-none" />
                                                </td>
                                                <td className="px-1 py-2 text-center text-gray-400 leading-none">
                                                    <input type="number" value={row.nr ?? 0} onChange={(e) => updatePointsRow(idx, 'nr', parseInt(e.target.value, 10) || 0)} className="w-[30px] text-center bg-transparent outline-none" />
                                                </td>
                                                <td className="px-1 py-2 text-center leading-none"><strong className="text-emerald-600">{row.pts ?? 0}</strong></td>
                                                <td className="px-2 py-2 text-gray-900 dark:text-white">
                                                    <input type="text" value={row.nrr ?? '0.000'} onChange={(e) => updatePointsRow(idx, 'nrr', e.target.value)} className="w-[50px] text-center px-1 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-none" />
                                                </td>
                                                <td className="px-2 py-2 text-right">
                                                    <button onClick={() => removePointsRow(idx)} className="text-red-400 hover:text-red-600 transition-colors text-lg">×</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap gap-4 border-t border-gray-100 dark:border-gray-700 font-['Outfit']">
                                    <button onClick={addPointsRow} className="flex-1 min-w-[120px] px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-lg border border-gray-200 dark:border-gray-600 transition-all text-xs">
                                        + Add Team
                                    </button>
                                    <button
                                        onClick={handleSavePoints}
                                        disabled={savingPoints}
                                        className="flex-1 min-w-[120px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md text-xs disabled:opacity-50"
                                    >
                                        {savingPoints ? 'Saving...' : 'Save All Groups'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 font-['Outfit']">
                            <span className="text-4xl">📭</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                Set an Active Series ID in settings to enable manual points table.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Manual Match Add Section */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔗</span>
                    <input
                        type="text"
                        placeholder="Enter Match ID or Cricbuzz URL to add manually"
                        value={matchInput}
                        onChange={(e) => setMatchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <button
                    onClick={handleAddMatch}
                    disabled={adding}
                    className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md disabled:opacity-50"
                >
                    {adding ? 'Adding...' : 'Add Match Manually'}
                </button>
            </div>

            {/* Previews: Scorecard & Points Table */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                {selectedMatchId && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Match Scorecard Preview
                            </h3>
                            <button onClick={() => setSelectedMatchId(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1">✕</button>
                        </div>
                        <div className="p-4 max-h-[600px] overflow-y-auto">
                            <CricketScorecard matchId={selectedMatchId} />
                        </div>
                    </div>
                )}

                {seriesId && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-100 border-b border-blue-200 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-xl">📊</span> Points Table Preview
                            </h3>
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg">ID: {seriesId}</span>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <CricketPointsTable seriesId={seriesId} />
                        </div>
                    </div>
                )}
            </div>

            {/* Matches List Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">All Discovered Matches</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4">Match / Info</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Category</th>
                                <th className="px-6 py-4">Tracking Actions</th>
                                <th className="px-6 py-4 text-right">Last Sync</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {matches.map((match) => (
                                <tr key={match.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{match.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-2">
                                                <span>{match.matchType}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                <span>{match.venue}</span>
                                            </div>
                                            <div className="flex gap-1.5 mt-1 flex-wrap">
                                                {match.isManual && (
                                                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-[9px] font-bold rounded border border-purple-200 dark:border-purple-800 uppercase tracking-tighter">MANUAL</span>
                                                )}
                                                {match.isLiveTracked && (
                                                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[9px] font-bold rounded border border-emerald-200 dark:border-emerald-800 uppercase tracking-tighter">LIVE</span>
                                                )}
                                                {match.showInUpcoming && (
                                                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[9px] font-bold rounded border border-amber-200 dark:border-amber-800 uppercase tracking-tighter">UPCOMING</span>
                                                )}
                                                {match.showInRecent && (
                                                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400 text-[9px] font-bold rounded border border-gray-200 dark:border-gray-600 uppercase tracking-tighter">RECENT</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{match.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${match.category === 'live' ? 'bg-red-500 text-white' :
                                            match.category === 'upcoming' ? 'bg-blue-500 text-white' :
                                                'bg-gray-500 text-white'
                                            }`}>
                                            {match.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="grid grid-cols-2 gap-2 max-w-[300px]">
                                            <button
                                                onClick={() => handleToggleStatus(match.id, 'isLiveTracked', match.isLiveTracked)}
                                                className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all border ${match.isLiveTracked ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-500'}`}
                                            >
                                                {match.isLiveTracked ? "� Tracking ON" : "⚪ Tracking OFF"}
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(match.id, 'showInUpcoming', match.showInUpcoming)}
                                                className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all border ${match.showInUpcoming ? 'bg-amber-500 border-amber-500 text-black shadow-sm' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-500'}`}
                                            >
                                                {match.showInUpcoming ? "🔔 In Upcoming" : "➕ Add Upcoming"}
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(match.id, 'showInRecent', match.showInRecent)}
                                                className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all border ${match.showInRecent ? 'bg-gray-600 border-gray-600 text-white shadow-sm' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-500'}`}
                                            >
                                                {match.showInRecent ? "🏁 In Recent" : "➕ Add Recent"}
                                            </button>
                                            <button
                                                onClick={() => setSelectedMatchId(match.id)}
                                                className="px-3 py-1.5 text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
                                            >
                                                👁️ Preview
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs text-gray-400 font-mono">
                                        {new Date(match.lastUpdated).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {matches.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400 space-y-4">
                        <span className="text-4xl">📭</span>
                        <p className="text-sm italic">No matches discovered yet. Try clicking "Sync Data" above.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CricketManager;
