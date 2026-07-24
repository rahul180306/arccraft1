'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { pageContainerVariants, pageItemVariants } from '@/lib/motion';
import { useUIStore } from '@/lib/stores/uiStore';
import GoogleTasksPanel from '@/components/workspace/GoogleTasksPanel';
import EvidenceLockerWorkspace from '@/components/workspace/EvidenceLockerWorkspace';
import VideoAnalysisWorkspace from '@/components/workspace/VideoAnalysisWorkspace';
import InvestigationReplayWorkspace from '@/components/workspace/InvestigationReplayWorkspace';
import {
  Folder,
  ChevronDown,
  Share2,
  MoreHorizontal,
  Plus,
  CheckCircle2,
  Clock,
  Circle,
  FileText,
  Video,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  UserCheck,
  Phone,
  Upload,
  MessageSquare,
  FileSpreadsheet,
  Presentation,
  FileCode,
  ListFilter,
  Pencil,
  Eye,
  ShieldAlert,
  Mic,
  Camera,
  Layers,
  MapPin,
  Calendar,
  Search,
  ExternalLink,
  CheckSquare,
  Square,
  AlertCircle,
  Tag,
  X,
  Send,
  Play
} from 'lucide-react';

export default function InvestigationsWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const openCopilot = useUIStore((s) => s.openCopilot);
  const showToast = useUIStore((s) => s.showToast);

  // Active navigation tab inside Investigation Workspace
  const [activeTab, setActiveTab] = useState('Overview');

  // Case Status Dropdown state
  const [caseStatus, setCaseStatus] = useState('ACTIVE');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Add New Dropdown state
  const [showAddNewMenu, setShowAddNewMenu] = useState(false);

  // Pending Tasks state for interactive check-off
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Collect FSL Blood Sample Report', priority: 'High', assignee: 'HC Kavya', dueDate: '19 Jul 2025', completed: false },
    { id: 2, title: 'Record Statement of Witness (Ramesh)', priority: 'High', assignee: 'ASI Ramesh', dueDate: '18 Jul 2025', completed: false },
    { id: 3, title: 'Obtain Call Detail Records', priority: 'Medium', assignee: 'SI Naveen', dueDate: '20 Jul 2025', completed: false },
    { id: 4, title: 'Verify Alibi of Accused Sandeep K.', priority: 'Medium', assignee: 'HC Kavya', dueDate: '21 Jul 2025', completed: false },
    { id: 5, title: 'Seize Weapon for Ballistic Test', priority: 'Low', assignee: 'ASI Ramesh', dueDate: '22 Jul 2025', completed: false },
  ]);

  // Selected Evidence Modal / Lightbox state
  const [selectedEvidence, setSelectedEvidence] = useState<{
    title: string;
    type: string;
    size: string;
    url: string;
    meta?: string;
  } | null>(null);

  // Selected Key Person Modal
  const [selectedPerson, setSelectedPerson] = useState<{
    name: string;
    role: string;
    initials: string;
    color: string;
    phone: string;
    statement: string;
  } | null>(null);

  // Quick Note Modal
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = !t.completed;
          showToast(updated ? `Marked completed: "${t.title}"` : `Reopened task: "${t.title}"`);
          return { ...t, completed: updated };
        }
        return t;
      })
    );
  };

  const cardBg = isDarkMode
    ? 'bg-[#111827] border-[#1F2937] text-white'
    : 'bg-white border-[#E2E8F0] text-slate-900 shadow-2xs';

  const subCardBg = isDarkMode
    ? 'bg-[#1F2937]/50 border-[#374151]/50 hover:bg-[#1F2937]'
    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100';

  const tabsList = [
    'Overview',
    'Replay ⭐',
    'Tasks',
    'Evidence',
    'Timeline',
    'Witnesses',
    'Accused',
    'Reports',
    'Notes',
    'Files',
  ];

  return (
    <motion.main
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-3 sm:p-6 max-w-[1850px] w-full mx-auto flex flex-col gap-5 pb-24"
    >
      {/* 1. BREADCRUMBS & TOP CASE HEADER BAR */}
      <motion.div variants={pageItemVariants} className="flex flex-col gap-2">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <span
            onClick={() => showToast('Navigated to Investigations Directory')}
            className="hover:text-[#FF5A1F] cursor-pointer transition-colors"
          >
            Investigations
          </span>
          <span>&gt;</span>
          <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-800'}`}>
            FIR KRP/2026/0456
          </span>
        </div>

        {/* Case Main Header Title Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Folder size={22} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  FIR KRP/2026/0456
                </h1>

                {/* Case Status Dropdown Pill */}
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
                            className={`w-full px-3 py-2 text-left hover:bg-[#FF5A1F] hover:text-white transition-colors cursor-pointer ${
                              caseStatus === st ? 'text-[#FF5A1F] font-black' : ''
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Subtitle Details */}
              <p className="text-xs text-gray-500 font-medium mt-1">
                Armed House Burglary & Theft • IPC 457, 380, 411 • Registered on 16 Jul 2025
              </p>
            </div>
          </div>

          {/* Top Right Action Buttons */}
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

            {/* Add New Dropdown Button */}
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

      {/* 2. NAVIGATION TABS BAR */}
      <motion.div variants={pageItemVariants} className={`border-b ${isDarkMode ? 'border-[#1F2937]' : 'border-[#E2E8F0]'}`}>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {tabsList.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  showToast(`Switched to tab: ${tab}`);
                }}
                className={`px-4 py-2 text-xs font-bold transition-all relative shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-[#FF5A1F]'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5A1F] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 3. MAIN CONTENT VIEW SWITCHER */}
      {activeTab === 'Overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT 3/4 MAIN COLUMN (lg:col-span-9) */}
          <div className="lg:col-span-9 flex flex-col gap-5">
            {/* CARD 1: CASE SUMMARY & INVESTIGATION PROGRESS */}
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
                      <span className="font-extrabold text-sm text-[#FF5A1F]">KRP/2026/0456</span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Police Station</span>
                      <span className="font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        KR Puram PS
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Crime Type</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-0.5">
                        <ShieldAlert size={13} />
                        House Burglary
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Date & Time</span>
                      <span className="font-bold">15 Jul 2025, 23:45</span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Sections</span>
                      <span className="font-bold">IPC 457, 380, 411</span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Investigating Officer</span>
                      <span className="font-bold">Inspector Arjun</span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Location</span>
                      <span className="font-bold truncate">Anekal Main Road, KR Puram</span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Status</span>
                      <span className="font-extrabold text-emerald-500">Active Investigation</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Investigation Progress (5 Cols) */}
                <div className="md:col-span-5 flex flex-col justify-between gap-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                    INVESTIGATION PROGRESS
                  </h3>

                  <div className="flex items-center gap-5">
                    {/* Progress Circle Visual */}
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

                    {/* Progress Items Checklist */}
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
              {/* RECENT EVIDENCE (7 Cols) */}
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

                {/* Evidence Thumbnails Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    {
                      title: 'CCTV_Exit_Gate.mp4',
                      type: 'Video • 450 MB',
                      badge: '00:45',
                      img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=300&q=80',
                      isVideo: true
                    },
                    {
                      title: 'FP_Sample_01.png',
                      type: 'Image • 2.4 MB',
                      img: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80'
                    },
                    {
                      title: 'Vehicle_KA03MN4481.jpg',
                      type: 'Image • 1.2 MB',
                      img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80'
                    },
                    {
                      title: 'Crowbar_Seized_01.jpg',
                      type: 'Image • 1.8 MB',
                      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80'
                    },
                    {
                      title: 'Gold_Items_Seized.jpg',
                      type: 'Image • 2.1 MB',
                      img: 'https://images.unsplash.com/photo-1611591475281-a1d9a04a08bc?auto=format&fit=crop&w=300&q=80'
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedEvidence({ title: item.title, type: item.type, size: '2.4 MB', url: item.img })}
                      className={`group rounded-xl border overflow-hidden transition-all cursor-pointer hover:border-[#FF5A1F] ${subCardBg}`}
                    >
                      <div className="relative h-20 w-full bg-slate-800 overflow-hidden">
                        <img
                          src={item.img}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.badge && (
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 rounded">
                            {item.badge}
                          </span>
                        )}
                        {item.isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow-md">
                              <Video size={12} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-1.5">
                        <div className={`text-[10px] font-bold truncate ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                          {item.title}
                        </div>
                        <div className="text-[9px] text-gray-400 font-mono mt-0.5">{item.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* AI INSIGHTS (5 Cols) */}
              <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border md:col-span-5 flex flex-col justify-between gap-3 ${cardBg}`}>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#FF5A1F]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                    AI INSIGHTS
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Insight 1 */}
                  <div
                    onClick={() => openCopilot('Analyze pattern matches for insider knowledge on case FIR KRP/2026/0456')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${subCardBg}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={14} />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                          High probability of insider knowledge
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          Pattern matches 3 similar cases
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-extrabold bg-purple-500/15 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 shrink-0">
                      92%
                    </span>
                  </div>

                  {/* Insight 2 */}
                  <div
                    onClick={() => openCopilot('Show CCTV blind spots details for Anekal Main Road burglary')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${subCardBg}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-[#FF5A1F] flex items-center justify-center shrink-0 mt-0.5">
                        <Camera size={14} />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                          CCTV blind spots detected
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          2 critical angles not covered
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-extrabold bg-orange-500/15 text-[#FF5A1F] px-2 py-0.5 rounded-full border border-[#FF5A1F]/20 shrink-0">
                      85%
                    </span>
                  </div>

                  {/* Insight 3 */}
                  <div
                    onClick={() => openCopilot('Show AFIS fingerprint match report for FP_Sample_01.png')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${subCardBg}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={14} />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                          Forensic match found
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          Fingerprint match probability high
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-extrabold bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                      88%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openCopilot('Provide a complete AI deep analysis of FIR KRP/2026/0456')}
                  className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center gap-1 cursor-pointer w-fit mt-1"
                >
                  <span>Ask Copilot for deeper analysis</span>
                  <ArrowRight size={13} />
                </button>
              </motion.div>
            </div>

            {/* ROW 3: PENDING TASKS & QUICK TOOLS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* PENDING TASKS (7 Cols) */}
              <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border md:col-span-7 flex flex-col gap-3 ${cardBg}`}>
                <GoogleTasksPanel 
                  isDarkMode={isDarkMode} 
                  subCardBg={subCardBg} 
                  showToast={showToast} 
                  isCompact={true} 
                />
              </motion.div>

              {/* QUICK TOOLS (5 Cols) */}
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

              {/* Horizontal Node Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 relative py-2">
                {[
                  { title: 'FIR Registered', date: '16 Jul, 10:02 AM', icon: FileText, color: 'bg-orange-500 text-white' },
                  { title: 'Scene Examined', date: '16 Jul, 11:15 AM', icon: Camera, color: 'bg-emerald-500 text-white' },
                  { title: 'Evidence Collected', date: '16 Jul, 01:40 PM', icon: Folder, color: 'bg-purple-500 text-white' },
                  { title: 'CCTV Analysis', date: '17 Jul, 09:12 AM', icon: Video, color: 'bg-orange-500 text-white' },
                  { title: 'Suspect Identified', date: '17 Jul, 04:30 PM', icon: UserCheck, color: 'bg-blue-500 text-white' },
                  { title: 'Chargesheet Draft', date: '...', icon: FileText, color: 'bg-gray-300 dark:bg-gray-700 text-gray-500' },
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

          {/* RIGHT 1/4 SIDEBAR COLUMN (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {/* CARD 1: CASE AT A GLANCE */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3.5 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                  CASE AT A GLANCE
                </span>
                <button
                  onClick={() => showToast('Opening Case Metadata Editor')}
                  className="p-1 text-gray-400 hover:text-[#FF5A1F] cursor-pointer"
                  title="Edit Metadata"
                >
                  <Pencil size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Priority</span>
                  <span className="font-bold text-red-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> High
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Sensitivity</span>
                  <span className="font-bold text-[#FF5A1F] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" /> Level 2
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Case Value</span>
                  <span className="font-mono font-extrabold text-slate-900 dark:text-white">₹ 12,45,000</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Property Stolen</span>
                  <span className="font-mono font-extrabold text-[#FF5A1F]">₹ 8,75,000</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Linked Cases</span>
                  <span className="font-mono font-bold">2</span>
                </div>

                {/* Case Tags */}
                <div className="flex flex-col gap-1.5 mt-1 border-t pt-2.5 border-gray-200 dark:border-gray-800">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Case Tags</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['Burglary', 'Night Crime', 'CCTV Available'].map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                          isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                    <button
                      onClick={() => showToast('Add new Tag dialog opened')}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md border border-dashed border-gray-400 text-gray-400 hover:text-[#FF5A1F] hover:border-[#FF5A1F] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CARD 2: KEY PERSONS */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                  KEY PERSONS
                </span>
                <button
                  onClick={() => {
                    setActiveTab('Witnesses');
                    showToast('Opening Persons Directory');
                  }}
                  className="text-xs font-bold text-[#FF5A1F] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { name: 'HC Kavya', role: 'Witness', initials: 'HK', color: 'bg-gray-200 text-slate-800 dark:bg-gray-800 dark:text-gray-200', phone: '+91 98450 12345', statement: 'Statement recorded on 16 Jul' },
                  { name: 'Ramesh B.', role: 'Witness', initials: 'RB', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', phone: '+91 98450 67890', statement: 'Gave description of suspect vehicle' },
                  { name: 'Sandeep K.', role: 'Accused', initials: 'SK', color: 'bg-red-500/15 text-red-500', phone: '+91 98450 99999', statement: 'Under interrogation at KR Puram' },
                  { name: 'Naveen J.', role: 'Accused', initials: 'NJ', color: 'bg-blue-500/15 text-blue-500', phone: '+91 98450 88888', statement: 'Alibi verification in progress' },
                ].map((person, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPerson(person)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${subCardBg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center shrink-0 ${person.color}`}>
                        {person.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                          {person.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">{person.role}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCopilot(`Draft a message or question list for ${person.name} (${person.role})`);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#FF5A1F] hover:bg-[#FF5A1F]/10 cursor-pointer transition-colors"
                      title="Send Message / Copilot Query"
                    >
                      <MessageSquare size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CARD 3: LATEST ACTIVITY */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                  LATEST ACTIVITY
                </span>
                <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                {[
                  { title: 'CCTV footage uploaded', time: '10:24 AM by ASI Ramesh', icon: Video, color: 'text-purple-400' },
                  { title: 'Fingerprint matched', time: '09:58 AM by HC Kavya', icon: CheckCircle2, color: 'text-emerald-500' },
                  { title: 'Witness statement recorded', time: '09:32 AM by SI Naveen', icon: FileText, color: 'text-[#FF5A1F]' },
                  { title: 'Scene photos added', time: 'Yesterday, 08:15 PM by AI System', icon: Camera, color: 'text-blue-500' },
                ].map((act, idx) => {
                  const IconComp = act.icon;
                  return (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                        <IconComp size={14} className={act.color} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                          {act.title}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{act.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => showToast('Opening Audit Activity Stream')}
                className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center gap-1 cursor-pointer w-fit mt-1"
              >
                <span>View All Activity</span>
                <ArrowRight size={13} />
              </button>
            </motion.div>
          </div>
        </div>
      ) : activeTab === 'Replay ⭐' ? (
        <motion.div variants={pageItemVariants} className="w-full">
          <InvestigationReplayWorkspace />
        </motion.div>
      ) : activeTab === 'Tasks' ? (
        /* TASKS TAB VIEW */
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-5 ${cardBg}`}>
          <GoogleTasksPanel 
            isDarkMode={isDarkMode} 
            subCardBg={subCardBg} 
            showToast={showToast} 
            isCompact={false} 
          />
        </motion.div>
      ) : activeTab === 'Evidence' ? (
        /* EVIDENCE TAB VIEW */
        <motion.div variants={pageItemVariants} className="w-full">
          <EvidenceLockerWorkspace />
        </motion.div>
      ) : activeTab === 'CCTV Feeds' || activeTab === 'Video Analysis' || activeTab === 'Video' ? (
        /* VIDEO ANALYSIS TAB VIEW */
        <motion.div variants={pageItemVariants} className="w-full">
          <VideoAnalysisWorkspace />
        </motion.div>
      ) : (
        /* GENERIC VIEWER FOR OTHER TABS */
        <motion.div variants={pageItemVariants} className={`p-8 rounded-2xl border flex flex-col gap-4 text-center items-center justify-center min-h-[300px] ${cardBg}`}>
          <div className="w-12 h-12 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center">
            <Folder size={24} />
          </div>
          <h2 className="text-xl font-black">{activeTab} Section</h2>
          <p className="text-xs text-gray-400 max-w-md">
            Showing synced records and data for {activeTab} in FIR KRP/2026/0456.
          </p>
          <button
            onClick={() => openCopilot(`Analyze ${activeTab} data for FIR KRP/2026/0456`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18]"
          >
            <Sparkles size={14} /> Ask Copilot
          </button>
        </motion.div>
      )}

      {/* FLOATING ACTION MIC BUTTON */}
      <button
        onClick={() => openCopilot('Voice record new investigation memo')}
        className="fixed bottom-6 right-6 z-40 w-13 h-13 bg-[#FF5A1F] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 cursor-pointer transition-all border-2 border-white/20"
        title="Record Audio / Talk to Copilot"
      >
        <Mic size={22} className="animate-pulse" />
      </button>

      {/* EVIDENCE LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedEvidence && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-xl w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setSelectedEvidence(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-black pr-8">{selectedEvidence.title}</h3>

              <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                <img src={selectedEvidence.url} alt={selectedEvidence.title} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>Type: {selectedEvidence.type}</span>
                <span>Size: {selectedEvidence.size}</span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => {
                    openCopilot(`Run AI scan on evidence item ${selectedEvidence.title}`);
                    setSelectedEvidence(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} /> Analyze with Copilot
                </button>

                <button
                  onClick={() => {
                    showToast('Downloaded evidence file to workstation');
                    setSelectedEvidence(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-gray-100 border-gray-200'
                  }`}
                >
                  Download
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* KEY PERSON MODAL */}
      <AnimatePresence>
        {selectedPerson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-md w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setSelectedPerson(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full font-black text-sm flex items-center justify-center ${selectedPerson.color}`}>
                  {selectedPerson.initials}
                </div>
                <div>
                  <h3 className="text-lg font-black">{selectedPerson.name}</h3>
                  <p className="text-xs text-gray-400">{selectedPerson.role} • {selectedPerson.phone}</p>
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-xs ${subCardBg}`}>
                <span className="font-bold block mb-1">Status / Statement:</span>
                <p className="text-gray-400">{selectedPerson.statement}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    openCopilot(`Draft interrogation or question list for ${selectedPerson.name}`);
                    setSelectedPerson(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={14} /> AI Question Draft
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK NOTE MODAL */}
      <AnimatePresence>
        {showNoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-md w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setShowNoteModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-base font-black">Add Investigation Note</h3>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Type your official case note or observation..."
                rows={4}
                className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A1F] ${
                  isDarkMode ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                }`}
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (noteText.trim()) {
                      showToast('Saved Note to Case Log');
                      setNoteText('');
                      setShowNoteModal(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
