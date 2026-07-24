'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutGrid, 
  Briefcase, 
  Sparkles, 
  FileText, 
  Video, 
  Network, 
  Clock, 
  BookOpen, 
  ShieldAlert, 
  Settings, 
  Command,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  BrainCircuit
} from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';

export const navItems = [
  { name: 'Overview', icon: LayoutGrid, key: 'Dashboard' },
  { name: 'Investigation Workspace', icon: Briefcase, key: 'Investigation Workspace' },
  { name: 'Intelligence Workspace', icon: Network, key: 'Intelligence Workspace' },
  { name: 'Reasoning Engine', icon: BrainCircuit, key: 'Reasoning Engine', badge: 'AI' },
  { name: 'Supervisor Command', icon: ShieldAlert, key: 'Supervisor Command' },
  { name: 'AI Copilot', icon: Sparkles, key: 'AI Copilot ⭐', badge: 'AI' },
  { name: 'Knowledge Base', icon: BookOpen, key: 'Knowledge Base' },
  { name: 'Settings', icon: Settings, key: 'Settings' },
];

export default function Sidebar() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const openCopilot = useUIStore((s) => s.openCopilot);
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const showToast = useUIStore((s) => s.showToast);

  return (
    <aside 
      className={`hidden lg:flex border-r flex-col justify-between shrink-0 h-screen sticky top-0 z-40 overflow-hidden transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-[250px]' : 'w-[72px]'
      } ${
        isDarkMode 
          ? 'bg-[#0B0F19] border-[#1E293B] text-white' 
          : 'bg-white border-[#E2E8F0] text-slate-900'
      }`}
    >
      <div className="flex flex-col min-h-0 flex-1">
        {/* Logo Branding & Collapse Toggle */}
        <div className={`py-4 px-3 border-b flex items-center ${isSidebarOpen ? 'justify-between px-5' : 'justify-center'} h-16 shrink-0 ${
          isDarkMode ? 'border-[#1E293B]' : 'border-[#E2E8F0]'
        }`}>
          {isSidebarOpen ? (
            <>
              <Link href="/" className="flex items-center gap-2 overflow-hidden">
                <span className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Arc<span className="text-[#FF5A1F]">Craft</span>
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                  isDarkMode 
                    ? 'bg-[#1E293B] text-[#FF5A1F] border-[#FF5A1F]/30' 
                    : 'bg-[#FFF5F2] text-[#FF5A1F] border-[#FFE4DC]'
                }`}>
                  2.0
                </span>
              </Link>

              <button
                onClick={() => {
                  toggleSidebar();
                  showToast('Sidebar Minimized');
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'hover:bg-[#1E293B] text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-slate-900'
                }`}
                title="Collapse Sidebar"
              >
                <PanelLeftClose size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                toggleSidebar();
                showToast('Sidebar Expanded');
              }}
              className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isDarkMode 
                  ? 'hover:bg-[#1E293B]' 
                  : 'hover:bg-gray-100'
              }`}
              title="Expand Sidebar"
            >
              <span className="text-base font-black tracking-tighter transition-all duration-200 group-hover:opacity-0 group-hover:scale-90">
                <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>A</span>
                <span className="text-[#FF5A1F]">C</span>
              </span>

              <span className="absolute inset-0 flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 text-[#FF5A1F] transition-all duration-200">
                <PanelLeftOpen size={19} />
              </span>
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className={`py-4 flex flex-col gap-1 overflow-y-auto flex-1 ${
          isSidebarOpen ? 'px-3' : 'px-2 items-center'
        }`}>
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.key || (item.key === 'Dashboard' && activeTab === 'Dashboard');
            
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (item.key === 'AI Copilot ⭐') {
                    openCopilot();
                  } else {
                    setActiveTab(item.key);
                    showToast(`Navigated to ${item.name}`);
                  }
                }}
                title={!isSidebarOpen ? item.name : undefined}
                className={`flex items-center transition-all duration-150 cursor-pointer relative ${
                  isSidebarOpen 
                    ? 'w-full justify-between px-3 py-2.5 rounded-xl text-left font-bold text-xs tracking-wider uppercase' 
                    : 'w-10 h-10 justify-center rounded-xl'
                } ${
                  isActive 
                    ? isDarkMode 
                      ? 'bg-[#FF5A1F]/15 text-[#FF5A1F] border border-[#FF5A1F]/30' 
                      : 'bg-[#FFF5F2] text-[#FF5A1F] border border-[#FFE4DC]' 
                    : isDarkMode 
                      ? 'text-gray-400 hover:bg-[#111827] hover:text-gray-200' 
                      : 'text-slate-600 hover:bg-[#F8FAFC] hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp size={16} className={isActive ? 'text-[#FF5A1F]' : 'opacity-70'} />
                  {isSidebarOpen && <span className="truncate">{item.name}</span>}
                </div>

                {item.badge && isSidebarOpen && (
                  <span className="text-[9px] font-mono font-bold bg-[#FF5A1F] text-white px-1.5 py-0.2 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer User Details & Quick Command */}
      <div className={`border-t flex flex-col gap-3 transition-all ${
        isDarkMode ? 'border-[#1E293B]' : 'border-[#E2E8F0]'
      } ${isSidebarOpen ? 'p-3.5' : 'p-2'}`}>
        {isSidebarOpen ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1F2937] text-white font-black text-xs flex items-center justify-center shrink-0 border border-gray-700">
                IA
              </div>
              <div className="flex flex-col text-left overflow-hidden">
                <span className={`text-xs font-bold leading-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Inspector Arjun
                </span>
                <span className="text-[10px] text-gray-400 font-medium truncate">
                  KR PURAM STATION
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-emerald-500">Online</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab('Landing');
                showToast('Signed out successfully.');
              }}
              title="Sign Out of Station OS"
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40' 
                  : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <LogOut size={14} className="text-red-500" />
                <span className="text-xs font-bold">Sign Out</span>
              </div>
              <span className="text-[10px] font-mono opacity-70">Landing →</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setActiveTab('Landing');
              showToast('Signed out successfully.');
            }}
            className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black text-xs flex items-center justify-center mx-auto border border-red-500/20 transition-all cursor-pointer"
            title="Sign Out to Landing Page"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}


