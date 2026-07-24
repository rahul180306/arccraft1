'use client';

import React, { memo } from 'react';
import { motion } from 'motion/react';
import { pageContainerVariants, pageItemVariants } from '@/lib/motion';
import { useUIStore } from '@/lib/stores/uiStore';

import TopMetricsRow from '@/components/dashboard2/TopMetricsRow';
import KarnatakaMap from '@/components/map/KarnatakaMap';
import LeftInvestigationPanel from '@/components/dashboard2/LeftInvestigationPanel';
import RightIntelligencePanel from '@/components/dashboard2/RightIntelligencePanel';

function DashboardWorkspaceComponent() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const showToast = useUIStore((s) => s.showToast);
  const openCopilot = useUIStore((s) => s.openCopilot);
  const setContinueModalOpen = useUIStore((s) => s.setContinueModalOpen);

  return (
    <motion.main 
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-3 sm:p-5 max-w-[1850px] w-full mx-auto flex flex-col gap-4 pb-20"
    >
      {/* TOP METRICS & PRIORITY CASE ROW */}
      <motion.div variants={pageItemVariants}>
        <TopMetricsRow 
          isDarkMode={isDarkMode} 
          onOpenCase={() => setContinueModalOpen(true)}
          onShowToast={showToast}
        />
      </motion.div>

      {/* FULL-SCREEN COMMAND CENTER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT PANEL: INVESTIGATION HEALTH & QUICK ACTIONS */}
        <motion.div variants={pageItemVariants} className="lg:col-span-3 flex flex-col gap-4">
          <LeftInvestigationPanel
            isDarkMode={isDarkMode}
            onContinueInvestigation={() => setContinueModalOpen(true)}
            onOpenCopilot={openCopilot}
            onShowToast={showToast}
          />
        </motion.div>

        {/* CENTER HERO: KARNATAKA STATE MAP */}
        <motion.div variants={pageItemVariants} className="lg:col-span-6 flex flex-col gap-4">
          <KarnatakaMap
            isDarkMode={isDarkMode}
            onSelectDistrict={(dist) => {
              if (dist) showToast(`Command Center Focused on ${dist.name} District`);
            }}
            onSelectIncident={(inc) => showToast(`Selected Incident ${inc.firNumber}`)}
            onShowToast={showToast}
          />
        </motion.div>

        {/* RIGHT PANEL: REAL-TIME INTELLIGENCE & JOBS */}
        <motion.div variants={pageItemVariants} className="lg:col-span-3 flex flex-col gap-4">
          <RightIntelligencePanel
            isDarkMode={isDarkMode}
            onOpenCopilot={openCopilot}
            onShowToast={showToast}
          />
        </motion.div>
      </div>
    </motion.main>
  );
}

export const DashboardWorkspace = memo(DashboardWorkspaceComponent);
export default DashboardWorkspace;

