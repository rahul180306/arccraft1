'use client';

import React from 'react';
import { motion } from 'motion/react';
import { pageContainerVariants, pageItemVariants } from '@/lib/motion';
import { useUIStore } from '@/lib/stores/uiStore';
import PremiumCard from '@/components/ui/PremiumCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface GenericWorkspaceProps {
  title: string;
  description: string;
}

export default function GenericWorkspace({ title, description }: GenericWorkspaceProps) {
  const openCopilot = useUIStore((s) => s.openCopilot);

  return (
    <motion.main 
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-4 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-8 pb-36"
    >
      <motion.div variants={pageItemVariants}>
        <PremiumCard className="p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <StatusBadge label="ARCCRAFT 2.0 WORKSPACE" type="ai" />
                <StatusBadge label="LIVE CASE SYNC" type="success" />
              </div>
              <h1 
                className="text-2xl font-black text-[var(--text-primary)] mt-2"
                
              >
                {title}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            </div>

            <button 
              onClick={() => openCopilot(`Help me analyze ${title} for FIR KRP/2026/0456`)}
              className="hidden sm:flex items-center gap-2 bg-[#FF5A1F] hover:bg-[#E04D18] text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              <Sparkles size={15} />
              <span>Ask Copilot about {title}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Status</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck size={16} /> Active & Synchronized
              </span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Connected to Karnataka Police CCTNS database core.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Target Case</span>
              <span className="text-sm font-black text-gray-900 dark:text-white">
                FIR KRP/2026/0456
              </span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                House Burglary at Anekal Road • KR Puram PS
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">AI Integrity Check</span>
              <span className="text-sm font-black text-[#FF5A1F]">
                100% Audit Verified
              </span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Section 63 BSA compliance & chain of custody secured.
              </p>
            </div>
          </div>
        </PremiumCard>
      </motion.div>
    </motion.main>
  );
}
