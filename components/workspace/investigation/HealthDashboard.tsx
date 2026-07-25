import React, { useState } from 'react';
import { ShieldCheck, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { pageItemVariants } from '@/lib/motion';

export default function HealthDashboard({
  healthMetrics,
  statutoryDeadlineDays,
  isDarkMode
}: {
  healthMetrics: any[];
  statutoryDeadlineDays: number;
  isDarkMode: boolean;
}) {
  const [activeHealthDetail, setActiveHealthDetail] = useState<string | null>(null);
  const [showHealthFormula, setShowHealthFormula] = useState(false);

  const healthScore = Math.round(
    healthMetrics.reduce((sum, metric) => sum + metric.value * metric.weight, 0)
  );
  
  const healthFormula = `${healthMetrics
    .map((metric) => `${metric.label} (${Math.round(metric.weight * 100)}%)`)
    .join(' + ')} = ${healthScore}%`;
  
  const bottleneckValue = Math.min(...healthMetrics.map((metric) => metric.value));
  const deadlineWarning = healthMetrics.some(
    (metric) => metric.label === 'Legal Readiness' && metric.value < 80 && statutoryDeadlineDays <= 3
  );

  const cardBg = isDarkMode
    ? 'bg-[#111827] border-[#1F2937] text-white'
    : 'bg-white border-[#E2E8F0] text-slate-900 shadow-sm transition-shadow hover:shadow-md';

  return (
    <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 relative overflow-hidden ${cardBg}`}>
      {/* Background Pulse Glow based on health score */}
      <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none ${
        healthScore > 80 ? 'bg-emerald-500' : healthScore > 60 ? 'bg-amber-500' : 'bg-red-500'
      }`} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className={healthScore >= 80 ? 'text-emerald-500' : 'text-amber-500'} />
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Investigation Health</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowHealthFormula(!showHealthFormula)}
            className="text-[9px] font-mono text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Maximize2 size={10} />
            Show Formula
          </button>
        </div>
      </div>

      {showHealthFormula && (
        <div className={`p-2.5 rounded-xl border text-[10px] font-mono ${isDarkMode ? 'bg-[#1F2937]/50 border-gray-700 text-gray-400' : 'bg-slate-50 border-gray-200 text-slate-500'}`}>
          <div className="mb-1 text-slate-300 font-bold">Calculation Model:</div>
          <div>{healthFormula}</div>
        </div>
      )}

      <div className="flex items-center gap-5 my-2">
        <div className="flex flex-col">
          <div className="flex items-end gap-1">
            <span className={`text-4xl font-black tracking-tighter ${
              healthScore >= 80 ? 'text-emerald-500' : healthScore >= 60 ? 'text-amber-500' : 'text-red-500'
            }`}>{healthScore}</span>
            <span className="text-sm font-bold text-slate-500 mb-1">/ 100</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Composite Score</span>
        </div>
        
        <div className="flex-1 space-y-2">
          {healthMetrics.map((metric) => (
            <div 
              key={metric.label} 
              className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${
                activeHealthDetail === metric.label 
                  ? (isDarkMode ? 'bg-[#1F2937]' : 'bg-slate-100') 
                  : (isDarkMode ? 'hover:bg-[#1F2937]/50' : 'hover:bg-slate-50')
              }`}
              onMouseEnter={() => setActiveHealthDetail(metric.label)}
              onMouseLeave={() => setActiveHealthDetail(null)}
            >
              <span className="text-[10px] font-bold w-28 truncate">{metric.label}</span>
              <div className={`flex-1 h-1.5 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-slate-200'} overflow-hidden`}>
                <div 
                  className={`h-full rounded-full ${metric.color.replace('text-', 'bg-')}`} 
                  style={{ width: `${metric.value}%` }}
                />
              </div>
              <span className={`text-[10px] font-mono font-bold w-8 text-right ${metric.color}`}>{metric.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-2 p-3 rounded-xl border text-[11px] leading-relaxed transition-all ${
        isDarkMode ? 'bg-[#1F2937]/30 border-gray-800 text-gray-300' : 'bg-slate-50 border-gray-200 text-slate-600'
      }`}>
        {activeHealthDetail ? (
          <div>
            <strong className="text-[#FF5A1F]">{activeHealthDetail}:</strong> {healthMetrics.find((m: any) => m.label === activeHealthDetail)?.description}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div>
              <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>AI Diagnostic:</strong> Investigation is progressing well, but constrained by the lowest bottleneck (<span className="text-amber-500 font-bold">{bottleneckValue}%</span>).
            </div>
            {deadlineWarning && (
              <div className="text-red-400 font-bold flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                CRITICAL: Legal Readiness ({healthMetrics.find((m: any) => m.label === 'Legal Readiness')?.value}%) is too low for the upcoming statutory deadline ({statutoryDeadlineDays} days).
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
