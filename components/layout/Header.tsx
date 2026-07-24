'use client';

import React from 'react';
import { Search, Sun, Moon, Bell, ChevronDown } from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';

export default function Header() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const showToast = useUIStore((s) => s.showToast);

  return (
    <header className={`border-b h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-[#0B0F19] border-[#1E293B] text-white' 
        : 'bg-white border-[#E2E8F0] text-slate-900'
    }`}>
      
      {/* Center/Left Search Bar */}
      <div className="flex items-center gap-3 w-full max-w-md md:max-w-2xl">
        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className={`w-full flex items-center justify-between border rounded-xl px-3.5 py-2 transition-all text-left cursor-pointer ${
            isDarkMode 
              ? 'bg-[#111827] border-[#1F2937] hover:border-[#FF5A1F]/40 text-gray-300' 
              : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#FF5A1F]/40 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Search size={16} className="text-gray-400 shrink-0" />
            <span className="text-xs font-medium text-gray-400 truncate">
              Search FIR, Suspect, CCTV...
            </span>
          </div>
          <span className={`hidden sm:block text-[10px] font-mono px-2 py-0.5 rounded-lg font-semibold shrink-0 ml-2 border ${
            isDarkMode 
              ? 'bg-[#1F2937] text-gray-400 border-gray-700' 
              : 'bg-white text-gray-500 border-gray-200 shadow-2xs'
          }`}>
            ⌘ K
          </span>
        </button>
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2 sm:ml-4">
        {/* Theme Shift Dropdown Pill */}
        <button 
          onClick={() => {
            toggleTheme();
            showToast(isDarkMode ? 'Switched to Light Mode' : 'Switched to Night Shift');
          }}
          className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            isDarkMode 
              ? 'bg-[#111827] border-[#1F2937] hover:bg-[#1F2937] text-gray-200' 
              : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-gray-100 text-slate-800'
          }`}
          title="Toggle Theme Mode"
        >
          {isDarkMode ? (
            <>
              <Moon size={14} className="text-gray-300" />
              <span className="hidden sm:inline">Night Shift</span>
            </>
          ) : (
            <>
              <Sun size={14} className="text-[#FF5A1F]" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          )}
          <ChevronDown size={12} className="text-gray-400 ml-0.5 hidden sm:block" />
        </button>

        {/* AI War Room Quick Access */}
        <button 
          onClick={() => {
            const setActiveTab = useUIStore.getState().setActiveTab;
            setActiveTab('Reasoning Engine');
            showToast('Entered AI Investigation War Room');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/20 border border-[#FF5A1F]/30 text-[#FF5A1F] text-xs font-bold transition-all cursor-pointer shadow-xs"
          title="Open AI Investigation War Room"
        >
          <span>🧠 War Room</span>
        </button>

        {/* Notifications Bell */}
        <button 
          onClick={() => showToast('4 high priority law enforcement alerts pending')}
          className={`p-2 rounded-xl border relative transition-colors cursor-pointer ${
            isDarkMode 
              ? 'bg-[#111827] border-[#1F2937] hover:bg-[#1F2937] text-gray-300' 
              : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-gray-100 text-slate-700'
          }`}
          title="View Alerts"
        >
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5A1F] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#0B0F19]">
            4
          </span>
        </button>

      </div>
    </header>
  );
}

