'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  Camera,
  Compass,
  Globe,
  MessageSquareText,
  Mic,
  Network,
  Radio,
  Sparkles,
  UserCheck,
  Video,
} from 'lucide-react';

interface RightIntelligencePanelProps {
  isDarkMode: boolean;
  onOpenCopilot: (prompt?: string) => void;
  onShowToast: (msg: string) => void;
}

export default function RightIntelligencePanel({
  isDarkMode,
  onOpenCopilot,
  onShowToast,
}: RightIntelligencePanelProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  const cardBg = isDarkMode
    ? 'bg-[#111827] border-[#1F2937] text-white'
    : 'bg-white border-[#E2E8F0] text-slate-900 shadow-2xs';

  const itemBg = isDarkMode
    ? 'bg-[#1F2937]/50 border-[#374151]/50 hover:bg-[#1F2937]'
    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100';

  const aiInsights = [
    { title: 'Confidence', value: '94%', tone: 'text-emerald-500', detail: 'Video corroborates witness timeline' },
    { title: 'Contradiction', value: '3 flags', tone: 'text-amber-500', detail: 'Two statements diverge on suspect vehicle' },
    { title: 'Next best action', value: 'FSL handoff', tone: 'text-purple-500', detail: 'Dispatch urgent sample packet to Bangalore lab' },
  ];

  const copilotActions = [
    { label: 'Summarize Case', prompt: 'Summarize the current case with key evidence and next steps.' },
    { label: 'Suggest Next Steps', prompt: 'Suggest the next three operational steps for this investigation.' },
    { label: 'Explain Evidence', prompt: 'Explain the strongest pieces of evidence and their significance.' },
    { label: 'Draft Witness Questions', prompt: 'Draft short witness questions for the pending statement.' },
  ];

  const notifications = [
    { title: 'FSL intake ready', time: '2m ago', tone: 'text-red-500' },
    { title: 'Complaint sync complete', time: '11m ago', tone: 'text-blue-500' },
    { title: 'AI contradiction flagged', time: '29m ago', tone: 'text-purple-500' },
  ];

  return (
    <div className="flex flex-col gap-3.5 w-full">
      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-gray-400">AI Insights</span>
          <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-500">Live</span>
        </div>
        <div className="flex flex-col gap-2">
          {aiInsights.map((item) => (
            <div key={item.title} className={`rounded-2xl border p-2.5 ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">{item.title}</span>
                <span className={`text-sm font-black ${item.tone}`}>{item.value}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-gray-400">AI Copilot</span>
          <Sparkles size={14} className="text-purple-500" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {copilotActions.map((action) => (
            <button key={action.label} onClick={() => onOpenCopilot(action.prompt)} className={`rounded-2xl border p-2.5 text-left transition-all ${itemBg}`}>
              <div className="text-sm font-semibold">{action.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-gray-400">Notifications</span>
          <span className="text-[10px] font-semibold text-slate-500">Filterable center</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {['All', 'Urgent', 'AI', 'Legal'].map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${activeFilter === filter ? 'bg-[#FF5A1F] text-white' : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              {filter}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {notifications.map((item) => (
            <div key={item.title} className={`rounded-2xl border p-2.5 ${itemBg}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle size={13} className={item.tone} />
                  <span className="text-sm font-semibold">{item.title}</span>
                </div>
                <span className="text-[10px] text-slate-500">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-gray-400">Relationship Graph</span>
          <Compass size={14} className="text-blue-500" />
        </div>
        <div className="rounded-2xl border border-dashed border-slate-300/70 p-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Suspect • Witness • Victim • Calls</span>
            <span className="font-semibold text-blue-500">Simple view</span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="rounded-full bg-rose-500/10 px-3 py-2 text-[11px] font-semibold text-rose-600">Suspect</div>
            <div className="h-px w-5 bg-slate-300" />
            <div className="rounded-full bg-amber-500/10 px-3 py-2 text-[11px] font-semibold text-amber-600">Witness</div>
            <div className="h-px w-5 bg-slate-300" />
            <div className="rounded-full bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold text-emerald-600">Victim</div>
          </div>
        </div>
      </div>
    </div>
  );
}
