'use client';

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Briefcase, 
  Sparkles, 
  Video, 
  Fingerprint, 
  FileText, 
  UserX, 
  Car, 
  Network, 
  Clock, 
  ShieldCheck, 
  X, 
  ArrowRight,
  Command as CmdIcon
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionName: string, detail?: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onSelectAction }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === 'Escape') {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          if (isOpen) onClose();
          else onSelectAction('ToggleCommandPalette');
        } else if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [isOpen, onClose, onSelectAction]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#0B0F19]/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-fadeIn">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-[#111827] border border-gray-800 rounded-[28px] shadow-2xl overflow-hidden text-white flex flex-col"
        >
          <Command className="w-full flex flex-col">
            {/* Command Input Header */}
            <div className="flex items-center px-5 py-4 border-b border-gray-800 bg-gray-900/80">
              <Search className="w-5 h-5 text-[#FF5A1F] mr-3 shrink-0" />
              <Command.Input 
                value={query}
                onValueChange={setQuery}
                placeholder="Type a command, search FIR KRP/2026/0456, suspect, or trigger AI action..."
                className="w-full bg-transparent text-sm font-semibold text-white placeholder-gray-500 outline-none"
              />
              <button 
                onClick={onClose}
                className="p-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
              >
                <X size={16} />
              </button>
            </div>

            {/* Command List Items */}
            <Command.List className="p-3 max-h-[380px] overflow-y-auto space-y-2 scrollbar-thin" data-lenis-prevent>
              <Command.Empty className="py-8 text-center text-xs text-gray-400 font-medium">
                No police records or commands found matching &quot;{query}&quot;.
              </Command.Empty>

              {/* Quick AI Actions Group */}
              <Command.Group heading="⚡ ArcCraft AI Copilot Actions" className="text-[10px] font-mono font-bold uppercase text-[#FF5A1F] px-3 py-1">
                <Command.Item
                  onSelect={() => {
                    onSelectAction('CopilotQuery', 'Analyze FIR KRP/2026/0456 overview');
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-[#FF5A1F]/15 border border-transparent hover:border-[#FF5A1F]/30 cursor-pointer flex items-center justify-between text-xs font-bold text-gray-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FF5A1F]/20 text-[#FF5A1F] flex items-center justify-center font-bold">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div className="text-white">Ask ArcCraft AI Copilot</div>
                      <div className="text-[10px] text-gray-400 font-normal">Generate intelligence summary for FIR KRP/2026/0456</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded">AI Command</span>
                </Command.Item>

                <Command.Item
                  onSelect={() => {
                    onSelectAction('DraftChargesheet');
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-emerald-500/15 border border-transparent hover:border-emerald-500/30 cursor-pointer flex items-center justify-between text-xs font-bold text-gray-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="text-white">Generate Form 173 Chargesheet Draft</div>
                      <div className="text-[10px] text-gray-400 font-normal">Automated BNSS statutory legal drafting</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Form 173</span>
                </Command.Item>
              </Command.Group>

              {/* Active Investigations Group */}
              <Command.Group heading="📁 Active Case Dossiers" className="text-[10px] font-mono font-bold uppercase text-gray-400 px-3 py-1">
                <Command.Item
                  onSelect={() => {
                    onSelectAction('OpenCase', 'FIR KRP/2026/0456');
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-gray-800 border border-transparent hover:border-gray-700 cursor-pointer flex items-center justify-between text-xs font-bold text-gray-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <div className="text-white">FIR KRP/2026/0456 — House Burglary</div>
                      <div className="text-[10px] text-gray-400 font-normal">Anekal Road • IO Inspector Arjun • 78% Conviction Score</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">ACTIVE</span>
                </Command.Item>

                <Command.Item
                  onSelect={() => {
                    onSelectAction('OpenCase', 'FIR KRP/2026/0412');
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-gray-800 border border-transparent hover:border-gray-700 cursor-pointer flex items-center justify-between text-xs font-bold text-gray-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <div className="text-white">FIR KRP/2026/0412 — Chain Snatching</div>
                      <div className="text-[10px] text-gray-400 font-normal">MG Road • WPC Bhavya • CCTV Ingested</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">PENDING</span>
                </Command.Item>
              </Command.Group>

              {/* Intelligence & Evidence Search */}
              <Command.Group heading="🔍 Intelligence Entity Query" className="text-[10px] font-mono font-bold uppercase text-gray-400 px-3 py-1">
                <Command.Item
                  onSelect={() => {
                    onSelectAction('SearchEntity', 'Accused: Bullet Suresh');
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-gray-800 border border-transparent hover:border-gray-700 cursor-pointer flex items-center justify-between text-xs font-bold text-gray-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <UserX size={16} className="text-red-400" />
                    <span>Suspect: Suresh @ Bullet Suresh (AFIS 89% Match)</span>
                  </div>
                  <ArrowRight size={14} className="text-gray-500" />
                </Command.Item>

                <Command.Item
                  onSelect={() => {
                    onSelectAction('SearchEntity', 'Vehicle: KA-03-MN-4491');
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-gray-800 border border-transparent hover:border-gray-700 cursor-pointer flex items-center justify-between text-xs font-bold text-gray-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Car size={16} className="text-emerald-400" />
                    <span>Vehicle: Blue SUV KA-03-MN-4491 (Vahan Lookup)</span>
                  </div>
                  <ArrowRight size={14} className="text-gray-500" />
                </Command.Item>

                <Command.Item
                  onSelect={() => {
                    onSelectAction('OpenGraph');
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-gray-800 border border-transparent hover:border-gray-700 cursor-pointer flex items-center justify-between text-xs font-bold text-gray-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Network size={16} className="text-purple-400" />
                    <span>View Interactive Entity Relationship Link Analysis</span>
                  </div>
                  <ArrowRight size={14} className="text-gray-500" />
                </Command.Item>
              </Command.Group>
            </Command.List>

            {/* Footer hints */}
            <div className="p-3 bg-gray-900 border-t border-gray-800 text-[10px] text-gray-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded border border-gray-700">↑↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded border border-gray-700">↵</kbd> select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded border border-gray-700">ESC</kbd> close
                </span>
              </div>
              <span className="font-mono font-bold text-[#FF5A1F]">ArcCraft Command v2.0</span>
            </div>
          </Command>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
