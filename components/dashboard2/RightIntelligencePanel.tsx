'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  UserCheck, 
  Radio, 
  Globe, 
  Video, 
  Network, 
  Mic
} from 'lucide-react';

interface RightIntelligencePanelProps {
  isDarkMode: boolean;
  onOpenCopilot: (prompt?: string) => void;
  onShowToast: (msg: string) => void;
}

export default function RightIntelligencePanel({
  isDarkMode,
  onOpenCopilot,
  onShowToast
}: RightIntelligencePanelProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  const cardBg = isDarkMode 
    ? 'bg-[#111827] border-[#1F2937] text-white' 
    : 'bg-white border-[#E2E8F0] text-slate-900 shadow-2xs';

  const itemBg = isDarkMode
    ? 'bg-[#1F2937]/50 border-[#374151]/50 hover:bg-[#1F2937]'
    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100';

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* 1. REAL-TIME INTELLIGENCE FEED */}
      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            REAL-TIME INTELLIGENCE FEED
          </span>
          <span className="text-[9px] font-mono font-bold text-white bg-[#FF5A1F] px-1.5 py-0.2 rounded-full">
            3 NEW
          </span>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {[
            { label: 'All', count: 14 },
            { label: 'ANPR', count: 5 },
            { label: 'FaceMatch', count: 4 },
            { label: 'CDR', count: 3 },
            { label: 'Social', count: 2 },
          ].map((filter) => {
            const isSelected = activeFilter === filter.label;
            return (
              <button
                key={filter.label}
                onClick={() => {
                  setActiveFilter(filter.label);
                  onShowToast(`Filtered by ${filter.label}`);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                    : isDarkMode
                      ? 'bg-[#1F2937] border-gray-800 text-gray-400 hover:text-white'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            );
          })}
        </div>

        {/* Feed Cards */}
        <div className="flex flex-col gap-2">
          {/* Feed 1 */}
          <div 
            onClick={() => onShowToast('ANPR Alert: KA-05-NB-9921 tracked at Hebbal Flyover')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${itemBg}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-ping shrink-0" />
                <span className="text-xs font-bold text-[#FF5A1F] flex items-center gap-1">
                  <Camera size={12} /> ANPR Alert
                </span>
              </div>
              <span className="text-[9px] text-gray-400 font-mono">2 mins ago</span>
            </div>
            <p className={`text-xs leading-snug font-medium ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
              <strong className="font-mono font-bold text-[#FF5A1F]">KA-05-NB-9921</strong> matched stolen Hyundai Creta at Hebbal Flyover.
            </p>
          </div>

          {/* Feed 2 */}
          <div 
            onClick={() => onShowToast('FaceMatch Alert: 89% match for Suspect Ramesh K')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${itemBg}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="text-xs font-bold text-blue-500 flex items-center gap-1">
                  <UserCheck size={12} /> CCTV Facial Recognition
                </span>
              </div>
              <span className="text-[9px] text-gray-400 font-mono">12 mins ago</span>
            </div>
            <p className={`text-xs leading-snug font-medium ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
              89% match for Suspect &apos;Ramesh K&apos; at Yeshwanthpur Station.
            </p>
          </div>

          {/* Feed 3 */}
          <div 
            onClick={() => onShowToast('CDR Anomaly: Tower jump detected on target IMEI')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${itemBg}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                  <Radio size={12} /> CDR Anomaly Alert
                </span>
              </div>
              <span className="text-[9px] text-gray-400 font-mono">28 mins ago</span>
            </div>
            <p className={`text-xs leading-snug font-medium ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
              Suspicious tower jump detected on target IMEI 86429... near Silk Board.
            </p>
          </div>

          {/* Feed 4 */}
          <div 
            onClick={() => onShowToast('Cyber Intel: Telegram channel mention detected')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${itemBg}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <Globe size={12} /> Cyber Intelligence
                </span>
              </div>
              <span className="text-[9px] text-gray-400 font-mono">45 mins ago</span>
            </div>
            <p className={`text-xs leading-snug font-medium ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
              Telegram channel mention of stolen jewellery lot.
            </p>
          </div>
        </div>
      </div>

      {/* 2. LIVE BACKGROUND AI JOBS */}
      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            LIVE BACKGROUND AI JOBS
          </span>
          <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            3 RUNNING
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {/* Job 1 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                <Video size={13} className="text-purple-400" /> CCTV Video Processing
              </span>
              <span className="font-mono text-[10px] font-bold text-purple-400">70%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
              <div className="h-full bg-purple-500 rounded-full w-[70%]" />
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Hebbal Junction Cam 4 • 14/20 hrs processed</span>
          </div>

          {/* Job 2 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                <Network size={13} className="text-blue-500" /> CDR Pattern Clustering
              </span>
              <span className="font-mono text-[10px] font-bold text-blue-500">45%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
              <div className="h-full bg-blue-500 rounded-full w-[45%]" />
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Target #8821 IMEI Map • 2,400 records</span>
          </div>

          {/* Job 3 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                <Mic size={13} className="text-[#FF5A1F]" /> Voice Biometrics Scan
              </span>
              <span className="font-mono text-[10px] font-bold text-[#FF5A1F]">90%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
              <div className="h-full bg-[#FF5A1F] rounded-full w-[90%]" />
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Intercept Call #42 • 89% spectro match</span>
          </div>
        </div>
      </div>
    </div>
  );
}
