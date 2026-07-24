'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  BarChart3, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Eye, 
  MoreVertical, 
  ChevronRight, 
  FileText, 
  Sparkles, 
  UserCheck, 
  TrendingUp, 
  Check, 
  X, 
  Globe, 
  Calendar, 
  HardDrive, 
  FileSpreadsheet, 
  StickyNote, 
  CheckSquare, 
  Mail, 
  MessageSquare, 
  Users, 
  ClipboardList, 
  ListFilter, 
  FileCode2, 
  Send, 
  ExternalLink,
  Activity,
  Award,
  AlertCircle,
  FolderLock,
  PieChart as PieChartIcon
} from 'lucide-react';

import { useUIStore } from '@/lib/stores/uiStore';

// Optional import Google Workspace Panels
import GoogleDocsPanel from './GoogleDocsPanel';
import GoogleSheetsPanel from './GoogleSheetsPanel';
import GoogleTasksPanel from './GoogleTasksPanel';
import GoogleKeepNotesPanel from './GoogleKeepNotesPanel';
import GoogleCalendarWidget from './GoogleCalendarWidget';
import GoogleDriveEvidencePanel from './GoogleDriveEvidencePanel';
import GmailPanel from './GmailPanel';
import GoogleChatPanel from './GoogleChatPanel';

// DATA INTERFACES
export interface CaseAssignment {
  id: string;
  caseNo: string;
  title: string;
  assignedTo: string;
  officerRole: string;
  category: 'Investigation' | 'Evidence' | 'Forensic' | 'Verification' | 'Legal' | 'CD Review';
  dueDate: string;
  status: 'Overdue' | 'Under Review' | 'On Time' | 'Closed';
  complianceScore: number;
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  checklist: { step: string; status: 'completed' | 'pending' | 'flagged' }[];
  supervisorRemarks?: string;
}

export interface OfficerPerformance {
  id: string;
  name: string;
  rank: string;
  score: number;
  casesCompleted: number;
  pendingCases: number;
  overdueCases: number;
  complianceRate: number;
  avatarColor: string;
}

export interface ObservationItem {
  id: string;
  title: string;
  caseNo: string;
  type: 'Positive' | 'Improvement' | 'Critical';
  time: string;
  description: string;
}

export interface AuditTrailItem {
  id: string;
  timestamp: string;
  officer: string;
  action: string;
  caseNo: string;
  type: 'Update' | 'Evidence' | 'Review' | 'Flag';
}

export default function SupervisorAuditWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const showToast = useUIStore((s) => s.showToast);
  const openCopilot = useUIStore((s) => s.openCopilot);

  // STYLING HELPERS
  const cardBg = isDarkMode 
    ? 'bg-[#111827]/90 border-gray-800/90 text-white shadow-xl backdrop-blur-md' 
    : 'bg-white border-slate-200/90 text-slate-900 shadow-sm';

  const subCardBg = isDarkMode 
    ? 'bg-gray-900/80 border-gray-800' 
    : 'bg-slate-50 border-slate-200';

  // SUB TABS NAVIGATION
  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Case Audit' | 'Officer Performance' | 'Compliance' | 'Activity Log' | 'Observations' | 'Corrective Actions' | 'Documents'
  >('Overview');

  // WORKSPACE SUITE PANELS
  const [isWorkspaceSuiteOpen, setIsWorkspaceSuiteOpen] = useState(false);
  const [workspaceSuiteTab, setWorkspaceSuiteTab] = useState<
    'Docs' | 'Sheets' | 'Keep' | 'Calendar' | 'Tasks' | 'Gmail' | 'Chat' | 'Drive'
  >('Docs');

  // SEARCH & STATUS FILTERS
  const [statusFilter, setStatusFilter] = useState<'All' | 'Overdue' | 'Under Review' | 'On Time' | 'Closed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // MODALS STATE
  const [isStartAuditOpen, setIsStartAuditOpen] = useState(false);
  const [selectedCaseForInspection, setSelectedCaseForInspection] = useState<CaseAssignment | null>(null);
  const [isAuditTrailModalOpen, setIsAuditTrailModalOpen] = useState(false);
  const [isOfficerPerformanceModalOpen, setIsOfficerPerformanceModalOpen] = useState(false);
  const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false);
  const [isStartAuditDropdownOpen, setIsStartAuditDropdownOpen] = useState(false);

  // NEW AUDIT FORM STATE
  const [newCaseNo, setNewCaseNo] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newAssignedTo, setNewAssignedTo] = useState('HC Kavya');
  const [newCategory, setNewCategory] = useState<CaseAssignment['category']>('Investigation');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<CaseAssignment['priority']>('Medium');

  // INITIAL STATE DATA MATCHING REFERENCE IMAGE
  const [assignments, setAssignments] = useState<CaseAssignment[]>([
    {
      id: 'ASG-101',
      caseNo: 'FIR KRP/2026/0456',
      title: 'Armed House Burglary & Theft',
      assignedTo: 'HC Kavya',
      officerRole: 'Head Constable',
      category: 'Investigation',
      dueDate: '18 Jul 2026 10:00 AM',
      status: 'Overdue',
      complianceScore: 68,
      priority: 'High',
      checklist: [
        { step: 'BNSS 35(3) Notice Served to Suspects', status: 'completed' },
        { step: 'Case Diary (CD) entries updated within 24 Hours', status: 'flagged' },
        { step: 'Crime Scene Seizure Memo & Digital Fingerprint Hash', status: 'pending' },
        { step: 'Form 173 Charge-Sheet Draft Inspection', status: 'pending' }
      ],
      supervisorRemarks: 'Case Diary submission delayed by 48 hours. Issued written requisition notice.'
    },
    {
      id: 'ASG-102',
      caseNo: 'CCTV Evidence Review',
      title: '3 Commercial Locations Footage Audit',
      assignedTo: 'SI Naveen',
      officerRole: 'Sub-Inspector',
      category: 'Evidence',
      dueDate: '17 Jul 2026 04:00 PM',
      status: 'Under Review',
      complianceScore: 85,
      priority: 'Medium',
      checklist: [
        { step: 'Section 61 BSA Hash Certificate Verified', status: 'completed' },
        { step: 'CCTV Timeline Alignment across 3 Cameras', status: 'completed' },
        { step: 'Forensic Lab Video Enhancement Requisition', status: 'pending' }
      ]
    },
    {
      id: 'ASG-103',
      caseNo: 'Fingerprint Analysis',
      title: 'Suspect: Suresh Kumar (Latent Print Match)',
      assignedTo: 'ASI Ramesh',
      officerRole: 'Assistant Sub-Inspector',
      category: 'Forensic',
      dueDate: '17 Jul 2026 11:30 AM',
      status: 'On Time',
      complianceScore: 92,
      priority: 'High',
      checklist: [
        { step: 'State FSL Fingerprint Match Certificate Received', status: 'completed' },
        { step: 'IO Verification Memo signed', status: 'completed' },
        { step: 'AFIS Database Cross-Check', status: 'completed' }
      ]
    },
    {
      id: 'ASG-104',
      caseNo: 'Witness Statements',
      title: 'Complainant Harish K. & Spot Witnesses',
      assignedTo: 'HC Kavya',
      officerRole: 'Head Constable',
      category: 'Investigation',
      dueDate: '19 Jul 2026 12:00 PM',
      status: 'On Time',
      complianceScore: 90,
      priority: 'Medium',
      checklist: [
        { step: 'Statement Recorded under Sec 180 BNSS', status: 'completed' },
        { step: 'Audio Recording Encrypted & Uploaded', status: 'completed' }
      ]
    },
    {
      id: 'ASG-105',
      caseNo: 'Vehicle Verification',
      title: 'Registration KA03MN4481 White Innova Audit',
      assignedTo: 'SI Naveen',
      officerRole: 'Sub-Inspector',
      category: 'Verification',
      dueDate: '18 Jul 2026 03:00 PM',
      status: 'On Time',
      complianceScore: 88,
      priority: 'Low',
      checklist: [
        { step: 'RTO Registration Certificate Validation', status: 'completed' },
        { step: 'Chassis Number Physical Inspection Sheet', status: 'completed' }
      ]
    },
    {
      id: 'ASG-106',
      caseNo: 'FIR KRP/2026/0448',
      title: 'Cyber Fraud Online Banking Heist',
      assignedTo: 'ASI Ramesh',
      officerRole: 'Assistant Sub-Inspector',
      category: 'Legal',
      dueDate: '20 Jul 2026 11:00 AM',
      status: 'On Time',
      complianceScore: 95,
      priority: 'Critical',
      checklist: [
        { step: 'Bank Account Freeze Requisition under Sec 106 BNSS', status: 'completed' },
        { step: 'MHA Cyber Crime Portal Incident Linked', status: 'completed' },
        { step: 'Form 173 Final Legal Audit', status: 'pending' }
      ]
    }
  ]);

  // OFFICER PERFORMANCE LIST
  const [officers] = useState<OfficerPerformance[]>([
    { id: 'O-1', name: 'SI Naveen', rank: 'Sub-Inspector', score: 98, casesCompleted: 42, pendingCases: 3, overdueCases: 0, complianceRate: 98, avatarColor: 'bg-emerald-500' },
    { id: 'O-2', name: 'ASI Ramesh', rank: 'Assistant Sub-Inspector', score: 94, casesCompleted: 38, pendingCases: 2, overdueCases: 0, complianceRate: 94, avatarColor: 'bg-blue-500' },
    { id: 'O-3', name: 'HC Kavya', rank: 'Head Constable', score: 89, casesCompleted: 31, pendingCases: 5, overdueCases: 1, complianceRate: 89, avatarColor: 'bg-amber-500' },
    { id: 'O-4', name: 'PC Mahesh', rank: 'Police Constable', score: 76, casesCompleted: 24, pendingCases: 4, overdueCases: 2, complianceRate: 76, avatarColor: 'bg-orange-500' },
    { id: 'O-5', name: 'PC Suresh', rank: 'Police Constable', score: 62, casesCompleted: 18, pendingCases: 6, overdueCases: 3, complianceRate: 62, avatarColor: 'bg-red-500' }
  ]);

  // OBSERVATIONS LIST
  const [observations, setObservations] = useState<ObservationItem[]>([
    { id: 'OBS-1', title: 'Proper evidence chain maintained in CCTV case.', caseNo: 'FIR KRP/2026/0456', type: 'Positive', time: '2h ago', description: 'Digital hash signatures and BSA 61 certificates correctly attached.' },
    { id: 'OBS-2', title: 'Delay in witness statement collection.', caseNo: 'FIR KRP/2026/0448', type: 'Improvement', time: '1d ago', description: 'IO recommended to schedule video statement recording within 48h.' },
    { id: 'OBS-3', title: 'Incomplete case diary entries.', caseNo: 'FIR KRP/2026/0442', type: 'Critical', time: '2d ago', description: 'Missing daily progress diary for 3 consecutive days during custody period.' }
  ]);

  // AUDIT TRAIL LOG
  const [auditLogs] = useState<AuditTrailItem[]>([
    { id: 'LOG-1', timestamp: '10:24 AM Today', officer: 'HC Kavya', action: 'Case Diary Updated', caseNo: 'FIR KRP/2026/0456', type: 'Update' },
    { id: 'LOG-2', timestamp: '09:58 AM Today', officer: 'ASI Ramesh', action: 'Evidence Uploaded: CCTV_FrontGate_15Jul.mp4', caseNo: 'CCTV Evidence Review', type: 'Evidence' },
    { id: 'LOG-3', timestamp: 'Yesterday 04:30 PM', officer: 'SI Naveen', action: 'Report Reviewed: Case Notes', caseNo: 'Vehicle Verification', type: 'Review' },
    { id: 'LOG-4', timestamp: '2 days ago', officer: 'Supervisor DySP', action: 'Corrective Action Issued for Overdue Case Diary', caseNo: 'FIR KRP/2026/0456', type: 'Flag' }
  ]);

  // FILTERED ASSIGNMENTS
  const filteredAssignments = assignments.filter((asg) => {
    const matchesStatus = statusFilter === 'All' || asg.status === statusFilter;
    const matchesQuery = 
      asg.caseNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asg.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asg.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // HANDLER FOR CREATING NEW AUDIT
  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseNo || !newTitle) {
      showToast('Please fill required audit fields');
      return;
    }

    const created: CaseAssignment = {
      id: `ASG-${Date.now().toString().slice(-3)}`,
      caseNo: newCaseNo,
      title: newTitle,
      assignedTo: newAssignedTo,
      officerRole: newAssignedTo.startsWith('SI') ? 'Sub-Inspector' : newAssignedTo.startsWith('ASI') ? 'Assistant Sub-Inspector' : 'Head Constable',
      category: newCategory,
      dueDate: newDueDate || 'Tomorrow 05:00 PM',
      status: 'On Time',
      complianceScore: 100,
      priority: newPriority,
      checklist: [
        { step: 'Supervisory Inspection Initiated', status: 'completed' },
        { step: 'Case Diary Audit', status: 'pending' },
        { step: 'Evidence Hash Certificate Verification', status: 'pending' }
      ]
    };

    setAssignments([created, ...assignments]);
    setIsStartAuditOpen(false);
    setNewCaseNo('');
    setNewTitle('');
    showToast(`Initiated Supervisory Audit for ${created.caseNo}`);
  };

  // HANDLER FOR APPROVING OR RESOLVING AN AUDIT
  const handleApproveAudit = (id: string) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, status: 'Closed', complianceScore: 100 } : a));
    setSelectedCaseForInspection(null);
    showToast(`Audit Completed & Approved for Case ${id}`);
  };

  // HANDLER FOR ISSUING DIRECTIVE
  const handleIssueDirective = (id: string, text: string) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, supervisorRemarks: text } : a));
    showToast(`Corrective Directive dispatched to IO for ${id}`);
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col gap-6 font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0F19] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      
      {/* 1. HEADER & TOP BREADCRUMB TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 font-mono">
            <span 
              onClick={() => showToast('Supervisory Dashboard Root')}
              className="hover:text-[#FF5A1F] cursor-pointer transition-colors"
            >
              Supervisor Audit
            </span>
            <span>&gt;</span>
            <span className="text-slate-800 dark:text-gray-200 font-bold">Dashboard</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>Supervisor Audit</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Active
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 font-medium max-w-2xl">
            Monitor performance, ensure compliance, and maintain accountability across investigations.
          </p>
        </div>

        {/* TOP RIGHT TOOLBAR BUTTONS */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* WORKSPACE SUITE TOGGLE BUTTON */}
          <button
            onClick={() => setIsWorkspaceSuiteOpen(!isWorkspaceSuiteOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-gray-800 text-xs font-bold hover:border-[#FF5A1F] transition-all cursor-pointer bg-slate-100 dark:bg-gray-900 text-slate-700 dark:text-gray-300"
          >
            <Globe size={14} className="text-[#FF5A1F]" />
            <span>Workspace Suite</span>
          </button>

          {/* AUDIT TRAILS BUTTON */}
          <button
            onClick={() => setIsAuditTrailModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-gray-800 text-xs font-bold hover:border-slate-400 dark:hover:border-gray-600 transition-all cursor-pointer bg-slate-100 dark:bg-gray-900 text-slate-700 dark:text-gray-300"
          >
            <Activity size={14} className="text-blue-500" />
            <span>Audit Trails</span>
          </button>

          {/* REPORTS DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setIsReportsDropdownOpen(!isReportsDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-gray-800 text-xs font-bold hover:border-slate-400 dark:hover:border-gray-600 transition-all cursor-pointer bg-slate-100 dark:bg-gray-900 text-slate-700 dark:text-gray-300"
            >
              <FileText size={14} />
              <span>Reports</span>
              <span className="text-[10px]">▾</span>
            </button>

            <AnimatePresence>
              {isReportsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl border bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 shadow-2xl p-2 z-50 flex flex-col gap-1"
                >
                  <button
                    onClick={() => {
                      showToast('Generated Executive Audit Summary PDF');
                      setIsReportsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Download size={13} className="text-[#FF5A1F]" />
                    <span>Export Audit Summary PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      showToast('Downloaded Station Compliance Excel');
                      setIsReportsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet size={13} className="text-emerald-500" />
                    <span>Download Excel Compliance Sheet</span>
                  </button>
                  <button
                    onClick={() => {
                      showToast('Opening Google Docs Audit Inspection Sheet');
                      setIsReportsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
                  >
                    <FileText size={13} className="text-blue-500" />
                    <span>Inspect Requisition Docs</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* START AUDIT PRIMARY BUTTON */}
          <button
            onClick={() => setIsStartAuditOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] hover:bg-[#e04d16] text-white text-xs font-bold shadow-lg shadow-[#FF5A1F]/20 transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Start Audit</span>
          </button>
        </div>
      </div>

      {/* 2. TOP METRICS ROW (6 KPI CARDS EXACTLY MATCHING SCREENSHOT) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* TOTAL ASSIGNMENTS */}
        <div 
          onClick={() => {
            setStatusFilter('All');
            showToast('Showing All 342 Assignments');
          }}
          className={`p-4 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer hover:border-[#FF5A1F]/50 ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">TOTAL ASSIGNMENTS</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
              <ClipboardList size={16} />
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">342</span>
            <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <span>↑ 18%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </span>
          </div>
        </div>

        {/* COMPLETED ON TIME */}
        <div 
          onClick={() => {
            setStatusFilter('On Time');
            showToast('Filtered by Completed On Time (247 Cases)');
          }}
          className={`p-4 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer hover:border-emerald-500/50 ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">COMPLETED ON TIME</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">247</span>
              <span className="text-xs text-slate-500 dark:text-gray-400 font-bold">(72%)</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>↑ 12%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </span>
          </div>
        </div>

        {/* PENDING REVIEW */}
        <div 
          onClick={() => {
            setStatusFilter('Under Review');
            showToast('Filtered by Pending Review (38 Cases)');
          }}
          className={`p-4 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer hover:border-amber-500/50 ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">PENDING REVIEW</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">38</span>
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span>↓ 5</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </span>
          </div>
        </div>

        {/* OVERDUE CASES */}
        <div 
          onClick={() => {
            setStatusFilter('Overdue');
            showToast('Filtered by Overdue Cases (19 Cases)');
          }}
          className={`p-4 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer hover:border-red-500/50 ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">OVERDUE CASES</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">19</span>
            <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
              <span>↓ 3</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </span>
          </div>
        </div>

        {/* LEGAL COMPLIANCE */}
        <div 
          onClick={() => {
            setActiveTab('Compliance');
            showToast('Opened Compliance Breakdown Tab');
          }}
          className={`p-4 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer hover:border-blue-500/50 ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">LEGAL COMPLIANCE</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shrink-0">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 w-[94%]" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white leading-none">94%</span>
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 dark:text-gray-400 mt-1">
              <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1 rounded">BNS ✓</span>
              <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1 rounded">BNSS ✓</span>
              <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1 rounded">Evidence Act ✓</span>
            </div>
          </div>
        </div>

        {/* AUDITS CONDUCTED */}
        <div 
          onClick={() => {
            setActiveTab('Activity Log');
            showToast('Opened Audit Activity Log');
          }}
          className={`p-4 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer hover:border-indigo-500/50 ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">AUDITS CONDUCTED</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
              <BarChart3 size={16} />
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">27</span>
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <span>↑ 9</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. SUB-NAVIGATION TABS BAR */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-gray-800 pb-1 scrollbar-none">
        {(
          [
            'Overview', 
            'Case Audit', 
            'Officer Performance', 
            'Compliance', 
            'Activity Log', 
            'Observations', 
            'Corrective Actions', 
            'Documents'
          ] as const
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'text-[#FF5A1F] bg-[#FF5A1F]/5 border-b-2 border-[#FF5A1F]'
                : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4. GOOGLE WORKSPACE LEGAL & SUPERVISORY PANEL (WHEN TOGGLED) */}
      <AnimatePresence>
        {isWorkspaceSuiteOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-2xl border flex flex-col gap-4 overflow-hidden ${cardBg}`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 font-bold flex items-center justify-center text-xs">
                  G
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-gray-200">
                    KSP GOOGLE WORKSPACE SUPERVISORY &amp; AUDIT INTEGRATION
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400">Dispatch Audit Directives, Requisition Docs, Case Spreadsheets &amp; Officer Memos</p>
                </div>
              </div>

              <button 
                onClick={() => setIsWorkspaceSuiteOpen(false)} 
                className="text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* SUITE TABS */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { name: 'Docs', icon: FileText },
                { name: 'Sheets', icon: FileSpreadsheet },
                { name: 'Tasks', icon: CheckSquare },
                { name: 'Keep', icon: StickyNote },
                { name: 'Calendar', icon: Calendar },
                { name: 'Drive', icon: HardDrive },
                { name: 'Gmail', icon: Mail },
                { name: 'Chat', icon: MessageSquare }
              ].map((t) => {
                const IconComp = t.icon;
                const isSelected = workspaceSuiteTab === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => setWorkspaceSuiteTab(t.name as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <IconComp size={13} />
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>

            {/* PANEL BODY */}
            <div className="pt-2">
              {workspaceSuiteTab === 'Docs' && <GoogleDocsPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Sheets' && <GoogleSheetsPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Tasks' && <GoogleTasksPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Keep' && <GoogleKeepNotesPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Calendar' && <GoogleCalendarWidget isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Drive' && <GoogleDriveEvidencePanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Gmail' && <GmailPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Chat' && <GoogleChatPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. OVERVIEW MAIN SECTION (3 CARDS ROW: AUDIT SUMMARY DONUT, COMPLIANCE TREND AREA, PENDING ACTIONS) */}
      {activeTab === 'Overview' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* AUDIT SUMMARY (THIS MONTH) - DONUT VISUALIZER */}
            <div className={`lg:col-span-4 p-5 rounded-2xl border flex flex-col justify-between gap-4 ${cardBg}`}>
              <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-gray-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  AUDIT SUMMARY <span className="text-[10px] text-[#FF5A1F]">(THIS MONTH)</span>
                </span>
                <PieChartIcon size={16} className="text-[#FF5A1F]" />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                {/* SVG DONUT CHART */}
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Circle 1: On Time (72%) - Emerald */}
                    <circle
                      cx="50" cy="50" r="38"
                      stroke="currentColor" strokeWidth="12"
                      className="text-emerald-500"
                      strokeDasharray="172 238"
                      strokeDashoffset="0"
                      fill="transparent"
                    />
                    {/* Circle 2: Under Review (11%) - Amber */}
                    <circle
                      cx="50" cy="50" r="38"
                      stroke="currentColor" strokeWidth="12"
                      className="text-amber-500"
                      strokeDasharray="26 238"
                      strokeDashoffset="-172"
                      fill="transparent"
                    />
                    {/* Circle 3: Overdue (6%) - Red */}
                    <circle
                      cx="50" cy="50" r="38"
                      stroke="currentColor" strokeWidth="12"
                      className="text-red-500"
                      strokeDasharray="14 238"
                      strokeDashoffset="-198"
                      fill="transparent"
                    />
                    {/* Circle 4: Closed (11%) - Purple */}
                    <circle
                      cx="50" cy="50" r="38"
                      stroke="currentColor" strokeWidth="12"
                      className="text-purple-500"
                      strokeDasharray="26 238"
                      strokeDashoffset="-212"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-black text-slate-900 dark:text-white">342</span>
                    <span className="text-[9px] font-mono text-slate-500 dark:text-gray-400">Total Assignments</span>
                  </div>
                </div>

                {/* DONUT LEGEND */}
                <div className="flex flex-col gap-2.5 text-xs w-full sm:w-auto">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-slate-700 dark:text-gray-300 font-medium">On Time</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">247 <span className="text-[10px] text-slate-400">(72%)</span></span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-slate-700 dark:text-gray-300 font-medium">Under Review</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">38 <span className="text-[10px] text-slate-400">(11%)</span></span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="text-slate-700 dark:text-gray-300 font-medium">Overdue</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">19 <span className="text-[10px] text-slate-400">(6%)</span></span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      <span className="text-slate-700 dark:text-gray-300 font-medium">Closed</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">38 <span className="text-[10px] text-slate-400">(11%)</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* COMPLIANCE TREND CHART (MIDDLE CARD - 5 COLS) */}
            <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between gap-3 ${cardBg}`}>
              <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-gray-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  COMPLIANCE TREND
                </span>
                <span className="text-xs text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-2.5 py-1 rounded-lg">
                  Last 7 Months ▾
                </span>
              </div>

              {/* COMPLIANCE SVG TREND AREA */}
              <div className="relative w-full h-44 pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 350 120" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="350" y2="20" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="350" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="350" y2="80" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />

                  {/* Gradient Area Fill */}
                  <defs>
                    <linearGradient id="complianceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 10 70 Q 60 30 110 40 T 210 45 T 310 15 L 310 110 L 10 110 Z"
                    fill="url(#complianceGrad)"
                  />
                  {/* Smooth Line */}
                  <path
                    d="M 10 70 Q 60 30 110 40 T 210 45 T 310 15"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                  />
                  {/* Active Point Callout for Jul 2025: 94% */}
                  <circle cx="310" cy="15" r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
                </svg>

                {/* FLOATING SCORE TOOLTIP */}
                <div className="absolute right-2 top-0 bg-white dark:bg-gray-900 border border-blue-500/40 text-slate-900 dark:text-white px-3 py-1.5 rounded-xl shadow-lg text-[10px] flex flex-col items-center">
                  <span className="text-slate-400 font-mono">Jul 2026</span>
                  <span className="font-bold text-blue-500 text-xs">Compliance Score: 94%</span>
                </div>

                {/* X-AXIS MONTH LABELS */}
                <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                </div>
              </div>
            </div>

            {/* PENDING ACTIONS (RIGHT CARD - 3 COLS) */}
            <div className={`lg:col-span-3 p-5 rounded-2xl border flex flex-col justify-between gap-3 ${cardBg}`}>
              <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-gray-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  PENDING ACTIONS
                </span>
                <AlertCircle size={15} className="text-amber-500" />
              </div>

              <div className="flex flex-col gap-2.5">
                {/* ACTION ITEM 1 */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-[10px]">
                      !
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[140px]">Review Overdue Case</span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">FIR KRP/2026/0456</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-red-500/10 text-red-500 border border-red-500/20">High</span>
                    <span className="text-[9px] text-slate-400">2h ago</span>
                  </div>
                </div>

                {/* ACTION ITEM 2 */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-[10px]">
                      ?
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[140px]">Verify Evidence Chain</span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">CCTV_FrontGate.mp4</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">Medium</span>
                    <span className="text-[9px] text-slate-400">5h ago</span>
                  </div>
                </div>

                {/* ACTION ITEM 3 */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-[10px]">
                      i
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[140px]">Officer Report Review</span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">HC Kavya - Case Notes</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Low</span>
                    <span className="text-[9px] text-slate-400">1d ago</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('Corrective Actions');
                  showToast('Navigated to Pending Actions Workspace');
                }}
                className="w-full text-center text-xs font-bold text-[#FF5A1F] hover:underline pt-1 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View All Actions</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* 6. MAIN LOWER SECTION: RECENT ASSIGNMENTS TABLE (LEFT 8 COLS) & OFFICER PERFORMANCE (RIGHT 4 COLS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-2">
            {/* RECENT ASSIGNMENTS TABLE */}
            <div className={`lg:col-span-8 p-5 rounded-2xl border flex flex-col gap-4 ${cardBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                    RECENT ASSIGNMENTS
                  </span>
                  <span className="text-[10px] font-mono bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/20 px-2 py-0.5 rounded-full">
                    {filteredAssignments.length} Listed
                  </span>
                </div>

                {/* SEARCH & STATUS FILTER PILLS */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search case, officer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1 rounded-xl text-xs bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white outline-none focus:border-[#FF5A1F] w-40 sm:w-48"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-gray-900 p-1 rounded-xl border border-slate-200 dark:border-gray-800 text-[10px] font-bold">
                    {(['All', 'Overdue', 'Under Review', 'On Time'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                          statusFilter === s
                            ? 'bg-[#FF5A1F] text-white shadow-xs'
                            : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TABLE CONTAINER */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-gray-800 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                      <th className="pb-2.5 font-bold">CASE / TASK</th>
                      <th className="pb-2.5 font-bold">ASSIGNED TO</th>
                      <th className="pb-2.5 font-bold">CATEGORY</th>
                      <th className="pb-2.5 font-bold">DUE DATE</th>
                      <th className="pb-2.5 font-bold">STATUS</th>
                      <th className="pb-2.5 font-bold">COMPLIANCE</th>
                      <th className="pb-2.5 font-bold text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60 font-medium">
                    {filteredAssignments.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-gray-900/50 transition-colors">
                        <td className="py-3 pr-2">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 dark:text-white text-xs">{row.caseNo}</span>
                            <span className="text-[10px] text-slate-500 dark:text-gray-400 truncate max-w-[180px]">{row.title}</span>
                          </div>
                        </td>

                        <td className="py-3 px-2">
                          <span className="font-bold text-slate-800 dark:text-gray-200">{row.assignedTo}</span>
                        </td>

                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            row.category === 'Investigation' ? 'bg-blue-500/10 text-blue-500' :
                            row.category === 'Evidence' ? 'bg-purple-500/10 text-purple-500' :
                            row.category === 'Forensic' ? 'bg-amber-500/10 text-amber-500' :
                            row.category === 'Verification' ? 'bg-indigo-500/10 text-indigo-500' :
                            'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {row.category}
                          </span>
                        </td>

                        <td className="py-3 px-2 text-[11px] font-mono text-slate-600 dark:text-gray-300 whitespace-nowrap">
                          {row.dueDate}
                        </td>

                        <td className="py-3 px-2 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                            row.status === 'Overdue' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            row.status === 'Under Review' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            row.status === 'On Time' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            'bg-purple-500/10 text-purple-500 border-purple-500/20'
                          }`}>
                            {row.status}
                          </span>
                        </td>

                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  row.complianceScore >= 90 ? 'bg-emerald-500' :
                                  row.complianceScore >= 80 ? 'bg-blue-500' :
                                  row.complianceScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${row.complianceScore}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-gray-300">{row.complianceScore}%</span>
                          </div>
                        </td>

                        <td className="py-3 pl-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedCaseForInspection(row)}
                              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-800 text-slate-600 dark:text-gray-300 hover:text-[#FF5A1F] cursor-pointer"
                              title="Inspect Case Checklist"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => {
                                handleApproveAudit(row.id);
                              }}
                              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-800 text-emerald-500 cursor-pointer"
                              title="Mark Audit Completed"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => {
                  setActiveTab('Case Audit');
                  showToast('Navigated to Full Case Audit Workspace');
                }}
                className="text-xs font-bold text-[#FF5A1F] hover:underline pt-2 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Assignments</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* OFFICER PERFORMANCE RANKINGS (RIGHT 4 COLS MATCHING IMAGE) */}
            <div className={`lg:col-span-4 p-5 rounded-2xl border flex flex-col justify-between gap-4 ${cardBg}`}>
              <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-gray-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  OFFICER PERFORMANCE <span className="text-[10px] text-[#FF5A1F]">(THIS MONTH)</span>
                </span>
                <Award size={16} className="text-emerald-500" />
              </div>

              <div className="flex flex-col gap-3">
                {officers.map((officer) => (
                  <div key={officer.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full ${officer.avatarColor} text-white flex items-center justify-center font-bold text-[10px] shadow-xs`}>
                        {officer.name.slice(-2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">{officer.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{officer.casesCompleted} cases closed</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-1 max-w-[120px]">
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${officer.score}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">{officer.score}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsOfficerPerformanceModalOpen(true)}
                className="text-xs font-bold text-[#FF5A1F] hover:underline pt-2 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View Full Performance</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* 7. BOTTOM ROW: COMPLIANCE BY CATEGORY, RECENT OBSERVATIONS, AUDIT TRAIL SNAPSHOT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">
            {/* COMPLIANCE BY CATEGORY */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between gap-3 ${cardBg}`}>
              <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-gray-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  COMPLIANCE BY CATEGORY
                </span>
                <ListFilter size={15} className="text-blue-500" />
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                {[
                  { name: 'Investigations', score: 96, color: 'bg-emerald-500' },
                  { name: 'Evidence Handling', score: 93, color: 'bg-blue-500' },
                  { name: 'Documentation', score: 91, color: 'bg-amber-500' },
                  { name: 'Timeliness', score: 88, color: 'bg-orange-500' },
                  { name: 'Legal Compliance', score: 97, color: 'bg-purple-500' }
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-2">
                    <span className="text-slate-700 dark:text-gray-300 font-medium w-32 truncate">{item.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white w-8 text-right">{item.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT OBSERVATIONS */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between gap-3 ${cardBg}`}>
              <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-gray-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  RECENT OBSERVATIONS
                </span>
                <Sparkles size={15} className="text-[#FF5A1F]" />
              </div>

              <div className="flex flex-col gap-2.5">
                {observations.map((obs) => (
                  <div key={obs.id} className="p-2 rounded-xl bg-slate-50 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 flex items-start gap-2">
                    <div className="mt-0.5">
                      {obs.type === 'Positive' && <CheckCircle2 size={13} className="text-emerald-500" />}
                      {obs.type === 'Improvement' && <Clock size={13} className="text-amber-500" />}
                      {obs.type === 'Critical' && <AlertTriangle size={13} className="text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{obs.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{obs.caseNo}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold ${
                      obs.type === 'Positive' ? 'bg-emerald-500/10 text-emerald-500' :
                      obs.type === 'Improvement' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {obs.type}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setActiveTab('Observations');
                  showToast('Navigated to Observations Module');
                }}
                className="text-xs font-bold text-[#FF5A1F] hover:underline pt-1 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View All Observations</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* AUDIT TRAIL SNAPSHOT */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between gap-3 ${cardBg}`}>
              <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-gray-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  AUDIT TRAIL SNAPSHOT
                </span>
                <Activity size={15} className="text-purple-500" />
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                {auditLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-2 rounded-xl bg-slate-50 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.caseNo}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{log.timestamp.split(' ')[0]}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsAuditTrailModalOpen(true)}
                className="text-xs font-bold text-[#FF5A1F] hover:underline pt-1 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View Full Audit Trail</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* OTHER SUB-TABS VIEWS (CASE AUDIT, OFFICER PERFORMANCE, COMPLIANCE, ACTIVITY LOG, OBSERVATIONS, DIRECTIVES) */}
      {activeTab !== 'Overview' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-gray-800">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert size={20} className="text-[#FF5A1F]" />
              <span>{activeTab} Management</span>
            </h2>
            <button
              onClick={() => setActiveTab('Overview')}
              className="px-3 py-1.5 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] text-xs font-bold hover:bg-[#FF5A1F]/20 transition-all cursor-pointer"
            >
              Back to Overview
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'Case Audit' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-slate-500 dark:text-gray-400">Select any assignment below to conduct a full supervisory inspection and review BNS/BNSS compliance checklists.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignments.map((asg) => (
                    <div key={asg.id} className="p-4 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900 dark:text-white">{asg.caseNo}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-500 font-bold">{asg.category}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-300">{asg.title}</p>
                      <div className="flex items-center justify-between text-xs border-t pt-2 border-slate-200 dark:border-gray-800 text-slate-500">
                        <span>Assigned: <strong className="text-slate-800 dark:text-gray-200">{asg.assignedTo}</strong></span>
                        <button
                          onClick={() => setSelectedCaseForInspection(asg)}
                          className="px-3 py-1 rounded-lg bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer"
                        >
                          Inspect Case
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Officer Performance' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {officers.map((off) => (
                  <div key={off.id} className="p-4 rounded-2xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${off.avatarColor} text-white flex items-center justify-center font-bold`}>
                        {off.name.slice(-2)}
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-slate-900 dark:text-white">{off.name}</h3>
                        <span className="text-xs text-slate-400 font-mono">{off.rank}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-200 dark:border-gray-800">
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-800">
                        <span className="text-[10px] text-slate-400 block">Closed</span>
                        <span className="font-bold text-emerald-500 text-sm">{off.casesCompleted}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-800">
                        <span className="text-[10px] text-slate-400 block">Pending</span>
                        <span className="font-bold text-amber-500 text-sm">{off.pendingCases}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-800">
                        <span className="text-[10px] text-slate-400 block">Score</span>
                        <span className="font-bold text-blue-500 text-sm">{off.score}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Compliance' && (
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300">
                  <strong>BNS 2023 &amp; BNSS Statutory Compliance Index:</strong> Current station compliance score is 94%. Zero tolerance policy enforced for un-hedged electronic evidence and unauthenticated seizure memos.
                </div>
              </div>
            )}

            {(activeTab === 'Activity Log' || activeTab === 'Observations' || activeTab === 'Corrective Actions' || activeTab === 'Documents') && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-slate-500 dark:text-gray-400">Detailed records for {activeTab}.</p>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-xs font-mono text-slate-700 dark:text-gray-300">
                  {activeTab} records synced live with KSP Supervisory Station Command Center.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. MODALS & DRAWERS */}

      {/* START NEW AUDIT MODAL */}
      <AnimatePresence>
        {isStartAuditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl flex flex-col gap-5 ${cardBg}`}
            >
              <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Plus size={18} className="text-[#FF5A1F]" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Initiate Supervisory Case Audit</h3>
                </div>
                <button onClick={() => setIsStartAuditOpen(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateAudit} className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700 dark:text-gray-300">FIR / Case Reference Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FIR KRP/2026/0460"
                    value={newCaseNo}
                    onChange={(e) => setNewCaseNo(e.target.value)}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700 dark:text-gray-300">Case / Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Form 173 Charge-Sheet Audit & Witness Verification"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700 dark:text-gray-300">Assigned Officer</label>
                    <select
                      value={newAssignedTo}
                      onChange={(e) => setNewAssignedTo(e.target.value)}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white outline-none focus:border-[#FF5A1F]"
                    >
                      <option value="SI Naveen">SI Naveen (Sub-Inspector)</option>
                      <option value="ASI Ramesh">ASI Ramesh (Asst. Sub-Inspector)</option>
                      <option value="HC Kavya">HC Kavya (Head Constable)</option>
                      <option value="PC Mahesh">PC Mahesh (Constable)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700 dark:text-gray-300">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white outline-none focus:border-[#FF5A1F]"
                    >
                      <option value="Investigation">Investigation</option>
                      <option value="Evidence">Evidence</option>
                      <option value="Forensic">Forensic</option>
                      <option value="Verification">Verification</option>
                      <option value="Legal">Legal</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsStartAuditOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#FF5A1F] text-white font-bold shadow-lg"
                  >
                    Initiate Audit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INSPECT CASE AUDIT MODAL */}
      <AnimatePresence>
        {selectedCaseForInspection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-2xl p-6 rounded-3xl border shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto ${cardBg}`}
            >
              <div className="flex items-start justify-between border-b pb-4 border-slate-200 dark:border-gray-800">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#FF5A1F]">SUPERVISORY INSPECTION DRAWER</span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">{selectedCaseForInspection.caseNo}</h2>
                  <p className="text-xs text-slate-500 dark:text-gray-400">{selectedCaseForInspection.title}</p>
                </div>
                <button onClick={() => setSelectedCaseForInspection(null)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
                  <span className="text-[10px] text-slate-400 block">Assigned Officer</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedCaseForInspection.assignedTo}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
                  <span className="text-[10px] text-slate-400 block">Due Date</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedCaseForInspection.dueDate}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
                  <span className="text-[10px] text-slate-400 block">Status</span>
                  <span className="font-bold text-[#FF5A1F]">{selectedCaseForInspection.status}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
                  <span className="text-[10px] text-slate-400 block">Compliance</span>
                  <span className="font-bold text-emerald-500">{selectedCaseForInspection.complianceScore}%</span>
                </div>
              </div>

              {/* CHECKLIST */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">Statutory BNSS Checklist Items</span>
                <div className="flex flex-col gap-2">
                  {selectedCaseForInspection.checklist.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {item.status === 'completed' && <CheckCircle2 size={15} className="text-emerald-500" />}
                        {item.status === 'pending' && <Clock size={15} className="text-amber-500" />}
                        {item.status === 'flagged' && <AlertTriangle size={15} className="text-red-500" />}
                        <span className="text-slate-800 dark:text-gray-200 font-medium">{item.step}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase ${
                        item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                        item.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-between border-t pt-4 border-slate-200 dark:border-gray-800 gap-2 flex-wrap">
                <button
                  onClick={() => {
                    handleIssueDirective(selectedCaseForInspection.id, 'Issue priority notice to IO.');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-gray-900 text-slate-800 dark:text-white font-bold text-xs border border-slate-300 dark:border-gray-700 hover:border-[#FF5A1F]"
                >
                  Issue Written Requisition Memo
                </button>
                <button
                  onClick={() => handleApproveAudit(selectedCaseForInspection.id)}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg"
                >
                  Approve &amp; Close Audit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AUDIT TRAIL FULL MODAL */}
      <AnimatePresence>
        {isAuditTrailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl p-6 rounded-3xl border shadow-2xl flex flex-col gap-4 ${cardBg}`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-blue-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Full KSP Station Audit Trail Log</h3>
                </div>
                <button onClick={() => setIsAuditTrailModalOpen(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                      <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Officer: <strong className="text-slate-700 dark:text-gray-300">{log.officer}</strong></span>
                      <span className="font-mono text-[#FF5A1F]">{log.caseNo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OFFICER PERFORMANCE FULL MODAL */}
      <AnimatePresence>
        {isOfficerPerformanceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl p-6 rounded-3xl border shadow-2xl flex flex-col gap-4 ${cardBg}`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-emerald-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Subordinate Officer Performance Scorecards</h3>
                </div>
                <button onClick={() => setIsOfficerPerformanceModalOpen(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                {officers.map((off) => (
                  <div key={off.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${off.avatarColor} text-white flex items-center justify-center font-bold`}>
                        {off.name.slice(-2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 dark:text-white">{off.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{off.rank}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-emerald-500">{off.score}% Compliance</span>
                        <span className="text-[10px] text-slate-400">{off.casesCompleted} closed &bull; {off.overdueCases} overdue</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
