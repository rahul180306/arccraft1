'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUIStore } from '@/lib/stores/uiStore';
import { pageContainerVariants, pageItemVariants } from '@/lib/motion';
import {
  FileText,
  ShieldCheck,
  HardDrive,
  BarChart3,
  AlertTriangle,
  Search,
  Filter,
  Share2,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  User,
  Eye,
  FileCheck,
  Video,
  FileSpreadsheet,
  Layers,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  QrCode,
  ShieldAlert,
  Mic,
  FolderPlus,
  FileUp,
  X,
  Play,
  Lock,
  History,
  Check,
  Tag,
  ExternalLink,
  MapPin,
  RefreshCw
} from 'lucide-react';

export interface EvidenceItem {
  id: string;
  code: string;
  name: string;
  fileSize: string;
  fileType: 'Video' | 'Image' | 'Audio' | 'PDF' | 'Document' | 'Physical';
  type: 'Digital' | 'Physical' | 'Document';
  category: 'Video' | 'Biological' | 'Vehicle' | 'Legal' | 'Weapon' | 'Audio' | 'Financial' | 'Other';
  addedOn: string;
  addedBy: string;
  status: 'Verified' | 'In Review' | 'Draft' | 'Flagged';
  custodyChain: string[];
  thumbnail: string;
  location: string;
  hash: string;
  description: string;
  firNumber: string;
}

const INITIAL_EVIDENCE_LIST: EvidenceItem[] = [
  {
    id: 'evd-1',
    code: 'EVD-2026-0456-001',
    name: 'CCTV_FrontGate_15Jul.mp4',
    fileSize: '450 MB',
    fileType: 'Video',
    type: 'Digital',
    category: 'Video',
    addedOn: '16 Jul 2025 • 10:24 AM',
    addedBy: 'ASI Ramesh',
    status: 'Verified',
    custodyChain: ['AR', 'RK', 'SN', 'IA'],
    thumbnail: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=150&auto=format&fit=crop&q=80',
    location: 'Server Storage (Vault A-1)',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    description: 'CCTV feed recording from KR Puram front gate entrance between 22:00 and 23:30 hrs.',
    firNumber: 'FIR KRP/2026/0456'
  },
  {
    id: 'evd-2',
    code: 'EVD-2026-0456-002',
    name: 'Fingerprint_Suspect_Ramesh.png',
    fileSize: '2.4 MB',
    fileType: 'Image',
    type: 'Physical',
    category: 'Biological',
    addedOn: '16 Jul 2025 • 11:05 AM',
    addedBy: 'HC Kavya',
    status: 'Verified',
    custodyChain: ['HK', 'AR', 'SN'],
    thumbnail: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=150&auto=format&fit=crop&q=80',
    location: 'Physical Vault Locker B-04',
    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    description: 'Latent fingerprint lifted from steering wheel of seized vehicle.',
    firNumber: 'FIR KRP/2026/0456'
  },
  {
    id: 'evd-3',
    code: 'EVD-2026-0456-003',
    name: 'Vehicle_KA03MN4481.jpg',
    fileSize: '1.2 MB',
    fileType: 'Image',
    type: 'Physical',
    category: 'Vehicle',
    addedOn: '16 Jul 2025 • 11:32 AM',
    addedBy: 'SI Naveen',
    status: 'Verified',
    custodyChain: ['SN', 'AR', 'HK', 'IA'],
    thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&auto=format&fit=crop&q=80',
    location: 'Station Yard Bay 3',
    hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    description: 'Silver sedan impounded at scene of incident with broken side mirror.',
    firNumber: 'FIR KRP/2026/0456'
  },
  {
    id: 'evd-4',
    code: 'EVD-2026-0456-004',
    name: 'Charge_Sheet_Draft.pdf',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    type: 'Document',
    category: 'Legal',
    addedOn: '16 Jul 2025 • 12:15 PM',
    addedBy: 'Inspector Arjun',
    status: 'Draft',
    custodyChain: ['IA', 'AR'],
    thumbnail: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=150&auto=format&fit=crop&q=80',
    location: 'Document Repository / Case Files',
    hash: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8',
    description: 'Preliminary charge sheet compiled under IPC Section 379/420.',
    firNumber: 'FIR KRP/2026/0456'
  },
  {
    id: 'evd-5',
    code: 'EVD-2026-0456-005',
    name: 'Crowbar_Seized_01.jpg',
    fileSize: '1.6 MB',
    fileType: 'Image',
    type: 'Physical',
    category: 'Weapon',
    addedOn: '16 Jul 2025 • 01:10 PM',
    addedBy: 'HC Kavya',
    status: 'Verified',
    custodyChain: ['HK', 'IA', 'SN'],
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80',
    location: 'Armory Locker W-02',
    hash: '5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4',
    description: 'Steel crowbar seized from trunk of suspect vehicle.',
    firNumber: 'FIR KRP/2026/0456'
  },
  {
    id: 'evd-6',
    code: 'EVD-2026-0456-006',
    name: 'Witness_Statement_Audio.m4a',
    fileSize: '8.7 MB',
    fileType: 'Audio',
    type: 'Digital',
    category: 'Audio',
    addedOn: '16 Jul 2025 • 02:02 PM',
    addedBy: 'ASI Ramesh',
    status: 'In Review',
    custodyChain: ['AR', 'IA'],
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=150&auto=format&fit=crop&q=80',
    location: 'Digital Audio Locker (Cloud Secure)',
    hash: '3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2',
    description: 'Recorded oral statement of key witness Srikanth V.',
    firNumber: 'FIR KRP/2026/0456'
  },
  {
    id: 'evd-7',
    code: 'EVD-2026-0456-007',
    name: 'Gold_Items_Seized.png',
    fileSize: '2.1 MB',
    fileType: 'Image',
    type: 'Physical',
    category: 'Financial',
    addedOn: '16 Jul 2025 • 03:45 PM',
    addedBy: 'SI Naveen',
    status: 'Verified',
    custodyChain: ['SN', 'HK'],
    thumbnail: 'https://images.unsplash.com/photo-1611591475170-435d28a42e58?w=150&auto=format&fit=crop&q=80',
    location: 'High Security Treasury Safe #1',
    hash: '7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6',
    description: 'Recovered stolen jewelry items sealed in tamper-evident bag #4402.',
    firNumber: 'FIR KRP/2026/0456'
  }
];

export default function EvidenceLockerWorkspace() {
  const { isDarkMode, showToast, openCopilot } = useUIStore();

  // State
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(INITIAL_EVIDENCE_LIST);
  const [activeTab, setActiveTab] = useState<string>('All Evidence');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isChainAuditOpen, setIsChainAuditOpen] = useState<boolean>(false);

  // New Evidence Form State
  const [newEvidence, setNewEvidence] = useState({
    name: '',
    firNumber: 'FIR KRP/2026/0456',
    type: 'Digital' as 'Digital' | 'Physical' | 'Document',
    category: 'Video' as EvidenceItem['category'],
    location: 'Physical Vault Locker B-01',
    addedBy: 'Inspector Arjun',
    description: ''
  });

  // Filter Categories
  const categoryTabs = [
    'All Evidence',
    'Physical',
    'Digital',
    'Documents',
    'Media',
    'Biological',
    'Forensic',
    'Financial',
    'Vehicles',
    'Weapons',
    'Other'
  ];

  // Filtered Items
  const filteredEvidence = useMemo(() => {
    return evidenceList.filter((item) => {
      // Tab filter
      if (activeTab !== 'All Evidence') {
        if (activeTab === 'Physical' && item.type !== 'Physical') return false;
        if (activeTab === 'Digital' && item.type !== 'Digital') return false;
        if (activeTab === 'Documents' && item.type !== 'Document') return false;
        if (activeTab === 'Media' && item.fileType !== 'Video' && item.fileType !== 'Audio' && item.fileType !== 'Image') return false;
        if (activeTab === 'Biological' && item.category !== 'Biological') return false;
        if (activeTab === 'Forensic' && item.category !== 'Biological' && item.category !== 'Weapon') return false;
        if (activeTab === 'Financial' && item.category !== 'Financial') return false;
        if (activeTab === 'Vehicles' && item.category !== 'Vehicle') return false;
        if (activeTab === 'Weapons' && item.category !== 'Weapon') return false;
      }

      // Dropdown filters
      if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) return false;
      if (selectedStatus !== 'All Status' && item.status !== selectedStatus) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.addedBy.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [evidenceList, activeTab, selectedCategory, selectedStatus, searchQuery]);

  // Toggle selection
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredEvidence.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEvidence.map((i) => i.id));
    }
  };

  const toggleSelectId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidence.name) return;

    const newItem: EvidenceItem = {
      id: `evd-${Date.now()}`,
      code: `EVD-2026-0456-00${evidenceList.length + 1}`,
      name: newEvidence.name,
      fileSize: '4.2 MB',
      fileType: newEvidence.type === 'Digital' ? 'Video' : 'Image',
      type: newEvidence.type,
      category: newEvidence.category,
      addedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' • Just now',
      addedBy: newEvidence.addedBy,
      status: 'Verified',
      custodyChain: ['IA', 'SN'],
      thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=150&auto=format&fit=crop&q=80',
      location: newEvidence.location,
      hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      description: newEvidence.description || 'Newly logged evidence item.',
      firNumber: newEvidence.firNumber
    };

    setEvidenceList([newItem, ...evidenceList]);
    setIsAddModalOpen(false);
    showToast(`Evidence "${newItem.code}" logged successfully.`);
    setNewEvidence({
      name: '',
      firNumber: 'FIR KRP/2026/0456',
      type: 'Digital',
      category: 'Video',
      location: 'Physical Vault Locker B-01',
      addedBy: 'Inspector Arjun',
      description: ''
    });
  };

  // Card theme classes
  const cardBg = isDarkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0] shadow-sm';
  const subCardBg = isDarkMode ? 'bg-[#1F2937]/60 border-[#374151]' : 'bg-slate-50 border-slate-200';
  const inputBg = isDarkMode ? 'bg-[#0B0F19] border-[#374151] text-white' : 'bg-white border-slate-200 text-slate-800';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageContainerVariants}
      className="p-4 md:p-8 flex flex-col gap-6 max-w-[1700px] mx-auto w-full min-h-screen pb-24"
    >
      {/* 1. BREADCRUMB & PAGE HEADER */}
      <motion.div variants={pageItemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-gray-400 mb-1">
            <span>Evidence Locker</span>
            <span>&gt;</span>
            <span className="text-[#FF5A1F] font-bold">FIR KRP/2026/0456</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
            Evidence Locker
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/20">
              Chain of Custody Active
            </span>
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Securely manage, analyze and track all case evidence with Chain of Custody.
          </p>
        </div>

        {/* TOP RIGHT ACTION BUTTONS */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDarkMode ? 'bg-[#111827] border-[#374151] hover:bg-[#1F2937] text-gray-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
            }`}
          >
            <Share2 size={14} className="text-gray-400" />
            <span>Share Evidence</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDarkMode ? 'bg-[#111827] border-[#374151] hover:bg-[#1F2937] text-gray-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
            }`}
          >
            <Download size={14} className="text-gray-400" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] transition-all cursor-pointer shadow-lg shadow-[#FF5A1F]/20 hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>Add Evidence</span>
          </button>
        </div>
      </motion.div>

      {/* 2. TOP METRICS OVERVIEW CARDS (6 CARDS) */}
      <motion.div variants={pageItemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Evidence */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Total Evidence</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <FileText size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black">{evidenceList.length}</div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-500 mt-0.5">
              <span>17% this week</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Categories</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Tag size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black">12</div>
            <div className="text-[11px] font-medium text-gray-400 mt-0.5">Types</div>
          </div>
        </div>

        {/* Chain Integrity */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Chain Integrity</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-500">100%</div>
            <div className="text-[11px] font-medium text-gray-400 mt-0.5">Verified</div>
          </div>
        </div>

        {/* Storage Used */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Storage Used</span>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
              14%
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black">72.4 <span className="text-sm font-normal text-gray-400">GB</span></div>
            <div className="text-[11px] font-medium text-gray-400 mt-0.5">of 500 GB</div>
          </div>
        </div>

        {/* Pending Analysis */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Pending Analysis</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <BarChart3 size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black">18</div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-amber-500 mt-0.5">
              <span>Items</span>
              <span className="font-bold">↑ 4 new</span>
            </div>
          </div>
        </div>

        {/* Expiry Alerts */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Expiry Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center animate-pulse">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-red-500">3</div>
            <div className="text-[11px] font-medium text-gray-400 mt-0.5">Items</div>
          </div>
        </div>
      </motion.div>

      {/* 3. CATEGORY TABS NAVBAR */}
      <motion.div variants={pageItemVariants} className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-gray-700/30">
        {categoryTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#FF5A1F] text-white shadow-md shadow-[#FF5A1F]/20'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-[#1F2937]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </motion.div>

      {/* 4. FILTERS AND SEARCH CONTROLS */}
      <motion.div variants={pageItemVariants} className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search evidence by name, type, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none transition-all ${inputBg}`}
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 scrollbar-none">
          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold outline-none cursor-pointer ${inputBg}`}
          >
            <option value="All Categories">All Categories</option>
            <option value="Video">Video</option>
            <option value="Biological">Biological</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Legal">Legal</option>
            <option value="Weapon">Weapon</option>
            <option value="Audio">Audio</option>
            <option value="Financial">Financial</option>
          </select>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold outline-none cursor-pointer ${inputBg}`}
          >
            <option value="All Status">All Status</option>
            <option value="Verified">Verified</option>
            <option value="In Review">In Review</option>
            <option value="Draft">Draft</option>
          </select>

          {/* Location Selector */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold outline-none cursor-pointer ${inputBg}`}
          >
            <option value="All Locations">All Locations</option>
            <option value="Physical Vault">Physical Vault</option>
            <option value="Server Storage">Server Storage</option>
            <option value="Armory Locker">Armory Locker</option>
          </select>

          {/* Date Filter */}
          <button
            onClick={() => showToast('Date range picker opened')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border cursor-pointer ${inputBg}`}
          >
            <Clock size={13} className="text-gray-400" />
            <span>Date Range</span>
          </button>

          {/* Filters Toggle */}
          <button
            onClick={() => showToast('Advanced Filters Toggle')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
              isDarkMode ? 'bg-[#111827] border-[#374151] text-gray-200' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <Filter size={13} className="text-[#FF5A1F]" />
            <span>Filters</span>
          </button>
        </div>
      </motion.div>

      {/* 5. MAIN CONTENT LAYOUT (TABLE + RIGHT SIDEBAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: EVIDENCE TABLE (8 or 9 COLS) */}
        <motion.div variants={pageItemVariants} className={`lg:col-span-8 xl:col-span-9 rounded-2xl border flex flex-col overflow-hidden ${cardBg}`}>
          {/* Table Container */}
          <div className="overflow-x-auto min-h-[450px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 ${
                  isDarkMode ? 'border-[#1F2937] bg-[#0B0F19]/40' : 'border-slate-200 bg-slate-50'
                }`}>
                  <th className="p-3.5 pl-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredEvidence.length && filteredEvidence.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded accent-[#FF5A1F] cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5">Evidence Name</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Added On</th>
                  <th className="p-3.5">Added By</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-center">Chain of Custody</th>
                  <th className="p-3.5 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/10 text-xs">
                {filteredEvidence.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-gray-400">
                      <FileText size={32} className="mx-auto mb-2 opacity-40" />
                      <p className="font-semibold text-sm">No evidence found matching criteria</p>
                      <p className="text-xs text-gray-500 mt-1">Try resetting filters or changing your search terms.</p>
                    </td>
                  </tr>
                ) : (
                  filteredEvidence.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`transition-colors cursor-pointer group ${
                          isSelected
                            ? isDarkMode ? 'bg-[#FF5A1F]/10' : 'bg-[#FF5A1F]/5'
                            : isDarkMode ? 'hover:bg-[#1F2937]/50' : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="p-3.5 pl-4" onClick={(e) => toggleSelectId(item.id, e)}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded accent-[#FF5A1F] cursor-pointer"
                          />
                        </td>

                        {/* Evidence Name & Thumbnail */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-700/50 bg-black/40">
                              <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                              {item.fileType === 'Video' && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                                  <Play size={12} fill="currentColor" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-xs truncate group-hover:text-[#FF5A1F] transition-colors">
                                {item.name}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                                <span>{item.code}</span>
                                <span>•</span>
                                <span>{item.fileSize}</span>
                                <span>•</span>
                                <span>{item.fileType}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="p-3.5 font-semibold text-gray-300">
                          {item.type}
                        </td>

                        {/* Category */}
                        <td className="p-3.5">
                          <span className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full border ${
                            item.category === 'Video' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            item.category === 'Biological' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            item.category === 'Vehicle' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                            item.category === 'Legal' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            item.category === 'Weapon' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            item.category === 'Audio' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                            'bg-pink-500/10 text-pink-400 border-pink-500/20'
                          }`}>
                            {item.category}
                          </span>
                        </td>

                        {/* Added On */}
                        <td className="p-3.5 font-mono text-xs text-gray-400 whitespace-nowrap">
                          {item.addedOn}
                        </td>

                        {/* Added By */}
                        <td className="p-3.5 font-semibold text-xs whitespace-nowrap">
                          {item.addedBy}
                        </td>

                        {/* Status */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                            item.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            item.status === 'In Review' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        {/* Chain of Custody */}
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center -space-x-1.5">
                            {item.custodyChain.slice(0, 3).map((node, idx) => (
                              <div
                                key={idx}
                                className="w-6 h-6 rounded-full bg-slate-800 border-2 border-[#111827] text-[9px] font-mono font-black text-white flex items-center justify-center"
                              >
                                {node}
                              </div>
                            ))}
                            {item.custodyChain.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-[#FF5A1F]/20 text-[#FF5A1F] border-2 border-[#111827] text-[9px] font-mono font-bold flex items-center justify-center">
                                +{item.custodyChain.length - 2}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Action */}
                        <td className="p-3.5 text-right pr-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                            className="p-1.5 rounded-lg hover:bg-[#FF5A1F]/10 text-gray-400 hover:text-[#FF5A1F] transition-colors cursor-pointer"
                            title="Inspect Evidence"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
            isDarkMode ? 'border-[#1F2937] bg-[#0B0F19]/20' : 'border-slate-200 bg-slate-50'
          }`}>
            <span className="text-gray-400 font-medium">
              Showing <span className="font-bold text-white">1 to {filteredEvidence.length}</span> of 243 results
            </span>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg border flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
                  <ChevronLeft size={14} />
                </button>
                <button className="w-7 h-7 rounded-lg bg-[#FF5A1F] text-white font-bold text-xs flex items-center justify-center">
                  1
                </button>
                <button className="w-7 h-7 rounded-lg border flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
                  2
                </button>
                <button className="w-7 h-7 rounded-lg border flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
                  3
                </button>
                <span className="text-gray-500 font-mono px-1">...</span>
                <button className="w-7 h-7 rounded-lg border flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
                  35
                </button>
                <button className="w-7 h-7 rounded-lg border flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
                  <ChevronRight size={14} />
                </button>
              </div>

              <select className={`px-2.5 py-1 rounded-lg text-xs font-semibold outline-none border cursor-pointer ${inputBg}`}>
                <option value="10">10 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: OVERVIEW WIDGETS (4 or 3 COLS) */}
        <motion.div variants={pageItemVariants} className="lg:col-span-4 xl:col-span-3 flex flex-col gap-5">
          {/* 1. EVIDENCE OVERVIEW DONUT CHART */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Evidence Overview</h3>
              <Sparkles size={14} className="text-[#FF5A1F]" />
            </div>

            {/* Donut Chart Graphic */}
            <div className="relative py-4 flex items-center justify-center">
              <svg className="w-44 h-44 transform -rotate-90">
                <circle cx="88" cy="88" r="68" stroke="currentColor" strokeWidth="18" className="text-slate-800" fill="transparent" />
                {/* Digital 42% */}
                <circle cx="88" cy="88" r="68" stroke="#3B82F6" strokeWidth="18" strokeDasharray="427" strokeDashoffset="247" fill="transparent" />
                {/* Physical 30% */}
                <circle cx="88" cy="88" r="68" stroke="#10B981" strokeWidth="18" strokeDasharray="427" strokeDashoffset="320" fill="transparent" />
                {/* Documents 15% */}
                <circle cx="88" cy="88" r="68" stroke="#A855F7" strokeWidth="18" strokeDasharray="427" strokeDashoffset="380" fill="transparent" />
                {/* Biological 8% */}
                <circle cx="88" cy="88" r="68" stroke="#F59E0B" strokeWidth="18" strokeDasharray="427" strokeDashoffset="410" fill="transparent" />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">243</span>
                <span className="text-[10px] font-mono text-gray-400 uppercase">Total</span>
              </div>
            </div>

            {/* Donut Legend Breakdown */}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-700/30 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="font-semibold text-gray-300">Digital</span>
                </div>
                <span className="font-mono text-gray-400">42% (102)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-gray-300">Physical</span>
                </div>
                <span className="font-mono text-gray-400">30% (73)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="font-semibold text-gray-300">Documents</span>
                </div>
                <span className="font-mono text-gray-400">15% (36)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-gray-300">Biological</span>
                </div>
                <span className="font-mono text-gray-400">8% (19)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  <span className="font-semibold text-gray-300">Others</span>
                </div>
                <span className="font-mono text-gray-400">5% (13)</span>
              </div>
            </div>
          </div>

          {/* 2. RECENT ACTIVITY (LIVE) */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Recent Activity</h3>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live
              </span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-2.5 rounded-xl border flex items-start gap-3 bg-gray-500/5 border-gray-700/30">
                <FileUp size={16} className="text-[#FF5A1F] mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs">New evidence added</div>
                  <div className="text-[11px] text-gray-400 truncate">CCTV_FrontGate_15Jul.mp4</div>
                </div>
                <span className="text-[10px] font-mono text-gray-500 shrink-0">10:24 AM</span>
              </div>

              <div className="p-2.5 rounded-xl border flex items-start gap-3 bg-gray-500/5 border-gray-700/30">
                <ShieldCheck size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs">Chain of custody updated</div>
                  <div className="text-[11px] text-gray-400 truncate">Fingerprint_Suspect_Ramesh.png</div>
                </div>
                <span className="text-[10px] font-mono text-gray-500 shrink-0">09:58 AM</span>
              </div>

              <div className="p-2.5 rounded-xl border flex items-start gap-3 bg-gray-500/5 border-gray-700/30">
                <FileCheck size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs">Evidence analysis completed</div>
                  <div className="text-[11px] text-gray-400 truncate">Vehicle_KA03MN4481.jpg</div>
                </div>
                <span className="text-[10px] font-mono text-gray-500 shrink-0">09:32 AM</span>
              </div>

              <div className="p-2.5 rounded-xl border flex items-start gap-3 bg-red-500/5 border-red-500/20">
                <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-red-400">Evidence expired</div>
                  <div className="text-[11px] text-gray-400 truncate">Old_Statement_2023.pdf</div>
                </div>
                <span className="text-[10px] font-mono text-gray-500 shrink-0">Yesterday</span>
              </div>
            </div>

            <button
              onClick={() => showToast('Opened Activity Logs')}
              className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center justify-end gap-1 cursor-pointer pt-1"
            >
              <span>View All Activity</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* 3. STORAGE USAGE BAR */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Storage Usage</h3>

            <div className="flex items-center justify-between">
              <span className="text-sm font-black">72.4 GB <span className="text-xs font-normal text-gray-400">of 500 GB Used</span></span>
              <span className="text-xs font-mono font-bold text-[#FF5A1F]">14%</span>
            </div>

            {/* Storage bar */}
            <div className="w-full h-2.5 rounded-full bg-gray-800 overflow-hidden flex">
              <div className="h-full bg-blue-500 w-[58%]" title="Videos" />
              <div className="h-full bg-emerald-500 w-[26%]" title="Images" />
              <div className="h-full bg-purple-500 w-[10%]" title="Audio" />
              <div className="h-full bg-amber-500 w-[6%]" title="Others" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono text-gray-400">
              <div>Videos: <span className="text-white font-bold">42.1 GB</span></div>
              <div>Images: <span className="text-white font-bold">18.7 GB</span></div>
              <div>Audio: <span className="text-white font-bold">2.7 GB</span></div>
              <div>Others: <span className="text-white font-bold">8.9 GB</span></div>
            </div>

            <button
              onClick={() => showToast('Storage Management Panel')}
              className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center justify-end gap-1 cursor-pointer pt-1"
            >
              <span>Manage Storage</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 6. BOTTOM QUICK ACTIONS FLOATING TOOLBAR */}
      <motion.div variants={pageItemVariants} className="mt-4 pt-4 border-t border-gray-800">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 mb-3">Quick Actions</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all hover:scale-[1.02] cursor-pointer ${
              isDarkMode ? 'bg-[#111827] border-[#1F2937] hover:border-[#FF5A1F]/50' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <UploadCloud size={18} />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-bold truncate">Add Evidence</div>
              <div className="text-[10px] text-gray-400 truncate">Upload new item</div>
            </div>
          </button>

          <button
            onClick={() => showToast('Opening OCR Document Scanner')}
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all hover:scale-[1.02] cursor-pointer ${
              isDarkMode ? 'bg-[#111827] border-[#1F2937] hover:border-[#FF5A1F]/50' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <QrCode size={18} />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-bold truncate">Scan Document</div>
              <div className="text-[10px] text-gray-400 truncate">OCR & Extract</div>
            </div>
          </button>

          <button
            onClick={() => showToast('Audio/Video Statement Recorder')}
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all hover:scale-[1.02] cursor-pointer ${
              isDarkMode ? 'bg-[#111827] border-[#1F2937] hover:border-[#FF5A1F]/50' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <Mic size={18} />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-bold truncate">Record Statement</div>
              <div className="text-[10px] text-gray-400 truncate">Audio / Video</div>
            </div>
          </button>

          <button
            onClick={() => showToast('Folder Creation Form')}
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all hover:scale-[1.02] cursor-pointer ${
              isDarkMode ? 'bg-[#111827] border-[#1F2937] hover:border-[#FF5A1F]/50' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <FolderPlus size={18} />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-bold truncate">Create Folder</div>
              <div className="text-[10px] text-gray-400 truncate">Organize evidence</div>
            </div>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all hover:scale-[1.02] cursor-pointer ${
              isDarkMode ? 'bg-[#111827] border-[#1F2937] hover:border-[#FF5A1F]/50' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
              <FileSpreadsheet size={18} />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-bold truncate">Generate Report</div>
              <div className="text-[10px] text-gray-400 truncate">Evidence summary</div>
            </div>
          </button>

          <button
            onClick={() => setIsChainAuditOpen(true)}
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all hover:scale-[1.02] cursor-pointer ${
              isDarkMode ? 'bg-[#111827] border-[#1F2937] hover:border-[#FF5A1F]/50' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-bold truncate">Chain Audit</div>
              <div className="text-[10px] text-gray-400 truncate">Verify Integrity</div>
            </div>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all hover:scale-[1.02] cursor-pointer ${
              isDarkMode ? 'bg-[#111827] border-[#1F2937] hover:border-[#FF5A1F]/50' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center shrink-0">
              <Layers size={18} />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-bold truncate">Bulk Upload</div>
              <div className="text-[10px] text-gray-400 truncate">Multiple files</div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. INSPECT EVIDENCE DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
                isDarkMode ? 'bg-[#111827] border-[#374151] text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              {/* Header */}
              <div className="p-5 border-b flex items-center justify-between border-gray-700/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-black flex items-center gap-2">
                      {selectedItem.name}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {selectedItem.status}
                      </span>
                    </h2>
                    <p className="text-xs font-mono text-gray-400">{selectedItem.code} • {selectedItem.firNumber}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 overflow-y-auto flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Media Preview */}
                  <div className="flex flex-col gap-3">
                    <div className="w-full h-56 rounded-xl border border-gray-700 overflow-hidden relative bg-black flex items-center justify-center">
                      <img src={selectedItem.thumbnail} alt={selectedItem.name} className="w-full h-full object-cover opacity-80" />
                      {selectedItem.fileType === 'Video' && (
                        <div className="absolute w-12 h-12 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
                          <Play size={20} fill="currentColor" />
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/50 flex flex-col gap-1.5 text-xs">
                      <span className="font-mono text-[10px] text-gray-400 uppercase font-bold">SHA-256 Hash Fingerprint</span>
                      <span className="font-mono text-[10px] text-emerald-400 break-all bg-black/40 p-2 rounded border border-emerald-500/20">
                        {selectedItem.hash}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 mt-1">
                        <CheckCircle2 size={12} />
                        <span>Hash integrity verified against blockchain custody ledger</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Metadata Details */}
                  <div className="flex flex-col gap-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/30">
                        <span className="text-[10px] font-mono text-gray-400">Type</span>
                        <div className="font-bold text-sm mt-0.5">{selectedItem.type}</div>
                      </div>

                      <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/30">
                        <span className="text-[10px] font-mono text-gray-400">Category</span>
                        <div className="font-bold text-sm mt-0.5">{selectedItem.category}</div>
                      </div>

                      <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/30">
                        <span className="text-[10px] font-mono text-gray-400">File Size</span>
                        <div className="font-bold text-sm mt-0.5">{selectedItem.fileSize}</div>
                      </div>

                      <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/30">
                        <span className="text-[10px] font-mono text-gray-400">Added By</span>
                        <div className="font-bold text-sm mt-0.5">{selectedItem.addedBy}</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/30">
                      <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                        <MapPin size={12} /> Storage Location
                      </span>
                      <div className="font-bold text-xs mt-0.5">{selectedItem.location}</div>
                    </div>

                    <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/30">
                      <span className="text-[10px] font-mono text-gray-400">Description / Notes</span>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">{selectedItem.description}</p>
                    </div>
                  </div>
                </div>

                {/* Custody Audit Trail Timeline */}
                <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/40">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                    <History size={14} className="text-[#FF5A1F]" /> Chain of Custody History Log
                  </h3>

                  <div className="space-y-3 relative pl-4 border-l-2 border-gray-800">
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <div className="text-xs font-bold">Evidence Logged & Sealed</div>
                      <div className="text-[10px] text-gray-400 font-mono">16 Jul 2025 • 10:24 AM by {selectedItem.addedBy}</div>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <div className="text-xs font-bold">Transferred to Forensic Lab</div>
                      <div className="text-[10px] text-gray-400 font-mono">16 Jul 2025 • 01:15 PM by HC Kavya</div>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#FF5A1F]" />
                      <div className="text-xs font-bold">Audited & Verified for Court Submission</div>
                      <div className="text-[10px] text-gray-400 font-mono">17 Jul 2025 • 09:00 AM by Inspector Arjun</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-800 flex items-center justify-between">
                <button
                  onClick={() => openCopilot(`Please analyze the evidence file ${selectedItem.name} (${selectedItem.code}). Focus on details relevant to ${selectedItem.firNumber}.`)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 border-indigo-500/50 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 cursor-pointer"
                >
                  <Sparkles size={14} /> Analyze with ArcCraft AI
                </button>
                <button
                  onClick={() => showToast(`Downloaded report for ${selectedItem.code}`)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 border-gray-700 hover:bg-gray-800 cursor-pointer"
                >
                  <Download size={14} /> Download Certificate
                </button>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold hover:bg-[#E04D18] cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. ADD EVIDENCE MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
                isDarkMode ? 'bg-[#111827] border-[#374151] text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="p-5 border-b border-gray-700/40 flex items-center justify-between">
                <h2 className="text-base font-black flex items-center gap-2">
                  <Plus size={18} className="text-[#FF5A1F]" /> Add New Evidence Item
                </h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddEvidenceSubmit} className="p-6 flex flex-col gap-4 text-xs">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-900/40 hover:border-[#FF5A1F]/50 transition-colors cursor-pointer">
                  <UploadCloud size={32} className="text-[#FF5A1F] mb-2" />
                  <span className="font-bold text-sm">Drag & Drop file here or Click to Browse</span>
                  <span className="text-[10px] text-gray-400 mt-1">Supports Video, Audio, Images, Documents up to 2 GB</span>
                </div>

                <div>
                  <label className="font-bold text-gray-300 mb-1 block">Evidence Title / Filename</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CCTV_Footage_Store_Front.mp4"
                    value={newEvidence.name}
                    onChange={(e) => setNewEvidence({ ...newEvidence, name: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${inputBg}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-300 mb-1 block">Evidence Type</label>
                    <select
                      value={newEvidence.type}
                      onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value as any })}
                      className={`w-full p-2.5 rounded-xl border outline-none ${inputBg}`}
                    >
                      <option value="Digital">Digital</option>
                      <option value="Physical">Physical</option>
                      <option value="Document">Document</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-300 mb-1 block">Category Tag</label>
                    <select
                      value={newEvidence.category}
                      onChange={(e) => setNewEvidence({ ...newEvidence, category: e.target.value as any })}
                      className={`w-full p-2.5 rounded-xl border outline-none ${inputBg}`}
                    >
                      <option value="Video">Video</option>
                      <option value="Biological">Biological</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Legal">Legal</option>
                      <option value="Weapon">Weapon</option>
                      <option value="Audio">Audio</option>
                      <option value="Financial">Financial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-300 mb-1 block">Storage Location</label>
                  <input
                    type="text"
                    value={newEvidence.location}
                    onChange={(e) => setNewEvidence({ ...newEvidence, location: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-300 mb-1 block">Description & Seizure Details</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details on location seized, time, officer notes..."
                    value={newEvidence.description}
                    onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${inputBg}`}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#FF5A1F] text-white font-bold hover:bg-[#E04D18] cursor-pointer"
                  >
                    Save & Lock Evidence
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CHAIN AUDIT MODAL */}
      <AnimatePresence>
        {isChainAuditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 ${
                isDarkMode ? 'bg-[#111827] border-[#374151] text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-base flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  Chain Integrity Audit
                </h3>
                <button onClick={() => setIsChainAuditOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 flex items-center gap-3">
                  <CheckCircle2 size={24} className="shrink-0" />
                  <div>
                    <div className="font-bold text-sm">243 / 243 Items Verified</div>
                    <div className="text-[10px]">Zero tampering detected across all case evidence.</div>
                  </div>
                </div>

                <p className="text-gray-400 leading-relaxed">
                  Every evidence entry is sealed with a cryptographic SHA-256 fingerprint and synchronized with the Station OS Immutable Ledger.
                </p>

                <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/50 font-mono text-[10px] space-y-1">
                  <div>Ledger Block: <span className="text-white">#882940</span></div>
                  <div>Last Consensus: <span className="text-white">Just now (100% agreement)</span></div>
                  <div>Audit Signature: <span className="text-emerald-400 font-bold">VALID_VERIFIED</span></div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsChainAuditOpen(false)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 cursor-pointer text-xs"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. SHARE / EXPORT MODAL */}
      <AnimatePresence>
        {(isShareModalOpen || isExportModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 ${
                isDarkMode ? 'bg-[#111827] border-[#374151] text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-base flex items-center gap-2">
                  {isShareModalOpen ? <Share2 size={18} className="text-[#FF5A1F]" /> : <Download size={18} className="text-[#FF5A1F]" />}
                  {isShareModalOpen ? 'Share Case Evidence Package' : 'Export Evidence Report'}
                </h3>
                <button
                  onClick={() => {
                    setIsShareModalOpen(false);
                    setIsExportModalOpen(false);
                  }}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                {isShareModalOpen ? (
                  <>
                    <p className="text-gray-400">
                      Generate an encrypted, time-limited access portal link for Prosecutor / Court Review.
                    </p>
                    <div>
                      <label className="font-bold text-gray-300 block mb-1">Prosecutor Email / ID</label>
                      <input
                        type="email"
                        defaultValue="public.prosecutor@judiciary.gov.in"
                        className={`w-full p-2.5 rounded-xl border outline-none ${inputBg}`}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400">
                      Export full court-admissible PDF / Excel report including Chain of Custody logs.
                    </p>
                    <div>
                      <label className="font-bold text-gray-300 block mb-1">Export Format</label>
                      <select className={`w-full p-2.5 rounded-xl border outline-none ${inputBg}`}>
                        <option>PDF Case Summary with Chain of Custody</option>
                        <option>Excel / CSV Metadata Dump</option>
                        <option>Judicial Court Package (.ZIP)</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsShareModalOpen(false);
                    setIsExportModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    showToast(isShareModalOpen ? 'Encrypted Link Sent to Prosecutor' : 'Evidence Report Exported');
                    setIsShareModalOpen(false);
                    setIsExportModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#FF5A1F] text-white font-bold text-xs hover:bg-[#E04D18] cursor-pointer"
                >
                  {isShareModalOpen ? 'Send Secure Portal Link' : 'Download Report'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
