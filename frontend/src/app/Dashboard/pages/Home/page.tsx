"use client";

import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from "../../ProtectedRoute/ProtectedRoute";
import MainSection from '@/app/Dashboard/Components/Home/MainSection/Main';
import AINewsManagement from "@/app/Dashboard/Components/Home/AINewsManagement/AINewsManagement";
import EmployeeReports from "@/app/Dashboard/Components/Home/EmployeeReports/EmployeeReports";
import { UserContext } from "@/app/Dashboard/Context/ManageUserContext";
import {
  FileText,
  Cpu,
  Zap,
  Megaphone,
  Folder,
  BarChart2,
  Smartphone,
  Users,
  ClipboardList,
  Trophy,
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

const sections = [
  { id: 'news_management' as const, label: 'News Management', icon: <FileText className="w-5 h-5" /> },
  { id: 'ai_news' as const, label: 'AI News', icon: <Cpu className="w-5 h-5" /> },
  { id: 'breaking_news' as const, label: 'Breaking News', icon: <Zap className="w-5 h-5" /> },
  { id: 'ad_management' as const, label: 'Ad Management', icon: <Megaphone className="w-5 h-5" /> },
  { id: 'previous_news' as const, label: 'Previous News', icon: <Folder className="w-5 h-5" /> },
  { id: 'analytics' as const, label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
  { id: 'facebook_settings' as const, label: 'Facebook Post', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'user_management' as const, label: 'User Management', icon: <Users className="w-5 h-5" /> },
  { id: 'employee_reports' as const, label: 'Employee Reports', icon: <ClipboardList className="w-5 h-5" /> },
  { id: 'cricket_management' as const, label: 'Cricket Management', icon: <Trophy className="w-5 h-5" /> },
] as const;

type SectionId = typeof sections[number]['id'];

export default function NewsAdminPage() {
  const userCtx = useContext(UserContext);
  const userRole = userCtx?.UserAuthData?.role;
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const searchParams = useSearchParams();

  // Filter sections based on role
  const availableSections = sections.filter(s => {
    if (s.id === 'analytics' || s.id === 'user_management' || s.id === 'employee_reports') {
      return isSuperAdmin;
    }
    return true;
  });

  // Read initial section from URL params
  const urlSection = searchParams.get('section') as SectionId | null;
  const validSection = urlSection && sections.find(s => s.id === urlSection) ? urlSection : null;

  const [activeSection, setActiveSection] = useState<SectionId>(validSection || 'news_management');
  const activeSectionData = sections.find(s => s.id === activeSection);
  const [draftToEdit, setDraftToEdit] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update section if URL param changes
  useEffect(() => {
    if (validSection) {
      setActiveSection(validSection);
    }
  }, [validSection]);

  const handleLogout = () => {
    userCtx?.logout();
  };

  const handleEditDraft = (draft: any) => {
    setDraftToEdit(draft);
    setActiveSection('news_management');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-screen">

          {/* Mobile Header / Nav Toggle */}
          <div className="lg:hidden sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">T</div>
              <span className="font-bold tracking-tight">TimeCyber Admin</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Sidebar Overlay */}
          <div className={`lg:hidden fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-md transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 pt-24 h-full flex flex-col">
              <nav className="flex flex-col gap-2 overflow-y-auto">
                {availableSections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${activeSection === section.id
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                        : 'text-slate-400 hover:bg-slate-800/50'
                      }`}
                  >
                    <span className={activeSection === section.id ? 'text-blue-400' : 'text-slate-500'}>
                      {section.icon}
                    </span>
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
              <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                    {userCtx?.UserAuthData?.profilepic ? (
                      <img src={userCtx?.UserAuthData?.profilepic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                        {userCtx?.UserAuthData?.name?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{userCtx?.UserAuthData?.name || 'Logged User'}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{userCtx?.UserAuthData?.role?.replace('_', ' ') || 'User'}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-10 px-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">T</div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-white">TimeCyber</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-bold">Control Panel</span>
              </div>
            </div>

            <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 px-3">Main Menu</p>
              {availableSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-4 p-3.5 rounded-xl transition-all duration-200 group relative ${activeSection === section.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                >
                  <span className={`transition-transform duration-200 ${activeSection === section.id ? 'scale-110' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'}`}>
                    {section.icon}
                  </span>
                  <span className="text-sm font-semibold tracking-wide">{section.label}</span>
                  {activeSection === section.id && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-800/50">
              <div className="bg-slate-800/30 rounded-2xl p-4 flex items-center gap-4 border border-slate-700/50">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-slate-700">
                  {userCtx?.UserAuthData?.profilepic ? (
                    <img src={userCtx?.UserAuthData?.profilepic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                      {userCtx?.UserAuthData?.name?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-bold truncate text-slate-100">{userCtx?.UserAuthData?.name || 'Logged User'}</span>
                  <span className="text-[10px] text-blue-400 font-bold uppercase truncate">{userCtx?.UserAuthData?.role?.replace('_', ' ') || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-slate-800 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shrink-0"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-8 md:p-6 sm:p-4 overflow-y-auto">
            {/* Page Header Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-6 mb-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-black/20 border border-slate-700/50">
                    {activeSectionData?.icon}
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-black tracking-tight text-white mb-1">
                      {activeSectionData?.label}
                    </h2>
                    <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-500">
                      <span>Dashboard</span>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-blue-500">{activeSectionData?.label}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-5 py-2.5 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Live Activity: {activeSection}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-[2rem] overflow-hidden min-h-[600px] shadow-2xl shadow-black/20">
              {activeSection === 'ai_news' ? (
                <AINewsManagement onEdit={handleEditDraft} />
              ) : activeSection === 'employee_reports' ? (
                <EmployeeReports />
              ) : (
                <MainSection section={activeSection as any} initialDraft={activeSection === 'news_management' ? draftToEdit : null} />
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
