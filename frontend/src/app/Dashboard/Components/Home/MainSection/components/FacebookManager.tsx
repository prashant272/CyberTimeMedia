import React, { useState, useEffect, useCallback, FC } from "react";
import { FaFacebook } from "react-icons/fa";
import { API } from "@/Utils/Utils";

interface FacebookManagerProps {
    showNotification: (message: string, type: "success" | "error") => void;
}

const FacebookManager: FC<FacebookManagerProps> = ({ showNotification }) => {
    const [fbStatus, setFbStatus] = useState<any>(null);
    const [fbPages, setFbPages] = useState<any[]>([]);
    const [fbLoading, setFbLoading] = useState(false);

    const fetchFacebookStatus = useCallback(async () => {
        try {
            const res = await API.get('/fb/global-status');
            setFbStatus(res.data);
        } catch (err) {
            console.error("Fetch FB status error:", err);
        }
    }, []);

    useEffect(() => {
        fetchFacebookStatus();
    }, [fetchFacebookStatus]);

    const handleFacebookConnect = async () => {
        setFbLoading(true);
        try {
            const res = await API.get('/fb/auth');
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (err: any) {
            showNotification("Failed to connect Facebook", "error");
        } finally {
            setFbLoading(false);
        }
    };

    const handleDisconnectFacebook = async () => {
        if (!confirm("Disconnect Facebook? Auto-posting will stop.")) return;
        try {
            await API.delete('/fb/disconnect');
            showNotification("Facebook disconnected", "success");
            fetchFacebookStatus();
        } catch (err: any) {
            showNotification("Failed to disconnect", "error");
        }
    };

    const handleSaveFacebookPage = async (pageId: string, pageName: string, accessToken: string) => {
        try {
            await API.post('/fb/save-global-page', { pageId, pageName, pageAccessToken: accessToken });
            showNotification("Facebook page connected!", "success");
            fetchFacebookStatus();
            setFbPages([]);
        } catch (err) {
            showNotification("Failed to save page", "error");
        }
    };

    const handleFacebookTestPost = async () => {
        setFbLoading(true);
        try {
            const res = await API.post('/fb/test-post');
            if (res.data.success) {
                showNotification("Success! Check your FB page.", "success");
            }
        } catch (err: any) {
            showNotification(err.response?.data?.msg || "Test post failed", "error");
        } finally {
            setFbLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-8 font-['Outfit']">
            {/* Header section */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-3xl">
                        📱
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Facebook Auto-Post Settings</h2>
                        <p className="text-gray-500 dark:text-gray-400">Connect your page to automatically share news</p>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-12 flex flex-col items-center text-center">
                    {fbStatus?.connected ? (
                        <div className="w-full max-w-sm">
                            <div className="text-6xl text-[#1877F2] mb-6 flex justify-center">
                                <FaFacebook />
                            </div>
                            <h3 className="text-xl font-bold text-emerald-500 mb-2">✓ System Connected</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
                                Posting to: <strong className="text-gray-900 dark:text-white">{fbStatus.facebook.pageName}</strong>
                            </p>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleFacebookTestPost}
                                    disabled={fbLoading}
                                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {fbLoading ? 'Processing...' : '🚀 Test Post to Facebook'}
                                </button>
                                <button
                                    onClick={handleDisconnectFacebook}
                                    className="w-full py-3.5 border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold rounded-xl transition-all"
                                >
                                    🔌 Disconnect Facebook
                                </button>
                            </div>
                        </div>
                    ) : fbPages.length > 0 ? (
                        <div className="w-full">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select Facebook Page</h3>
                            <p className="text-gray-500 mb-8">Choose the page where news should be posted</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                {fbPages.map(page => (
                                    <div
                                        key={page.id}
                                        className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 cursor-pointer transition-all group"
                                        onClick={() => handleSaveFacebookPage(page.id, page.name, page.access_token)}
                                    >
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-500">{page.name}</h4>
                                        <div className="text-xs text-gray-400 font-mono mb-4">ID: {page.id}</div>
                                        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors">
                                            Select this Page
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-md">
                            <div className="text-6xl text-gray-200 dark:text-gray-700 mb-6 flex justify-center">
                                <FaFacebook />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Not Connected</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">
                                Authorize your Facebook account to enable automatic news sharing to your pages.
                            </p>
                            <button
                                onClick={handleFacebookConnect}
                                disabled={fbLoading}
                                className="w-full py-4 bg-[#1877F2] hover:bg-[#0e69de] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <FaFacebook className="text-xl" />
                                {fbLoading ? 'Connecting...' : 'Connect Facebook Page'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Help / Footer section */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="text-lg">💡</span> How it works?
                </h4>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
                    <li className="flex gap-2">
                        <span className="text-emerald-500">✅</span>
                        Once connected, every "Published" news will be shared automatically.
                    </li>
                    <li className="flex gap-2">
                        <span className="text-emerald-500">✅</span>
                        No manual copy-pasting required.
                    </li>
                    <li className="flex gap-2">
                        <span className="text-emerald-500">✅</span>
                        You can disconnect anytime from this settings panel.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default FacebookManager;
