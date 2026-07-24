'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileImage, ShieldCheck, User, Fingerprint, Activity, Clock, Database, ArrowUpRight } from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';

interface EvidenceViewerModalProps {
  evidenceId: string | null;
  onClose: () => void;
}

export default function EvidenceViewerModal({ evidenceId, onClose }: EvidenceViewerModalProps) {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  
  if (!evidenceId) return null;

  // Mock details based on ID
  const isVideo = evidenceId.toLowerCase().includes('cctv') || evidenceId.toLowerCase().includes('frame');
  const isFingerprint = evidenceId.toLowerCase().includes('afis') || evidenceId.toLowerCase().includes('fp');
  
  const evidenceTitle = isVideo 
    ? 'CCTV Surveillance Frame' 
    : isFingerprint 
      ? 'AFIS Biometric Scan' 
      : 'Digital Evidence Record';

  const Icon = isVideo ? FileImage : isFingerprint ? Fingerprint : Database;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border ${
            isDarkMode ? 'bg-[#111115] border-gray-800' : 'bg-white border-gray-200'
          }`}
        >
          {/* Header */}
          <div className={`p-4 border-b flex items-center justify-between ${
            isDarkMode ? 'border-gray-800 bg-[#18181C]' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isVideo ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'
              }`}>
                <Icon size={16} />
              </div>
              <div>
                <h3 className={`text-sm font-black tracking-tight ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {evidenceTitle}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    {isVideo ? 'CCTV Connector' : isFingerprint ? 'AFIS Connector' : 'Modular Evidence Connector'}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">ID: {evidenceId}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
              }`}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            {/* Visual Placeholder */}
            <div className={`w-full h-48 rounded-xl mb-5 flex flex-col items-center justify-center border-2 border-dashed ${
              isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-gray-50 border-gray-300'
            }`}>
              {isVideo ? (
                <>
                  <div className="relative">
                    <FileImage size={48} className="text-gray-400 opacity-20" />
                    <div className="absolute inset-0 border-2 border-red-500 rounded border-dashed opacity-50" />
                  </div>
                  <span className="mt-2 text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">ENHANCED FRAME #294</span>
                </>
              ) : (
                <>
                  <Fingerprint size={48} className="text-gray-400 opacity-20" />
                  <span className="mt-2 text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">MINUTIAE MATCH DETECTED</span>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-1.5 mb-1 text-gray-500">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Timestamp</span>
                </div>
                <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  10 Feb 2026, 02:14:33 AM
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-1.5 mb-1 text-emerald-500">
                  <ShieldCheck size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Chain of Custody</span>
                </div>
                <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Verified (SHA-256 Hash Intact)
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-1.5 mb-1 text-blue-500">
                  <Activity size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">AI Confidence</span>
                </div>
                <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {isVideo ? '96.4%' : '94.2%'} Match Score
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-1.5 mb-1 text-purple-500">
                  <User size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Associated With</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline cursor-pointer">
                  <span>FIR KRP/2026/0456</span>
                  <ArrowUpRight size={10} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
