import React from 'react';
import { motion } from 'motion/react';
import { pageItemVariants } from '@/lib/motion';
import { CheckCircle2, Search, X } from 'lucide-react';

export default function EvidencePanel({
  missingEvidence,
  isDarkMode,
  searchQuery,
  setSearchQuery
}: {
  missingEvidence: any[];
  isDarkMode: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  const cardBg = isDarkMode
    ? 'bg-[#111827] border-[#1F2937] text-white'
    : 'bg-white border-[#E2E8F0] text-slate-900 shadow-sm transition-shadow hover:shadow-md';

  return (
    <>
      {/* Missing Evidence Detector */}
      <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-gray-400">Missing Evidence Detector</span>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">Flags evidence categories expected for this FIR but not yet present in the case file.</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#FF5A1F] bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 px-2 py-0.5 rounded-full">Auto-checklist</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {missingEvidence.map((item) => {
            const cardClasses = isDarkMode 
              ? (item.present ? 'border-emerald-900/50 bg-emerald-900/20' : 'border-orange-900/50 bg-orange-900/20')
              : (item.present ? 'bg-white border-emerald-300' : 'bg-white border-orange-300');
            const titleColor = isDarkMode ? 'text-white' : 'text-slate-900';
            const badgeColor = item.present ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-orange-600 bg-orange-50 border-orange-200';
            const descColor = isDarkMode ? 'text-gray-400' : 'text-slate-500';

            return (
              <div key={item.label} className={`rounded-2xl border p-3 ${cardClasses}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {item.present && <CheckCircle2 size={12} className="text-emerald-500" />}
                    <span className={`text-[11px] font-semibold ${titleColor}`}>{item.label}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${badgeColor}`}>{item.present ? 'Present' : 'Missing'}</span>
                </div>
                <p className={`text-[9px] mt-2 ${descColor}`}>{item.present ? 'Evidence found in current records.' : 'Add this evidence type to close gaps.'}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
