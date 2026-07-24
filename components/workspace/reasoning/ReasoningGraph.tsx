'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Database, GitCommit, Scale, FileText } from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';

interface ReasoningGraphProps {
  evidenceList: string[];
  findings: string[];
  decision: string;
}

export default function ReasoningGraph({ evidenceList, findings, decision }: ReasoningGraphProps) {
  const isDarkMode = useUIStore((s) => s.isDarkMode);

  // Example structured tree:
  // Evidence nodes -> Findings -> Final Decision
  // For demo, we just map all evidence to the first finding, and all findings to the decision.

  return (
    <div className={`p-6 rounded-xl border-2 flex flex-col items-center overflow-x-auto ${
      isDarkMode ? 'bg-[#1C1C21] border-gray-800' : 'bg-white border-gray-200'
    }`}>
      
      {/* Level 1: Evidence Nodes */}
      <div className="flex gap-4 mb-8">
        {evidenceList.map((ev, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex flex-col items-center gap-2 relative`}
          >
            <div className={`px-3 py-2 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-sm ${
              isDarkMode ? 'bg-[#111115] border-gray-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <Database size={12} />
              {ev}
            </div>
            {/* Downward line */}
            <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
          </motion.div>
        ))}
      </div>

      {/* Level 2: Findings */}
      <div className="flex gap-6 mb-8 relative">
        {/* Horizontal connector line if multiple evidence above */}
        {evidenceList.length > 1 && (
          <div className={`absolute -top-8 left-1/2 -translate-x-1/2 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} 
               style={{ width: `calc(100% - ${(100 / evidenceList.length)}%)` }} 
          />
        )}
        
        {findings.map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className="flex flex-col items-center gap-2 relative"
          >
            {/* Top connection point */}
            <div className={`w-px h-8 absolute -top-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            
            <div className={`max-w-[200px] text-center px-4 py-2 rounded-xl border text-xs font-semibold shadow-sm flex items-center gap-2 ${
              isDarkMode ? 'bg-[#272730] border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'
            }`}>
              <GitCommit size={14} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
              {f}
            </div>

            {/* Downward line */}
            <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
          </motion.div>
        ))}
      </div>

      {/* Level 3: Decision */}
      <div className="relative flex flex-col items-center">
        {/* Horizontal connector line if multiple findings above */}
        {findings.length > 1 && (
          <div className={`absolute -top-8 left-1/2 -translate-x-1/2 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} 
               style={{ width: `calc(100% - ${(100 / findings.length)}%)` }} 
          />
        )}
        
        {/* Top connection point */}
        <div className={`w-px h-8 absolute -top-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className={`px-6 py-3 rounded-2xl border-2 flex flex-col items-center gap-1 shadow-lg ${
            isDarkMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-800'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Scale size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Final Conclusion</span>
          </div>
          <p className="text-sm font-bold text-center max-w-[300px]">{decision}</p>
        </motion.div>
      </div>

    </div>
  );
}
