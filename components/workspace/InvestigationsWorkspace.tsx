'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { pageContainerVariants, pageItemVariants } from '@/lib/motion';
import { useUIStore } from '@/lib/stores/uiStore';
import { useInvestigationStore } from '@/lib/stores/investigationStore';
import { Folder, Mic, Sparkles } from 'lucide-react';

import CaseHeader from './investigation/CaseHeader';
import NavigationTabs from './investigation/NavigationTabs';
import Overview from './investigation/Overview';
import Sidebar from './investigation/Sidebar';
import Modals from './investigation/Modals';

import GoogleTasksPanel from '@/components/workspace/GoogleTasksPanel';
import EvidenceLockerWorkspace from '@/components/workspace/EvidenceLockerWorkspace';
import VideoAnalysisWorkspace from '@/components/workspace/VideoAnalysisWorkspace';
import InvestigationReplayWorkspace from '@/components/workspace/InvestigationReplayWorkspace';

export default function InvestigationsWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const openCopilot = useUIStore((s) => s.openCopilot);
  const showToast = useUIStore((s) => s.showToast);
  const activeCase = useInvestigationStore((s) => s.activeCase);

  const [activeTab, setActiveTab] = useState('Overview');

  const [selectedEvidence, setSelectedEvidence] = useState<{
    title: string;
    type: string;
    size: string;
    url: string;
    meta?: string;
  } | null>(null);

  const [selectedPerson, setSelectedPerson] = useState<{
    name: string;
    role: string;
    initials: string;
    color: string;
    phone: string;
    statement: string;
  } | null>(null);

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');

  if (!activeCase) return null;

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
      <CaseHeader
        activeCase={activeCase}
        isDarkMode={isDarkMode}
        setActiveTab={setActiveTab}
        showToast={showToast}
      />

      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabsList={tabsList}
        isDarkMode={isDarkMode}
        showToast={showToast}
      />

      {activeTab === 'Overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <Overview
            activeCase={activeCase}
            isDarkMode={isDarkMode}
            cardBg={cardBg}
            subCardBg={subCardBg}
            setActiveTab={setActiveTab}
            setSelectedEvidence={setSelectedEvidence}
            setShowNoteModal={setShowNoteModal}
            openCopilot={openCopilot}
            showToast={showToast}
          />
          <Sidebar
            activeCase={activeCase}
            isDarkMode={isDarkMode}
            cardBg={cardBg}
            subCardBg={subCardBg}
            setActiveTab={setActiveTab}
            setSelectedPerson={setSelectedPerson}
            openCopilot={openCopilot}
            showToast={showToast}
          />
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
      ) : activeTab === 'CCTV Feeds' || activeTab === 'Video Analysis' || activeTab === 'Video' ? (
        <motion.div variants={pageItemVariants} className="w-full">
          <VideoAnalysisWorkspace />
        </motion.div>
      ) : (
        <motion.div variants={pageItemVariants} className={`p-8 rounded-2xl border flex flex-col gap-4 text-center items-center justify-center min-h-[300px] ${cardBg}`}>
          <div className="w-12 h-12 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center">
            <Folder size={24} />
          </div>
          <h2 className="text-xl font-black">{activeTab} Section</h2>
          <p className="text-xs text-gray-400 max-w-md">
            Showing synced records and data for {activeTab} in FIR {activeCase.crimeNo}.
          </p>
          <button
            onClick={() => openCopilot(`Analyze ${activeTab} data for FIR ${activeCase.crimeNo}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18]"
          >
            <Sparkles size={14} /> Ask Copilot
          </button>
        </motion.div>
      )}

      <button
        onClick={() => openCopilot('Voice record new investigation memo')}
        className="fixed bottom-6 right-6 z-40 w-13 h-13 bg-[#FF5A1F] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 cursor-pointer transition-all border-2 border-white/20"
        title="Record Audio / Talk to Copilot"
      >
        <Mic size={22} className="animate-pulse" />
      </button>

      <Modals
        isDarkMode={isDarkMode}
        cardBg={cardBg}
        subCardBg={subCardBg}
        selectedEvidence={selectedEvidence}
        setSelectedEvidence={setSelectedEvidence}
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        showNoteModal={showNoteModal}
        setShowNoteModal={setShowNoteModal}
        noteText={noteText}
        setNoteText={setNoteText}
        openCopilot={openCopilot}
        showToast={showToast}
      />
    </motion.main>
  );
}
