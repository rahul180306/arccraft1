'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Mic, 
  FileText, 
  Video, 
  Camera, 
  Send, 
  ArrowUpRight,
  Maximize2,
  Bot
} from 'lucide-react';
import PremiumCard from '@/components/ui/PremiumCard';
import StatusBadge from '@/components/ui/StatusBadge';

import { exportToPDF } from '@/lib/pdfExport';

interface AICopilotCardProps {
  onOpenCopilot: (initialPrompt?: string) => void;
  onOpenVoiceModal: () => void;
  onUploadFile: (type: 'fir' | 'cctv' | 'image') => void;
}

export default function AICopilotCard({ onOpenCopilot, onOpenVoiceModal, onUploadFile }: AICopilotCardProps) {
  const [promptInput, setPromptInput] = useState('');

  const quickPrompts = [
    "Suresh K. (PersonID A1) ಜಾಲ ಮತ್ತು ಅಪರಾಧ ಹಿನ್ನೆಲೆ ವಿಶ್ಲೇಷಿಸಿ (Kannada Analysis)",
    "Draft Chargesheet for FIR 104430006202600001 (Anekal PS)",
    "Cross-check Suresh K. across Bengaluru and Mysuru FIRs",
    "Identify financial mule accounts linked to SIM Swap Fraud"
  ];

  const handleExportPDF = () => {
    exportToPDF(
      "ArcCraft KSP Investigation Brief",
      `KARNATAKA STATE POLICE — CASE SUMMARY DOSSIER

FIR #104430006202600001 (Anekal Police Station, Bengaluru City)
Category: Heinous Property Crime (Night Commercial Burglary)
Primary Accused: Suresh K. (Alias "Chotte", PersonID A1 - Repeat Offender)
Stolen Property: ₹45 Lakhs Gold
Status: Chargesheeted (CSID #501 by Inspector Arjun)

FIR #104440008202600002 (Devaraja Police Station, Mysuru City)
Category: Cyber Crime & Financial Fraud (ATM SIM Swap Scam)
Primary Accused: Suresh K. (Alias "Chotte", PersonID A1 - Linked across 2 districts!)
Fraud Amount: ₹18.5 Lakhs routed to Mule Account #908122
Status: Under Investigation (IO PSI Priya R.)`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    onOpenCopilot(promptInput);
    setPromptInput('');
  };

  return (
    <PremiumCard hoverGlow="orange" padding="p-6">
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#FF5A1F]/10 via-[#FF5A1F]/5 to-transparent rounded-bl-full pointer-events-none" />

      <div>
        {/* Header Title */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#111111] flex items-center justify-center text-white shadow-md">
              <Sparkles size={18} className="text-[#FF5A1F] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#111111] tracking-tight">Ask ArcCraft</h3>
                <StatusBadge label="AI Copilot" type="ai" />
              </div>
              <p className="text-[10px] text-gray-500 font-medium leading-none mt-1">
                AI Decision Support & Investigation Reasoning Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <FileText size={13} />
              <span className="hidden sm:inline">Export PDF</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenCopilot()}
              className="flex items-center gap-1.5 text-xs font-bold text-[#FF5A1F] hover:text-[#e04d19] bg-[#FFF5F2] border border-[#FFE4DC] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <Maximize2 size={13} />
              <span className="hidden sm:inline">Fullscreen Copilot</span>
            </motion.button>
          </div>
        </div>

        {/* 4 Hero Action Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenVoiceModal}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#FFF5F2] hover:bg-[#FFEAE3] border border-[#FFE4DC] text-[#111111] transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow group-hover:scale-110 transition-transform">
              <Mic size={16} />
            </div>
            <span className="text-xs font-extrabold tracking-tight">🎤 Speak</span>
            <span className="text-[9px] text-gray-500 font-medium">Voice Command</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUploadFile('fir')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#111111] transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow group-hover:scale-110 transition-transform">
              <FileText size={16} />
            </div>
            <span className="text-xs font-extrabold tracking-tight">📄 Upload FIR</span>
            <span className="text-[9px] text-gray-500 font-medium">PDF/Document</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUploadFile('cctv')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#111111] transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow group-hover:scale-110 transition-transform">
              <Video size={16} />
            </div>
            <span className="text-xs font-extrabold tracking-tight">📹 Upload CCTV</span>
            <span className="text-[9px] text-gray-500 font-medium">Keyframe Scan</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUploadFile('image')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#111111] transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow group-hover:scale-110 transition-transform">
              <Camera size={16} />
            </div>
            <span className="text-xs font-extrabold tracking-tight">📷 Upload Image</span>
            <span className="text-[9px] text-gray-500 font-medium">Forensic Photo</span>
          </motion.button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="relative mt-2">
          <div className="flex items-center bg-[#F8FAFC] border border-gray-200 rounded-2xl px-4 py-2.5 shadow-inner focus-within:border-[#FF5A1F] focus-within:bg-white transition-all">
            <input 
              type="text" 
              placeholder="Ask ArcCraft for case analysis, witness cross-check, or legal procedure..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-gray-800 placeholder-gray-400 outline-none"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="bg-[#111111] hover:bg-[#FF5A1F] text-white p-2 rounded-xl transition-all cursor-pointer shrink-0 ml-2"
            >
              <Send size={14} />
            </motion.button>
          </div>
        </form>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
          Suggested Copilot Queries:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((qp, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenCopilot(qp)}
              className="text-[10px] font-semibold text-gray-600 hover:text-[#FF5A1F] bg-gray-50 hover:bg-[#FFF5F2] border border-gray-200 hover:border-[#FFE4DC] px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>{qp}</span>
              <ArrowUpRight size={10} />
            </motion.button>
          ))}
        </div>
      </div>
    </PremiumCard>
  );
}
