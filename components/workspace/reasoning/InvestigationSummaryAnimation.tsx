import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Database, Users, AlertTriangle, Activity, FileText } from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';

// Helper component for counting up numbers
const Counter = ({ from, to, duration = 2, decimals = 0, suffix = "" }: { from: number, to: number, duration?: number, decimals?: number, suffix?: string }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = from + (to - from) * easeProgress;
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration]);

  return <span>{count.toFixed(decimals)}{suffix}</span>;
};

export default function InvestigationSummaryAnimation() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`w-full p-4 sm:p-6 rounded-2xl border-2 shadow-2xl relative overflow-hidden my-4 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-[#1A1A1F] to-[#0D0D11] border-[#FF5A1F]/30' 
          : 'bg-gradient-to-br from-white to-orange-50 border-[#FF5A1F]/30'
      }`}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-[#FF5A1F]/10 blur-3xl" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-[#FF5A1F] flex items-center justify-center text-white shadow-lg shadow-[#FF5A1F]/20">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Investigation Complete
          </h3>
          <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-[#FF5A1F]' : 'text-[#e04e18]'}`}>
            Multi-Agent Consensus Reached
          </p>
        </div>
      </div>
      
      <div className={`w-full h-px mb-6 relative z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 relative z-10">
        
        {/* Evidence Reviewed */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            <Database size={12} /> Evidence
          </span>
          <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Counter from={0} to={124} />
          </span>
        </motion.div>

        {/* Entities Connected */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            <Users size={12} /> Entities
          </span>
          <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Counter from={0} to={39} />
          </span>
        </motion.div>

        {/* Specialist Units */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            <ShieldCheck size={12} /> Units
          </span>
          <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Counter from={0} to={5} />
          </span>
        </motion.div>

        {/* Conflicts Resolved */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-col">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            <AlertTriangle size={12} /> Conflicts
          </span>
          <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Counter from={0} to={3} />
          </span>
        </motion.div>

        {/* Investigation Confidence */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="flex flex-col sm:col-span-2">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            <Activity size={12} /> Confidence
          </span>
          <span className="text-3xl font-black text-emerald-500">
            <Counter from={0} to={95.2} decimals={1} suffix="%" />
          </span>
        </motion.div>

      </div>
      
      <div className={`w-full h-px mb-4 relative z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10"
      >
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
            Decision Record
          </span>
          <span className={`text-sm font-mono font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            AI-30291
          </span>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm ${
          isDarkMode ? 'bg-blue-900/40 border-blue-800 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          <FileText size={14} />
          <span className="text-xs font-black tracking-tight">Executive Brief Ready</span>
        </div>
      </motion.div>

    </motion.div>
  );
}
