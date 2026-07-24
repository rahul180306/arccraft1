'use client';

import React, { useState, useEffect } from 'react';
import { Mic, X, Sparkles, Volume2, Send, Bot } from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendQuery: (query: string) => void;
}

export default function VoiceAssistantModal({ isOpen, onClose, onSendQuery }: VoiceAssistantModalProps) {
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('Inspect active suspect connections for FIR KRP/2026/0456...');
  const [aiAnswer, setAiAnswer] = useState('');

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsListening(false);
        setAiAnswer("Analyzing FIR KRP/2026/0456: Suspect 'Bullet Suresh' has 4 prior burglary convictions in KR Puram station. CCTV captured a blue SUV KA-03-MN-4491 linked to his associate. Recommendation: Issue Sec 35 BNSS arrest warrant.");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19]/90 text-white flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative bg-[#111827] border border-gray-800 rounded-[32px] p-8 max-w-lg w-full shadow-2xl flex flex-col items-center text-center">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Animated Mic Wave Ring */}
        <div className="relative my-6 flex items-center justify-center">
          <div className={`w-28 h-28 rounded-full bg-[#FF5A1F]/20 flex items-center justify-center ${isListening ? 'animate-ping' : ''}`} />
          <div className="absolute w-20 h-20 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow-2xl cursor-pointer">
            <Mic size={36} className={isListening ? 'animate-pulse' : ''} />
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-[#FF5A1F] uppercase tracking-widest bg-[#FF5A1F]/10 px-3 py-1 rounded-full border border-[#FF5A1F]/20 mb-3">
          {isListening ? '🎙️ ArcCraft Voice Listening...' : '⚡ Speech Processed'}
        </span>

        <h3 className="text-lg font-black tracking-tight text-white mb-2">
          {isListening ? 'Speak your query clearly...' : `"${transcript}"`}
        </h3>

        {/* AI Answer Stream Card */}
        {aiAnswer && (
          <div className="w-full bg-gray-900 border border-[#FF5A1F]/30 p-4 rounded-2xl text-left my-4 text-xs font-medium text-gray-200 leading-relaxed shadow-inner">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-[#FF5A1F]" />
              <span className="text-[10px] font-mono font-bold text-[#FF5A1F] uppercase">ArcCraft Voice Assistant Response</span>
            </div>
            {aiAnswer}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center gap-3 w-full mt-2">
          <button
            onClick={() => {
              setIsListening(true);
              setAiAnswer('');
              setTimeout(() => {
                setIsListening(false);
                setAiAnswer("Searching CCTNS database for KA-03-MN-4491... Registered under Suresh Kumar, Whitefield. Active warrant pending.");
              }, 1800);
            }}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Ask Another Question
          </button>

          <button
            onClick={() => {
              onSendQuery(transcript);
              onClose();
            }}
            className="flex-1 bg-[#FF5A1F] hover:bg-[#e04d19] text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-[#FF5A1F]/20"
          >
            Open in Full Copilot
          </button>
        </div>
      </div>
    </div>
  );
}
