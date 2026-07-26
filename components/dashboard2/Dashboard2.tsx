'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Sparkles } from 'lucide-react';

import SmoothScrollProvider from '@/components/ui/SmoothScrollProvider';
import CommandPalette from '@/components/ui/CommandPalette';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';

import DashboardWorkspace from '@/components/workspace/DashboardWorkspace';
import InvestigationsWorkspace from '@/components/workspace/InvestigationsWorkspace';
import GenericWorkspace from '@/components/workspace/GenericWorkspace';
import SettingsWorkspace from '@/components/workspace/SettingsWorkspace';
import LandingPageWorkspace from '@/components/workspace/LandingPageWorkspace';
import IntelligenceWorkspace from '@/components/workspace/IntelligenceWorkspace';
import ReasoningEngineWorkspace from '@/components/workspace/ReasoningEngineWorkspace';
import KnowledgeBaseWorkspace from '@/components/workspace/KnowledgeBaseWorkspace';
import SupervisorAuditWorkspace from '@/components/workspace/SupervisorAuditWorkspace';

import VoiceAssistantModal from './VoiceAssistantModal';
import CopilotDrawerModal from './CopilotDrawerModal';
import ContinueInvestigationModal from './ContinueInvestigationModal';
import GlobalInvestigationDock from './GlobalInvestigationDock';
import FIRSwitcherModal from './FIRSwitcherModal';

import { useUIStore } from '@/lib/stores/uiStore';
import { useInvestigationStore } from '@/lib/stores/investigationStore';

export default function Dashboard2() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const toastMsg = useUIStore((s) => s.toastMsg);
  const showToast = useUIStore((s) => s.showToast);

  const isFIRSwitcherOpen = useUIStore((s) => s.isFIRSwitcherOpen);
  const closeFIRSwitcher = useUIStore((s) => s.closeFIRSwitcher);

  // ESC key closes any open modal
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFIRSwitcherOpen) closeFIRSwitcher();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFIRSwitcherOpen, closeFIRSwitcher]);

  const isLoading = useInvestigationStore((s) => s.isLoading);
  const loadError = useInvestigationStore((s) => s.loadError);
  // Data is bundled into the app at build time — always immediately available
  const casesLoaded = useInvestigationStore((s) => s.cases.length > 0);

  const isCommandPaletteOpen = useUIStore((s) => s.isCommandPaletteOpen);
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);

  const isVoiceModalOpen = useUIStore((s) => s.isVoiceModalOpen);
  const setVoiceModalOpen = useUIStore((s) => s.setVoiceModalOpen);

  const isCopilotOpen = useUIStore((s) => s.isCopilotOpen);
  const closeCopilot = useUIStore((s) => s.closeCopilot);
  const openCopilot = useUIStore((s) => s.openCopilot);
  const copilotInitialPrompt = useUIStore((s) => s.copilotInitialPrompt);

  const isContinueModalOpen = useUIStore((s) => s.isContinueModalOpen);
  const setContinueModalOpen = useUIStore((s) => s.setContinueModalOpen);

  const handleCommandPaletteAction = (actionName: string, detail?: string) => {
    if (actionName === 'ToggleCommandPalette') {
      setCommandPaletteOpen(true);
    } else if (actionName === 'CopilotQuery' && detail) {
      openCopilot(detail);
    } else if (actionName === 'DraftChargesheet') {
      setContinueModalOpen(true);
      showToast('Opening Form 173 Legal Chargesheet Drafter');
    } else if (actionName === 'OpenCase' && detail) {
      showToast(`Switched active investigation to: ${detail}`);
    } else if (actionName === 'SearchEntity' && detail) {
      showToast(`Querying intelligence database for: ${detail}`);
    } else if (actionName === 'OpenGraph') {
      setActiveTab('Relationship Graph');
      showToast('Navigated to Link Analysis Graph');
    }
  };

  // Show loading screen while KSP dataset is being parsed from Excel
  if (isLoading || !casesLoaded) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center gap-6 select-none">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF5A1F] to-[#FF8C00] flex items-center justify-center shadow-2xl shadow-[#FF5A1F]/30">
            <Sparkles size={28} className="text-white animate-pulse" />
          </div>
          <div className="absolute -inset-1 rounded-2xl border border-[#FF5A1F]/20 animate-ping" />
        </div>
        <div className="text-center">
          <p className="text-white text-xl font-bold tracking-tight font-mono">
            Loading KSP CCTNS Database
          </p>
          <p className="text-[#FF5A1F]/70 text-sm mt-1 font-mono">
            Parsing 1,079 FIRs from <span className="text-[#FF5A1F]">Police_FIR_Combined_Dataset_Final.xlsx</span>
          </p>
        </div>
        <div className="flex gap-1">
          {[0,1,2,3].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#FF5A1F]" style={{animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`}} />
          ))}
        </div>
        {loadError && (
          <div className="mt-4 max-w-sm text-center bg-red-950/30 border border-red-800/40 rounded-xl p-4">
            <p className="text-red-400 text-sm font-mono">⚠ {loadError}</p>
            <p className="text-red-300/60 text-xs mt-1">Ensure Python 3 is available and the dataset file exists.</p>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'Landing' || activeTab === 'Landing Page') {
    return (
      <>
        {/* Toast Alert Notification */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div 
              initial={{ y: -50, opacity: 0, x: '-50%' }}
              animate={{ y: 0, opacity: 1, x: '-50%' }}
              exit={{ y: -50, opacity: 0, x: '-50%' }}
              className="fixed top-5 left-1/2 z-[100] bg-[#111111] text-white border border-[#FF5A1F]/30 shadow-2xl rounded-full px-6 py-2.5 flex items-center gap-2.5 pointer-events-none"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] animate-ping" />
              <span className="text-xs font-semibold tracking-wider uppercase font-mono">{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <LandingPageWorkspace />
      </>
    );
  }

  return (
    <>
      <div className={`min-h-screen font-sans flex flex-col lg:flex-row transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0F19] text-white' : 'bg-[#F8FAFC] text-[#1F2937]'}`}>
        
        {/* Toast Alert Notification */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div 
              initial={{ y: -50, opacity: 0, x: '-50%' }}
              animate={{ y: 0, opacity: 1, x: '-50%' }}
              exit={{ y: -50, opacity: 0, x: '-50%' }}
              className="fixed top-5 left-1/2 z-50 bg-[#111111] text-white border border-[#FF5A1F]/30 shadow-2xl rounded-full px-6 py-2.5 flex items-center gap-2.5 pointer-events-none"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] animate-ping" />
              <span className="text-xs font-semibold tracking-wider uppercase font-mono">{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Command Palette Modal */}
        <CommandPalette 
          isOpen={isCommandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onSelectAction={handleCommandPaletteAction}
        />

        {/* DESKTOP SIDEBAR NAVIGATION */}
        <Sidebar />

        {/* MAIN WORKSPACE CONTENT */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
          
          {/* TOP HEADER */}
          <Header />

          {/* DYNAMIC WORKSPACE VIEW SWITCHER */}
          {activeTab === 'Dashboard' ? (
            <DashboardWorkspace />
          ) : activeTab === 'Investigation Workspace' || activeTab === 'Investigations' ? (
            <InvestigationsWorkspace />
          ) : activeTab === 'Intelligence Workspace' ? (
            <IntelligenceWorkspace />
          ) : activeTab === 'Reasoning Engine' ? (
            <ReasoningEngineWorkspace />
          ) : activeTab === 'Supervisor Command' || activeTab === 'Supervisor Audit' ? (
            <SupervisorAuditWorkspace />
          ) : activeTab === 'Knowledge Base' || activeTab === 'Knowledge' ? (
            <KnowledgeBaseWorkspace />
          ) : activeTab === 'Settings' ? (
            <SettingsWorkspace />
          ) : (
            <GenericWorkspace 
              title={activeTab} 
              description={`Law enforcement tools and analytics for ${activeTab}.`} 
            />
          )}
        </div>

        {/* MOBILE NAVIGATION BAR */}
        <MobileNav />

        {/* FLOATING ACTION BUTTON (FAB): 🤖 AI Copilot Chat */}
        <button
          onClick={() => openCopilot()}
          title="Open ArcCraft AI Copilot"
          aria-label="Open ArcCraft AI Copilot Chat"
          className="hidden sm:flex fixed bottom-6 right-6 z-40 h-12 px-4 bg-[#111111] hover:bg-[#FF5A1F] text-white rounded-full shadow-2xl border border-white/20 items-center gap-2.5 transition-all hover:scale-105 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-full bg-[#FF5A1F] group-hover:bg-white text-white group-hover:text-[#FF5A1F] flex items-center justify-center transition-colors shadow-sm">
            <Sparkles size={15} className="animate-pulse" />
          </div>
          <span className="text-xs font-black tracking-wide pr-1">AI Copilot</span>
        </button>

        {/* MODALS */}
        <VoiceAssistantModal 
          isOpen={isVoiceModalOpen}
          onClose={() => setVoiceModalOpen(false)}
          onSendQuery={(prompt) => openCopilot(prompt)}
        />

        <CopilotDrawerModal 
          isOpen={isCopilotOpen}
          onClose={() => closeCopilot()}
          initialPrompt={copilotInitialPrompt}
        />

        <ContinueInvestigationModal 
          isOpen={isContinueModalOpen}
          onClose={() => setContinueModalOpen(false)}
          onShowToast={showToast}
        />

        {/* FIR SWITCHER MODAL */}
        <AnimatePresence>
          {isFIRSwitcherOpen && <FIRSwitcherModal />}
        </AnimatePresence>

      </div>
    </>
  );
}
