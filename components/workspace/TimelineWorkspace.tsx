'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  Share2,
  Plus,
  FileText,
  MapPin,
  Video,
  Fingerprint,
  User,
  Car,
  Users,
  Shield,
  Eye,
  MoreVertical,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Globe,
  HardDrive,
  Mail,
  MessageSquare,
  CheckSquare,
  StickyNote,
  FileSpreadsheet,
  X,
  Check,
  AlertTriangle,
  FolderPlus,
  Layers,
  Activity,
  ArrowRight,
  FileCheck
} from 'lucide-react';

import { useUIStore } from '@/lib/stores/uiStore';
import GooglePickerModal from '@/components/workspace/GooglePickerModal';
import GoogleDocsPanel from '@/components/workspace/GoogleDocsPanel';
import GoogleSheetsPanel from '@/components/workspace/GoogleSheetsPanel';
import GmailPanel from '@/components/workspace/GmailPanel';
import GoogleChatPanel from '@/components/workspace/GoogleChatPanel';
import GoogleTasksPanel from '@/components/workspace/GoogleTasksPanel';
import GoogleDriveEvidencePanel from '@/components/workspace/GoogleDriveEvidencePanel';
import GoogleCalendarWidget from '@/components/workspace/GoogleCalendarWidget';
import GoogleKeepNotesPanel from '@/components/workspace/GoogleKeepNotesPanel';

export interface TimelineEvent {
  id: string;
  time: string;
  date: string; // e.g. '16 JUL 2025'
  title: string;
  description: string;
  officer: string;
  category: 'INVESTIGATION' | 'SCENE' | 'EVIDENCE' | 'FORENSIC' | 'INTELLIGENCE' | 'VEHICLE' | 'WITNESS' | 'LEGAL';
  actionText: string;
  iconType: 'document' | 'mappin' | 'video' | 'fingerprint' | 'user' | 'car' | 'users' | 'legal';
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  entityLinked?: string;
  evidenceRef?: string;
}

export default function TimelineWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const showToast = useUIStore((s) => s.showToast);
  const openCopilot = useUIStore((s) => s.openCopilot);

  // Navigation Sub-Tabs
  const [activeSubTab, setActiveSubTab] = useState<'Timeline View' | 'Calendar View' | 'Activity Log'>('Timeline View');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Events');
  const [entityFilter, setEntityFilter] = useState<string>('All Entities');
  const [dateFilter, setDateFilter] = useState<string>('16 Jul 2025 - 17 Jul 2025');

  // Workspace Suite Drawer State
  const [isWorkspaceSuiteOpen, setIsWorkspaceSuiteOpen] = useState(false);
  const [workspaceSuiteTab, setWorkspaceSuiteTab] = useState<'Docs' | 'Sheets' | 'Gmail' | 'Chat' | 'Tasks' | 'Drive' | 'Calendar' | 'Keep'>('Calendar');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Modal States
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState<TimelineEvent | null>(null);

  // New Event Form
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<TimelineEvent['category']>('INVESTIGATION');
  const [newEventTime, setNewEventTime] = useState('05:30 PM');
  const [newEventDate, setNewEventDate] = useState('16 JUL 2025');
  const [newEventOfficer, setNewEventOfficer] = useState('Inspector Arjun');

  // Timeline Events Mock Master List (Karnataka State Police KSP FIR KRP/2026/0456)
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: 'evt-1',
      date: '16 JUL 2025',
      time: '10:02 AM',
      title: 'FIR Registered',
      description: 'FIR KRP/2026/0456 registered at KR Puram PS under IPC 457, 380, 411.',
      officer: 'Inspector Arjun',
      category: 'INVESTIGATION',
      actionText: 'View FIR',
      iconType: 'document',
      dotColor: '#3B82F6',
      badgeBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      badgeText: 'INVESTIGATION',
      evidenceRef: 'FIR_KRP_2026_0456.pdf'
    },
    {
      id: 'evt-2',
      date: '16 JUL 2025',
      time: '10:15 AM',
      title: 'Scene Examined',
      description: 'Crime scene inspected at Anakal Main Road, KR Puram. Physical evidence tagged.',
      officer: 'HC Kavya',
      category: 'SCENE',
      actionText: 'View Details',
      iconType: 'mappin',
      dotColor: '#10B981',
      badgeBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      badgeText: 'SCENE',
      evidenceRef: 'Scene_Inspection_Log.docx'
    },
    {
      id: 'evt-3',
      date: '16 JUL 2025',
      time: '11:05 AM',
      title: 'CCTV Footage Collected',
      description: 'CCTV footage collected from 3 locations including Tin Factory junction camera.',
      officer: 'SI Naveen',
      category: 'EVIDENCE',
      actionText: 'View Evidence',
      iconType: 'video',
      dotColor: '#A855F7',
      badgeBg: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      badgeText: 'EVIDENCE',
      evidenceRef: 'CCTV_01.mp4'
    },
    {
      id: 'evt-4',
      date: '16 JUL 2025',
      time: '12:30 PM',
      title: 'Fingerprint Match Found',
      description: 'Partial fingerprint match with suspect Sandeep Kumar via FSL automated database.',
      officer: 'FSL Lab System',
      category: 'FORENSIC',
      actionText: 'View Report',
      iconType: 'fingerprint',
      dotColor: '#F59E0B',
      badgeBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      badgeText: 'FORENSIC',
      evidenceRef: 'FSL_Latent_Print_Analysis.pdf'
    },
    {
      id: 'evt-5',
      date: '16 JUL 2025',
      time: '01:45 PM',
      title: 'Suspect Identified',
      description: 'Sandeep Kumar identified as prime suspect based on prior records and intel.',
      officer: 'AI Copilot',
      category: 'INTELLIGENCE',
      actionText: 'View Profile',
      iconType: 'user',
      dotColor: '#EF4444',
      badgeBg: 'bg-red-500/10 text-red-500 border-red-500/20',
      badgeText: 'INTELLIGENCE',
      entityLinked: 'Sandeep Kumar'
    },
    {
      id: 'evt-6',
      date: '16 JUL 2025',
      time: '03:20 PM',
      title: 'Vehicle Tracked',
      description: 'Vehicle KA03MN4481 tracked near Hoodi Circle ANPR camera feed.',
      officer: 'ASI Ramesh',
      category: 'VEHICLE',
      actionText: 'View Tracking',
      iconType: 'car',
      dotColor: '#06B6D4',
      badgeBg: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      badgeText: 'VEHICLE',
      entityLinked: 'KA03MN4481'
    },
    {
      id: 'evt-7',
      date: '16 JUL 2025',
      time: '04:10 PM',
      title: 'Witness Statement Recorded',
      description: 'Statement recorded from witness Harish K. under Sec 161 CrPC.',
      officer: 'HC Kavya',
      category: 'WITNESS',
      actionText: 'View Statement',
      iconType: 'users',
      dotColor: '#8B5CF6',
      badgeBg: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      badgeText: 'WITNESS',
      entityLinked: 'Harish K.'
    },
    {
      id: 'evt-8',
      date: '17 JUL 2025',
      time: '09:12 AM',
      title: 'Chargesheet Drafted',
      description: 'Chargesheet draft prepared and reviewed by Public Prosecutor Office.',
      officer: 'Inspector Arjun',
      category: 'LEGAL',
      actionText: 'View Document',
      iconType: 'legal',
      dotColor: '#F97316',
      badgeBg: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      badgeText: 'LEGAL',
      evidenceRef: 'Form173_Chargesheet_Draft.docx'
    }
  ]);

  // Handle Adding New Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const categoryColorMap: Record<TimelineEvent['category'], { dot: string; bg: string }> = {
      INVESTIGATION: { dot: '#3B82F6', bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
      SCENE: { dot: '#10B981', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
      EVIDENCE: { dot: '#A855F7', bg: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
      FORENSIC: { dot: '#F59E0B', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      INTELLIGENCE: { dot: '#EF4444', bg: 'bg-red-500/10 text-red-500 border-red-500/20' },
      VEHICLE: { dot: '#06B6D4', bg: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
      WITNESS: { dot: '#8B5CF6', bg: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
      LEGAL: { dot: '#F97316', bg: 'bg-orange-500/10 text-orange-500 border-orange-500/20' }
    };

    const iconMap: Record<TimelineEvent['category'], TimelineEvent['iconType']> = {
      INVESTIGATION: 'document',
      SCENE: 'mappin',
      EVIDENCE: 'video',
      FORENSIC: 'fingerprint',
      INTELLIGENCE: 'user',
      VEHICLE: 'car',
      WITNESS: 'users',
      LEGAL: 'legal'
    };

    const newEvt: TimelineEvent = {
      id: `evt-${Date.now()}`,
      time: newEventTime,
      date: newEventDate,
      title: newEventTitle.trim(),
      description: newEventDesc.trim() || 'Event added to FIR KRP/2026/0456 log.',
      officer: newEventOfficer,
      category: newEventCategory,
      actionText: 'View Entry',
      iconType: iconMap[newEventCategory],
      dotColor: categoryColorMap[newEventCategory].dot,
      badgeBg: categoryColorMap[newEventCategory].bg,
      badgeText: newEventCategory
    };

    setEvents((prev) => [newEvt, ...prev]);
    setIsAddEventOpen(false);
    setNewEventTitle('');
    setNewEventDesc('');
    showToast(`Added event "${newEvt.title}" to Timeline Log`);
  };

  // Filtered Events
  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.officer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All Events' || evt.category.toUpperCase() === categoryFilter.toUpperCase();

    const matchesEntity =
      entityFilter === 'All Entities' ||
      (evt.entityLinked && evt.entityLinked.toLowerCase().includes(entityFilter.toLowerCase()));

    return matchesSearch && matchesCategory && matchesEntity;
  });

  // Unique Dates in Filtered Events
  const dateGroups = Array.from(new Set(filteredEvents.map((e) => e.date)));

  // Theme Helpers
  const cardBg = isDarkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900';
  const subCardBg = isDarkMode ? 'bg-[#1F2937]/60 border-gray-800' : 'bg-slate-50 border-slate-200';

  return (
    <div className="flex-1 p-4 lg:p-6 flex flex-col gap-6 max-w-[1800px] w-full mx-auto">
      {/* BREADCRUMB & MAIN CASE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span className="hover:text-[#FF5A1F] cursor-pointer transition-colors">Timeline</span>
            <span>&gt;</span>
            <span className="text-gray-200 font-bold">FIR KRP/2026/0456</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center border border-[#FF5A1F]/30 shadow-xs">
              <Clock size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">FIR KRP/2026/0456</h1>
                <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wide">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                Armed House Burglary &amp; Theft &bull; IPC 457, 380, 411 &bull; Registered on 16 Jul 2025
              </p>
            </div>
          </div>
        </div>

        {/* TOP ACTION CONTROLS */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsWorkspaceSuiteOpen(!isWorkspaceSuiteOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold hover:border-[#FF5A1F] transition-all cursor-pointer bg-gray-100 dark:bg-gray-900 text-gray-300"
          >
            <Globe size={14} className="text-[#FF5A1F]" />
            <span>Workspace Suite</span>
          </button>

          <button
            onClick={() => {
              showToast('Generated encrypted Timeline PDF Report for Court');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold hover:border-gray-600 transition-all cursor-pointer bg-gray-100 dark:bg-gray-900 text-gray-300"
          >
            <Share2 size={14} />
            <span>Share Timeline</span>
          </button>

          <button
            onClick={() => {
              showToast('Exported Timeline events to CSV/JSON format');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold hover:border-gray-600 transition-all cursor-pointer bg-gray-100 dark:bg-gray-900 text-gray-300"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          <button
            onClick={() => setIsAddEventOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#FF5A1F]/20"
          >
            <Plus size={15} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-1">
        <div className="flex items-center gap-2">
          {(['Timeline View', 'Calendar View', 'Activity Log'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveSubTab(tab);
                showToast(`Switched view to ${tab}`);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
                activeSubTab === tab
                  ? 'text-[#FF5A1F] bg-[#FF5A1F]/5 border-b-2 border-[#FF5A1F]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* GOOGLE WORKSPACE EXPANDABLE SUITE */}
      <AnimatePresence>
        {isWorkspaceSuiteOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-5 rounded-2xl border flex flex-col gap-4 shadow-xl overflow-hidden ${cardBg}`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center font-black text-xs">
                  G
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                    GOOGLE WORKSPACE SUITE INTEGRATION (POLICE KSP)
                  </h3>
                  <p className="text-[10px] text-gray-400">Sync Timeline Duty Shifts, Dispatch Calendar &amp; Case Notes</p>
                </div>
              </div>

              <button onClick={() => setIsWorkspaceSuiteOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setWorkspaceSuiteTab('Calendar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Calendar' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Calendar size={13} />
                <span>Calendar</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Docs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Docs' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText size={13} />
                <span>Docs</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Sheets')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Sheets' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet size={13} />
                <span>Sheets</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Gmail')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Gmail' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Mail size={13} />
                <span>Gmail</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Chat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Chat' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                <MessageSquare size={13} />
                <span>Chat</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Tasks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Tasks' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                <CheckSquare size={13} />
                <span>Tasks</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Drive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Drive' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                <HardDrive size={13} />
                <span>Drive</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Keep')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Keep' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                <StickyNote size={13} />
                <span>Keep Notes</span>
              </button>
            </div>

            <div className="pt-2">
              {workspaceSuiteTab === 'Calendar' && <GoogleCalendarWidget isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Docs' && <GoogleDocsPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Sheets' && <GoogleSheetsPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Gmail' && <GmailPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Chat' && <GoogleChatPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Tasks' && <GoogleTasksPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Drive' && <GoogleDriveEvidencePanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Keep' && <GoogleKeepNotesPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FILTER BAR ROW */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm ${cardBg}`}>
        {/* SEARCH FIELD */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search timeline events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border outline-none focus:border-[#FF5A1F] ${
              isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
            }`}
          />
        </div>

        {/* DROPDOWNS & DATE RANGE */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* CATEGORY SELECTOR */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs border outline-none font-medium cursor-pointer ${
              isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
            }`}
          >
            <option value="All Events">All Events</option>
            <option value="INVESTIGATION">Investigation</option>
            <option value="SCENE">Scene</option>
            <option value="EVIDENCE">Evidence</option>
            <option value="FORENSIC">Forensic</option>
            <option value="INTELLIGENCE">Intelligence</option>
            <option value="VEHICLE">Vehicle</option>
            <option value="WITNESS">Witness</option>
            <option value="LEGAL">Legal</option>
          </select>

          {/* ENTITY SELECTOR */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs border outline-none font-medium cursor-pointer ${
              isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
            }`}
          >
            <option value="All Entities">All Entities</option>
            <option value="Sandeep Kumar">Sandeep Kumar (Prime Suspect)</option>
            <option value="Harish K.">Harish K. (Witness)</option>
            <option value="KA03MN4481">White Innova (Vehicle)</option>
            <option value="Anakal Main Road">Anakal Main Road (Scene)</option>
          </select>

          {/* DATE RANGE BADGE */}
          <div className={`px-3 py-2 rounded-xl text-xs border flex items-center gap-2 font-mono ${
            isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-300' : 'bg-slate-50 border-gray-200 text-slate-700'
          }`}>
            <Calendar size={13} className="text-[#FF5A1F]" />
            <span>{dateFilter}</span>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('All Events');
              setEntityFilter('All Entities');
              showToast('Reset timeline filters');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold hover:border-[#FF5A1F] transition-all cursor-pointer bg-gray-100 dark:bg-gray-900 text-gray-400 hover:text-white"
          >
            <Filter size={13} />
            <span>Filters</span>
            <span className="w-4 h-4 rounded-full bg-[#FF5A1F] text-white text-[9px] flex items-center justify-center font-black">
              1
            </span>
          </button>
        </div>
      </div>

      {/* MAIN TWO COLUMN LAYOUT: STREAM (8 COLS) + SIDEBAR ANALYTICS (4 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: TIMELINE STREAM (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {dateGroups.length === 0 ? (
            <div className={`p-12 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 ${cardBg}`}>
              <AlertTriangle size={32} className="text-amber-500" />
              <h3 className="text-base font-bold">No Events Match Filter</h3>
              <p className="text-xs text-gray-400 max-w-sm">
                Try clearing your search terms or category selection to view full chronological investigation logs.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('All Events');
                  setEntityFilter('All Entities');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            dateGroups.map((dateGroup) => {
              const groupEvents = filteredEvents.filter((e) => e.date === dateGroup);

              return (
                <div key={dateGroup} className="flex flex-col gap-4 relative">
                  {/* DATE HEADER DIVIDER */}
                  <div className="flex items-center justify-center my-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 bg-gray-900/90 border border-gray-800 px-4 py-1 rounded-full shadow-xs">
                      {dateGroup}
                    </span>
                  </div>

                  {/* TIMELINE CARDS STREAM */}
                  <div className="relative pl-6 sm:pl-28 flex flex-col gap-4">
                    {/* VERTICAL CONTINUOUS LINE */}
                    <div className="absolute left-[11px] sm:left-[91px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#FF5A1F] via-blue-500 to-purple-500 opacity-30" />

                    {groupEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#FF5A1F]/50 group relative shadow-md ${cardBg}`}
                      >
                        {/* TIMESTAMP LABEL (DESKTOP LEFT) */}
                        <div className="hidden sm:flex flex-col items-end absolute -left-24 top-5 w-20 text-right">
                          <span className="text-xs font-mono font-bold text-gray-300">{event.time}</span>
                        </div>

                        {/* COLORED NODE CONNECTOR DOT */}
                        <div
                          className="absolute -left-[19px] sm:-left-[15px] top-6 w-3 h-3 rounded-full border-2 border-[#0B0F19] ring-2 ring-gray-800 shadow-md transition-transform group-hover:scale-125"
                          style={{ backgroundColor: event.dotColor }}
                        />

                        {/* MOBILE TIMESTAMP */}
                        <div className="flex sm:hidden items-center gap-2 text-xs font-mono font-bold text-gray-400">
                          <Clock size={12} className="text-[#FF5A1F]" />
                          <span>{event.time}</span>
                        </div>

                        {/* MAIN EVENT CONTENT & ICON */}
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          {/* CATEGORY ICON BADGE */}
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-gray-800 shadow-sm"
                            style={{ backgroundColor: `${event.dotColor}15`, color: event.dotColor }}
                          >
                            {event.iconType === 'document' && <FileText size={18} />}
                            {event.iconType === 'mappin' && <MapPin size={18} />}
                            {event.iconType === 'video' && <Video size={18} />}
                            {event.iconType === 'fingerprint' && <Fingerprint size={18} />}
                            {event.iconType === 'user' && <User size={18} />}
                            {event.iconType === 'car' && <Car size={18} />}
                            {event.iconType === 'users' && <Users size={18} />}
                            {event.iconType === 'legal' && <FileCheck size={18} />}
                          </div>

                          <div className="flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-black text-white group-hover:text-[#FF5A1F] transition-colors">
                                {event.title}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed font-normal">
                              {event.description}
                            </p>
                            <span className="text-[11px] font-medium text-gray-400">
                              By <span className="font-bold text-gray-200">{event.officer}</span>
                            </span>
                          </div>
                        </div>

                        {/* RIGHT ACTION BUTTON & BADGE */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-800">
                          <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${event.badgeBg}`}>
                            {event.badgeText}
                          </span>

                          <button
                            onClick={() => setSelectedEventModal(event)}
                            className="px-3.5 py-1.5 rounded-xl border border-gray-700 hover:border-[#FF5A1F] text-xs font-bold text-gray-200 hover:text-white transition-all cursor-pointer bg-gray-900/80 flex items-center gap-1"
                          >
                            <span>{event.actionText}</span>
                          </button>

                          <button
                            onClick={() => showToast(`Options for ${event.title}`)}
                            className="text-gray-500 hover:text-white p-1 rounded-lg cursor-pointer"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: ANALYTICS & TOOLS (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* TIMELINE OVERVIEW CARD */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 shadow-xl ${cardBg}`}>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 border-b pb-2 border-gray-200 dark:border-gray-800">
              TIMELINE OVERVIEW
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-xl sm:text-2xl font-black text-white block">21</span>
                <span className="text-[10px] font-mono text-gray-400 uppercase">Total Events</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 block">7</span>
                <span className="text-[10px] font-mono text-gray-400 uppercase">Related Entities</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-xs font-bold text-white block">16 Jul 2025</span>
                <span className="text-[10px] font-mono text-gray-400 uppercase">Start Date</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-xs font-bold text-white block">17 Jul 2025</span>
                <span className="text-[10px] font-mono text-gray-400 uppercase">Latest Event</span>
              </div>
            </div>
          </div>

          {/* EVENT BREAKDOWN DONUT CHART CARD */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 shadow-xl ${cardBg}`}>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 border-b pb-2 border-gray-200 dark:border-gray-800">
              EVENT BREAKDOWN
            </span>

            <div className="flex items-center gap-4">
              {/* SVG DONUT CHART */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-gray-800"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Investigation 25% */}
                  <path
                    className="text-blue-500"
                    strokeDasharray="25, 100"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Evidence 20% */}
                  <path
                    className="text-purple-500"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-25"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Forensic 15% */}
                  <path
                    className="text-amber-500"
                    strokeDasharray="15, 100"
                    strokeDashoffset="-45"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Intelligence 15% */}
                  <path
                    className="text-red-500"
                    strokeDasharray="15, 100"
                    strokeDashoffset="-60"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-black text-white">21</span>
                  <span className="text-[9px] font-mono text-gray-400">Total</span>
                </div>
              </div>

              {/* BREAKDOWN LIST */}
              <div className="flex-1 flex flex-col gap-1.5 text-xs font-semibold">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Investigation</span>
                  </span>
                  <span className="text-gray-400 font-mono text-[11px]">25% (5)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Evidence</span>
                  </span>
                  <span className="text-gray-400 font-mono text-[11px]">20% (4)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Forensic</span>
                  </span>
                  <span className="text-gray-400 font-mono text-[11px]">15% (3)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Intelligence</span>
                  </span>
                  <span className="text-gray-400 font-mono text-[11px]">15% (3)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Scene</span>
                  </span>
                  <span className="text-gray-400 font-mono text-[11px]">10% (2)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span>Others</span>
                  </span>
                  <span className="text-gray-400 font-mono text-[11px]">15% (3)</span>
                </div>
              </div>
            </div>
          </div>

          {/* KEY ENTITIES IN TIMELINE */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 shadow-xl ${cardBg}`}>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 border-b pb-2 border-gray-200 dark:border-gray-800">
              KEY ENTITIES IN TIMELINE
            </span>

            <div className="flex flex-col gap-2.5">
              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-black text-xs">
                    SK
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Sandeep Kumar</h4>
                    <span className="text-[10px] text-gray-400">Prime Suspect</span>
                  </div>
                </div>
                <button
                  onClick={() => openCopilot('Show intelligence profile for Sandeep Kumar')}
                  className="text-xs text-[#FF5A1F] hover:underline cursor-pointer"
                >
                  Inspect
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-black text-xs">
                    HK
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Harish K.</h4>
                    <span className="text-[10px] text-gray-400">Witness</span>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Opening witness statement transcript')}
                  className="text-xs text-indigo-400 hover:underline cursor-pointer"
                >
                  Statement
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black text-xs">
                    HA
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">White Innova</h4>
                    <span className="text-[10px] text-gray-400">KA03MN4481</span>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Displaying ANPR movement history')}
                  className="text-xs text-emerald-400 hover:underline cursor-pointer"
                >
                  Tracking
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-black text-xs">
                    AM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Anakal Main Road</h4>
                    <span className="text-[10px] text-gray-400">Scene of Crime</span>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Opening spot inspection report')}
                  className="text-xs text-blue-400 hover:underline cursor-pointer"
                >
                  Spot Map
                </button>
              </div>
            </div>

            <button
              onClick={() => showToast('Viewing all 7 related timeline entities')}
              className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center justify-center gap-1 cursor-pointer pt-1"
            >
              <span>View All Entities</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* QUICK FILTERS CARD */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3 shadow-xl ${cardBg}`}>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 border-b pb-2 border-gray-200 dark:border-gray-800">
              QUICK FILTERS
            </span>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'Investigation',
                'Evidence',
                'Forensic',
                'Intelligence',
                'Scene',
                'Witness',
                'Legal',
                'All Events'
              ].map((filterName) => (
                <button
                  key={filterName}
                  onClick={() => {
                    setCategoryFilter(filterName);
                    showToast(`Filtered timeline by ${filterName}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    categoryFilter.toLowerCase() === filterName.toLowerCase()
                      ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs'
                      : 'bg-gray-900/60 text-gray-300 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {filterName}
                </button>
              ))}
            </div>
          </div>

          {/* AI INSIGHT CARD */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3 shadow-xl relative overflow-hidden bg-gradient-to-br from-[#FF5A1F]/10 via-[#111827] to-[#111827] border-[#FF5A1F]/30`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF5A1F] animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A1F]">
                  AI INSIGHT
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-400">Copilot V2.4</span>
            </div>

            <p className="text-xs text-gray-200 leading-relaxed font-medium">
              The suspect was seen near the crime location <span className="font-bold text-[#FF5A1F]">15 mins before</span> the incident. CCTV and vehicle tracking strongly correlate.
            </p>

            <button
              onClick={() => openCopilot('Provide complete cross-correlation timeline analysis for FIR KRP/2026/0456.')}
              className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>View Full Insight</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* EVENT DETAIL / EVIDENCE MODAL */}
      <AnimatePresence>
        {selectedEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl p-6 rounded-3xl border shadow-2xl flex flex-col gap-5 ${cardBg}`}
            >
              <div className="flex items-center justify-between border-b pb-4 border-gray-800">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white"
                    style={{ backgroundColor: selectedEventModal.dotColor }}
                  >
                    <Clock size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">{selectedEventModal.title}</h2>
                    <span className="text-xs font-mono text-gray-400">
                      {selectedEventModal.date} &bull; {selectedEventModal.time}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEventModal(null)}
                  className="p-1 rounded-xl text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-xs text-gray-200">
                <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 leading-relaxed">
                  <span className="text-[10px] font-mono text-gray-400 block uppercase mb-1">
                    Event Description
                  </span>
                  {selectedEventModal.description}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">Recorded By</span>
                    <span className="font-bold text-white">{selectedEventModal.officer}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">Category</span>
                    <span className="font-bold text-emerald-400">{selectedEventModal.category}</span>
                  </div>
                </div>

                {selectedEventModal.evidenceRef && (
                  <div className="p-3 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-[#FF5A1F]" />
                      <span className="font-mono text-xs text-gray-200">{selectedEventModal.evidenceRef}</span>
                    </div>
                    <button
                      onClick={() => showToast(`Opened attached file: ${selectedEventModal.evidenceRef}`)}
                      className="px-3 py-1 rounded-lg bg-[#FF5A1F] text-white font-bold text-xs cursor-pointer"
                    >
                      Open Evidence
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t pt-4 border-gray-800">
                <button
                  onClick={() => setSelectedEventModal(null)}
                  className="px-4 py-2 rounded-xl border border-gray-800 text-xs font-bold text-gray-300 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    showToast(`Copied timeline link for ${selectedEventModal.title}`);
                    setSelectedEventModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer"
                >
                  Copy Link Reference
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD EVENT MODAL */}
      <AnimatePresence>
        {isAddEventOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl flex flex-col gap-5 ${cardBg}`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center font-bold">
                    <Plus size={18} />
                  </div>
                  <h2 className="text-base font-black text-white">Add New Timeline Event</h2>
                </div>

                <button
                  onClick={() => setIsAddEventOpen(false)}
                  className="p-1 rounded-xl text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="flex flex-col gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FSL Chemical Analysis Report Attached"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-800 bg-gray-900 text-white outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">
                    Event Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide incident details, location coordinates or witness statement context..."
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-800 bg-gray-900 text-white outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">
                      Category
                    </label>
                    <select
                      value={newEventCategory}
                      onChange={(e) => setNewEventCategory(e.target.value as TimelineEvent['category'])}
                      className="w-full p-2.5 rounded-xl border border-gray-800 bg-gray-900 text-white outline-none focus:border-[#FF5A1F]"
                    >
                      <option value="INVESTIGATION">Investigation</option>
                      <option value="SCENE">Scene Inspection</option>
                      <option value="EVIDENCE">Evidence Locker</option>
                      <option value="FORENSIC">Forensic / FSL</option>
                      <option value="INTELLIGENCE">Intelligence / AI</option>
                      <option value="VEHICLE">Vehicle ANPR</option>
                      <option value="WITNESS">Witness Recording</option>
                      <option value="LEGAL">Legal Chargesheet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-800 bg-gray-900 text-white outline-none focus:border-[#FF5A1F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-800 bg-gray-900 text-white outline-none focus:border-[#FF5A1F]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">
                      Reporting Officer
                    </label>
                    <input
                      type="text"
                      value={newEventOfficer}
                      onChange={(e) => setNewEventOfficer(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-800 bg-gray-900 text-white outline-none focus:border-[#FF5A1F]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsAddEventOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-800 text-xs font-bold text-gray-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GOOGLE PICKER FILE SELECTOR MODAL */}
      <GooglePickerModal
        isOpen={isPickerOpen}
        isDarkMode={isDarkMode}
        onClose={() => setIsPickerOpen(false)}
        onSelectFile={(file) => {
          showToast(`Attached Drive File: ${file.name} to Timeline Event`);
        }}
        showToast={showToast}
      />
    </div>
  );
}
