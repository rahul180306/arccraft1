import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, ChevronDown, Share2, MoreHorizontal, Plus, Play, ArrowRight, Video, Camera, CheckCircle2, FileText, Sparkles, Calendar, Upload, MessageSquare, FileSpreadsheet, Presentation, FileCode, ShieldAlert, Circle } from 'lucide-react';
import { pageItemVariants } from '@/lib/motion';
import { KSPCase } from '@/lib/data/realCases';

interface CaseHeaderProps {
  activeCase: KSPCase;
  isDarkMode: boolean;
  setActiveTab: (tab: string) => void;
  showToast: (msg: string) => void;
}

export default function CaseHeader({ activeCase, isDarkMode, setActiveTab, showToast }: CaseHeaderProps) {
  const [caseStatus, setCaseStatus] = useState(activeCase.caseStatus || 'ACTIVE');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showAddNewMenu, setShowAddNewMenu] = useState(false);

  return (
    <motion.div variants={pageItemVariants} className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
        <span
          onClick={() => showToast('Navigated to Investigations Directory')}
          className="hover:text-[#FF5A1F] cursor-pointer transition-colors"
        >
          Investigations
        </span>
        <span>&gt;</span>
        <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-800'}`}>
          FIR {activeCase.crimeNo || '—'}
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Folder size={22} />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                FIR {activeCase.crimeNo || '—'}
              </h1>

              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#FF5A1F] text-white border border-[#FF5A1F] shadow-xs cursor-pointer hover:bg-[#E04D18] transition-all"
                >
                  <span>{caseStatus}</span>
                  <ChevronDown size={13} />
                </button>

                <AnimatePresence>
                  {showStatusMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className={`absolute left-0 mt-1.5 w-36 rounded-xl border shadow-xl z-50 overflow-hidden text-xs font-bold ${
                        isDarkMode ? 'bg-[#1F2937] border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-slate-800'
                      }`}
                    >
                      {['ACTIVE', 'ON HOLD', 'UNDER REVIEW', 'SUBMITTED', 'CLOSED'].map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            setCaseStatus(st);
                            setShowStatusMenu(false);
                            showToast(`Updated Case Status to ${st}`);
                          }}
                          className={`w-full px-3 py-2 text-left hover:bg-[#FF5A1F] hover:text-white transition-colors cursor-pointer flex items-center justify-between ${
                            caseStatus === st ? 'text-[#FF5A1F] font-black' : ''
                          }`}
                        >
                          <span>{st}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <p className="text-xs text-gray-500 font-medium mt-1">
              {activeCase.crimeSubHead || '—'} — {activeCase.crimeHead || '—'} • {activeCase.sections?.length ? activeCase.sections.slice(0, 2).join(', ') : 'IPC'} • Registered on {activeCase.registrationDate || '—'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              setActiveTab('Replay ⭐');
              showToast('▶ Playing Investigation Timeline');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-black transition-all cursor-pointer shadow-md ${
              isDarkMode
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'
                : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
            }`}
          >
            <Play size={14} className="fill-current" />
            <span>Play Investigation</span>
          </button>

          <button
            onClick={() => showToast('Case link copied to clipboard')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#111827] border-[#1F2937] hover:bg-[#1F2937] text-gray-200'
                : 'bg-white border-[#E2E8F0] hover:bg-slate-50 text-slate-700 shadow-2xs'
            }`}
          >
            <Share2 size={14} />
            <span>Share Case</span>
          </button>

          <button
            onClick={() => showToast('Opening Additional Actions Menu')}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#111827] border-[#1F2937] hover:bg-[#1F2937] text-gray-200'
                : 'bg-white border-[#E2E8F0] hover:bg-slate-50 text-slate-700 shadow-2xs'
            }`}
            title="More Options"
          >
            <MoreHorizontal size={16} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowAddNewMenu(!showAddNewMenu)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] shadow-md transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Add New</span>
              <ChevronDown size={13} />
            </button>

            <AnimatePresence>
              {showAddNewMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className={`absolute right-0 mt-1.5 w-44 rounded-2xl border shadow-2xl z-50 overflow-hidden text-xs font-bold ${
                    isDarkMode ? 'bg-[#1F2937] border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-slate-800'
                  }`}
                >
                  {[
                    { label: 'Add Evidence', action: 'Opening Evidence Upload Modal' },
                    { label: 'Add Witness Statement', action: 'Opening Statement Drafter' },
                    { label: 'Add Suspect Record', action: 'Opening Suspect Entry Form' },
                    { label: 'Create New Task', action: 'Opening Task Creator' },
                    { label: 'Attach Report Document', action: 'Opening File Attachment' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setShowAddNewMenu(false);
                        showToast(item.action);
                      }}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-[#FF5A1F] hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <Plus size={12} />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
