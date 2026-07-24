'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Network,
  Users,
  User,
  Car,
  MapPin,
  ShieldAlert,
  FileText,
  FileSpreadsheet,
  Mail,
  MessageSquare,
  Calendar,
  CheckSquare,
  HardDrive,
  StickyNote,
  Plus,
  Search,
  Filter,
  Download,
  Maximize2,
  ZoomIn,
  ZoomOut,
  MousePointer,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  Building2,
  Phone,
  Clock,
  Activity,
  X,
  ChevronDown,
  Check,
  Share2,
  Layers,
  HelpCircle,
  Link2,
  DollarSign,
  Film,
  FileCheck,
  Zap,
  Globe,
  Contact,
  ClipboardList
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

export interface GraphNode {
  id: string;
  label: string;
  subtitle: string;
  type: 'Person' | 'Location' | 'Vehicle' | 'Organization' | 'Evidence' | 'Event';
  roleBadge?: string;
  avatarText?: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  x: number; // percentage on canvas
  y: number; // percentage on canvas
  details: {
    type: string;
    dob?: string;
    phone?: string;
    address?: string;
    casesLinked?: number;
    regNo?: string;
    model?: string;
    owner?: string;
    hash?: string;
    evidenceType?: string;
    notes?: string;
  };
}

export interface GraphLink {
  id: string;
  sourceId: string;
  targetId: string;
  relationLabel: string;
  evidenceRef?: string;
  addedBy?: string;
  timestamp?: string;
  isHighRisk?: boolean;
}

export default function RelationshipGraphWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const showToast = useUIStore((s) => s.showToast);
  const openCopilot = useUIStore((s) => s.openCopilot);

  // Sub-tab selection
  const [activeSubTab, setActiveSubTab] = useState<string>('Overview');

  // Graph Canvas View Modes
  const [graphViewMode, setGraphViewMode] = useState<'Radial' | 'Force' | 'Hierarchy' | 'Timeline'>('Radial');
  const [zoomLevel, setZoomLevel] = useState<number>(96);
  const [selectedTool, setSelectedTool] = useState<'Pan' | 'Select' | 'Center'>('Select');

  // Active Entity Selection State
  const [selectedNodeId, setSelectedNodeId] = useState<string>('SK');

  // Modal States
  const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isWorkspaceSuiteOpen, setIsWorkspaceSuiteOpen] = useState(false);
  const [workspaceSuiteTab, setWorkspaceSuiteTab] = useState<'Docs' | 'Sheets' | 'Gmail' | 'Chat' | 'Tasks' | 'Drive' | 'Calendar' | 'Keep'>('Docs');

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [nodeTypeFilter, setNodeTypeFilter] = useState<string>('ALL');

  // Node Definitions based on Karnataka State Police Investigation FIR KRP/2026/0456
  const [nodes, setNodes] = useState<GraphNode[]>([
    {
      id: 'SK',
      label: 'Sandeep Kumar',
      subtitle: 'Prime Suspect',
      type: 'Person',
      roleBadge: 'Prime Suspect',
      avatarText: 'SK',
      color: '#A855F7',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-400',
      x: 50,
      y: 50,
      details: {
        type: 'Person (Prime Suspect)',
        dob: '12 Mar 1992',
        phone: '+91 98765 43210',
        address: 'KR Puram, Bengaluru, Karnataka',
        casesLinked: 3,
        notes: 'Prior history in house burglary. Flagged in 2 other open FIRs in Whitefield precinct.'
      }
    },
    {
      id: 'HK',
      label: 'Harish K.',
      subtitle: 'Witness',
      type: 'Person',
      roleBadge: 'Witness',
      avatarText: 'HK',
      color: '#A855F7',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-400',
      textColor: 'text-purple-300',
      x: 32,
      y: 28,
      details: {
        type: 'Person (Key Witness)',
        phone: '+91 98123 45678',
        address: 'Hoodi Village, Bengaluru',
        casesLinked: 1,
        notes: 'Gave recorded statement under Sec 161 CrPC. Confirmed meeting Sandeep at 08:45 PM.'
      }
    },
    {
      id: 'RB',
      label: 'Ramesh B.',
      subtitle: 'Associate',
      type: 'Person',
      roleBadge: 'Associate',
      avatarText: 'RB',
      color: '#A855F7',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-400',
      textColor: 'text-purple-300',
      x: 48,
      y: 20,
      details: {
        type: 'Person (Known Associate)',
        phone: '+91 97654 32109',
        address: 'Banaswadi, Bengaluru',
        casesLinked: 2,
        notes: 'Cell tower records show frequent voice call exchanges prior to crime execution.'
      }
    },
    {
      id: 'VEH1',
      label: 'KA03MN4481',
      subtitle: 'White Innova',
      type: 'Vehicle',
      roleBadge: 'Suspect Car',
      avatarText: 'CAR',
      color: '#10B981',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500',
      textColor: 'text-emerald-400',
      x: 68,
      y: 28,
      details: {
        type: 'Vehicle (Four Wheeler)',
        regNo: 'KA03MN4481',
        model: 'Toyota Innova (White)',
        owner: 'Sandeep Kumar',
        casesLinked: 2,
        notes: 'Captured on ANPR camera passing Outer Ring Road at 02:15 AM on incident night.'
      }
    },
    {
      id: 'EVD1',
      label: 'CCTV_01.mp4',
      subtitle: 'Video Evidence',
      type: 'Evidence',
      roleBadge: 'CCTV Feed',
      avatarText: 'MP4',
      color: '#EF4444',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500',
      textColor: 'text-red-400',
      x: 70,
      y: 52,
      details: {
        type: 'Digital Video Evidence',
        evidenceType: 'MP4 CCTV Footage (HD)',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        notes: 'Front Gate Camera #1. Shows suspect vehicle entering restricted zone.'
      }
    },
    {
      id: 'LOC1',
      label: 'Hoodi Circle',
      subtitle: 'Last Seen',
      type: 'Location',
      roleBadge: 'Hotspot',
      avatarText: 'LOC',
      color: '#3B82F6',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-400',
      x: 65,
      y: 74,
      details: {
        type: 'Geographic Location',
        address: 'Hoodi Junction, ITPL Main Rd, Bengaluru',
        notes: 'Mobile tower dump confirms Sandeep’s handset registered on BTS tower #402.'
      }
    },
    {
      id: 'ORG1',
      label: 'City Robbery Gang',
      subtitle: 'Organized Group',
      type: 'Organization',
      roleBadge: 'Criminal Syndicate',
      avatarText: 'ORG',
      color: '#F97316',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-400',
      x: 48,
      y: 78,
      details: {
        type: 'Organized Crime Unit',
        casesLinked: 5,
        notes: 'Under KSP State Intelligence monitoring for illegal arms possession and burglary.'
      }
    },
    {
      id: 'NJ',
      label: 'Naveen J.',
      subtitle: 'Accused',
      type: 'Person',
      roleBadge: 'Co-Accused',
      avatarText: 'NJ',
      color: '#A855F7',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-400',
      textColor: 'text-purple-300',
      x: 32,
      y: 74,
      details: {
        type: 'Person (Co-Accused)',
        phone: '+91 96111 22334',
        address: 'TC Palya, Bengaluru',
        casesLinked: 2,
        notes: 'Arrested under Non-Bailable Warrant on 17 Jul. Confessed to driving vehicle KA03MN4481.'
      }
    },
    {
      id: 'LOC2',
      label: 'Anakal Main Road',
      subtitle: 'Crime Location',
      type: 'Location',
      roleBadge: 'Scene of Crime',
      avatarText: 'LOC',
      color: '#3B82F6',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-400',
      x: 28,
      y: 52,
      details: {
        type: 'Crime Scene Location',
        address: 'Plot #42, Anakal Main Road, KR Puram',
        notes: 'Location of armed house burglary. High-resolution spot map generated.'
      }
    }
  ]);

  // Links connecting nodes
  const [links, setLinks] = useState<GraphLink[]>([
    { id: 'l1', sourceId: 'SK', targetId: 'HK', relationLabel: 'MET AT 15 JUL, 08:45 PM', addedBy: 'ASI Ramesh', timestamp: '16 Jul 2025, 08:45 AM' },
    { id: 'l2', sourceId: 'SK', targetId: 'RB', relationLabel: 'KNOWN ASSOCIATE', addedBy: 'HC Kavya', timestamp: '16 Jul 2025, 09:30 AM' },
    { id: 'l3', sourceId: 'SK', targetId: 'VEH1', relationLabel: 'USED VEHICLE', evidenceRef: 'CCTV_01.mp4', addedBy: 'ASI Ramesh', timestamp: '16 Jul 2025, 10:24 AM' },
    { id: 'l4', sourceId: 'SK', targetId: 'EVD1', relationLabel: 'CAPTURED ON', evidenceRef: 'CCTV_01.mp4', addedBy: 'SI Naveen', timestamp: '16 Jul 2025, 11:00 AM' },
    { id: 'l5', sourceId: 'SK', targetId: 'LOC1', relationLabel: 'LAST SEEN', evidenceRef: 'BTS_TowerDump.xlsx', addedBy: 'ASI Ramesh', timestamp: '16 Jul 2025, 11:45 AM' },
    { id: 'l6', sourceId: 'SK', targetId: 'ORG1', relationLabel: 'MEMBER OF', addedBy: 'HC Kavya', timestamp: '16 Jul 2025, 12:15 PM' },
    { id: 'l7', sourceId: 'SK', targetId: 'NJ', relationLabel: 'CO-ACCUSED', evidenceRef: 'Charge_Sheet.pdf', addedBy: 'HC Kavya', timestamp: '16 Jul 2025, 01:00 PM' },
    { id: 'l8', sourceId: 'SK', targetId: 'LOC2', relationLabel: 'PRESENT AT 15 JUL, 09:15 PM', addedBy: 'SI Naveen', timestamp: '16 Jul 2025, 01:30 PM' },
    { id: 'l9', sourceId: 'LOC2', targetId: 'LOC1', relationLabel: 'NEARBY (1.8 KM)', addedBy: 'SI Naveen', timestamp: '16 Jul 2025, 02:00 PM' }
  ]);

  // Selected Node Object
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // AI Suggestions
  const potentialConnections = [
    {
      id: 'sug-1',
      title: 'Harish K. visited the crime location 2 days before incident.',
      risk: 'Medium',
      riskColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'sug-2',
      title: 'Financial transaction links between Sandeep Kumar & City Robbery Gang.',
      risk: 'High',
      riskColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    },
    {
      id: 'sug-3',
      title: 'Mobile tower dump suggests an additional unknown associate near Hoodi Circle.',
      risk: 'Medium',
      riskColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    }
  ];

  // Recently Added Links
  const recentLinks = [
    {
      source: 'Sandeep Kumar',
      sourceType: 'Person',
      sourceAvatar: 'SK',
      relation: 'USED',
      target: 'KA03MN4481',
      targetType: 'Vehicle',
      targetAvatar: 'CAR',
      evidence: 'CCTV_01.mp4',
      evidenceType: 'Video',
      addedBy: 'ASI Ramesh',
      time: '16 Jul 2025, 10:24 AM'
    },
    {
      source: 'Naveen J.',
      sourceType: 'Person',
      sourceAvatar: 'NJ',
      relation: 'CO-ACCUSED WITH',
      target: 'Sandeep Kumar',
      targetType: 'Person',
      targetAvatar: 'SK',
      evidence: 'Charge_Sheet.pdf',
      evidenceType: 'Document',
      addedBy: 'HC Kavya',
      time: '16 Jul 2025, 11:05 AM'
    },
    {
      source: 'Anakal Main Road',
      sourceType: 'Location',
      sourceAvatar: 'LOC',
      relation: 'NEARBY TO',
      target: 'Hoodi Circle',
      targetType: 'Location',
      targetAvatar: 'LOC',
      evidence: 'Scene_Photos.zip',
      evidenceType: 'Archive',
      addedBy: 'SI Naveen',
      time: '16 Jul 2025, 09:58 AM'
    }
  ];

  // New Entity Form State
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityType, setNewEntityType] = useState<'Person' | 'Location' | 'Vehicle' | 'Organization' | 'Evidence' | 'Event'>('Person');
  const [newEntityRole, setNewEntityRole] = useState('Suspect / Witness');
  const [newEntityRelation, setNewEntityRelation] = useState('CONNECTED TO');

  const handleAddEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName.trim()) return;

    const newId = `ent-${Date.now()}`;
    const initials = newEntityName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'EN';

    const colorMap = {
      Person: '#A855F7',
      Location: '#3B82F6',
      Vehicle: '#10B981',
      Organization: '#F97316',
      Evidence: '#EF4444',
      Event: '#6366F1'
    };

    const newNode: GraphNode = {
      id: newId,
      label: newEntityName.trim(),
      subtitle: newEntityRole,
      type: newEntityType,
      roleBadge: newEntityRole,
      avatarText: initials,
      color: colorMap[newEntityType],
      bgColor: 'bg-[#FF5A1F]/10',
      borderColor: 'border-[#FF5A1F]',
      textColor: 'text-[#FF5A1F]',
      x: Math.floor(Math.random() * 60) + 20,
      y: Math.floor(Math.random() * 60) + 20,
      details: {
        type: newEntityType,
        notes: `Entity added on ${new Date().toLocaleDateString()} for FIR KRP/2026/0456.`
      }
    };

    setNodes((prev) => [...prev, newNode]);

    // Create link to active selected node
    const newLink: GraphLink = {
      id: `link-${Date.now()}`,
      sourceId: selectedNodeId,
      targetId: newId,
      relationLabel: newEntityRelation.toUpperCase(),
      addedBy: 'Inspector Arjun',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLinks((prev) => [...prev, newLink]);
    setSelectedNodeId(newId);
    setIsAddEntityOpen(false);
    setNewEntityName('');
    showToast(`Added entity "${newNode.label}" to Link Graph`);
  };

  // Helper color classes
  const cardBg = isDarkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900';
  const subCardBg = isDarkMode ? 'bg-[#1F2937]/60 border-gray-800' : 'bg-slate-50 border-slate-200';

  return (
    <div className="flex-1 p-4 lg:p-6 flex flex-col gap-6 max-w-[1800px] w-full mx-auto">
      {/* BREADCRUMB & MAIN CASE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span className="hover:text-[#FF5A1F] cursor-pointer transition-colors">Relationship Graph</span>
            <span>&gt;</span>
            <span className="text-gray-200 font-bold">FIR KRP/2026/0456</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center border border-[#FF5A1F]/30 shadow-xs">
              <Network size={20} />
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
          {/* VIEW SWITCHER */}
          <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            {(['Radial', 'Force', 'Hierarchy', 'Timeline'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setGraphViewMode(mode);
                  showToast(`Switched graph projection to ${mode} mode`);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  graphViewMode === mode
                    ? 'bg-[#FF5A1F] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsWorkspaceSuiteOpen(!isWorkspaceSuiteOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold hover:border-[#FF5A1F] transition-all cursor-pointer bg-gray-100 dark:bg-gray-900 text-gray-300"
          >
            <Globe size={14} className="text-[#FF5A1F]" />
            <span>Workspace Suite</span>
          </button>

          <button
            onClick={() => setIsPickerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold hover:border-indigo-500 transition-all cursor-pointer bg-gray-100 dark:bg-gray-900 text-indigo-400"
          >
            <HardDrive size={14} />
            <span>Google Picker</span>
          </button>

          <button
            onClick={() => setIsAddEntityOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#FF5A1F]/20"
          >
            <Plus size={15} />
            <span>Add Entity</span>
          </button>
        </div>
      </div>

      {/* CATEGORY SUB-TABS */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-gray-200 dark:border-gray-800 scrollbar-none">
        {[
          'Overview',
          'People',
          'Locations',
          'Vehicles',
          'Communications',
          'Organizations',
          'Evidence Links',
          'Financial',
          'Digital Footprint',
          'Timeline View'
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 text-xs font-bold whitespace-nowrap rounded-t-xl transition-all cursor-pointer relative ${
              activeSubTab === tab
                ? 'text-[#FF5A1F] bg-[#FF5A1F]/5 border-b-2 border-[#FF5A1F]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
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
                    GOOGLE WORKSPACE INTEGRATED SUITE FOR POLICE KSP
                  </h3>
                  <p className="text-[10px] text-gray-400">Export Case Briefings, ANPR Matrices &amp; Field Dispatch Updates</p>
                </div>
              </div>

              <button onClick={() => setIsWorkspaceSuiteOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-x-auto scrollbar-none">
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
                onClick={() => setWorkspaceSuiteTab('Calendar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Calendar' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Calendar size={13} />
                <span>Calendar</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Keep')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Keep' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                <StickyNote size={13} />
                <span>Notes</span>
              </button>
            </div>

            <div className="pt-2">
              {workspaceSuiteTab === 'Docs' && <GoogleDocsPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Sheets' && <GoogleSheetsPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Gmail' && <GmailPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Chat' && <GoogleChatPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Tasks' && <GoogleTasksPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Drive' && <GoogleDriveEvidencePanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Calendar' && <GoogleCalendarWidget isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Keep' && <GoogleKeepNotesPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN TWO-COLUMN LAYOUT: GRAPH CANVAS (8 COLS) + INTELLIGENCE SIDEBAR (4 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT GRAPH CANVAS CONTAINER */}
        <div className={`lg:col-span-8 p-5 rounded-2xl border flex flex-col gap-4 shadow-xl relative min-h-[620px] ${cardBg}`}>
          {/* GRAPH TOP BAR (LEGEND + FILTERS) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mr-2">
                RELATIONSHIP GRAPH
              </span>

              {/* NODE LEGEND */}
              <div className="flex items-center gap-3 flex-wrap text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
                  <span className="text-gray-300">Person</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-gray-300">Location</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-gray-300">Vehicle</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                  <span className="text-gray-300">Organization</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="text-gray-300">Evidence</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
                  <span className="text-gray-300">Event</span>
                </span>
              </div>
            </div>

            {/* QUICK SEARCH */}
            <div className="relative w-full sm:w-48">
              <Search size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Find entity or link..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-2.5 py-1 rounded-xl text-xs border outline-none focus:border-[#FF5A1F] ${
                  isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* FLOATING LEFT GRAPH TOOLBAR */}
          <div className="absolute left-8 top-20 z-20 flex flex-col gap-1 p-1.5 rounded-2xl bg-gray-900/90 border border-gray-800 backdrop-blur-md shadow-2xl">
            <button
              onClick={() => setSelectedTool('Select')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                selectedTool === 'Select' ? 'bg-[#FF5A1F] text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Select / Interact"
            >
              <MousePointer size={15} />
            </button>

            <button
              onClick={() => setSelectedTool('Pan')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                selectedTool === 'Pan' ? 'bg-[#FF5A1F] text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Pan Canvas"
            >
              <Layers size={15} />
            </button>

            <button
              onClick={() => setSelectedNodeId('SK')}
              className="p-2 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Recenter Central Node (SK)"
            >
              <RefreshCw size={15} />
            </button>

            <div className="w-full h-px bg-gray-800 my-0.5" />

            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="p-2 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>

            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
              className="p-2 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>

            <button
              onClick={() => setZoomLevel(96)}
              className="p-2 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 size={15} />
            </button>
          </div>

          {/* INTERACTIVE GRAPH CANVAS SURFACE */}
          <div className="w-full h-[520px] rounded-2xl relative overflow-hidden bg-[#0A0D14] border border-gray-800/80 shadow-inner flex items-center justify-center">
            {/* CANVAS BACKGROUND GRID PATTERN */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-[#3B82F6] 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* SVG LINK CONNECTIONS */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="link-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {links.map((link) => {
                const sNode = nodes.find((n) => n.id === link.sourceId);
                const tNode = nodes.find((n) => n.id === link.targetId);
                if (!sNode || !tNode) return null;

                const isConnectedToSelected =
                  sNode.id === selectedNodeId || tNode.id === selectedNodeId;

                const strokeColor = isConnectedToSelected ? '#FF5A1F' : '#374151';
                const strokeWidth = isConnectedToSelected ? 2.5 : 1.2;

                return (
                  <g key={link.id}>
                    <line
                      x1={`${sNode.x}%`}
                      y1={`${sNode.y}%`}
                      x2={`${tNode.x}%`}
                      y2={`${tNode.y}%`}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={isConnectedToSelected ? 'none' : '4 4'}
                      className="transition-all duration-300"
                    />

                    {/* INTERMEDIATE RELATIONSHIP BADGE ON EDGE */}
                    <foreignObject
                      x={`calc(${(sNode.x + tNode.x) / 2}% - 65px)`}
                      y={`calc(${(sNode.y + tNode.y) / 2}% - 11px)`}
                      width="130"
                      height="22"
                    >
                      <div className="flex items-center justify-center">
                        <span
                          className={`text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full border shadow-xs transition-all pointer-events-auto cursor-pointer ${
                            isConnectedToSelected
                              ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] scale-105'
                              : 'bg-gray-900/90 text-gray-400 border-gray-800'
                          }`}
                        >
                          {link.relationLabel}
                        </span>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>

            {/* NODES GRAPH INTERACTION MAPPING */}
            <div
              className="w-full h-full relative transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const isCentral = node.id === 'SK';

                return (
                  <motion.div
                    key={node.id}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      showToast(`Selected Node: ${node.label}`);
                    }}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={`absolute flex flex-col items-center cursor-pointer group z-10`}
                  >
                    {/* NODE GLOW EFFECT */}
                    {isSelected && (
                      <div className="absolute inset-0 rounded-full bg-[#FF5A1F]/30 animate-ping -m-2 pointer-events-none" />
                    )}

                    {/* NODE AVATAR ICON */}
                    <div
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center font-black border-2 transition-all shadow-xl ${
                        isSelected
                          ? 'ring-4 ring-[#FF5A1F]/50 scale-110 shadow-[#FF5A1F]/30'
                          : ''
                      }`}
                      style={{
                        backgroundColor: isSelected ? '#111827' : '#1F2937',
                        borderColor: isSelected ? '#FF5A1F' : node.color
                      }}
                    >
                      <span className="text-xs font-mono tracking-wider font-black" style={{ color: node.color }}>
                        {node.avatarText || 'ND'}
                      </span>

                      {/* ICON BADGE AT CORNER */}
                      <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-gray-900 border border-gray-700 shadow-xs">
                        {node.type === 'Person' && <User size={10} className="text-purple-400" />}
                        {node.type === 'Location' && <MapPin size={10} className="text-blue-400" />}
                        {node.type === 'Vehicle' && <Car size={10} className="text-emerald-400" />}
                        {node.type === 'Organization' && <Building2 size={10} className="text-orange-400" />}
                        {node.type === 'Evidence' && <Film size={10} className="text-red-400" />}
                        {node.type === 'Event' && <Clock size={10} className="text-indigo-400" />}
                      </div>
                    </div>

                    {/* NODE TEXT LABELS */}
                    <div className="mt-2 flex flex-col items-center">
                      <span className={`text-xs font-black tracking-tight text-white drop-shadow-md`}>
                        {node.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${node.bgColor} ${node.borderColor} ${node.textColor}`}>
                        {node.subtitle}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* BOTTOM RIGHT RADAR MINIMAP OVERVIEW */}
            <div className="absolute right-4 bottom-4 z-20 w-44 h-28 rounded-2xl bg-gray-900/90 border border-gray-800 p-2 shadow-2xl backdrop-blur-md hidden sm:flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-gray-400">
                <span>RADAR PREVIEW</span>
                <span className="text-[#FF5A1F]">{zoomLevel}%</span>
              </div>

              {/* THUMBNAIL GRAPH DOTS */}
              <div className="w-full h-16 rounded-xl bg-black/60 relative border border-gray-800/80 overflow-hidden flex items-center justify-center">
                {nodes.map((n) => (
                  <div
                    key={`mini-${n.id}`}
                    className={`absolute w-1.5 h-1.5 rounded-full ${
                      n.id === selectedNodeId ? 'bg-[#FF5A1F] ring-2 ring-[#FF5A1F]' : 'bg-gray-500'
                    }`}
                    style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: INSPECTOR INTELLIGENCE SIDEBAR (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* ENTITY DETAILS CARD */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 shadow-xl ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                ENTITY DETAILS
              </span>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="text-xs font-bold text-[#FF5A1F] hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            {/* ENTITY PROFILE SUMMARY */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-white shadow-md border-2"
                style={{ backgroundColor: selectedNode.color, borderColor: selectedNode.color }}
              >
                {selectedNode.avatarText}
              </div>
              <div>
                <h3 className="text-sm font-black text-white">{selectedNode.label}</h3>
                <span className="text-xs font-bold text-purple-400">{selectedNode.subtitle}</span>
              </div>
            </div>

            {/* SPECS GRID */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-mono">Type</span>
                <span className="font-bold text-gray-200">{selectedNode.type}</span>
              </div>
              {selectedNode.details.dob && (
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-mono">Date of Birth</span>
                  <span className="font-bold text-gray-200">{selectedNode.details.dob}</span>
                </div>
              )}
              {selectedNode.details.phone && (
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-mono">Phone</span>
                  <span className="font-bold text-gray-200">{selectedNode.details.phone}</span>
                </div>
              )}
              {selectedNode.details.address && (
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-mono">Address</span>
                  <span className="font-bold text-gray-200 truncate block">{selectedNode.details.address}</span>
                </div>
              )}
              {selectedNode.details.casesLinked !== undefined && (
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-mono">Cases Linked</span>
                  <span className="font-bold text-gray-200">{selectedNode.details.casesLinked}</span>
                </div>
              )}
            </div>

            {selectedNode.details.notes && (
              <p className="text-xs text-gray-300 bg-gray-900/40 p-3 rounded-xl border border-gray-800 leading-relaxed italic">
                &quot;{selectedNode.details.notes}&quot;
              </p>
            )}

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full py-2 rounded-xl border border-gray-800 hover:border-[#FF5A1F] text-xs font-bold text-[#FF5A1F] flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-gray-900/50"
            >
              <span>View Full Profile</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* RELATIONSHIP INSIGHTS CARD */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 shadow-xl ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                RELATIONSHIP INSIGHTS
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                4 Insights
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex items-start gap-2.5">
                <User size={15} className="text-purple-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-200 leading-relaxed">
                  Sandeep Kumar was seen at the crime location <span className="font-bold text-white">15 mins before</span> the incident.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex items-start gap-2.5">
                <Car size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-200 leading-relaxed">
                  Sandeep Kumar and Naveen J. traveled together in vehicle <span className="font-bold text-emerald-400">KA03MN4481</span>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex items-start gap-2.5">
                <Film size={15} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-200 leading-relaxed">
                  CCTV evidence strongly connects <span className="font-bold text-white">Sandeep Kumar</span> to the scene.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex items-start gap-2.5">
                <DollarSign size={15} className="text-orange-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-200 leading-relaxed">
                  Financial transactions found between Sandeep Kumar and <span className="font-bold text-orange-400">City Robbery Gang</span>.
                </p>
              </div>
            </div>

            <button
              onClick={() => openCopilot('Analyze relationship graph connections and highlight top suspect risk scores for FIR KRP/2026/0456.')}
              className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center justify-center gap-1 cursor-pointer pt-1"
            >
              <span>View All Insights with AI Copilot</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* GRAPH STATISTICS CARD */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 shadow-xl ${cardBg}`}>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 border-b pb-2 border-gray-200 dark:border-gray-800">
              GRAPH STATISTICS
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <span className="text-gray-400">Total Entities</span>
                <span className="font-black text-white">28</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <span className="text-gray-400">Evidence</span>
                <span className="font-black text-red-400">7</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <span className="text-gray-400">Persons</span>
                <span className="font-black text-purple-400">14</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <span className="text-gray-400">Organizations</span>
                <span className="font-black text-orange-400">2</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <span className="text-gray-400">Locations</span>
                <span className="font-black text-blue-400">6</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <span className="text-gray-400">Events</span>
                <span className="font-black text-indigo-400">3</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <span className="text-gray-400">Vehicles</span>
                <span className="font-black text-emerald-400">4</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <span className="text-gray-400">Relationships</span>
                <span className="font-black text-[#FF5A1F]">42</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: RECENTLY ADDED LINKS + POTENTIAL CONNECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* RECENTLY ADDED LINKS (8 COLS) */}
        <div className={`lg:col-span-8 p-5 rounded-2xl border flex flex-col gap-4 shadow-xl ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
              RECENTLY ADDED LINKS
            </span>
            <button
              onClick={() => showToast('Displaying full link activity audit log')}
              className="text-xs font-bold text-[#FF5A1F] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {recentLinks.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${subCardBg}`}
              >
                {/* FLOW TUPLE */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span className="w-5 h-5 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">
                      {item.sourceAvatar}
                    </span>
                    <span>{item.source}</span>
                  </div>

                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                    &mdash; {item.relation} &rarr;
                  </span>

                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                      {item.targetAvatar}
                    </span>
                    <span>{item.target}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-red-400 font-mono ml-1 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    <FileText size={10} />
                    <span>{item.evidence}</span>
                  </div>
                </div>

                {/* AUDIT METADATA */}
                <div className="text-[10px] text-gray-400 font-mono text-right shrink-0">
                  <div>Added by <span className="text-gray-200 font-bold">{item.addedBy}</span></div>
                  <div>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POTENTIAL CONNECTIONS / AI SUGGESTIONS (4 COLS) */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border flex flex-col gap-4 shadow-xl ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
              POTENTIAL CONNECTIONS
            </span>
            <span className="text-[10px] font-mono font-bold text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded-full border border-[#FF5A1F]/20">
              3 Suggestions
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {potentialConnections.map((sug) => (
              <div key={sug.id} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-gray-200 leading-relaxed">{sug.title}</p>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${sug.riskColor}`}>
                    {sug.risk}
                  </span>
                </div>
                <button
                  onClick={() => {
                    showToast(`Approved AI connection suggestion: "${sug.title}"`);
                  }}
                  className="text-[10px] font-bold text-[#FF5A1F] hover:underline self-end cursor-pointer"
                >
                  + Add Link
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => openCopilot('Run link prediction analysis to detect hidden associates in FIR KRP/2026/0456.')}
            className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center justify-center gap-1 cursor-pointer pt-1"
          >
            <span>View All Suggestions</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* MODAL: ADD ENTITY */}
      <AnimatePresence>
        {isAddEntityOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl flex flex-col gap-4 ${cardBg}`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center font-bold">
                    <Plus size={16} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider">ADD NEW ENTITY TO CASE GRAPH</h3>
                </div>
                <button onClick={() => setIsAddEntityOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddEntity} className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Entity Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Babu, White Honda City, Scene Photo #3..."
                    value={newEntityName}
                    onChange={(e) => setNewEntityName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                      isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Entity Category
                    </label>
                    <select
                      value={newEntityType}
                      onChange={(e) => setNewEntityType(e.target.value as any)}
                      className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                        isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                      }`}
                    >
                      <option value="Person">Person</option>
                      <option value="Location">Location</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Organization">Organization</option>
                      <option value="Evidence">Evidence</option>
                      <option value="Event">Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Role Badge
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Suspect, Witness, Hotspot..."
                      value={newEntityRole}
                      onChange={(e) => setNewEntityRole(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                        isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Relationship to Active Node ({selectedNode.label})
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KNOWN ASSOCIATE, USED VEHICLE, CAPTURED ON..."
                    value={newEntityRelation}
                    onChange={(e) => setNewEntityRelation(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-[#FF5A1F] ${
                      isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddEntityOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FF5A1F] hover:bg-[#e04e18] text-white cursor-pointer shadow-md"
                  >
                    Add Entity to Graph
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: FULL ENTITY PROFILE */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl flex flex-col gap-4 ${cardBg}`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs"
                    style={{ backgroundColor: selectedNode.color }}
                  >
                    {selectedNode.avatarText}
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider">{selectedNode.label}</h3>
                    <p className="text-[10px] text-gray-400">Forensic Profile &bull; FIR KRP/2026/0456</p>
                  </div>
                </div>
                <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Category</span>
                  <span className="font-bold text-white">{selectedNode.type}</span>
                </div>
                {selectedNode.details.phone && (
                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Contact Number</span>
                    <span className="font-bold text-white">{selectedNode.details.phone}</span>
                  </div>
                )}
                {selectedNode.details.address && (
                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Primary Residence</span>
                    <span className="font-bold text-white">{selectedNode.details.address}</span>
                  </div>
                )}
                {selectedNode.details.notes && (
                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Investigating Officer Brief</span>
                    <span className="text-gray-300 leading-relaxed">{selectedNode.details.notes}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FF5A1F] hover:bg-[#e04e18] text-white cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: GOOGLE PICKER */}
      <GooglePickerModal
        isOpen={isPickerOpen}
        isDarkMode={isDarkMode}
        onClose={() => setIsPickerOpen(false)}
        onSelectFile={(file) => {
          showToast(`Attached "${file.name}" to Relationship Graph`);
        }}
        showToast={showToast}
      />
    </div>
  );
}
