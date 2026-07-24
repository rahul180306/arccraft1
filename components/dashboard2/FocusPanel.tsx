'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Briefcase, 
  CheckCircle2, 
  ChevronDown, 
  ShieldAlert,
  User,
  FileText,
  Sparkles
} from 'lucide-react';
import PremiumButton from '@/components/ui/PremiumButton';
import StatusBadge from '@/components/ui/StatusBadge';

interface FocusPanelProps {
  onContinueInvestigation: () => void;
  onSelectCase: (firNo: string) => void;
  isDarkMode?: boolean;
}

export default function FocusPanel({ onContinueInvestigation, onSelectCase, isDarkMode = false }: FocusPanelProps) {
  const [selectedCase, setSelectedCase] = useState({
    firNumber: 'FIR KRP/2026/0456',
    crimeType: 'Burglary & House Breaking',
    location: 'Building #4B, Anekal Main Road, KR Puram',
    status: 'Evidence Collection Pending',
    severity: 'High',
    deadline: 'Today 5:00 PM',
    timeRemaining: '180 mins remaining for Initial Site Seizure Report',
    io: 'Inspector Arjun (IO)',
    ps: 'KR Puram Police Station'
  });

  const [showCaseDropdown, setShowCaseDropdown] = useState(false);

  const activeCases = [
    {
      firNumber: 'FIR KRP/2026/0456',
      crimeType: 'Burglary & House Breaking',
      location: 'Building #4B, Anekal Main Road, KR Puram',
      status: 'Evidence Collection Pending',
      severity: 'High',
      deadline: 'Today 5:00 PM',
      timeRemaining: '180 mins remaining for Initial Site Seizure Report',
      io: 'Inspector Arjun (IO)',
      ps: 'KR Puram Police Station'
    },
    {
      firNumber: 'FIR KRP/2026/0412',
      crimeType: 'Chain Snatching & Robbery',
      location: 'Near MG Road Metro Gate 3',
      status: 'Suspect Identification Pending',
      severity: 'Critical',
      deadline: 'Today 7:30 PM',
      timeRemaining: '330 mins remaining for CCTV keyframe dump',
      io: 'Inspector Arjun (IO)',
      ps: 'KR Puram Police Station'
    },
    {
      firNumber: 'FIR KRP/2026/0388',
      crimeType: 'NDPS Drug Seizure',
      location: 'Seegehalli Checkpost',
      status: 'Malkhana Seizure Log',
      severity: 'Medium',
      deadline: 'Tomorrow 11:00 AM',
      timeRemaining: '18 hrs remaining for Court Sample Submission',
      io: 'Inspector Arjun (IO)',
      ps: 'KR Puram Police Station'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-[28px] p-6 sm:p-8 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white shadow-2xl border border-gray-800 ambient-grid-dark' 
          : 'bg-gradient-to-br from-white via-slate-50 to-orange-50/20 text-slate-900 shadow-xl border border-slate-200/90'
      }`}
    >
      {/* Decorative ambient glowing lights */}
      <div className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-pulse ${
        isDarkMode ? 'bg-[#FF5A1F]/20' : 'bg-[#FF5A1F]/10'
      }`} />
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-bl-full pointer-events-none" />

      {/* Top Banner Row */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 ${
        isDarkMode ? 'border-gray-800' : 'border-slate-200/80'
      }`}>
        <div className="flex items-center gap-3.5">
          <span className="flex h-3.5 w-3.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5A1F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#FF5A1F]"></span>
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge label="TODAY'S PRIORITY INVESTIGATION ⭐" type="ai" />
              <StatusBadge label={`SEVERITY: ${selectedCase.severity}`} type="urgent" />
            </div>
            <h2 className={`text-xl sm:text-2xl font-black tracking-tight mt-1.5 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              <span>{selectedCase.firNumber}</span>
              <span className={`text-xs font-mono font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-slate-500'
              }`}>({selectedCase.ps})</span>
            </h2>
          </div>
        </div>

        {/* Switch Case Selector */}
        <div className="relative">
          <button 
            onClick={() => setShowCaseDropdown(!showCaseDropdown)}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-2xl transition-all cursor-pointer shadow-xs ${
              isDarkMode 
                ? 'bg-gray-800/90 hover:bg-gray-700 border border-gray-700 text-gray-200 hover:border-[#FF5A1F]/50' 
                : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 hover:border-[#FF5A1F]/60'
            }`}
          >
            <Briefcase size={15} className="text-[#FF5A1F]" />
            <span>Switch Priority Case</span>
            <ChevronDown size={14} className={isDarkMode ? 'text-gray-400' : 'text-slate-500'} />
          </button>

          <AnimatePresence>
            {showCaseDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 top-12 w-80 rounded-2xl shadow-2xl p-2.5 z-50 border ${
                  isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 font-mono ${
                  isDarkMode ? 'text-gray-400' : 'text-slate-500'
                }`}>
                  Active Assigned Cases ({activeCases.length})
                </div>
                {activeCases.map((c) => (
                  <button
                    key={c.firNumber}
                    onClick={() => {
                      setSelectedCase(c);
                      setShowCaseDropdown(false);
                      onSelectCase(c.firNumber);
                    }}
                    className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex flex-col gap-1 transition-all ${
                      selectedCase.firNumber === c.firNumber 
                        ? 'bg-[#FF5A1F]/15 border border-[#FF5A1F]/40 text-[#FF5A1F]' 
                        : isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{c.firNumber}</span>
                      <span className="text-[9px] text-[#FF5A1F] font-mono font-bold uppercase">{c.severity}</span>
                    </div>
                    <span className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>{c.crimeType}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Focus Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        {/* Crime Meta */}
        <div className="flex flex-col gap-2">
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
            isDarkMode ? 'text-gray-400' : 'text-slate-500'
          }`}>Crime Type & Location</span>
          <div className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedCase.crimeType}</div>
          <div className={`flex items-center gap-2 text-xs font-medium mt-0.5 ${
            isDarkMode ? 'text-gray-300' : 'text-slate-700'
          }`}>
            <MapPin size={14} className="text-[#FF5A1F] shrink-0" />
            <span className="truncate">{selectedCase.location}</span>
          </div>
          <div className={`flex items-center gap-2 text-[11px] ${
            isDarkMode ? 'text-gray-400' : 'text-slate-500'
          }`}>
            <User size={14} className="shrink-0" />
            <span>IO: {selectedCase.io}</span>
          </div>
        </div>

        {/* Current Stage */}
        <div className={`flex flex-col gap-2 border-l-0 md:border-l md:pl-6 ${
          isDarkMode ? 'border-gray-800' : 'border-slate-200/80'
        }`}>
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
            isDarkMode ? 'text-gray-400' : 'text-slate-500'
          }`}>Current Stage</span>
          <div className="inline-flex items-center gap-2 bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF5A1F] px-3.5 py-1.5 rounded-xl text-xs font-extrabold self-start shadow-2xs">
            <CheckCircle2 size={14} />
            <span>{selectedCase.status}</span>
          </div>
          <span className={`text-[11px] leading-snug ${
            isDarkMode ? 'text-gray-400' : 'text-slate-600'
          }`}>
            3 physical evidence items logged. Scene inspection completed by IO Arjun.
          </span>
        </div>

        {/* Urgent Action Deadline */}
        <div className={`flex flex-col gap-2 border-l-0 md:border-l md:pl-6 ${
          isDarkMode ? 'border-gray-800' : 'border-slate-200/80'
        }`}>
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isDarkMode ? 'text-amber-400' : 'text-amber-700'
          }`}>
            <Clock size={13} /> Target Deadline
          </span>
          <div className={`text-sm font-extrabold ${
            isDarkMode ? 'text-amber-300' : 'text-amber-900'
          }`}>{selectedCase.deadline}</div>
          <div className={`text-[11px] font-mono px-3 py-1.5 rounded-xl border ${
            isDarkMode 
              ? 'text-amber-200 bg-amber-500/10 border-amber-500/20' 
              : 'text-amber-900 bg-amber-50 border-amber-200 font-bold'
          }`}>
            ⚠️ {selectedCase.timeRemaining}
          </div>
        </div>
      </div>

      {/* Action CTA Bar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t ${
        isDarkMode ? 'border-gray-800' : 'border-slate-200/80'
      }`}>
        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
          Next Step: <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Collect exit gate CCTV & dispatch physical prints to FSL</span>
        </div>

        <div className="w-full sm:w-auto">
          <PremiumButton
            variant="primary"
            size="md"
            onClick={onContinueInvestigation}
            icon={<ArrowRight size={15} />}
            className="w-full sm:w-auto"
          >
            Continue Investigation
          </PremiumButton>
        </div>
      </div>
    </motion.div>
  );
}
