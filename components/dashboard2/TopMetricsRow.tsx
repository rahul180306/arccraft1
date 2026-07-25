'use client';

import React from 'react';
import { Briefcase, FolderArchive, Brain, Clock, ArrowUpRight, Shield, IndianRupee } from 'lucide-react';
import { useInvestigationStore } from '@/lib/stores/investigationStore';
import { useDashboardMetrics } from '@/lib/stores/selectors';

interface TopMetricsRowProps {
  isDarkMode: boolean;
  onOpenCase?: () => void;
  onShowToast?: (msg: string) => void;
}

export default function TopMetricsRow({ isDarkMode, onOpenCase, onShowToast }: TopMetricsRowProps) {
  const cardBgClass = isDarkMode 
    ? 'bg-[#111827] border-[#1F2937] text-white' 
    : 'bg-white border-[#E2E8F0] text-slate-900 shadow-2xs';

  const activeCase = useInvestigationStore(s => s.activeCase)!;
  const metrics = useDashboardMetrics();

  // Real conviction rate from dataset: 220 convicted / 1079 total
  const convictionRate = Math.round((metrics.convicted / metrics.totalFIRs) * 100);

  // Real active = Under Investigation + Pending Trial
  const activeCasesCount = metrics.underInvestigation + metrics.pendingTrial;

  // Priority case
  const priorityCase = activeCase;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3.5 w-full">
      {/* 1. TODAY'S PRIORITY CASE */}
      <div 
        onClick={() => {
          if (onOpenCase) onOpenCase();
          if (onShowToast) onShowToast(`Opened Priority Case FIR ${priorityCase.crimeNo}`);
        }}
        className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer hover:border-[#FF5A1F]/50 xl:col-span-1 min-h-[105px] ${cardBgClass}`}
      >
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-gray-400">
              {"TODAY'S PRIORITY CASE"}
            </span>
            <span className="text-[9px] font-mono font-bold text-[#FF5A1F] bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 px-1.5 py-0.2 rounded">
              {priorityCase.caseStatus.toUpperCase().slice(0, 6)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-6 h-6 rounded-lg bg-[#FF5A1F] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Briefcase size={13} />
            </div>
            <span className="text-sm font-black tracking-tight leading-none">
              FIR #{priorityCase.crimeNo.slice(-6)}
            </span>
          </div>
        </div>

        <div className="mt-2 text-[10px] leading-tight">
          <div className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
            {priorityCase.crimeSubHead}
          </div>
          <div className="text-gray-400 text-[9px] truncate mt-0.5">
            {priorityCase.policeStation} • IO: {priorityCase.ioName}
          </div>
        </div>
      </div>

      {/* 2. TOTAL FIRs */}
      <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all min-h-[105px] ${cardBgClass}`}>
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-gray-400">
            TOTAL FIRS
          </span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-black tracking-tight">{metrics.totalFIRs.toLocaleString()}</span>
          <span className="text-xs font-bold text-[#FF5A1F] flex items-center">
            {activeCasesCount} Active
          </span>
        </div>
        {/* Sparkline */}
        <div className="h-6 w-full mt-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24" fill="none">
            <path 
              d="M0 20 L20 16 L40 18 L60 8 L80 14 L100 4" 
              stroke="#FF5A1F" 
              strokeWidth="2.2" 
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 3. CONVICTION RATE */}
      <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all min-h-[105px] ${cardBgClass}`}>
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-gray-400">
            CONVICTION RATE
          </span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-black tracking-tight">{convictionRate}%</span>
          <span className="text-xs font-bold text-emerald-500 flex items-center">
            {metrics.convicted} Convicted
          </span>
        </div>
        {/* Sparkline */}
        <div className="h-6 w-full mt-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24" fill="none">
            <path 
              d="M0 18 L20 14 L40 10 L60 15 L80 8 L100 2" 
              stroke="#10B981" 
              strokeWidth="2.2" 
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 4. ACCUSED IN SYSTEM */}
      <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all min-h-[105px] ${cardBgClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FolderArchive size={13} className="text-blue-500" />
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-gray-400">
              PENDING TRIAL
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-black tracking-tight">{metrics.pendingTrial}</span>
          <span className="text-xs font-bold text-amber-500 flex items-center gap-1 mt-0.5">
            {metrics.chargesheeted} Chargesheeted
          </span>
        </div>
        {/* Sparkline */}
        <div className="h-6 w-full mt-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24" fill="none">
            <path 
              d="M0 19 L25 15 L50 17 L75 9 L100 5" 
              stroke="#3B82F6" 
              strokeWidth="2.2" 
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 5. CRIME CATEGORIES */}
      <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all min-h-[105px] ${cardBgClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Brain size={13} className="text-purple-400" />
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-gray-400">
              HEINOUS CRIMES
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-black tracking-tight">{metrics.heinousCases}</span>
        </div>
        
        {/* Metric Details Component */}
        <div className="mt-1 flex-1">
          <div className="text-[10px] text-gray-500 font-medium">
          Body: {metrics.crimeAgainstBody} · Women: {metrics.crimeAgainstWomen} · Children: {metrics.crimeAgainstChildren}
          </div>
        </div>
      </div>

      {/* 6. UNDER INVESTIGATION */}
      <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all min-h-[105px] ${cardBgClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-[#FF5A1F]" />
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-gray-400">
              UNDER INVESTIGATION
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <div className="text-2xl font-black tracking-tight">{metrics.underInvestigation}</div>
          <div className="text-[10px] text-gray-500 font-medium leading-tight">
            {metrics.cyberCrimes} Cyber · {metrics.economicOffences} Economic
          </div>
        </div>
      </div>
    </div>
  );
}
