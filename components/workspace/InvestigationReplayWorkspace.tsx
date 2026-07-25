'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, ShieldAlert, Sparkles, MapPin, Search, FileText, MessageSquare, Video, HandMetal, FileCode } from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';

const REPLAY_EVENTS = [
  { time: '08:15', title: 'FIR Registered', desc: 'Case #104430006202600001 filed at KR Puram.', icon: FileText, color: 'text-blue-500' },
  { time: '08:42', title: 'Victim Statement', desc: 'Recorded statement from Complainant ID #8432.', icon: MessageSquare, color: 'text-indigo-500' },
  { time: '09:15', title: 'CCTV Uploaded', desc: 'Exit gate footage uploaded. BSA 61 Cert generated.', icon: Video, color: 'text-purple-500' },
  { time: '09:24', title: 'AI Detected Contradiction', desc: 'Vehicle color discrepancy flagged by Cognitive Engine.', icon: ShieldAlert, color: 'text-amber-500', isAI: true },
  { time: '10:30', title: 'Evidence Gap Fixed', desc: 'Latent fingerprints dispatched to FSL.', icon: Search, color: 'text-emerald-500' },
  { time: '11:15', title: 'Suspect Arrested', desc: 'Accused A1 apprehended near Hoskote.', icon: HandMetal, color: 'text-red-500' },
  { time: '14:20', title: 'Chargesheet Draft', Form: '173', desc: 'Draft generated for Section 302 BNS.', icon: FileCode, color: 'text-teal-500', isAI: true }
];

export default function InvestigationReplayWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const themeClasses = isDarkMode ? 'bg-[#0B0F19] text-white' : 'bg-slate-50 text-slate-900';
  const cardBg = isDarkMode ? 'bg-[#111827] border-gray-800' : 'bg-white border-gray-200';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < REPLAY_EVENTS.length) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev + 1 >= REPLAY_EVENTS.length) {
            setTimeout(() => setIsPlaying(false), 0);
          }
          return prev + 1;
        });
      }, 2500); // 2.5s per step
    } else if (isPlaying && currentStep >= REPLAY_EVENTS.length) {
      setTimeout(() => setIsPlaying(false), 0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  return (
    <div className={`p-8 rounded-2xl border ${cardBg} min-h-[500px] flex flex-col relative overflow-hidden`}>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            Investigation Replay <span className="text-[#FF5A1F]">⭐</span>
          </h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Cinematic playback of case evolution.
          </p>
        </div>
        
        {/* CONTROLS */}
        <div className={`flex items-center gap-2 p-1.5 rounded-xl border ${isDarkMode ? 'bg-black/50 border-gray-800' : 'bg-gray-100 border-gray-300'}`}>
          <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className={`p-2 rounded-lg hover:bg-gray-500/20`}>
            <RotateCcw size={18} />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} className={`p-2 px-6 rounded-lg bg-[#FF5A1F] text-white font-bold flex items-center gap-2 hover:scale-105 transition-transform`}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
            {isPlaying ? 'PAUSE' : currentStep >= REPLAY_EVENTS.length ? 'REPLAY' : 'PLAY'}
          </button>
          <button onClick={() => setCurrentStep(REPLAY_EVENTS.length)} className={`p-2 rounded-lg hover:bg-gray-500/20`}>
            <FastForward size={18} />
          </button>
        </div>
      </div>

      {/* TIMELINE VISUALIZATION */}
      <div className="flex-1 relative flex flex-col justify-center max-w-3xl mx-auto w-full">
        {/* Vertical Line */}
        <div className={`absolute left-[72px] top-0 bottom-0 w-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
        <motion.div 
          className="absolute left-[72px] top-0 bottom-0 w-1 bg-[#FF5A1F] origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: currentStep / Math.max(1, REPLAY_EVENTS.length - 1) }}
          transition={{ ease: "linear", duration: 0.5 }}
        />

        <div className="space-y-6 relative z-10 py-10">
          <AnimatePresence>
            {REPLAY_EVENTS.slice(0, currentStep + 1).map((event, idx) => {
              const Icon = event.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  className="flex items-start gap-6 relative"
                >
                  <div className="w-16 text-right pt-2 font-mono text-xs font-bold opacity-70">
                    {event.time}
                  </div>
                  
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 ${isDarkMode ? 'bg-gray-900 border-gray-900' : 'bg-white border-white'}`}>
                    <div className={`w-full h-full rounded-full flex items-center justify-center ${event.color.replace('text-', 'bg-').replace('500', '500/20')}`}>
                       <Icon size={16} className={event.color} />
                    </div>
                  </div>

                  <div className={`flex-1 p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'} ${event.isAI ? 'border-[#FF5A1F]/30 bg-[#FF5A1F]/5' : ''}`}>
                     <div className="flex items-center justify-between">
                       <h4 className="font-bold text-base flex items-center gap-2">
                         {event.title}
                         {event.isAI && <Sparkles size={14} className="text-[#FF5A1F]" />}
                       </h4>
                     </div>
                     <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                       {event.desc}
                     </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}