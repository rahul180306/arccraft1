'use client';

import React, { useEffect, useState } from 'react';
import { Briefcase, FolderArchive, Brain, Clock, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { DASHBOARD_METRICS, CASE_ANEKAL_BURGLARY } from '@/lib/data/dummyCases';

interface TopMetricsRowProps {
  isDarkMode: boolean;
  onOpenCase?: () => void;
  onShowToast?: (msg: string) => void;
}

export default function TopMetricsRow({ isDarkMode, onOpenCase, onShowToast }: TopMetricsRowProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 280);
    return () => window.clearTimeout(timer);
  }, []);

  const cardBgClass = isDarkMode
    ? 'bg-[#111827] border-[#1F2937] text-white'
    : 'bg-white border-[#E2E8F0] text-slate-900 shadow-2xs';

  const metricCards = [
    {
      title: "TODAY'S PRIORITY CASE",
      value: `FIR #${CASE_ANEKAL_BURGLARY.firNumber.slice(-6)}`,
      subtitle: CASE_ANEKAL_BURGLARY.crimeSubCategory,
      meta: `${CASE_ANEKAL_BURGLARY.policeStation} • IO ${CASE_ANEKAL_BURGLARY.investigatingOfficer.name}`,
      accent: 'text-[#FF5A1F]',
      icon: Briefcase,
      badge: 'ACTIVE',
      onClick: () => {
        if (onOpenCase) onOpenCase();
        if (onShowToast) onShowToast('Opened Priority Case FIR KRP/2026/0456');
      },
      wide: true,
    },
    {
      title: 'TOTAL FIRS',
      value: DASHBOARD_METRICS.totalFIRs,
      subtitle: `${DASHBOARD_METRICS.activeCases} Active`,
      accent: 'text-[#FF5A1F]',
      icon: ShieldCheck,
      badge: 'LIVE',
      onClick: undefined,
      wide: false,
    },
    {
      title: 'CASE SOLVABILITY',
      value: '68%',
      subtitle: '↑ 12%',
      accent: 'text-emerald-500',
      icon: ShieldCheck,
      badge: 'UP',
      onClick: undefined,
      wide: false,
    },
    {
      title: 'EVIDENCE COLLECTED',
      value: DASHBOARD_METRICS.totalEvidence,
      subtitle: `${DASHBOARD_METRICS.totalAccused} Accused`,
      accent: 'text-blue-500',
      icon: FolderArchive,
      badge: 'SYNCED',
      onClick: undefined,
      wide: false,
    },
    {
      title: 'AI CONFIDENCE',
      value: `${DASHBOARD_METRICS.avgAIConfidence}%`,
      subtitle: 'High Confidence',
      accent: 'text-purple-400',
      icon: Brain,
      badge: 'AI',
      onClick: undefined,
      wide: false,
    },
    {
      title: 'STATUTORY DEADLINES',
      value: '7',
      subtitle: 'Due Soon',
      accent: 'text-[#FF5A1F]',
      icon: Clock,
      badge: 'URGENT',
      onClick: undefined,
      wide: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3.5 w-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={`p-3.5 rounded-2xl border min-h-[114px] animate-pulse ${cardBgClass}`}>
            <div className="h-3 w-20 rounded-full bg-slate-200/80 mb-3" />
            <div className="h-6 w-24 rounded-full bg-slate-200/80 mb-2" />
            <div className="h-3 w-28 rounded-full bg-slate-200/60" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3.5 w-full">
      {metricCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            onClick={card.onClick}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${card.onClick ? 'cursor-pointer hover:border-[#FF5A1F]/50' : ''} min-h-[114px] ${card.wide ? 'xl:col-span-2' : ''} ${cardBgClass}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-gray-400">
                {card.title}
              </span>
              <span className={`text-[9px] font-mono font-bold ${card.accent} bg-current/10 border border-current/20 px-1.5 py-0.2 rounded`}>
                {card.badge}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-current/10 ${card.accent}`}>
                <Icon size={14} />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-black tracking-tight leading-none">
                  {card.value}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 mt-1 truncate">
                  {card.subtitle}
                </div>
              </div>
            </div>
            <div className="text-[10px] leading-tight text-gray-500 mt-1">
              {card.meta ?? null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
