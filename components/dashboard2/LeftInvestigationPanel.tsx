'use client';

import React from 'react';
import { useInvestigationStore } from '@/lib/stores/investigationStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { 
  ArrowUpRight,
  FileText,
  UserCheck,
  Phone,
  Upload,
  Sparkles,
  FileSearch,
  Fingerprint,
  Users,
  Radio,
  ArrowRight,
  Folders
} from 'lucide-react';

interface LeftInvestigationPanelProps {
  isDarkMode: boolean;
  onContinueInvestigation: () => void;
  onOpenCopilot: (prompt?: string) => void;
  onShowToast: (msg: string) => void;
}

export default function LeftInvestigationPanel({
  isDarkMode,
  onContinueInvestigation,
  onOpenCopilot,
  onShowToast
}: LeftInvestigationPanelProps) {
  const activeCase = useInvestigationStore((s: any) => s.activeCase)!;
  const openFIRSwitcher = useUIStore((s) => s.openFIRSwitcher);

  if (!activeCase) return null;

  // Derive health scores from real case fields
  const evidenceIntegrity = activeCase.hasChargesheet ? 91 : activeCase.hasArrest ? 68 : 42;
  const witnessStatements = Math.min(100, Math.round((activeCase.victims.length / Math.max(1, activeCase.accused.length + activeCase.victims.length)) * 100 + (activeCase.hasArrest ? 20 : 0)));
  const forensicReports = activeCase.hasArrest ? 82 : activeCase.hasChargesheet ? 65 : 38;
  const legalCompliance = Math.min(95, Math.round((activeCase.sections.length / 6) * 80 + (activeCase.hasChargesheet ? 15 : 0)));

  // Dynamic AI recommendations from real case data
  const accused0 = activeCase.accused[0]?.name ?? 'Primary Accused';
  const victim0 = activeCase.victims[0]?.name ?? 'Victim';
  const recs = [
    {
      icon: <Fingerprint size={13} className="text-[#FF5A1F]" />,
      label: `Upload AFIS Fingerprint — ${accused0}`,
      desc: `Latent prints from ${activeCase.policeStation} crime scene.`,
      onClick: () => onShowToast(`Sent fingerprint request for ${accused0} to AFIS Database`),
    },
    {
      icon: <Users size={13} className="text-blue-400" />,
      label: `Record Statement — ${victim0}`,
      desc: `${activeCase.crimeSubHead} victim statement pending.`,
      onClick: () => onShowToast(`Scheduled statement collection for ${victim0}`),
    },
    {
      icon: <Radio size={13} className="text-purple-400" />,
      label: `Request CDR — ${accused0}`,
      desc: `Tower dump request for ${activeCase.district} area — ${activeCase.registrationDate}.`,
      onClick: () => onShowToast(`Sent CDR request for accused ${accused0} to Nodal Officer`),
    },
  ];

  const cardBg = isDarkMode 
    ? 'bg-[#111827] border-[#1F2937] text-white' 
    : 'bg-white border-[#E2E8F0] text-slate-900 shadow-2xs';

  const itemBg = isDarkMode
    ? 'bg-[#1F2937]/50 border-[#374151]/50 hover:bg-[#1F2937]'
    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100';

  const healthColor = (pct: number) =>
    pct >= 80 ? 'bg-emerald-500 text-emerald-500' :
    pct >= 55 ? 'bg-[#FF5A1F] text-[#FF5A1F]' :
    'bg-red-500 text-red-500';

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* 1. CASE HEALTH — derived from activeCase fields */}
      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            CASE HEALTH
          </span>
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            evidenceIntegrity >= 75
              ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
              : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
          }`}>
            {evidenceIntegrity >= 75 ? 'OPTIMAL' : 'ATTENTION'}
          </span>
        </div>

        <div className="flex flex-col gap-2.5 font-sans">
          {[
            { label: 'Evidence Integrity', pct: evidenceIntegrity },
            { label: 'Witness Statements', pct: witnessStatements },
            { label: 'Forensic Reports', pct: forensicReports },
            { label: 'Legal Compliance', pct: legalCompliance },
          ].map(({ label, pct }) => {
            const [barClass, textClass] = healthColor(pct).split(' ');
            return (
              <div key={label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                    {label}
                  </span>
                  <span className={`font-mono font-bold text-xs ${textClass}`}>{pct}%</span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
                  <div className={`h-full ${barClass} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. AI RECOMMENDATIONS — dynamic from activeCase */}
      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
              AI RECOMMENDATIONS
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold text-white bg-[#FF5A1F] px-1.5 py-0.2 rounded-full">
            {recs.length}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {recs.map((rec, i) => (
            <div 
              key={i}
              onClick={rec.onClick}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${itemBg}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                  {rec.icon} {rec.label}
                </span>
                <ArrowUpRight size={13} className="text-gray-400" />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{rec.desc}</p>
            </div>
          ))}
        </div>

        <button 
          onClick={() => onOpenCopilot(`List all active AI recommendations for FIR ${activeCase.crimeNo} — ${activeCase.crimeSubHead}`)}
          className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center gap-1 mt-1 cursor-pointer w-fit"
        >
          <span>View All Recommendations</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* 3. QUICK ACTIONS */}
      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
          QUICK ACTIONS
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={onContinueInvestigation}
            className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 text-left transition-all cursor-pointer ${itemBg}`}
          >
            <FileText size={15} className="text-[#FF5A1F]" />
            <div>
              <div className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Draft Chargesheet</div>
              <div className="text-[9px] text-gray-400 font-medium">Form 173</div>
            </div>
          </button>

          <button 
            onClick={() => onShowToast('Recording Witness Statement...')}
            className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 text-left transition-all cursor-pointer ${itemBg}`}
          >
            <UserCheck size={15} className="text-emerald-500" />
            <div>
              <div className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Record Statement</div>
              <div className="text-[9px] text-gray-400 font-medium">Witness</div>
            </div>
          </button>

          <button 
            onClick={() => onShowToast('Requesting Mobile CDR Data...')}
            className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 text-left transition-all cursor-pointer ${itemBg}`}
          >
            <Phone size={15} className="text-emerald-500" />
            <div>
              <div className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Request CDR</div>
              <div className="text-[9px] text-gray-400 font-medium">Mobile Data</div>
            </div>
          </button>

          <button 
            onClick={() => onShowToast('Opening Evidence Uploader...')}
            className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 text-left transition-all cursor-pointer ${itemBg}`}
          >
            <Upload size={15} className="text-purple-400" />
            <div>
              <div className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Upload Evidence</div>
              <div className="text-[9px] text-gray-400 font-medium">Files / Images</div>
            </div>
          </button>

          <button 
            onClick={() => onOpenCopilot(`Run full AI scan on evidence locker and suspects for FIR ${activeCase.crimeNo}`)}
            className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 text-left transition-all cursor-pointer ${itemBg}`}
          >
            <Sparkles size={15} className="text-purple-400" />
            <div>
              <div className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Run AI Analysis</div>
              <div className="text-[9px] text-gray-400 font-medium">Full Scan</div>
            </div>
          </button>

          {/* Switch FIR — now built into Quick Actions */}
          <button 
            onClick={openFIRSwitcher}
            className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 text-left transition-all cursor-pointer ${itemBg}`}
          >
            <Folders size={15} className="text-[#FF5A1F]" />
            <div>
              <div className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Switch FIR</div>
              <div className="text-[9px] text-gray-400 font-medium">Browse 1,079</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
