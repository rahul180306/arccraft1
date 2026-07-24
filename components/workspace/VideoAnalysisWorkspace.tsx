'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUIStore } from '@/lib/stores/uiStore';
import { pageContainerVariants, pageItemVariants } from '@/lib/motion';
import {
  Play,
  Pause,
  Video,
  Download,
  Share2,
  Upload,
  ZoomIn,
  ZoomOut,
  Sliders,
  Maximize,
  RotateCcw,
  Sparkles,
  Eye,
  ShieldCheck,
  Clock,
  User,
  Car,
  Package,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
  Calendar,
  CheckSquare,
  MessageSquare,
  StickyNote,
  HardDrive,
  Mail,
  FileCheck,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronLeft,
  X,
  Plus,
  Zap,
  Tag,
  Crosshair,
  Volume2,
  VolumeX,
  Scissors,
  Layers,
  MapPin,
  ExternalLink,
  Info,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

import GoogleTasksPanel from '@/components/workspace/GoogleTasksPanel';
import GoogleDriveEvidencePanel from '@/components/workspace/GoogleDriveEvidencePanel';
import GoogleCalendarWidget from '@/components/workspace/GoogleCalendarWidget';
import GoogleKeepNotesPanel from '@/components/workspace/GoogleKeepNotesPanel';
import GoogleDocsPanel from '@/components/workspace/GoogleDocsPanel';
import GoogleSheetsPanel from '@/components/workspace/GoogleSheetsPanel';
import GmailPanel from '@/components/workspace/GmailPanel';
import GoogleChatPanel from '@/components/workspace/GoogleChatPanel';
import GooglePickerModal from '@/components/workspace/GooglePickerModal';

interface KeyFrame {
  id: string;
  timestamp: string;
  seconds: number;
  label: string;
  thumbnail: string;
  events: string[];
}

const KEYFRAMES: KeyFrame[] = [
  {
    id: 'f-1',
    timestamp: '02:15:35',
    seconds: 935,
    label: 'Normal feed',
    thumbnail: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&auto=format&fit=crop&q=80',
    events: ['Camera Active']
  },
  {
    id: 'f-2',
    timestamp: '02:15:38',
    seconds: 938,
    label: 'Vehicle headlights',
    thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80',
    events: ['Vehicle Approach']
  },
  {
    id: 'f-3',
    timestamp: '02:15:40',
    seconds: 940,
    label: 'Vehicle stops near gate',
    thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop&q=80',
    events: ['Vehicle Stopped', 'Suspicious']
  },
  {
    id: 'f-4',
    timestamp: '02:15:43',
    seconds: 943,
    label: 'Suspect exits vehicle',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    events: ['Person Detected', 'Cap Hidden Face']
  },
  {
    id: 'f-5',
    timestamp: '02:15:45',
    seconds: 945,
    label: 'Object placement on wall',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
    events: ['Object Drop', 'Backpack']
  },
  {
    id: 'f-6',
    timestamp: '02:15:48',
    seconds: 948,
    label: 'Suspect re-enters vehicle',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    events: ['Person Re-entered']
  },
  {
    id: 'f-7',
    timestamp: '02:15:52',
    seconds: 952,
    label: 'Vehicle speeds away',
    thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80',
    events: ['Vehicle Departed']
  }
];

export default function VideoAnalysisWorkspace() {
  const { isDarkMode, showToast } = useUIStore();

  // Navigation Sub-Tabs
  const [activeSubTab, setActiveSubTab] = useState<string>('Overview');
  const [googleTab, setGoogleTab] = useState<'Tasks' | 'Drive' | 'Docs' | 'Sheets' | 'Gmail' | 'Chat' | 'Calendar' | 'Keep'>('Docs');
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

  // Video Player Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(943); // 02:15:43
  const [totalTime] = useState<number>(16338); // 04:32:18
  const [playbackSpeed, setPlaybackSpeed] = useState<string>('1.0x');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'Normal' | 'NightVision' | 'Thermal' | 'Enhance'>('Enhance');
  const [selectedKeyframe, setSelectedKeyframe] = useState<KeyFrame>(KEYFRAMES[3]);

  // Modals & Drawers
  const [isWorkspaceSuiteOpen, setIsWorkspaceSuiteOpen] = useState<boolean>(false);
  const [selectedToolModal, setSelectedToolModal] = useState<string | null>(null);

  // Quick Action States
  const [isAnprActive, setIsAnprActive] = useState<boolean>(false);

  // Toggle Video Playback simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= 960 ? 935 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Format time code MM:SS:FF
  const formatTimecode = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Card themes
  const cardBg = isDarkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0] shadow-sm';
  const subCardBg = isDarkMode ? 'bg-[#1F2937]/50 border-[#374151]' : 'bg-slate-50 border-slate-200';
  const inputBg = isDarkMode ? 'bg-[#0B0F19] border-[#374151] text-white' : 'bg-white border-slate-200 text-slate-800';

  const subTabs = [
    'Overview',
    'Timeline',
    'Objects & People',
    'Vehicle Analysis (ANPR)',
    'Audio Analysis',
    'Enhance & Filters',
    'Compare Feeds',
    'Extract Keyframes',
    'Forensic Reports',
    'Investigator Notes'
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageContainerVariants}
      className="p-4 md:p-8 flex flex-col gap-6 max-w-[1700px] mx-auto w-full min-h-screen pb-24"
    >
      {/* 1. TOP BREADCRUMB & VIDEO TITLE HEADER */}
      <motion.div variants={pageItemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-gray-400 mb-1">
            <span>Video Analysis</span>
            <span>&gt;</span>
            <span>FIR KRP/2026/0456</span>
            <span>&gt;</span>
            <span className="text-[#FF5A1F] font-bold">CCTV_FrontGate_15Jul.mp4</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              CCTV_FrontGate_15Jul.mp4
            </h1>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              VERIFIED CUSTODY
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-gray-400 mt-2 flex-wrap">
            <span className="flex items-center gap-1"><Video size={13} className="text-[#FF5A1F]" /> Digital Evidence</span>
            <span>•</span>
            <span>Video Stream</span>
            <span>•</span>
            <span>450 MB</span>
            <span>•</span>
            <span>1920x1080 (4K)</span>
            <span>•</span>
            <span>25 FPS</span>
            <span>•</span>
            <span>H.264 High Profile</span>
            <span>•</span>
            <span>Added 16 Jul 2025, 10:24 AM by ASI Ramesh</span>
          </div>
        </div>

        {/* TOP RIGHT ACTION BUTTONS & WORKSPACE TOOLKIT TRIGGER */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setIsWorkspaceSuiteOpen(!isWorkspaceSuiteOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/20 transition-all cursor-pointer"
          >
            <Sparkles size={14} />
            <span>KSP Workspace Suite</span>
            <span className="text-[9px] bg-[#FF5A1F] text-white px-1.5 py-0.5 rounded font-mono">10 Tools</span>
          </button>

          <button
            onClick={() => showToast('Downloading Video Hash Package...')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDarkMode ? 'bg-[#111827] border-[#374151] hover:bg-[#1F2937] text-gray-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
            }`}
          >
            <Download size={14} className="text-gray-400" />
            <span>Download</span>
          </button>

          <button
            onClick={() => showToast('Evidence Share Link Generated')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDarkMode ? 'bg-[#111827] border-[#374151] hover:bg-[#1F2937] text-gray-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
            }`}
          >
            <Share2 size={14} className="text-gray-400" />
            <span>Share</span>
          </button>

          <button
            onClick={() => showToast('Opened Video Upload Modal')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] transition-all cursor-pointer shadow-lg shadow-[#FF5A1F]/20 hover:scale-[1.02]"
          >
            <Upload size={16} />
            <span>Upload Video</span>
          </button>
        </div>
      </motion.div>

      {/* WORKSPACE SUITE COLLAPSIBLE BAR (GOOGLE WORKSPACE & POLICE TOOLS) */}
      <AnimatePresence>
        {isWorkspaceSuiteOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-2xl border flex flex-col gap-3 ${
              isDarkMode ? 'bg-[#111827] border-[#FF5A1F]/30' : 'bg-orange-50/50 border-orange-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF5A1F]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A1F]">
                  KSP Law Enforcement Workspace Integration Suite
                </span>
              </div>
              <button
                onClick={() => setIsWorkspaceSuiteOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Directly synchronize video findings, vehicle logs, and keyframe snapshots into official Karnataka State Police Google Workspace documents:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
              {[
                { name: 'Google Docs', icon: FileText, color: 'text-blue-500', action: 'Docs' },
                { name: 'Google Sheets', icon: FileSpreadsheet, color: 'text-emerald-500', action: 'Sheets' },
                { name: 'Google Slides', icon: FileCheck, color: 'text-amber-500', action: 'Slides' },
                { name: 'Google Calendar', icon: Calendar, color: 'text-rose-500', action: 'Calendar' },
                { name: 'Google Tasks', icon: CheckSquare, color: 'text-sky-500', action: 'Tasks' },
                { name: 'Google Chat', icon: MessageSquare, color: 'text-teal-500', action: 'Chat' },
                { name: 'Google Keep', icon: StickyNote, color: 'text-yellow-500', action: 'Keep' },
                { name: 'Google Drive', icon: HardDrive, color: 'text-indigo-500', action: 'Drive' },
                { name: 'Gmail', icon: Mail, color: 'text-red-500', action: 'Gmail' },
                { name: 'KSP RTO Contacts', icon: Users, color: 'text-purple-500', action: 'Contacts' }
              ].map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.name}
                    onClick={() => {
                      setSelectedToolModal(tool.action);
                      showToast(`Opened ${tool.name} integration`);
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-105 cursor-pointer ${
                      isDarkMode ? 'bg-[#1F2937]/70 border-[#374151] hover:border-[#FF5A1F]' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <Icon size={18} className={tool.color} />
                    <span className="text-[10px] font-bold truncate max-w-full">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SUB TABS NAVIGATION BAR */}
      <motion.div variants={pageItemVariants} className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-gray-700/30">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
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

      {/* 3. MAIN WORKSPACE CONTENT: 3-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT & CENTER MAIN PANEL (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* VIDEO PLAYER CANVAS & FLOATING OVERLAY CONTROLS */}
          <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-4 relative overflow-hidden ${cardBg}`}>
            {/* Video Canvas Container */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-gray-800 flex items-center justify-center group">
              {/* CCTV Feed Image representation */}
              <img
                src={selectedKeyframe.thumbnail}
                alt="CCTV Video Feed"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  activeFilter === 'NightVision' ? 'hue-rotate-90 contrast-125 saturate-200 brightness-110' :
                  activeFilter === 'Thermal' ? 'invert contrast-200 hue-rotate-180' :
                  activeFilter === 'Enhance' ? 'contrast-110 brightness-105 saturate-110' : ''
                }`}
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%)`
                }}
              />

              {/* Timestamp Watermark Overlay (Top Left) */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white font-mono text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>15-07-2025 Tue 02:15:43</span>
              </div>

              {/* Camera Identifier (Bottom Right) */}
              <div className="absolute bottom-16 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-white font-mono text-xs">
                Camera 01 - KR Puram Main Gate
              </div>

              {/* Bounding Box AI Overlays */}
              {showOverlays && (
                <>
                  {/* Person Bounding Box */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-[35%] left-[45%] w-[12%] h-[40%] border-2 border-emerald-400 bg-emerald-400/10 rounded pointer-events-none flex flex-col justify-between p-1"
                  >
                    <div className="bg-emerald-500 text-black font-mono font-bold text-[9px] px-1 py-0.5 rounded w-max">
                      Person 92%
                    </div>
                    <div className="text-[8px] font-mono text-emerald-300 bg-black/60 px-1 rounded">
                      Facing Away
                    </div>
                  </motion.div>

                  {/* Vehicle Bounding Box */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-[48%] left-[20%] w-[30%] h-[35%] border-2 border-blue-400 bg-blue-400/10 rounded pointer-events-none flex flex-col justify-between p-1"
                  >
                    <div className="bg-blue-500 text-white font-mono font-bold text-[9px] px-1 py-0.5 rounded w-max">
                      Vehicle (KA03MN4481) 86%
                    </div>
                    <div className="text-[8px] font-mono text-blue-300 bg-black/60 px-1 rounded">
                      Sedan • Hazard Lights On
                    </div>
                  </motion.div>

                  {/* Backpack Bounding Box */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-[58%] left-[58%] w-[8%] h-[12%] border-2 border-amber-400 bg-amber-400/10 rounded pointer-events-none p-0.5"
                  >
                    <div className="bg-amber-500 text-black font-mono font-bold text-[8px] px-1 rounded w-max">
                      Backpack 78%
                    </div>
                  </motion.div>
                </>
              )}

              {/* INSET MINIMAP BLUEPRINT (Bottom Left) */}
              <div className="absolute bottom-16 left-4 w-32 h-24 rounded-lg bg-black/80 border border-white/20 p-2 pointer-events-none hidden sm:flex flex-col justify-between">
                <div className="flex items-center justify-between text-[8px] font-mono text-gray-400">
                  <span>SITE MAP</span>
                  <MapPin size={10} className="text-[#FF5A1F]" />
                </div>
                <div className="relative w-full h-14 bg-slate-900 rounded border border-gray-700 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-600" />
                  <div className="absolute left-3 top-2 w-4 h-6 border border-emerald-400/50 bg-emerald-400/20" />
                  {/* Camera Cone */}
                  <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[24px] border-b-[#FF5A1F]/30 animate-pulse" />
                </div>
              </div>

              {/* FLOATING RIGHT SIDE TOOLBAR ON VIDEO PLAYER */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setZoomLevel((z) => Math.min(z + 25, 300));
                    showToast(`Zoomed In (${zoomLevel + 25}%)`);
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>

                <button
                  onClick={() => {
                    setZoomLevel((z) => Math.max(z - 25, 100));
                    showToast(`Zoom Out (${zoomLevel - 25}%)`);
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>

                <button
                  onClick={() => {
                    setActiveFilter(activeFilter === 'Enhance' ? 'Normal' : 'Enhance');
                    showToast(`Toggled Filter: ${activeFilter}`);
                  }}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    activeFilter === 'Enhance' ? 'bg-[#FF5A1F] text-white' : 'hover:bg-white/10 text-white'
                  }`}
                  title="Super Resolution Enhance"
                >
                  <Zap size={16} />
                </button>

                <button
                  onClick={() => {
                    setActiveFilter(activeFilter === 'NightVision' ? 'Normal' : 'NightVision');
                    showToast('Night Vision Enhanced');
                  }}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    activeFilter === 'NightVision' ? 'bg-emerald-500 text-black' : 'hover:bg-white/10 text-white'
                  }`}
                  title="Night Vision Mode"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => setShowOverlays(!showOverlays)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    showOverlays ? 'bg-blue-500 text-white' : 'hover:bg-white/10 text-white'
                  }`}
                  title="Toggle AI Overlays"
                >
                  <Crosshair size={16} />
                </button>

                <button
                  onClick={() => {
                    setZoomLevel(100);
                    setBrightness(100);
                    setContrast(100);
                    setActiveFilter('Normal');
                    showToast('Reset Video View');
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                  title="Reset View"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              {/* BOTTOM SCRUB BAR OVERLAY ON PLAYER */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 flex flex-col gap-2 text-white">
                <div className="flex items-center gap-3">
                  {/* Play/Pause Button */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                  >
                    {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                  </button>

                  {/* Scrubber track */}
                  <div className="flex-1 flex items-center relative h-3 group/scrub cursor-pointer">
                    <input
                      type="range"
                      min={935}
                      max={960}
                      value={currentTime}
                      onChange={(e) => setCurrentTime(Number(e.target.value))}
                      className="w-full accent-[#FF5A1F] h-1.5 rounded-lg cursor-pointer bg-white/30"
                    />
                  </div>

                  {/* Timecode */}
                  <div className="font-mono text-xs font-bold text-gray-200">
                    {formatTimecode(currentTime)} / 04:32:18
                  </div>

                  {/* Audio mute */}
                  <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 text-gray-300 hover:text-white cursor-pointer">
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>

                  {/* Speed Selector */}
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(e.target.value)}
                    className="bg-black/80 border border-white/20 text-white text-[10px] font-mono rounded px-1.5 py-0.5 outline-none cursor-pointer"
                  >
                    <option value="0.5x">0.5x</option>
                    <option value="1.0x">1.0x</option>
                    <option value="2.0x">2.0x</option>
                  </select>

                  {/* Maximize */}
                  <button onClick={() => showToast('Full screen mode toggle')} className="p-1.5 text-gray-300 hover:text-white cursor-pointer">
                    <Maximize size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* EVENT TIMELINE & KEYFRAME SNAPSHOT STRIP */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Event Timeline & Snapshots</span>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Person</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Vehicle</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Object</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Audio</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Event</span>
                </div>
              </div>

              {/* Timeline Keyframe Thumbnails Carousel */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {KEYFRAMES.map((frame) => {
                  const isSelected = selectedKeyframe.id === frame.id;
                  return (
                    <div
                      key={frame.id}
                      onClick={() => {
                        setSelectedKeyframe(frame);
                        setCurrentTime(frame.seconds);
                        showToast(`Jumped to timecode ${frame.timestamp}`);
                      }}
                      className={`shrink-0 w-32 p-1.5 rounded-xl border flex flex-col gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/30 bg-[#FF5A1F]/10'
                          : isDarkMode
                          ? 'border-[#374151] hover:border-gray-500 bg-[#1F2937]/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="relative w-full h-16 rounded-lg overflow-hidden bg-black">
                        <img src={frame.thumbnail} alt={frame.label} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[9px] font-mono text-white">
                          {frame.timestamp}
                        </div>
                      </div>
                      <div className="text-[10px] font-bold truncate leading-tight">{frame.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* AI SUMMARY, KEY OBJECTS & QUICK ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Summary Box */}
            <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border flex flex-col gap-4 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#FF5A1F]" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">AI Summary</h3>
                </div>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  GENERATED
                </span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                AI has analyzed this 4.5-hour CCTV video stream and identified key events, objects, and suspicious movement patterns:
              </p>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl border flex items-center justify-between bg-purple-500/5 border-purple-500/20">
                  <div className="flex items-center gap-2.5">
                    <User size={16} className="text-purple-400" />
                    <div>
                      <div className="font-bold">1 Person detected</div>
                      <div className="text-[10px] text-gray-400 font-mono">02:12:15 - 02:16:02</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-400">High Conf.</span>
                </div>

                <div className="p-2.5 rounded-xl border flex items-center justify-between bg-blue-500/5 border-blue-500/20">
                  <div className="flex items-center gap-2.5">
                    <Car size={16} className="text-blue-400" />
                    <div>
                      <div className="font-bold">2 Vehicles detected</div>
                      <div className="text-[10px] text-gray-400 font-mono">02:05:10 - 02:20:45</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400">ANPR Read</span>
                </div>

                <div className="p-2.5 rounded-xl border flex items-center justify-between bg-red-500/5 border-red-500/20">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle size={16} className="text-red-400" />
                    <div>
                      <div className="font-bold text-red-400">2 Suspicious Events</div>
                      <div className="text-[10px] text-gray-400 font-mono">02:15:40 - 02:16:05</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-red-400">Alert</span>
                </div>
              </div>

              <button
                onClick={() => showToast('Generated Full AI Video Analysis PDF')}
                className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center justify-end gap-1 cursor-pointer pt-1"
              >
                <span>View Full AI Report</span>
                <ChevronRight size={14} />
              </button>
            </motion.div>

            {/* Key Objects Detected */}
            <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 ${cardBg}`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Key Objects</h3>
                  <span className="text-xs font-mono text-gray-400">3 Detected</span>
                </div>

                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-700/40">
                    <div className="flex items-center gap-2.5">
                      <User size={16} className="text-emerald-400" />
                      <span className="font-bold">Person</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">Confidence 92%</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-700/40">
                    <div className="flex items-center gap-2.5">
                      <Car size={16} className="text-blue-400" />
                      <span className="font-bold">Vehicle</span>
                    </div>
                    <span className="font-mono font-bold text-blue-400">Confidence 86%</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-700/40">
                    <div className="flex items-center gap-2.5">
                      <Package size={16} className="text-amber-400" />
                      <span className="font-bold">Backpack</span>
                    </div>
                    <span className="font-mono font-bold text-amber-400">Confidence 78%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => showToast('Opening All Detected Objects Panel')}
                className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center justify-end gap-1 cursor-pointer"
              >
                <span>View All Objects</span>
                <ChevronRight size={14} />
              </button>
            </motion.div>
          </div>

          {/* QUICK ACTIONS TOOLBAR */}
          <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border flex flex-col gap-4 ${cardBg}`}>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Quick Forensics Actions</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => showToast('Extracted Frame Snapshot with Hash metadata')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer ${subCardBg}`}
              >
                <Scissors size={16} className="text-[#FF5A1F]" />
                <span className="text-xs font-bold">Extract Frame</span>
              </button>

              <button
                onClick={() => showToast('Face blurring privacy filter applied')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer ${subCardBg}`}
              >
                <Eye size={16} className="text-blue-400" />
                <span className="text-xs font-bold">Blur Faces</span>
              </button>

              <button
                onClick={() => showToast('Optical Flow Object Tracker Enabled')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer ${subCardBg}`}
              >
                <Crosshair size={16} className="text-emerald-400" />
                <span className="text-xs font-bold">Track Object</span>
              </button>

              <button
                onClick={() => {
                  setIsAnprActive(!isAnprActive);
                  showToast('ANPR Plate Recognition: KA03MN4481');
                }}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer ${
                  isAnprActive ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]' : subCardBg
                }`}
              >
                <Car size={16} className={isAnprActive ? 'text-white' : 'text-purple-400'} />
                <span className="text-xs font-bold">Detect License Plate</span>
              </button>

              <button
                onClick={() => showToast('Generated Forensic Analysis Summary Report')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer ${subCardBg}`}
              >
                <FileText size={16} className="text-teal-400" />
                <span className="text-xs font-bold">Generate Report</span>
              </button>

              <button
                onClick={() => showToast('Side-by-side Video Comparison Feed')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer ${subCardBg}`}
              >
                <Layers size={16} className="text-amber-400" />
                <span className="text-xs font-bold">Compare Video</span>
              </button>
            </div>
          </motion.div>

          {/* ANALYSIS RESULTS DIAGNOSTICS (5 STATS) */}
          <motion.div variants={pageItemVariants} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className={`p-3.5 rounded-2xl border text-center ${cardBg}`}>
              <span className="text-[10px] font-mono text-gray-400 uppercase">Video Quality</span>
              <div className="text-lg font-black text-emerald-500 mt-1">Good</div>
              <span className="text-[10px] font-mono text-gray-400">92% Score</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center ${cardBg}`}>
              <span className="text-[10px] font-mono text-gray-400 uppercase">Stability</span>
              <div className="text-lg font-black text-emerald-500 mt-1">Stable</div>
              <span className="text-[10px] font-mono text-gray-400">95% Gimbal</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center ${cardBg}`}>
              <span className="text-[10px] font-mono text-gray-400 uppercase">Lighting</span>
              <div className="text-lg font-black text-amber-500 mt-1">Low Light</div>
              <span className="text-[10px] font-mono text-gray-400">62% IR Auto</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center ${cardBg}`}>
              <span className="text-[10px] font-mono text-gray-400 uppercase">Clarity</span>
              <div className="text-lg font-black text-emerald-500 mt-1">Clear</div>
              <span className="text-[10px] font-mono text-gray-400">88% Sharp</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-center ${cardBg}`}>
              <span className="text-[10px] font-mono text-gray-400 uppercase">Compression</span>
              <div className="text-lg font-black text-blue-400 mt-1">H.264</div>
              <span className="text-[10px] font-mono text-gray-400">Standard</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT PANEL: EVIDENCE DETAILS & AI INSIGHTS (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* GOOGLE WORKSPACE INTEGRATED INTELLIGENCE SUITE */}
          <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border flex flex-col gap-4 shadow-sm ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center font-black text-xs">
                  G
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                    GOOGLE WORKSPACE SYNC
                  </h3>
                  <p className="text-[10px] text-gray-400">Live KSP Investigation Suite</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPickerOpen(true)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <HardDrive size={11} />
                  <span>Picker</span>
                </button>
                <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setGoogleTab('Docs')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  googleTab === 'Docs'
                    ? 'bg-[#FF5A1F] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText size={12} />
                <span>Docs</span>
              </button>

              <button
                onClick={() => setGoogleTab('Sheets')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  googleTab === 'Sheets'
                    ? 'bg-[#FF5A1F] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet size={12} />
                <span>Sheets</span>
              </button>

              <button
                onClick={() => setGoogleTab('Gmail')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  googleTab === 'Gmail'
                    ? 'bg-[#FF5A1F] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Mail size={12} />
                <span>Gmail</span>
              </button>

              <button
                onClick={() => setGoogleTab('Chat')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  googleTab === 'Chat'
                    ? 'bg-[#FF5A1F] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <MessageSquare size={12} />
                <span>Chat</span>
              </button>

              <button
                onClick={() => setGoogleTab('Tasks')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  googleTab === 'Tasks'
                    ? 'bg-[#FF5A1F] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <CheckSquare size={12} />
                <span>Tasks</span>
              </button>

              <button
                onClick={() => setGoogleTab('Drive')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  googleTab === 'Drive'
                    ? 'bg-[#FF5A1F] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <HardDrive size={12} />
                <span>Drive</span>
              </button>

              <button
                onClick={() => setGoogleTab('Calendar')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  googleTab === 'Calendar'
                    ? 'bg-[#FF5A1F] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Calendar size={12} />
                <span>Schedule</span>
              </button>

              <button
                onClick={() => setGoogleTab('Keep')}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  googleTab === 'Keep'
                    ? 'bg-[#FF5A1F] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <StickyNote size={12} />
                <span>Notes</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="pt-1">
              {googleTab === 'Docs' && (
                <GoogleDocsPanel
                  isDarkMode={isDarkMode}
                  subCardBg={subCardBg}
                  showToast={showToast}
                />
              )}

              {googleTab === 'Sheets' && (
                <GoogleSheetsPanel
                  isDarkMode={isDarkMode}
                  subCardBg={subCardBg}
                  showToast={showToast}
                />
              )}

              {googleTab === 'Gmail' && (
                <GmailPanel
                  isDarkMode={isDarkMode}
                  subCardBg={subCardBg}
                  showToast={showToast}
                />
              )}

              {googleTab === 'Chat' && (
                <GoogleChatPanel
                  isDarkMode={isDarkMode}
                  subCardBg={subCardBg}
                  showToast={showToast}
                />
              )}

              {googleTab === 'Tasks' && (
                <GoogleTasksPanel
                  isDarkMode={isDarkMode}
                  subCardBg={subCardBg}
                  showToast={showToast}
                />
              )}

              {googleTab === 'Drive' && (
                <GoogleDriveEvidencePanel
                  isDarkMode={isDarkMode}
                  subCardBg={subCardBg}
                  showToast={showToast}
                />
              )}

              {googleTab === 'Calendar' && (
                <GoogleCalendarWidget
                  isDarkMode={isDarkMode}
                  subCardBg={subCardBg}
                  showToast={showToast}
                />
              )}

              {googleTab === 'Keep' && (
                <GoogleKeepNotesPanel
                  isDarkMode={isDarkMode}
                  subCardBg={subCardBg}
                  showToast={showToast}
                />
              )}
            </div>
          </motion.div>

          {/* EVIDENCE DETAILS BOX */}
          <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border flex flex-col gap-4 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Evidence Details</h3>
              <button
                onClick={() => showToast('Editing Evidence Metadata')}
                className="text-xs font-bold text-[#FF5A1F] hover:underline cursor-pointer"
              >
                EDIT
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-xs divide-y divide-gray-700/20">
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Evidence ID</span>
                <span className="font-mono font-bold">EVD-2025-0456-001</span>
              </div>

              <div className="flex justify-between py-1 pt-2">
                <span className="text-gray-400">Source</span>
                <span className="font-semibold">KR Puram PS - CCTV</span>
              </div>

              <div className="flex justify-between py-1 pt-2">
                <span className="text-gray-400">Captured On</span>
                <span className="font-mono font-semibold">15 Jul 2025, 02:00 AM</span>
              </div>

              <div className="flex justify-between py-1 pt-2">
                <span className="text-gray-400">Location</span>
                <span className="font-semibold">Front Gate, Main Entrance</span>
              </div>

              <div className="flex justify-between py-1 pt-2">
                <span className="text-gray-400">Device Model</span>
                <span className="font-mono text-[11px]">Hikvision DS-2CD2387G2</span>
              </div>

              <div className="flex justify-between py-1 pt-2">
                <span className="text-gray-400">Submitted By</span>
                <span className="font-semibold">ASI Ramesh</span>
              </div>

              <div className="flex justify-between items-center py-1 pt-2">
                <span className="text-gray-400">Chain of Custody</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Verified
                </span>
              </div>
            </div>

            {/* Custody Avatar Sequence */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-700/30">
              {['AR', 'RK', 'SN', 'IA'].map((initials, idx) => (
                <React.Fragment key={idx}>
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-gray-600 text-[10px] font-mono font-bold text-white flex items-center justify-center">
                    {initials}
                  </div>
                  {idx < 3 && <ChevronRight size={12} className="text-gray-500" />}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* AI INSIGHTS PANEL (4 INSIGHTS) */}
          <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border flex flex-col gap-4 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF5A1F]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">AI Insights</h3>
              </div>
              <span className="text-xs font-mono text-gray-400">4 Insights</span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3 rounded-xl border flex items-start gap-3 bg-amber-500/5 border-amber-500/20">
                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-400">Unusual entry time</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">02:15 AM is outside normal station gate hours</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border flex items-start gap-3 bg-purple-500/5 border-purple-500/20">
                <User size={16} className="text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-purple-300">Person hides face</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Low visibility, cap & hooded jacket detected</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border flex items-start gap-3 bg-blue-500/5 border-blue-500/20">
                <Car size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-blue-300">Vehicle stopped</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Stayed for 2m 15s near front gate with hazard lights</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border flex items-start gap-3 bg-red-500/5 border-red-500/20">
                <Package size={16} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-300">Possible object drop</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Object detected near boundary ledge at 02:16:02</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast('Opening All AI Video Insights')}
              className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center justify-end gap-1 cursor-pointer"
            >
              <span>View All Insights</span>
              <ChevronRight size={14} />
            </button>
          </motion.div>

          {/* TAGS */}
          <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Tags</h3>
              <button
                onClick={() => showToast('Add Custom Tag')}
                className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Night Surveillance
              </span>
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Entrance
              </span>
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Suspicious Activity
              </span>
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                High Priority
              </span>
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
                CCTV
              </span>
            </div>
          </motion.div>

          {/* RELATED EVIDENCE FEEDS */}
          <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Related Evidence</h3>
              <button
                onClick={() => showToast('Viewing All Synchronized CCTV Feeds')}
                className="text-xs font-bold text-[#FF5A1F] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl border flex items-center justify-between hover:border-[#FF5A1F] cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <Video size={16} className="text-[#FF5A1F]" />
                  <div>
                    <div className="font-bold">CCTV_LeftSide_15Jul.mp4</div>
                    <div className="text-[10px] text-gray-400 font-mono">02:00 AM - 04:30 AM</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-500" />
              </div>

              <div className="p-2.5 rounded-xl border flex items-center justify-between hover:border-[#FF5A1F] cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <Video size={16} className="text-[#FF5A1F]" />
                  <div>
                    <div className="font-bold">CCTV_Parking_15Jul.mp4</div>
                    <div className="text-[10px] text-gray-400 font-mono">01:45 AM - 04:15 AM</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-500" />
              </div>

              <div className="p-2.5 rounded-xl border flex items-center justify-between hover:border-[#FF5A1F] cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <Video size={16} className="text-[#FF5A1F]" />
                  <div>
                    <div className="font-bold">CCTV_BackGate_15Jul.mp4</div>
                    <div className="text-[10px] text-gray-400 font-mono">02:05 AM - 04:20 AM</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. MODAL DIALOG FOR SELECTED GOOGLE WORKSPACE TOOL */}
      <AnimatePresence>
        {selectedToolModal && (
          <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl flex flex-col gap-5 ${cardBg}`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-gray-700/40">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#FF5A1F]" />
                  <h3 className="text-base font-bold">
                    Export to Google {selectedToolModal}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedToolModal(null)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <label className="font-bold text-gray-300">Document / Export Title</label>
                <input
                  type="text"
                  defaultValue={`KSP_Video_Forensics_FIR_KRP_2026_0456_${selectedToolModal}`}
                  className={`p-3 rounded-xl outline-none font-mono text-xs ${inputBg}`}
                />

                <label className="font-bold text-gray-300">Included Video Artifacts</label>
                <div className="space-y-1.5 text-gray-400 font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Selected Keyframe Snapshot (02:15:43)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>ANPR Vehicle Plate Log (KA03MN4481)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>AI Detection Summary & Confidence Scores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Chain of Custody SHA-256 Hash Verification</span>
                  </div>
                </div>

                <label className="font-bold text-gray-300">Recipient Officer / Email</label>
                <input
                  type="email"
                  defaultValue="inspector.arjun@ksp.gov.in"
                  className={`p-3 rounded-xl outline-none font-mono text-xs ${inputBg}`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-700/40">
                <button
                  onClick={() => setSelectedToolModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    showToast(`Successfully created Google ${selectedToolModal} Document!`);
                    setSelectedToolModal(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] cursor-pointer shadow-md"
                >
                  Confirm Export
                </button>
              </div>
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
          showToast(`Attached ${file.name} to FIR Evidence Locker`);
        }}
        showToast={showToast}
      />
    </motion.div>
  );
}
