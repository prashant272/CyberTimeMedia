"use client";
import React, { useState, useCallback, FC, useContext } from "react";
import dynamic from "next/dynamic";
import { UserContext } from "@/app/Dashboard/Context/ManageUserContext";
import { NewsItem } from "@/app/hooks/NewsApi";

// Lazy-load sub-components to optimize initial bundle size
const NewsManager = dynamic(() => import("./components/NewsManager"), {
  loading: () => <div className="p-10 text-center text-[1.2rem] text-slate-500 animate-pulse">Loading News Manager...</div>
});
const AdManager = dynamic(() => import("./components/AdManager"), {
  loading: () => <div className="p-10 text-center text-[1.2rem] text-slate-500 animate-pulse">Loading Ad Manager...</div>
});
const UserManager = dynamic(() => import("./components/UserManager"), {
  loading: () => <div className="p-10 text-center text-[1.2rem] text-slate-500 animate-pulse">Loading User Manager...</div>
});
const AnalyticsDashboard = dynamic(() => import("./components/AnalyticsDashboard"), {
  loading: () => <div className="p-10 text-center text-[1.2rem] text-slate-500 animate-pulse">Loading Analytics...</div>
});
const FacebookManager = dynamic(() => import("./components/FacebookManager"), {
  loading: () => <div className="p-10 text-center text-[1.2rem] text-slate-500 animate-pulse">Loading Facebook Settings...</div>
});
const BreakingNewsManager = dynamic(() => import("./components/BreakingNewsManager"), {
  loading: () => <div className="p-10 text-center text-[1.2rem] text-slate-500 animate-pulse">Loading Breaking News...</div>
});
const CricketManager = dynamic(() => import("./components/CricketManager"), {
  loading: () => <div className="p-10 text-center text-[1.2rem] text-slate-500 animate-pulse">Loading Cricket Manager...</div>
});

interface MainSectionProps {
  section: 'news_management' | 'ad_management' | 'previous_news' | 'analytics' | 'user_management' | 'facebook_settings' | 'breaking_news' | 'cricket_management';
  initialDraft?: NewsItem | null;
}

const MainSection: FC<MainSectionProps> = ({ section, initialDraft }) => {
  const { UserAuthData } = useContext(UserContext) as any;
  const userPermissions = UserAuthData?.permissions || {};
  const userRole = UserAuthData?.role || "USER";
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  const canCreate = userPermissions.create !== false;
  const canRead = userPermissions.read !== false;
  const canUpdate = userPermissions.update !== false;
  const canDelete = userPermissions.delete !== false;

  const [showToast, setShowToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = useCallback((message: string, type: "success" | "error") => {
    setShowToast({ message, type });
    // Auto-hide toast after 3 seconds
    setTimeout(() => setShowToast(null), 3000);
  }, []);

  if (!canRead) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center gap-4 bg-white/5 border border-red-500/20 rounded-2xl">
        <div className="text-4xl text-red-500">🔒</div>
        <h3 className="text-xl font-bold text-[#f1f5f9]">Access Denied</h3>
        <p className="text-slate-400">You don't have permission to view this section.</p>
        <p className="text-sm text-slate-500 font-mono">Role: {userRole}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-4 transition-colors duration-300">
      {showToast && (
        <div className={`fixed top-6 right-6 md:top-4 md:right-4 md:left-4 p-4 px-6 bg-[#334155] rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] flex items-center gap-3 z-[9999] animate-slide-in-right min-w-[320px] md:min-w-0 border border-[#475569] ${showToast.type === 'success' ? 'border-l-4 border-emerald-500' : 'border-l-4 border-red-500'}`}>
          <span className={`w-10 h-10 rounded-full flex items-center justify-center text-[1.25rem] font-bold shrink-0 ${showToast.type === "success" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
            {showToast.type === "success" ? "✓" : "✕"}
          </span>
          <span className="text-[#f1f5f9] font-medium">{showToast.message}</span>
        </div>
      )}
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-5 mb-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center gap-6 flex-wrap font-sans">
            <div className="flex-1 min-w-[250px]">
              <h1 className="text-[2.25rem] md:text-[1.75rem] font-extrabold text-[#0f172a] m-0 mb-1 flex items-center gap-3 tracking-tighter">
                <span className="text-[2.5rem] md:text-[2rem] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                  {section === 'news_management' ? '📝' :
                    section === 'ad_management' ? '📢' :
                      section === 'analytics' ? '📊' :
                        section === 'user_management' ? '👥' :
                          section === 'breaking_news' ? '🔥' :
                            section === 'facebook_settings' ? '📱' :
                              section === 'cricket_management' ? '🏏' : '📁'}
                </span>
                {section === 'news_management' ? 'News Management' :
                  section === 'ad_management' ? 'Ad Management' :
                    section === 'analytics' ? 'Analytics' :
                      section === 'user_management' ? 'User Management' :
                        section === 'breaking_news' ? 'Breaking News' :
                          section === 'facebook_settings' ? 'Facebook Settings' :
                            section === 'cricket_management' ? 'Cricket Management' : 'Previous News'}
              </h1>
              <p className="text-[1rem] text-slate-500 m-0 font-medium">
                {section === 'news_management' ? 'Add new articles to any category' :
                  section === 'ad_management' ? 'Manage advertisements across the platform' :
                    section === 'analytics' ? 'Platform overview and performance' :
                      section === 'user_management' ? 'Manage administrators and permissions' :
                        section === 'breaking_news' ? 'Manage live breaking news headlines' :
                          section === 'facebook_settings' ? 'Configure auto-posting to Facebook' :
                            section === 'cricket_management' ? 'Select and track live matches' :
                              'View and manage previously published news'}
                {userRole !== "USER" && <span className="inline-flex items-center px-3 py-1 bg-blue-500/15 text-blue-400 rounded-md text-[0.875rem] font-bold ml-2"> • {userRole}</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Modular Sections */}
        {(section === 'news_management' || section === 'previous_news') && (
          <NewsManager
            section={section}
            initialDraft={initialDraft}
            canCreate={canCreate}
            canUpdate={canUpdate}
            canDelete={canDelete}
            userAuthData={UserAuthData}
            showNotification={showNotification}
          />
        )}

        {section === 'ad_management' && (
          <AdManager
            canCreate={canCreate}
            canUpdate={canUpdate}
            canDelete={canDelete}
            showNotification={showNotification}
          />
        )}

        {section === 'user_management' && (
          <UserManager
            isSuperAdmin={isSuperAdmin}
            showNotification={showNotification}
          />
        )}

        {section === 'analytics' && (
          <AnalyticsDashboard
            isSuperAdmin={isSuperAdmin}
          />
        )}

        {section === 'facebook_settings' && (
          <FacebookManager
            showNotification={showNotification}
          />
        )}
        {section === 'breaking_news' && (
          <BreakingNewsManager />
        )}
        {section === 'cricket_management' && (
          <CricketManager />
        )}
      </div>
    </div>
  );
};

export default MainSection;
