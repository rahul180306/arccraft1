import React from 'react';
import { motion } from 'motion/react';
import { pageItemVariants } from '@/lib/motion';
import { KSPCase } from '@/lib/data/realCases';
import GoogleTasksPanel from '@/components/workspace/GoogleTasksPanel';
import { ShieldAlert, CheckCircle2, Circle, Video, Camera, Sparkles, ArrowRight, FileText, Calendar, Upload, MessageSquare, FileSpreadsheet, Presentation, FileCode, Folder, UserCheck } from 'lucide-react';

interface OverviewProps {
  activeCase: KSPCase;
  isDarkMode: boolean;
  cardBg: string;
  subCardBg: string;
  setActiveTab: (tab: string) => void;
  setSelectedEvidence: (evidence: any) => void;
  setShowNoteModal: (show: boolean) => void;
  openCopilot: (prompt: string) => void;
  showToast: (msg: string) => void;
}

export default function Overview({
  activeCase,
  isDarkMode,
  cardBg,
  subCardBg,
  setActiveTab,
  setSelectedEvidence,
  setShowNoteModal,
  openCopilot,
  showToast
}: OverviewProps) {
  return (
    <div className="lg:col-span-9 flex flex-col gap-5">
      <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border ${cardBg}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Side: Case Summary (7 Cols) */}
          <div className="md:col-span-7 flex flex-col gap-4 border-b md:border-b-0 md:border-r pb-5 md:pb-0 md:pr-6 border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                CASE SUMMARY
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs font-sans">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-mono block">FIR Number</span>
                <span className="font-extrabold text-sm text-[#FF5A1F]">{activeCase.crimeNo || '—'}</span>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] uppercase font-mono block">Police Station</span>
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {activeCase.policeStation || '—'}
                </span>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] uppercase font-mono block">Crime Type</span>
                <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-0.5">
                  <ShieldAlert size={13} />
                  {activeCase.crimeSubHead || '—'}
                </span>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] uppercase font-mono block">Date & Time</span>
                <span className="font-bold">{activeCase.incidentDate || '—'}</span>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] uppercase font-mono block">Sections</span>
                <span className="font-bold">{activeCase.sections?.length ? activeCase.sections.join(', ') : '—'}</span>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] uppercase font-mono block">Investigating Officer</span>
                <span className="font-bold">{activeCase.ioName || '—'}</span>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] uppercase font-mono block">Location</span>
                <span className="font-bold truncate">{activeCase.district || '—'}</span>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] uppercase font-mono block">Status</span>
                <span className="font-extrabold text-emerald-500">{activeCase.caseStatus || '—'}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Investigation Progress (5 Cols) */}
          <div className="md:col-span-5 flex flex-col justify-between gap-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
              INVESTIGATION PROGRESS
            </h3>

            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200 dark:text-gray-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#FF5A1F]"
                    strokeDasharray="78, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black tracking-tight leading-none">78%</span>
                  <span className="text-[8px] font-mono text-gray-400 uppercase mt-0.5">Overall</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" /> Scene Examination
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500">Completed</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Circle size={13} className="text-[#FF5A1F]" /> Evidence Collection
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#FF5A1F]">24 / 36</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Circle size={13} className="text-[#FF5A1F]" /> Witness Statements
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#FF5A1F]">8 / 12</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Circle size={13} className="text-teal-500" /> Suspect Identification
                  </span>
                  <span className="text-[10px] font-bold text-teal-500">In Progress</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5 text-gray-400">
                    <Circle size={13} className="text-gray-400" /> Chargesheet Draft
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">Not Started</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ROW 2: RECENT EVIDENCE & AI INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border md:col-span-7 flex flex-col gap-3 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
              RECENT EVIDENCE
            </span>
            <button
              onClick={() => {
                setActiveTab('Evidence');
                showToast('Opening full Evidence Locker');
              }}
              className="text-xs font-bold text-[#FF5A1F] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { title: 'CCTV_Exit_Gate.mp4', type: 'Video • 450 MB', badge: '00:45', img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=300&q=80', isVideo: true },
              { title: 'FP_Sample_01.png', type: 'Image • 2.4 MB', img: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80' },
              { title: 'Vehicle_KA03MN4481.jpg', type: 'Image • 1.2 MB', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80' },
              { title: 'Crowbar_Seized_01.jpg', type: 'Image • 1.8 MB', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80' },
              { title: 'Gold_Items_Seized.jpg', type: 'Image • 2.1 MB', img: 'https://images.unsplash.com/photo-1611591475281-a1d9a04a08bc?auto=format&fit=crop&w=300&q=80' }
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedEvidence({ title: item.title, type: item.type, size: '2.4 MB', url: item.img })}
                className={`group rounded-xl border overflow-hidden transition-all cursor-pointer hover:border-[#FF5A1F] ${subCardBg}`}
              >
                <div className="relative h-20 w-full bg-slate-800 overflow-hidden">
                  <img src={item.img} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {item.badge && <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 rounded">{item.badge}</span>}
                  {item.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow-md"><Video size={12} /></div>
                    </div>
                  )}
                </div>
                <div className="p-1.5">
                  <div className={`text-[10px] font-bold truncate ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>{item.title}</div>
                  <div className="text-[9px] text-gray-400 font-mono mt-0.5">{item.type}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border md:col-span-5 flex flex-col justify-between gap-3 ${cardBg}`}>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#FF5A1F]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
              AI INSIGHTS
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div onClick={() => openCopilot(`Analyze pattern matches for insider knowledge on case FIR ${activeCase.crimeNo || ''}`)} className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${subCardBg}`}>
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-0.5"><Sparkles size={14} /></div>
                <div>
                  <div className={`text-xs font-bold ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>High probability of insider knowledge</div>
                  <div className="text-[10px] text-gray-400 font-medium">Pattern matches 3 similar cases</div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-extrabold bg-purple-500/15 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 shrink-0">92%</span>
            </div>

            <div onClick={() => openCopilot(`Show CCTV blind spots details for ${activeCase.district || 'Location'}`)} className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${subCardBg}`}>
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-[#FF5A1F] flex items-center justify-center shrink-0 mt-0.5"><Camera size={14} /></div>
                <div>
                  <div className={`text-xs font-bold ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>CCTV blind spots detected</div>
                  <div className="text-[10px] text-gray-400 font-medium">2 critical angles not covered</div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-extrabold bg-orange-500/15 text-[#FF5A1F] px-2 py-0.5 rounded-full border border-[#FF5A1F]/20 shrink-0">85%</span>
            </div>

            <div onClick={() => openCopilot('Show AFIS fingerprint match report for FP_Sample_01.png')} className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${subCardBg}`}>
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={14} /></div>
                <div>
                  <div className={`text-xs font-bold ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>Forensic match found</div>
                  <div className="text-[10px] text-gray-400 font-medium">Fingerprint match probability high</div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-extrabold bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">88%</span>
            </div>
          </div>

          <button
            onClick={() => openCopilot(`Provide a complete AI deep analysis of FIR ${activeCase.crimeNo || ''}`)}
            className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center gap-1 cursor-pointer w-fit mt-1"
          >
            <span>Ask Copilot for deeper analysis</span>
            <ArrowRight size={13} />
          </button>
        </motion.div>
      </div>

      {/* ROW 3: PENDING TASKS & QUICK TOOLS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border md:col-span-7 flex flex-col gap-3 ${cardBg}`}>
          <GoogleTasksPanel 
            isDarkMode={isDarkMode} 
            subCardBg={subCardBg} 
            showToast={showToast} 
            isCompact={true} 
          />
        </motion.div>

        <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border md:col-span-5 flex flex-col gap-3 ${cardBg}`}>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            QUICK TOOLS
          </span>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'New Note', icon: FileText, color: 'text-emerald-500', action: () => setShowNoteModal(true) },
              { label: 'New Task', icon: Calendar, color: 'text-emerald-500', action: () => showToast('Opened Task Creator') },
              { label: 'Upload Evidence', icon: Upload, color: 'text-blue-500', action: () => showToast('Opened File Uploader') },
              { label: 'New Chat', icon: MessageSquare, color: 'text-teal-500', action: () => openCopilot('Start new investigation conversation') },
              { label: 'New Sheet', icon: FileSpreadsheet, color: 'text-emerald-500', action: () => showToast('Created Form 10 Statement Spreadsheet') },
              { label: 'New Slide', icon: Presentation, color: 'text-orange-500', action: () => showToast('Generated Case Brief Slide Deck') },
              { label: 'New Doc', icon: FileText, color: 'text-blue-500', action: () => showToast('Created Form 173 Charge Sheet Document') },
              { label: 'New Form', icon: FileCode, color: 'text-purple-500', action: () => showToast('Created Seizure Memo Form') },
            ].map((tool, idx) => {
              const IconComp = tool.icon;
              return (
                <button
                  key={idx}
                  onClick={tool.action}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${subCardBg}`}
                >
                  <IconComp size={18} className={tool.color} />
                  <span className={`text-[10px] font-bold leading-tight ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                    {tool.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* CARD 4: INVESTIGATION TIMELINE */}
      <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border flex flex-col gap-4 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            INVESTIGATION TIMELINE
          </span>
          <button
            onClick={() => {
              setActiveTab('Timeline');
              showToast('Opening full Timeline view');
            }}
            className="text-xs font-bold text-[#FF5A1F] hover:underline cursor-pointer"
          >
            View Full Timeline
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 relative py-2">
          {[
            { title: 'FIR Registered', date: activeCase.registrationDate || '—', icon: FileText, color: 'bg-orange-500 text-white' },
            { title: 'Scene Examined', date: activeCase.incidentDate || '—', icon: Camera, color: 'bg-emerald-500 text-white' },
            { title: 'Evidence Collected', date: '—', icon: Folder, color: 'bg-purple-500 text-white' },
            { title: 'CCTV Analysis', date: '—', icon: Video, color: 'bg-orange-500 text-white' },
            { title: 'Suspect Identified', date: '—', icon: UserCheck, color: 'bg-blue-500 text-white' },
            { title: 'Chargesheet Draft', date: '—', icon: FileText, color: 'bg-gray-300 dark:bg-gray-700 text-gray-500' },
          ].map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center gap-1.5 relative z-10">
                <div className={`w-9 h-9 rounded-full ${step.color} flex items-center justify-center shadow-md shrink-0`}>
                  <IconComp size={16} />
                </div>
                <div className={`text-xs font-bold ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                  {step.title}
                </div>
                <div className="text-[10px] text-gray-400 font-mono">{step.date}</div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
