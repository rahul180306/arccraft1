'use client';

import React from 'react';
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
  ArrowRight
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
  const cardBg = isDarkMode 
    ? 'bg-[#111827] border-[#1F2937] text-white' 
    : 'bg-white border-[#E2E8F0] text-slate-900 shadow-2xs';

  const itemBg = isDarkMode
    ? 'bg-[#1F2937]/50 border-[#374151]/50 hover:bg-[#1F2937]'
    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100';

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* 1. CASE HEALTH */}
      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            CASE HEALTH
          </span>
          <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            OPTIMAL
          </span>
        </div>

        <div className="flex flex-col gap-2.5 font-sans">
          {/* Item 1 */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                Evidence Integrity
              </span>
              <span className="font-mono font-bold text-emerald-500 text-xs">92%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
              <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
            </div>
          </div>

          {/* Item 2 */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                Witness Statements
              </span>
              <span className="font-mono font-bold text-[#FF5A1F] text-xs">68%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
              <div className="h-full bg-[#FF5A1F] rounded-full w-[68%]" />
            </div>
          </div>

          {/* Item 3 */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                Forensic Reports
              </span>
              <span className="font-mono font-bold text-blue-500 text-xs">76%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
              <div className="h-full bg-blue-500 rounded-full w-[76%]" />
            </div>
          </div>

          {/* Item 4 */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                Legal Compliance
              </span>
              <span className="font-mono font-bold text-emerald-500 text-xs">88%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
              <div className="h-full bg-emerald-500 rounded-full w-[88%]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI RECOMMENDATIONS */}
      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
              AI RECOMMENDATIONS
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold text-white bg-[#FF5A1F] px-1.5 py-0.2 rounded-full">
            3
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Rec 1 */}
          <div 
            onClick={() => onShowToast('Sent Fingerprint #4 to AFIS Database')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${itemBg}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                <Fingerprint size={13} className="text-[#FF5A1F]" /> Upload AFIS Fingerprint #4
              </span>
              <ArrowUpRight size={13} className="text-gray-400" />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">
              Latent prints isolated from bedroom safe handle.
            </p>
          </div>

          {/* Rec 2 */}
          <div 
            onClick={() => onShowToast('Scheduled statement for Witness Ramesh')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${itemBg}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                <Users size={13} className="text-blue-400" /> Schedule Witness Statement
              </span>
              <ArrowUpRight size={13} className="text-gray-400" />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">
              Witness Ramesh pending statement.
            </p>
          </div>

          {/* Rec 3 */}
          <div 
            onClick={() => onShowToast('Sent CDR request to Airtel Nodal Officer')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${itemBg}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                <Radio size={13} className="text-purple-400" /> Request Airtel CDR
              </span>
              <ArrowUpRight size={13} className="text-gray-400" />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">
              Tower dump request sent July 20.
            </p>
          </div>
        </div>

        <button 
          onClick={() => onOpenCopilot('List all active AI recommendations for case FIR KRP/2026/0456')}
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
          {/* Tile 1 */}
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

          {/* Tile 2 */}
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

          {/* Tile 3 */}
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

          {/* Tile 4 */}
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

          {/* Tile 5 */}
          <button 
            onClick={() => onOpenCopilot('Run full AI scan on evidence locker and suspects')}
            className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 text-left transition-all cursor-pointer ${itemBg}`}
          >
            <Sparkles size={15} className="text-purple-400" />
            <div>
              <div className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Run AI Analysis</div>
              <div className="text-[9px] text-gray-400 font-medium">Full Scan</div>
            </div>
          </button>

          {/* Tile 6 */}
          <button 
            onClick={() => onShowToast('Generating Case Brief Executive Summary PDF...')}
            className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 text-left transition-all cursor-pointer ${itemBg}`}
          >
            <FileSearch size={15} className="text-blue-500" />
            <div>
              <div className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Generate Report</div>
              <div className="text-[9px] text-gray-400 font-medium">Case Brief</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
