"use client";
import React, { useState } from "react";

interface NewsLayoutProps {
  children?: React.ReactNode;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const NewsLayout: React.FC<NewsLayoutProps> = ({
  children,
  tabs = [],
  activeTab = tabs[0] || "",
  onTabChange
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "content", label: "Content", icon: "📝" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const handleTabClick = (tab: string) => {
    onTabChange?.(tab);
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-[#e5e7eb] font-sans overflow-hidden">
      {/* ========== NAVBAR ========== */}
      <header className="h-16 px-6 flex items-center justify-between bg-[#0f172a]/96 border-b border-[#1f2937] backdrop-blur-xl sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.3)] gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[radial-gradient(circle,#22c55e,#0d9488)] shadow-[0_0_12px_rgba(34,197,94,0.5)] animate-pulse" />
            <span className="font-bold tracking-wider text-[1.1rem] bg-gradient-to-br from-[#f9fafb] to-[#22c55e] bg-clip-text text-transparent">News Admin</span>
          </div>
          <span className="px-2 py-1 bg-[#22c55e]/15 text-[#22c55e] rounded-full text-[0.7rem] font-semibold tracking-wider border border-[#22c55e]/30">v2.0</span>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-center md:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`border-none px-4 py-2 rounded-full bg-transparent text-[#9ca3af] text-[0.85rem] cursor-pointer transition-all duration-150 flex items-center gap-2 font-medium relative hover:bg-slate-900/85 hover:text-[#e5e7eb] hover:-translate-y-0.5 ${activeNav === item.id ? "!bg-gradient-to-br from-[#22c55e]/20 to-[#0ea5e9]/10 !text-[#22c55e] border border-[#22c55e]/30 after:content-[''] after:absolute after:bottom-[-1px] after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-0.5 after:bg-[#22c55e] after:rounded-full" : ""
                }`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="text-[1rem]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center md:hidden">
            <span className="absolute left-3 text-[0.9rem] text-[#6b7280] pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder="Search news..."
              className="p-[0.5rem_0.5rem_0.5rem_2.25rem] bg-white/5 border border-[#1f2937] rounded-full text-[#e5e7eb] text-[0.85rem] w-48 transition-all duration-200 placeholder:text-[#6b7280] focus:outline-none focus:bg-white/8 focus:border-[#22c55e] focus:w-64 focus:ring-3 focus:ring-[#22c55e]/10"
            />
          </div>

          <button
            className="relative bg-transparent border border-[#1f2937] rounded-full w-9 h-9 flex items-center justify-center cursor-pointer transition-all duration-150 text-[1.1rem] hover:bg-slate-900/85 hover:border-[#374151] hover:scale-105"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            <span className="absolute -top-1 -right-1 bg-[#ef4444] text-white rounded-full text-[0.65rem] font-bold min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-[#0f172a]">3</span>
          </button>

          <div className="flex items-center gap-3 px-2 py-1 bg-white/3 rounded-full border border-[#1f2937] cursor-pointer transition-all duration-150 hover:bg-white/6 hover:border-[#374151]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22c55e] to-[#0ea5e9] flex items-center justify-center text-[0.8rem] font-bold text-[#020617] shrink-0">JD</div>
            <div className="flex flex-col gap-0.5 sm:hidden">
              <div className="text-[0.8rem] font-semibold text-[#e5e7eb] leading-none">John Doe</div>
              <div className="text-[0.7rem] text-[#6b7280] leading-none">Admin</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ========== SIDEBAR TABS ========== */}
        {tabs.length > 0 && (
          <div className={`border-r border-[#1f2937] bg-gradient-to-b from-[#020617] to-black p-4 flex flex-col gap-4 overflow-y-auto transition-all duration-200 ${isSidebarCollapsed ? "w-[72px] px-2" : "w-[280px]"}`}>
            <div className="flex items-center justify-between text-[0.75rem] uppercase tracking-widest text-[#6b7280] px-2 font-semibold">
              <span className={isSidebarCollapsed ? "hidden" : "block"}>Sections</span>
              <button
                className="bg-transparent border border-[#1f2937] text-[#6b7280] rounded-md w-6 h-6 flex items-center justify-center cursor-pointer transition-all duration-150 text-[0.85rem] hover:bg-slate-900/85 hover:text-[#e5e7eb] hover:border-[#374151]"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                {isSidebarCollapsed ? "→" : "←"}
              </button>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`group flex items-center gap-3 w-full p-3 rounded-xl border-none bg-transparent text-[#e5e7eb] text-[0.85rem] text-left cursor-pointer transition-all duration-150 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#22c55e] before:scale-y-0 before:transition-transform before:duration-200 hover:bg-white/5 hover:translate-x-1 ${activeTab === tab ? "bg-gradient-to-r from-[#22c55e]/15 to-[#22c55e]/5 text-[#f9fafb] border border-[#22c55e]/30 before:scale-y-100" : ""
                    }`}
                  onClick={() => handleTabClick(tab)}
                >
                  <span className="text-[1.3rem] shrink-0 transition-transform duration-200 group-hover:scale-110">
                    {tab === 'India' ? '🇮🇳' :
                      tab === 'Sports' ? '⚽' :
                        tab === 'Business' ? '📈' :
                          tab === 'Entertainment' ? '🎬' :
                            tab === 'Lifestyle' ? '💅' : '📰'}
                  </span>
                  <div className={`flex flex-col gap-0.5 flex-1 min-w-0 ${isSidebarCollapsed ? "hidden" : "block"}`}>
                    <span className="font-semibold leading-tight">{tab}</span>
                  </div>
                  {(activeTab === tab && !isSidebarCollapsed) && <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="fixed top-[72px] right-6 w-80 bg-[#0f172a] border border-[#1f2937] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-[100] overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-[#1f2937] flex items-center justify-between">
              <h3 className="m-0 text-[0.95rem] font-bold text-[#f9fafb]">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="bg-transparent border-none text-[#9ca3af] cursor-pointer text-[1.2rem] w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/5"
              >
                ✕
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-[#1f2937] last:border-b-0 flex gap-3 transition-colors duration-150 hover:bg-white/3 cursor-pointer">
                <span className="text-[1.2rem] shrink-0">✅</span>
                <div className="flex flex-col gap-1">
                  <div className="text-[0.85rem] font-medium text-[#e5e7eb]">Article published</div>
                  <div className="text-[0.7rem] text-[#6b7280]">2 mins ago</div>
                </div>
              </div>
              <div className="p-4 border-b border-[#1f2937] last:border-b-0 flex gap-3 transition-colors duration-150 hover:bg-white/3 cursor-pointer">
                <span className="text-[1.2rem] shrink-0">💬</span>
                <div className="flex flex-col gap-1">
                  <div className="text-[0.85rem] font-medium text-[#e5e7eb]">New comment received</div>
                  <div className="text-[0.7rem] text-[#6b7280]">1 hour ago</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto bg-[radial-gradient(circle_at_top_left,#020617,#010309_60%)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NewsLayout;
