'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { pageContainerVariants, pageItemVariants } from '@/lib/motion';
import { useUIStore } from '@/lib/stores/uiStore';
import GoogleTasksPanel from '@/components/workspace/GoogleTasksPanel';
import EvidenceLockerWorkspace from '@/components/workspace/EvidenceLockerWorkspace';
import VideoAnalysisWorkspace from '@/components/workspace/VideoAnalysisWorkspace';
import InvestigationReplayWorkspace from '@/components/workspace/InvestigationReplayWorkspace';
import { Folder, ChevronDown, Share2, MoreHorizontal, Plus, CheckCircle2, Clock, Circle, FileText, Video, Image as ImageIcon, Sparkles, ArrowRight, UserCheck, Phone, Upload, MessageSquare, FileSpreadsheet, Presentation, FileCode, ListFilter, Pencil, Eye, ShieldAlert, Mic, Camera, Layers, MapPin, Calendar, Search, ExternalLink, CheckSquare, Square, AlertCircle, Tag, X, Send, Play, ShieldCheck, HardDrive, BarChart3, Filter, Download, User, FileCheck, RefreshCw, Hash, Lock, Volume2, Pause, Printer, FileDown, Building, Scale, Award, AlertTriangle, FileArchive, Paperclip, Check, Zap, HelpCircle, Maximize2, Flame, ArrowUpRight } from 'lucide-react';
import HealthDashboard from './investigation/HealthDashboard';
import EvidencePanel from './investigation/EvidencePanel';

// --- DATA TYPES & MOCK DATA FOR MULTI-CASE WORKSPACE ---
interface CaseItem {
  id: string;
  firNumber: string;
  title: string;
  sections: string;
  registeredDate: string;
  daysActive: number;
  lastUpdated: string;
  station: string;
  crimeType: string;
  ioName: string;
  location: string;
  status: string;
  priority: 'High' | 'Medium' | 'Low';
  sensitivity: string;
  caseValue: string;
  stolenValue: string;
  progress: number;
  tags: string[];
  pendingTasksCount: number;
  urgentTasksCount: number;
}

const CASES_DATA: Record<string, CaseItem> = {
  'KRP/2026/0456': {
    id: 'KRP/2026/0456',
    firNumber: 'FIR KRP/2026/0456',
    title: 'Armed House Burglary & Jewellery Theft',
    sections: 'IPC 457, 380, 411 (BNS 331, 305)',
    registeredDate: '16 Jul 2025, 10:02 AM',
    daysActive: 8,
    lastUpdated: 'Updated 12m ago by Inspector Arjun',
    station: 'KR Puram Police Station, Bengaluru',
    crimeType: 'House Burglary',
    ioName: 'Inspector Arjun Kumar',
    location: 'Anekal Main Road, KR Puram, Bengaluru',
    status: 'ACTIVE',
    priority: 'High',
    sensitivity: 'Level 2 Confidential',
    caseValue: '₹ 12,45,000',
    stolenValue: '₹ 8,75,000',
    progress: 78,
    tags: ['Burglary', 'Night Crime', 'CCTV Available', 'Forensics Matched'],
    pendingTasksCount: 5,
    urgentTasksCount: 2
  },
  'MYS/2026/0082': {
    id: 'MYS/2026/0082',
    firNumber: 'FIR MYS/2026/0082',
    title: 'Multi-State SIM-Swap Financial Cyber Fraud',
    sections: 'IT Act Sec 66C, 66D, IPC 420 (BNS 318)',
    registeredDate: '10 Jul 2025, 02:30 PM',
    daysActive: 14,
    lastUpdated: 'Updated 1h ago by SI Priya',
    station: 'Cyber Crime PS, Mysuru',
    crimeType: 'Cyber Financial Fraud',
    ioName: 'Inspector Priya Sharma',
    location: 'Devaraja Urs Road, Mysuru',
    status: 'UNDER REVIEW',
    priority: 'High',
    sensitivity: 'Level 1 High Security',
    caseValue: '₹ 45,00,000',
    stolenValue: '₹ 42,30,000',
    progress: 62,
    tags: ['Cyber Crime', 'SIM Swap', 'Mule Accounts', 'Inter-State Gang'],
    pendingTasksCount: 8,
    urgentTasksCount: 4
  },
  'HAL/2026/0119': {
    id: 'HAL/2026/0119',
    firNumber: 'FIR HAL/2026/0119',
    title: 'Commercial Electronics Cargo Highway Hijack',
    sections: 'IPC 395, 397, 365 (BNS 310, 311)',
    registeredDate: '02 Jul 2025, 11:15 PM',
    daysActive: 22,
    lastUpdated: 'Updated 3h ago by ACP Gowda',
    station: 'HAL Airport PS, Bengaluru',
    crimeType: 'Highway Dacoity',
    ioName: 'ACP Rajesh Gowda',
    location: 'Old Airport Road Underpass, Bengaluru',
    status: 'ACTIVE',
    priority: 'High',
    sensitivity: 'Level 2 Confidential',
    caseValue: '₹ 85,00,000',
    stolenValue: '₹ 85,00,000',
    progress: 89,
    tags: ['Dacoity', 'Cargo Theft', 'GPS Tracking', 'Weapon Seized'],
    pendingTasksCount: 3,
    urgentTasksCount: 1
  }
};

export default function InvestigationsWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const openCopilot = useUIStore((s) => s.openCopilot);
  const showToast = useUIStore((s) => s.showToast);

  // Active Multi-Case selection
  const [activeCaseId, setActiveCaseId] = useState<string>('104430006202600001');
  const [showCaseSelectorMenu, setShowCaseSelectorMenu] = useState(false);

  // Dynamic Case State
  const [investigationData, setInvestigationData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  React.useEffect(() => {
    async function fetchCaseData() {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/v1/investigation/${activeCaseId}/details`);
        if (res.ok) {
          const data = await res.json();
          setInvestigationData(data);
        } else {
          console.error("Failed to fetch case data");
        }
      } catch (e) {
        console.error(e);
      }
      setIsFetching(false);
    }
    fetchCaseData();
  }, [activeCaseId]);

  // Use dynamic or fallback
  const currentCase = investigationData?.case_overview || CASES_DATA['KRP/2026/0456'];
  const missingEvidence = investigationData?.missing_evidence || [];
  const healthMetrics = investigationData?.health_metrics || [];
  const caseSummary = investigationData?.case_overview?.summary || `Loading case summary...`;

  // Active Navigation Tab inside Investigation Workspace
  const [activeTab, setActiveTab] = useState('Overview');

  // Search & Filter State (P0)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Records');
  const [evidenceCategoryFilter, setEvidenceCategoryFilter] = useState('All');
  const [selectedRecommendationId, setSelectedRecommendationId] = useState('rec_1');

  // We'll use the recommendations from backend
  const recommendations = investigationData?.recommendations || [];
  const selectedRecommendation = recommendations.find((rec: any) => rec.id === selectedRecommendationId) || recommendations[0];

  const caseActionChips = ['Summarize Case', 'Find Contradictions', 'Show Similar Cases', 'Generate Chargesheet', 'Find Missing Evidence'];

  const statutoryDeadlineDays = 2;
  const legalReadinessWeight = statutoryDeadlineDays <= 3 ? 0.3 : 0.25;

  const similarCases = [
    {
      title: 'FIR MYS/2026/0082',
      similarity: '86%',
      reason: 'SIM-swap gang, shared getaway scooter MO, high-value cash movement.'
    },
    {
      title: 'FIR HAL/2026/0119',
      similarity: '74%',
      reason: 'Night burglary with vehicle escape and coordinated loot transfer.'
    }
  ];
  const statutoryDeadlineText = `Chargesheet filing deadline in ${statutoryDeadlineDays} days under BNSS Section 193.`;

  // Case Status Dropdown state
  const [caseStatus, setCaseStatus] = useState(currentCase.status);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Top Add New Item Dropdown / Modal state
  const [showAddNewMenu, setShowAddNewMenu] = useState(false);
  const [activeAddNewModalTab, setActiveAddNewModalTab] = useState<'Evidence' | 'Witness' | 'Suspect' | 'Task' | 'FSL' | 'Chargesheet' | 'Note' | null>(null);

  // --- STATE FOR DOSSIER (WITNESSES) ---
  const witnesses = investigationData?.witnesses || [];

  const [selectedWitnessModal, setSelectedWitnessModal] = useState<typeof witnesses[0] | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // --- STATE FOR DOSSIER (ACCUSED) ---
  const accusedList = investigationData?.accused_list || [];

  const [selectedAccusedModal, setSelectedAccusedModal] = useState<typeof accusedList[0] | null>(null);

  // --- STATE FOR EVIDENCE LOCKER ---
  const evidenceItems = investigationData?.evidence_items || [];

  // --- STATE FOR TIMELINE ---
  const timelineEvents = investigationData?.timeline_events || [];

  const [timelineFilter, setTimelineFilter] = useState('All');
  const [showAddTimelineModal, setShowAddTimelineModal] = useState(false);
  const [newTimelineTitle, setNewTimelineTitle] = useState('');
  const [newTimelineTime, setNewTimelineTime] = useState('');
  const [newTimelineCat, setNewTimelineCat] = useState('FIR & Legal');
  const [newTimelineDesc, setNewTimelineDesc] = useState('');

  // --- STATE FOR REPORTS ---
  const reportsList = investigationData?.reports || [];

  const [selectedReportModal, setSelectedReportModal] = useState<typeof reportsList[0] | null>(null);

  // --- STATE FOR CASE NOTES ---
  const caseNotes = investigationData?.notes || [];
  const [newNoteInput, setNewNoteInput] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('Field Note');

  // --- STATE FOR FILES ---
  const filesList = investigationData?.files || [];

  const [selectedEvidence, setSelectedEvidence] = useState<typeof evidenceItems[0] | null>(null);

  // Quick Note Modal state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteModalText, setNoteModalText] = useState('');

  // Handle Save Note
  const handleSaveNote = async (text: string, category: string) => {
    if (!text.trim()) return;
    showToast('Saved Note to Official Case Diary');
    setNewNoteInput('');
    setNoteModalText('');
    setShowNoteModal(false);
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
      {/* 1. STICKY TOP HEADER BAR WITH DAYS SINCE FIR, LAST UPDATED, STATUS STRIP & TASK BADGE (P0) */}
      <motion.div 
        variants={pageItemVariants} 
        className={`sticky top-0 z-30 flex flex-col gap-2.5 p-4 rounded-2xl border backdrop-blur-md transition-colors ${
          isDarkMode ? 'bg-[#0B0F19]/90 border-gray-800 shadow-2xl' : 'bg-white/90 border-gray-200 shadow-sm'
        }`}
      >
        {/* Row 1: Breadcrumbs & Meta Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              onClick={() => showToast('Navigated to Investigations Directory')}
              className="hover:text-[#FF5A1F] cursor-pointer transition-colors text-slate-500 dark:text-gray-400 font-mono"
            >
              Investigations
            </span>
            <span className="text-gray-600">&gt;</span>
            
            {/* Active Case Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCaseSelectorMenu(!showCaseSelectorMenu)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono font-bold text-xs transition-all cursor-pointer ${
                  isDarkMode ? 'bg-[#1F2937] border-gray-700 text-slate-700 dark:text-gray-200 hover:border-[#FF5A1F]' : 'bg-slate-100 border-slate-300 text-slate-800 hover:border-[#FF5A1F]'
                }`}
              >
                <Folder size={13} className="text-[#FF5A1F]" />
                <span>{currentCase.firNumber}</span>
                <ChevronDown size={13} className="text-slate-500 dark:text-gray-400" />
              </button>

              <AnimatePresence>
                {showCaseSelectorMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className={`absolute left-0 mt-1.5 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden text-xs ${
                      isDarkMode ? 'bg-[#1F2937] border-gray-700 text-slate-700 dark:text-gray-200' : 'bg-white border-gray-200 text-slate-800'
                    }`}
                  >
                    <div className="p-2.5 border-b border-gray-200 dark:border-gray-700 text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-gray-400">
                      Switch Active Station Investigation
                    </div>
                    {Object.values(CASES_DATA).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveCaseId(c.id);
                          setCaseStatus(c.status);
                          setShowCaseSelectorMenu(false);
                          showToast(`Switched active investigation to ${c.firNumber}`);
                        }}
                        className={`w-full p-3 text-left hover:bg-[#FF5A1F] hover:text-white transition-colors cursor-pointer flex flex-col gap-1 border-b border-gray-100 dark:border-gray-800/50 ${
                          activeCaseId === c.id ? 'bg-[#FF5A1F]/10 border-l-4 border-l-[#FF5A1F]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{c.firNumber}</span>
                          <span className="text-[10px] font-mono opacity-80">{c.status}</span>
                        </div>
                        <div className="text-[11px] opacity-90 truncate">{c.title}</div>
                        <div className="flex items-center justify-between text-[9px] opacity-60 font-mono mt-0.5">
                          <span>{c.station}</span>
                          <span>{c.daysActive}d active</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* P0 HEADER BADGES: DAYS SINCE FIR, LAST UPDATED, PENDING TASKS */}
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-700 dark:text-red-500 font-mono font-bold text-[11px] border border-red-500/20 flex items-center gap-1">
              <Calendar size={12} />
              <span>{currentCase.daysActive} Days Active</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-gray-500/15 text-slate-500 dark:text-gray-400 font-mono text-[11px] border border-gray-500/20 flex items-center gap-1">
              <Clock size={12} />
              <span>{currentCase.lastUpdated}</span>
            </span>

            <span 
              onClick={() => setActiveTab('Tasks')}
              className="px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-700 dark:text-red-400 font-mono font-bold text-[11px] border border-red-500/30 flex items-center gap-1.5 cursor-pointer hover:bg-red-500/25 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>{currentCase.pendingTasksCount} Tasks ({currentCase.urgentTasksCount} Urgent)</span>
            </span>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab('Replay ⭐');
                showToast('▶ Playing Investigation Timeline');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-all cursor-pointer"
            >
              <Play size={13} className="fill-current" />
              <span>Replay Investigation</span>
            </button>

            <button
              onClick={() => showToast(`Case link for ${currentCase.firNumber} copied to clipboard`)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDarkMode ? 'bg-[#1F2937] border-gray-700 text-slate-700 dark:text-gray-200' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Share2 size={13} />
              <span>Share</span>
            </button>

            {/* Add New Item Button */}
            <button
              onClick={() => setShowAddNewMenu(!showAddNewMenu)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] shadow-md transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* Row 2: STATUS TIMELINE STRIP (P0) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-gray-200 dark:border-gray-800">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-gray-400 mr-1 shrink-0">Workflow Stage:</span>
          {[
            { stage: '1. FIR Registered', status: 'Done', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
            { stage: '2. Scene Examined', status: 'Done', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
            { stage: '3. Evidence Collection', status: 'In Progress', color: 'bg-[#FF5A1F]/15 text-[#FF5A1F] border-[#FF5A1F]/30' },
            { stage: '4. Suspect Interrogation', status: 'Active', color: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30' },
            { stage: '5. Form 173 Chargesheet', status: 'Draft Ready', color: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30' }
          ].map((st, idx) => (
            <div
              key={st.stage}
              className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1.5 shrink-0 ${st.color}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{st.stage}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 flex flex-col gap-5">
          
          <HealthDashboard healthMetrics={healthMetrics} statutoryDeadlineDays={statutoryDeadlineDays} isDarkMode={isDarkMode} />
          
          <EvidencePanel missingEvidence={missingEvidence} isDarkMode={isDarkMode} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* 2. SEARCH BAR WITH RECENT SEARCHES & FILTERS (P0) */}
          <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-500 dark:text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search investigation records, evidence IDs, accused names, witness statements..."
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A1F] ${
                    isDarkMode ? 'bg-[#1F2937] border-gray-700 text-white placeholder-gray-500' : 'bg-[#F8FAFC] border-[#CBD5E1] text-slate-900 placeholder-slate-400 focus:shadow-[0_0_0_4px_rgba(255,90,31,0.12)] transition-shadow'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Basic Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto shrink-0">
                {['All Records', 'High Urgency', 'Evidence Items', 'Witness Statements', 'FSL Reports'].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setActiveFilter(f);
                      showToast(`Filter applied: ${f}`);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeFilter === f
                        ? 'bg-[#FF5A1F] text-white'
                        : isDarkMode
                          ? 'bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches Pills */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-gray-400">Recent Searches:</span>
              {['KA-03-MN-4481', 'Crowbar P1', 'AFIS Fingerprint', 'Suresh K.', 'Srinivas V.'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    showToast(`Searching for "${tag}"`);
                  }}
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                    isDarkMode ? 'bg-gray-800/60 border-gray-700 text-slate-600 dark:text-gray-300 hover:text-[#FF5A1F]' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-[#FF5A1F]'
                  }`}
                >
                  🔍 {tag}
                </button>
              ))}
            </div>
          </motion.div>


      {/* 3. WORKSPACE TABS */}
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
                      ? 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:text-gray-200'
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

      {/* 4. DYNAMIC TAB VIEW SWITCHER */}
      {activeTab === 'Overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT 3/4 MAIN COLUMN (lg:col-span-9) */}
          <div className="lg:col-span-9 flex flex-col gap-5">

            {/* CARD 1: UNIFIED CASE CONTROL PANEL (MERGED SUMMARY + AT A GLANCE - P0) */}
            <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border ${cardBg}`}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Side: Merged Case Intelligence Details (7 Cols) */}
                <div className="md:col-span-7 flex flex-col gap-4 border-b md:border-b-0 md:border-r pb-5 md:pb-0 md:pr-6 border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F]" />
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                        CASE MASTER CONTROL PANEL
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/20 font-extrabold">
                      {currentCase.crimeType}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-700 dark:text-gray-300">{caseSummary}</p>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs font-sans">
                    <div>
                      <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-mono block">FIR Number</span>
                      <span className="font-extrabold text-sm text-[#FF5A1F]">{currentCase.id}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-mono block">Police Station</span>
                      <span className="font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {currentCase.station.split(',')[0]}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-mono block">Investigating Officer</span>
                      <span className="font-bold">{currentCase.ioName}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-mono block">Registered Date</span>
                      <span className="font-bold">{currentCase.registeredDate}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-mono block">Legal Sections</span>
                      <span className="font-bold truncate" title={currentCase.sections}>{currentCase.sections}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-mono block">Priority / Sensitivity</span>
                      <span className="font-bold flex items-center gap-2">
                        <span className="text-red-700 dark:text-red-500 font-extrabold">🔴 {currentCase.priority}</span>
                        <span className="text-[#FF5A1F]">• Level 2</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-mono block">Case Total Value</span>
                      <span className="font-mono font-extrabold text-slate-900 dark:text-white">{currentCase.caseValue}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-mono block">Stolen Property Stolen</span>
                      <span className="font-mono font-extrabold text-red-700 dark:text-red-500">{currentCase.stolenValue}</span>
                    </div>

                    <div className="col-span-2 border-t pt-2 border-gray-200 dark:border-gray-800">
                      <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-mono">Similar Cases:</span>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {similarCases.map((item) => (
                          <div key={item.title} className="rounded-2xl border p-2 bg-slate-50 dark:bg-[#111827] border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold text-slate-900 dark:text-gray-100">{item.title}</span>
                              <span className="text-[10px] font-mono font-bold text-teal-400">{item.similarity}</span>
                            </div>
                            <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Workflow Progress Matrix (5 Cols) */}
                <div className="md:col-span-5 flex flex-col justify-between gap-4">
                  <HealthDashboard healthMetrics={healthMetrics} statutoryDeadlineDays={statutoryDeadlineDays} isDarkMode={isDarkMode} />
                </div>
              </div>
            </motion.div>

            {/* CARD 2: REPLACED CASE QUICK ACTIONS (P0 & CUT/MERGE) */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                CASE INVESTIGATION ACTIONS (CASE TOOLS)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    title: 'Add Evidence Item',
                    desc: 'Upload file & assign Malkhana ID',
                    icon: Upload,
                    color: 'text-blue-700 dark:text-blue-500 bg-blue-500/10 border-blue-500/20',
                    action: () => setActiveAddNewModalTab('Evidence')
                  },
                  {
                    title: 'Request FSL Analysis',
                    desc: 'Generate lab dispatch memo',
                    icon: ShieldCheck,
                    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                    action: () => setActiveAddNewModalTab('FSL')
                  },
                  {
                    title: 'Start AI Swarm Scan',
                    desc: 'Detect contradictions & patterns',
                    icon: Sparkles,
                    color: 'text-purple-700 dark:text-purple-500 bg-purple-500/10 border-purple-500/20',
                    action: () => openCopilot(`Run multi-agent AI contradiction and pattern scan for case ${currentCase.firNumber}`)
                  },
                  {
                    title: 'Draft Chargesheet (Form 173)',
                    desc: 'Compile final court report',
                    icon: Scale,
                    color: 'text-[#FF5A1F] bg-[#FF5A1F]/10 border-[#FF5A1F]/20',
                    action: () => setActiveAddNewModalTab('Chargesheet')
                  }
                ].map((act, idx) => {
                  const IconComp = act.icon;
                  return (
                    <button
                      key={idx}
                      onClick={act.action}
                      className={`p-3 rounded-xl border flex flex-col items-start gap-1.5 transition-all text-left cursor-pointer hover:border-[#FF5A1F] ${subCardBg}`}
                    >
                      <div className={`p-2 rounded-lg border ${act.color}`}>
                        <IconComp size={18} />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-slate-800 dark:text-gray-100' : 'text-slate-900'}`}>
                          {act.title}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">{act.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* ROW 3: AI INSIGHTS, CONTRADICTION ENGINE & RECOMMENDATIONS (P1) */}
            <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border flex flex-col gap-4 ${cardBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-700 dark:text-purple-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    AI INTELLIGENCE & CONTRADICTION ENGINE
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {caseActionChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => openCopilot(chip)}
                      className="text-[10px] font-mono px-3 py-1 rounded-full border border-purple-500/20 text-purple-700 dark:text-purple-400 bg-purple-500/5 hover:bg-purple-500/10"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Box 1: Contradiction Alert Box */}
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-red-700 dark:text-red-500 flex items-center gap-1.5">
                      <AlertTriangle size={15} /> CONTRADICTION DETECTED
                    </span>
                    <span className="text-[10px] font-mono font-extrabold bg-red-500/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                      94.8% Confidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-gray-200 leading-relaxed font-sans">
                    Alibi Statement by Accused <strong>Suresh K.</strong> claims being in Hoskote at 11:30 PM, but CCTV Exit Gate video (#E-01) matches vehicle KA-03-MN-4481 at KR Puram underpass at 11:42 PM.
                  </p>
                  <span className="text-[9px] text-slate-500 dark:text-gray-400 font-mono mt-1">Detected on: 18 Jul 2025, 02:15 PM</span>
                </div>

                {/* Box 2: Recommendation List */}
                <div className="lg:col-span-2 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                      <Zap size={15} /> RECOMMENDED INVESTIGATION ACTIONS
                    </span>
                    {selectedRecommendation && (
                      <span className="text-[10px] font-mono font-extrabold bg-purple-500/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">
                        {selectedRecommendation?.confidence} Lead Confidence
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {recommendations.map((rec: any) => (
                      <button
                        key={rec.id}
                        onClick={() => setSelectedRecommendationId(rec.id)}
                        className={`text-left p-3 rounded-2xl border transition-all ${selectedRecommendationId === rec.id ? 'border-purple-500/60 bg-purple-500/10' : 'border-transparent bg-white dark:bg-[#111827]'}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">{rec?.title}</span>
                          <span className="text-[10px] font-bold text-purple-700 dark:text-purple-500">{rec?.confidence}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-2">{rec?.why}</p>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-purple-500/20 bg-slate-50 dark:bg-[#111827] p-3 text-xs text-slate-700 dark:text-gray-200">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold">Why this Recommendation?</span>
                      <span className="text-[10px] font-mono text-purple-700 dark:text-purple-500">Selected action details</span>
                    </div>
                    {selectedRecommendation ? (
                      <>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedRecommendation.title}</p>
                        <div className="mt-2 space-y-1">
                          {selectedRecommendation.details?.map((item: string) => (
                            <div key={item} className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-gray-300">
                              <span className="mt-0.5 text-purple-700 dark:text-purple-500">•</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-slate-500">No recommendations available for this case yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ROW 4: RECENT EVIDENCE WITH CHAIN OF CUSTODY BADGES (P0 & P1) */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  RECENT EVIDENCE & CHAIN OF CUSTODY INTEGRITY
                </span>

                {/* Evidence Category Filters */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {['All', 'CCTV Video', 'Forensics', 'Weapons', 'Photos'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setEvidenceCategoryFilter(cat)}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        evidenceCategoryFilter === cat
                          ? 'bg-[#FF5A1F] text-white'
                          : isDarkMode
                            ? 'bg-gray-800 text-slate-600 dark:text-gray-300'
                            : 'bg-gray-200 text-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence Thumbnails Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {evidenceItems
                  .filter((ev: any) => evidenceCategoryFilter === 'All' || ev.category === evidenceCategoryFilter)
                  .map((item: any) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedEvidence(item)}
                      className={`group rounded-xl border overflow-hidden transition-all cursor-pointer hover:border-[#FF5A1F] ${subCardBg}`}
                    >
                      <div className="relative h-24 w-full bg-slate-800 overflow-hidden">
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
                      <div className="p-2 flex flex-col gap-1">
                        <div className={`text-[11px] font-bold truncate ${isDarkMode ? 'text-slate-700 dark:text-gray-200' : 'text-slate-800'}`}>
                          {item.title}
                        </div>
                        <div className="text-[9px] text-emerald-400 font-mono font-bold truncate">
                          {item.custodyBadge}
                        </div>
                        <div className="text-[9px] text-slate-500 dark:text-gray-400 font-mono truncate">
                          {item.uploader} • {item.timestamp.split(',')[0]}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>

            {/* ROW 5: PENDING TASKS OVERVIEW (P0) */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border ${cardBg}`}>
              <GoogleTasksPanel 
                isDarkMode={isDarkMode} 
                subCardBg={subCardBg} 
                showToast={showToast} 
                isCompact={true} 
              />
            </motion.div>
          </div>

          {/* RIGHT 1/4 SIDEBAR COLUMN: VISUALLY SPLIT ACCUSED VS WITNESS DIRECTORY (P0) */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* 🔴 ACCUSED / SUSPECTS SECTION (P0) */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-red-700 dark:text-red-500 flex items-center gap-1">
                  <ShieldAlert size={14} /> ACCUSED & SUSPECTS ({accusedList.length})
                </span>
                <button
                  onClick={() => setActiveTab('Accused')}
                  className="text-xs font-bold text-red-700 dark:text-red-500 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {accusedList.map((acc: any) => (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccusedModal(acc)}
                    className={`p-3 rounded-xl border flex flex-col gap-2 transition-all cursor-pointer hover:border-red-500/50 ${subCardBg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      {acc.photo ? (
                        <img src={acc.photo} alt={acc.name} className="w-10 h-10 rounded-xl object-cover border border-red-500/40 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/40 shrink-0 flex items-center justify-center text-[10px] font-bold text-red-700 dark:text-red-500">
                          {acc.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className={`text-xs font-extrabold truncate ${isDarkMode ? 'text-slate-800 dark:text-gray-100' : 'text-slate-900'}`}>
                          {acc.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400 font-medium truncate">{acc.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-red-700 dark:text-red-400">{acc.riskBadge}</span>
                      <span className="text-amber-700 dark:text-amber-400">{acc.priorsCount} Priors</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 🟢 WITNESSES & COMPLAINANTS SECTION (P0) */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                  <UserCheck size={14} /> WITNESSES & COMPLAINANTS ({witnesses.length})
                </span>
                <button
                  onClick={() => setActiveTab('Witnesses')}
                  className="text-xs font-bold text-emerald-500 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {witnesses.map((w: any) => (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWitnessModal(w)}
                    className={`p-3 rounded-xl border flex flex-col gap-2 transition-all cursor-pointer hover:border-emerald-500/50 ${subCardBg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-500 font-black text-xs flex items-center justify-center shrink-0">
                        {w.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-xs font-extrabold truncate ${isDarkMode ? 'text-slate-800 dark:text-gray-100' : 'text-slate-900'}`}>
                          {w.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400 font-medium truncate">{w.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-emerald-400">{w.credibility}</span>
                      <span className="text-slate-500 dark:text-gray-400">Sec 161: {w.sec161Status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* LIVE CASE DIARY FEED */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  CASE DIARY STREAM (FORM 67)
                </span>
                <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Sec 172 CrPC
                </span>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                {caseNotes.slice(0, 3).map((note: any) => (
                  <div key={note.id} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-0.5 text-[#FF5A1F]">
                      <FileText size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-bold ${isDarkMode ? 'text-slate-700 dark:text-gray-200' : 'text-slate-800'}`}>
                        {note.author} ({note.category})
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 line-clamp-2">{note.content}</span>
                      <span className="text-[9px] text-gray-500 font-mono mt-0.5">{note.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('Notes')}
                className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center gap-1 cursor-pointer w-fit mt-1"
              >
                <span>View Full Case Diary</span>
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
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-5 ${cardBg}`}>
          <GoogleTasksPanel 
            isDarkMode={isDarkMode} 
            subCardBg={subCardBg} 
            showToast={showToast} 
            isCompact={false} 
          />
        </motion.div>
      ) : activeTab === 'Evidence' ? (
        <motion.div variants={pageItemVariants} className="w-full">
          <EvidenceLockerWorkspace />
        </motion.div>
      ) : activeTab === 'Timeline' ? (
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <Clock className="text-[#FF5A1F]" size={20} />
                Investigation Master Timeline ({currentCase.firNumber})
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Chronological event matrix linking scene inspection, CCTV surveillance, forensics, and arrests.</p>
            </div>

            <button
              onClick={() => setShowAddTimelineModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18] shadow-md"
            >
              <Plus size={15} /> Add Milestone Event
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'FIR & Legal', 'CCTV & Surveillance', 'Forensics & FSL', 'Arrest & Custody'].map((cat) => (
              <button
                key={cat}
                onClick={() => setTimelineFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timelineFilter === cat
                    ? 'bg-[#FF5A1F] text-white'
                    : isDarkMode
                      ? 'bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#FF5A1F]/30 flex flex-col gap-6 my-2">
            {timelineEvents
              .filter((ev: any) => timelineFilter === 'All' || ev.category === timelineFilter)
              .map((ev: any) => {
                const IconComp = ev.icon;
                return (
                  <div key={ev.id} className="relative flex flex-col gap-1 group">
                    <div className="absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full bg-[#111827] border-2 border-[#FF5A1F] flex items-center justify-center shadow-md">
                      <div className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
                    </div>

                    <div className={`p-4 rounded-xl border transition-all ${subCardBg}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-lg ${ev.color}`}>
                            <IconComp size={15} />
                          </span>
                          <span className="font-extrabold text-sm text-[#FF5A1F]">{ev.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-slate-500 dark:text-gray-400">
                            {ev.category}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-gray-400">{ev.timestamp}</span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-gray-300 font-sans leading-relaxed">{ev.desc}</p>

                      <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500 dark:text-gray-400 font-mono border-t pt-2 border-gray-200 dark:border-gray-800">
                        <span>Officer: {ev.officer}</span>
                        <button
                          onClick={() => openCopilot(`Analyze timeline milestone: ${ev.title}`)}
                          className="text-[#FF5A1F] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles size={12} /> Analyze Event
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      ) : activeTab === 'Witnesses' ? (
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <UserCheck className="text-emerald-500" size={20} />
                Witness Directory & Section 161 CrPC Statements
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Recorded witness statements, credibility scoring, and audio transcript logs for {currentCase.firNumber}.</p>
            </div>

            <button
              onClick={() => setActiveAddNewModalTab('Witness')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18] shadow-md"
            >
              <Plus size={15} /> Add New Witness
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {witnesses.map((w: any) => (
              <div key={w.id} className={`p-5 rounded-2xl border flex flex-col gap-3 transition-all ${subCardBg}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-500 font-black text-sm flex items-center justify-center">
                      {w.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm">{w.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-gray-400">{w.role} • {w.phone}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    Credibility: {w.credibility}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/20 border border-white/10 text-xs text-slate-600 dark:text-gray-300 italic">
                  &quot;{w.statementText}&quot;
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 font-mono">
                  <span>Sec 161: <strong className="text-emerald-400">{w.sec161Status}</strong></span>
                  <span>Recorded: {w.dateRecorded}</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => {
                      setSelectedWitnessModal(w);
                      setIsPlayingAudio(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText size={14} /> Full Transcript
                  </button>

                  <button
                    onClick={() => openCopilot(`Draft interrogation or question list for ${w.name} (${w.role})`)}
                    className="py-2 px-3 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={14} /> Question Strategy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : activeTab === 'Accused' ? (
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <ShieldAlert className="text-red-700 dark:text-red-500" size={20} />
                Suspect & Accused Dossier ({currentCase.firNumber})
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Custody tracking, Sec 27 Evidence Act recovery logs, and interrogation summaries.</p>
            </div>

            <button
              onClick={() => setActiveAddNewModalTab('Suspect')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18] shadow-md"
            >
              <Plus size={15} /> Add Suspect Record
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {accusedList.map((acc: any) => (
              <div key={acc.id} className={`p-5 rounded-2xl border flex flex-col gap-4 ${subCardBg}`}>
                <div className="flex items-start gap-3">
                  {acc.photo ? (
                    <img
                      src={acc.photo}
                      alt={acc.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-red-500/40 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border-2 border-red-500/40 shrink-0 flex items-center justify-center text-sm font-bold text-red-700 dark:text-red-500">
                      {acc.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold text-red-700 dark:text-red-500 uppercase">{acc.id}</span>
                    <h3 className="font-extrabold text-sm">{acc.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400">{acc.role}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-sans">
                  <div className="flex justify-between border-b pb-1.5 border-gray-200 dark:border-gray-800">
                    <span className="text-slate-500 dark:text-gray-400">Custody Status</span>
                    <span className="font-bold text-red-700 dark:text-red-400">{acc.custodyStatus}</span>
                  </div>

                  <div className="flex justify-between border-b pb-1.5 border-gray-200 dark:border-gray-800">
                    <span className="text-slate-500 dark:text-gray-400">Prior Antecedents</span>
                    <span className="font-bold text-amber-700 dark:text-amber-500">{acc.priorsCount} Criminal Cases</span>
                  </div>

                  <div className="flex justify-between border-b pb-1.5 border-gray-200 dark:border-gray-800">
                    <span className="text-slate-500 dark:text-gray-400">Sec 27 Recovery</span>
                    <span className="font-bold text-emerald-400 truncate">{acc.sec27Recovery}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {acc.moTags.map((t: any) => (
                    <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20">
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedAccusedModal(acc)}
                  className="w-full py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <FileText size={14} /> Full Interrogation Dossier
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      ) : activeTab === 'Reports' ? (
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <Scale className="text-blue-700 dark:text-blue-500" size={20} />
                Police Document & Legal Reports Hub ({currentCase.firNumber})
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Certified FIR Form 1, Spot Panchanama Memos, Seizure Memos, and Chargesheet (Form 173).</p>
            </div>

            <button
              onClick={() => openCopilot(`Draft new custom legal document for ${currentCase.firNumber}`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18] shadow-md"
            >
              <Sparkles size={15} /> Draft Legal Document
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportsList.map((doc: any) => (
              <div key={doc.id} className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 ${subCardBg}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-700 dark:text-blue-500 flex items-center justify-center shrink-0 font-bold">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm leading-tight">{doc.title}</h3>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400">{doc.docNo} • {doc.date}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                    {doc.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 font-mono text-[11px] text-slate-600 dark:text-gray-300 line-clamp-3 border border-white/5">
                  {doc.previewContent}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
                  <span>Author: {doc.author}</span>
                  <button
                    onClick={() => setSelectedReportModal(doc)}
                    className="px-4 py-2 rounded-xl bg-[#FF5A1F] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Eye size={14} /> Open & Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : activeTab === 'Notes' ? (
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <FileText className="text-[#FF5A1F]" size={20} />
                Official Case Diary Log (Sec 172 CrPC / Form 67)
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Daily investigation proceedings, field observations, and officer log entries.</p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${subCardBg}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-2">
              <Plus size={14} className="text-[#FF5A1F]" /> Add Case Diary Entry
            </span>
            <div className="flex items-center gap-2">
              <select
                value={newNoteCategory}
                onChange={(e) => setNewNoteCategory(e.target.value)}
                className={`p-2 rounded-xl border text-xs font-bold focus:outline-none focus:border-[#FF5A1F] ${
                  isDarkMode ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-slate-900'
                }`}
              >
                <option value="Field Note">Field Note</option>
                <option value="Interrogation Note">Interrogation Note</option>
                <option value="Technical Analysis">Technical Analysis</option>
                <option value="Supervisor Direction">Supervisor Direction</option>
              </select>

              <input
                type="text"
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder="Type official case diary entry observation..."
                className={`flex-1 p-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A1F] ${
                  isDarkMode ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-slate-900'
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveNote(newNoteInput, newNoteCategory);
                }}
              />

              <button
                onClick={() => handleSaveNote(newNoteInput, newNoteCategory)}
                className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18] shrink-0"
              >
                Save Entry
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {caseNotes.map((note: any) => (
              <div key={note.id} className={`p-4 rounded-2xl border flex flex-col gap-2 ${subCardBg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F]" />
                    <span className="font-extrabold text-sm">{note.author}</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400">({note.designation})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF5A1F]/15 text-[#FF5A1F] font-bold">
                      {note.category}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 font-mono">{note.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-gray-200 leading-relaxed font-sans mt-1">{note.content}</p>

                {note.hasAudio && (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-white/10 mt-2 text-xs">
                    <button
                      onClick={() => showToast(`Playing voice recording memo (${note.audioDuration})`)}
                      className="w-7 h-7 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center cursor-pointer"
                    >
                      <Play size={12} className="fill-current" />
                    </button>
                    <span className="text-slate-600 dark:text-gray-300 font-mono text-[11px]">Audio Memo Recording ({note.audioDuration})</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ) : activeTab === 'Files' ? (
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <HardDrive className="text-teal-500" size={20} />
                Cloud Evidence Locker & Files Drive ({currentCase.firNumber})
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">SHA-256 Chain of Custody verified file system.</p>
            </div>

            <button
              onClick={() => setActiveAddNewModalTab('Evidence')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18] shadow-md"
            >
              <Upload size={15} /> Upload Files
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-4 flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-gray-400 uppercase">Case Folder Hierarchy</span>
              {[
                '01_FIR_and_Panchanama',
                '02_CCTV_Surveillance_Video',
                '03_FSL_Forensic_Reports',
                '04_Witness_Audio_Records',
                '05_Form_173_Chargesheet'
              ].map((f) => (
                <div key={f} className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${subCardBg}`}>
                  <div className="flex items-center gap-2">
                    <Folder size={16} className="text-[#FF5A1F]" />
                    <span className="font-mono text-slate-700 dark:text-gray-200">{f}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">Folder</span>
                </div>
              ))}
            </div>

            <div className="md:col-span-8 flex flex-col gap-3">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-gray-400 uppercase">Files & Chain of Custody Hashes</span>
              <div className="flex flex-col gap-2">
                {filesList.map((file: any) => (
                  <div key={file.name} className={`p-3.5 rounded-xl border flex flex-col gap-1.5 ${subCardBg}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-700 dark:text-blue-400" />
                        <span className="font-extrabold text-xs">{file.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400">{file.size}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-gray-400">
                      <span>Folder: {file.folder}</span>
                      <span>Uploaded: {file.date}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5 font-mono text-[9px] text-emerald-400">
                      <span className="truncate">SHA-256: {file.hash}</span>
                      <button
                        onClick={() => showToast('Chain of Custody Hash Verified: Pristine Audit Log')}
                        className="text-[#FF5A1F] hover:underline font-bold shrink-0 ml-2"
                      >
                        Verify Hash
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={pageItemVariants} className={`p-8 rounded-2xl border flex flex-col gap-4 text-center items-center justify-center min-h-[300px] ${cardBg}`}>
          <div className="w-12 h-12 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center">
            <Folder size={24} />
          </div>
          <h2 className="text-xl font-black">{activeTab} Section</h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 max-w-md">
            Showing synced records and data for {activeTab} in {currentCase.firNumber}.
          </p>
          <button
            onClick={() => openCopilot(`Analyze ${activeTab} data for ${currentCase.firNumber}`)}
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

      {/* --- MODAL 1: ADD NEW ITEM MODAL --- */}
      <AnimatePresence>
        {activeAddNewModalTab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-lg w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setActiveAddNewModalTab(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-slate-500 dark:text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-base font-black flex items-center gap-2">
                <Plus className="text-[#FF5A1F]" size={18} />
                Add New {activeAddNewModalTab} ({currentCase.firNumber})
              </h3>

              {activeAddNewModalTab === 'Evidence' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-slate-600 dark:text-gray-300">Evidence Title</label>
                  <input type="text" placeholder="e.g. CCTV_Exit_Door_02.mp4" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-slate-600 dark:text-gray-300">Upload File</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center text-slate-500 dark:text-gray-400">
                    <Upload size={24} className="text-[#FF5A1F]" />
                    <span>Drag & Drop file or click to browse</span>
                  </div>
                </div>
              )}

              {activeAddNewModalTab === 'Witness' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-slate-600 dark:text-gray-300">Witness Name</label>
                  <input type="text" placeholder="e.g. Ramesh Kumar" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-slate-600 dark:text-gray-300">Witness Role / Type</label>
                  <input type="text" placeholder="e.g. Eyewitness / Neighbor" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-slate-600 dark:text-gray-300">Sec 161 CrPC Statement</label>
                  <textarea rows={3} placeholder="Type statement excerpt..." className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                </div>
              )}

              {activeAddNewModalTab === 'Suspect' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-slate-600 dark:text-gray-300">Suspect Full Name</label>
                  <input type="text" placeholder="e.g. Suresh K." className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-slate-600 dark:text-gray-300">Custody Status</label>
                  <select className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}>
                    <option>Police Custody (Remand)</option>
                    <option>Judicial Custody</option>
                    <option>Released on Bail</option>
                    <option>Absconding</option>
                  </select>
                </div>
              )}

              {activeAddNewModalTab === 'FSL' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-slate-600 dark:text-gray-300">Exhibit File / Material</label>
                  <input type="text" placeholder="e.g. Crowbar_Seized_P1.jpg" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-slate-600 dark:text-gray-300">Analysis Type Required</label>
                  <select className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}>
                    <option>AFIS Fingerprint Minutiae Matching</option>
                    <option>Ballistics & Toolmark Examination</option>
                    <option>Chemical / Forensic Toxicology</option>
                    <option>Cyber Video Deepfake Detection</option>
                  </select>
                </div>
              )}

              {activeAddNewModalTab === 'Chargesheet' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-slate-600 dark:text-gray-300">Court Jurisdiction</label>
                  <input type="text" placeholder="Hon'ble 10th ACMM Court, Bengaluru" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-slate-600 dark:text-gray-300">Prosecution Recommendation</label>
                  <textarea rows={3} placeholder="Charge accused under IPC 457, 380, 411 read with Sec 34..." className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                </div>
              )}

              {activeAddNewModalTab === 'Task' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-slate-600 dark:text-gray-300">Task Title</label>
                  <input type="text" placeholder="e.g. Collect FSL Blood Sample Report" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-slate-600 dark:text-gray-300">Assignee</label>
                  <input type="text" placeholder="e.g. SI Naveen" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                </div>
              )}

              {activeAddNewModalTab === 'Note' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-slate-600 dark:text-gray-300">Case Diary Note Content</label>
                  <textarea
                    rows={4}
                    value={noteModalText}
                    onChange={(e) => setNoteModalText(e.target.value)}
                    placeholder="Type official investigation observation..."
                    className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={() => setActiveAddNewModalTab(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (activeAddNewModalTab === 'Note' && noteModalText.trim()) {
                      handleSaveNote(noteModalText, 'Field Note');
                    } else {
                      showToast(`Submitted ${activeAddNewModalTab} request for ${currentCase.firNumber}`);
                    }
                    setActiveAddNewModalTab(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18]"
                >
                  Save Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: WITNESS STATEMENT TRANSCRIPT MODAL --- */}
      <AnimatePresence>
        {selectedWitnessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-xl w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setSelectedWitnessModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-slate-500 dark:text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 font-black text-base flex items-center justify-center">
                  {selectedWitnessModal.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black">{selectedWitnessModal.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400">{selectedWitnessModal.role} • {selectedWitnessModal.phone}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-white/10 text-xs flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-[11px] text-emerald-400">
                  <span>Sec 161 CrPC Statement ({selectedWitnessModal.sec161Status})</span>
                  <span>{selectedWitnessModal.dateRecorded}</span>
                </div>
                <p className="text-slate-700 dark:text-gray-200 leading-relaxed font-sans">&quot;{selectedWitnessModal.statementText}&quot;</p>
              </div>

              {selectedWitnessModal.hasAudio && (
                <div className="p-3 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setIsPlayingAudio(!isPlayingAudio);
                        showToast(isPlayingAudio ? 'Paused audio playback' : `Playing statement audio recording (${selectedWitnessModal.audioDuration})`);
                      }}
                      className="w-8 h-8 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center cursor-pointer"
                    >
                      {isPlayingAudio ? <Pause size={14} /> : <Play size={14} className="fill-current" />}
                    </button>
                    <span className="font-mono text-slate-700 dark:text-gray-200">Audio Recording ({selectedWitnessModal.audioDuration})</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Intelligible</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    openCopilot(`Draft interrogation or cross-examination strategy for witness ${selectedWitnessModal.name}`);
                    setSelectedWitnessModal(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} /> AI Question Strategy Draft
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 3: ACCUSED INTERROGATION DOSSIER MODAL --- */}
      <AnimatePresence>
        {selectedAccusedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-xl w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setSelectedAccusedModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-slate-500 dark:text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <img src={selectedAccusedModal.photo} alt={selectedAccusedModal.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-red-500" />
                <div>
                  <h3 className="text-lg font-black">{selectedAccusedModal.name}</h3>
                  <p className="text-xs text-red-700 dark:text-red-400 font-bold">{selectedAccusedModal.role}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-white/10 text-xs flex flex-col gap-2">
                <span className="font-bold text-slate-500 dark:text-gray-400 uppercase text-[10px] font-mono">Interrogation & Disclosure Excerpt (Sec 27 Evidence Act)</span>
                <p className="text-slate-700 dark:text-gray-200 leading-relaxed font-sans">{selectedAccusedModal.interrogationSummary}</p>
              </div>

              <div className="flex flex-col gap-1 text-xs font-mono">
                <span className="text-slate-500 dark:text-gray-400">Custody: <strong className="text-red-700 dark:text-red-400">{selectedAccusedModal.custodyStatus}</strong></span>
                <span className="text-slate-500 dark:text-gray-400">Recovery: <strong className="text-emerald-400">{selectedAccusedModal.sec27Recovery}</strong></span>
              </div>

              <button
                onClick={() => {
                  openCopilot(`Generate customized interrogation plan for accused ${selectedAccusedModal.name}`);
                  setSelectedAccusedModal(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={14} /> Generate Interrogation Plan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 4: REPORT DOCUMENT VIEWER MODAL --- */}
      <AnimatePresence>
        {selectedReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-2xl w-full flex flex-col gap-4 relative max-h-[85vh] overflow-y-auto ${cardBg}`}
            >
              <button
                onClick={() => setSelectedReportModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-slate-500 dark:text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-base font-black pr-8">{selectedReportModal.title}</h3>

              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 border border-white/10 whitespace-pre-wrap leading-relaxed">
                {selectedReportModal.previewContent}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 font-mono">
                <span>Doc ID: {selectedReportModal.docNo}</span>
                <span>Certified on: {selectedReportModal.date}</span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => showToast('Printing Official Certified Document...')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer size={14} /> Print Document
                </button>

                <button
                  onClick={() => showToast('Downloaded PDF to Local Station')}
                  className="flex-1 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-[#E04D18]"
                >
                  <FileDown size={14} /> Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 5: EVIDENCE LIGHTBOX MODAL --- */}
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
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-slate-500 dark:text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-black pr-8">{selectedEvidence.title}</h3>

              <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                <img src={selectedEvidence.img} alt={selectedEvidence.title} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
              </div>

              <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-gray-400 font-mono">
                <span>Category: {selectedEvidence.category} • Size: {selectedEvidence.type}</span>
                <span className="text-emerald-400 font-bold">Chain of Custody: {selectedEvidence.custodyBadge}</span>
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

      {/* --- MODAL 6: ADD TIMELINE MILESTONE MODAL --- */}
      <AnimatePresence>
        {showAddTimelineModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-md w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setShowAddTimelineModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-slate-500 dark:text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-base font-black">Add Timeline Milestone Event</h3>

              <div className="flex flex-col gap-3 text-xs">
                <input
                  type="text"
                  value={newTimelineTitle}
                  onChange={(e) => setNewTimelineTitle(e.target.value)}
                  placeholder="Event Title (e.g. Seizure of Getaway Scooter)"
                  className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}
                />
                <input
                  type="text"
                  value={newTimelineTime}
                  onChange={(e) => setNewTimelineTime(e.target.value)}
                  placeholder="Timestamp (e.g. 19 Jul 2025, 02:00 PM)"
                  className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}
                />
                <select
                  value={newTimelineCat}
                  onChange={(e) => setNewTimelineCat(e.target.value)}
                  className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}
                >
                  <option value="FIR & Legal">FIR & Legal</option>
                  <option value="CCTV & Surveillance">CCTV & Surveillance</option>
                  <option value="Forensics & FSL">Forensics & FSL</option>
                  <option value="Arrest & Custody">Arrest & Custody</option>
                </select>
                <textarea
                  rows={3}
                  value={newTimelineDesc}
                  onChange={(e) => setNewTimelineDesc(e.target.value)}
                  placeholder="Event description and details..."
                  className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowAddTimelineModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newTimelineTitle.trim()) {
                      const newEv = {
                        id: `E${Date.now()}`,
                        title: newTimelineTitle.trim(),
                        timestamp: newTimelineTime.trim() || 'Just Now',
                        category: newTimelineCat,
                        officer: 'Inspector Arjun',
                        desc: newTimelineDesc.trim() || 'Custom investigation milestone added by officer.',
                        icon: Clock,
                        color: 'text-amber-700 dark:text-amber-500 bg-amber-500/10'
                      };
                      showToast('Saved Milestone to Official Case Diary');
                      showToast('Added Milestone to Investigation Timeline');
                      setNewTimelineTitle('');
                      setNewTimelineTime('');
                      setNewTimelineDesc('');
                      setShowAddTimelineModal(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18]"
                >
                  Save Milestone
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
      </div>
    </motion.main>
  );
}
