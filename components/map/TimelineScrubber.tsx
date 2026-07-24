'use client';

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Calendar, Clock, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineScrubberProps {
  isDarkMode: boolean;
  onTimeframeChange: (timeframe: string) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export default function TimelineScrubber({
  isDarkMode,
  onTimeframeChange,
  onPlayStateChange
}: TimelineScrubberProps) {
  const [activePreset, setActivePreset] = useState<'today' | 'yesterday' | '7days' | '30days' | 'custom'>('7days');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(70);

  const presets = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: '7days', label: '7 Days' },
    { id: '30days', label: '30 Days' },
    { id: 'custom', label: 'Custom' }
  ] as const;

  const handlePresetSelect = (id: typeof activePreset) => {
    setActivePreset(id);
    onTimeframeChange(id);
  };

  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (onPlayStateChange) onPlayStateChange(next);
  };

  return (
    <div className={`w-full p-3 rounded-2xl backdrop-blur-2xl border transition-all shadow-2xl ${
      isDarkMode 
        ? 'bg-[#0F172A]/90 border-gray-800 text-white' 
        : 'bg-white/95 border-slate-200 text-slate-800'
    }`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Play / Pause & Live Playback Control */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={togglePlay}
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white transition-all cursor-pointer shadow-md ${
              isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#FF5A1F] hover:bg-[#FF5A1F]/90'
            }`}
            title={isPlaying ? 'Pause Incident Animation' : 'Play Timeline Incident Simulation'}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#FF5A1F] flex items-center gap-1">
                <Activity size={12} className="animate-pulse" /> Live Timeline Playback
              </span>
              <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded-md">
                12 Incidents Filtered
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              Simulating incident progression across Karnataka State
            </span>
          </div>
        </div>

        {/* Timeline Slider Track */}
        <div className="flex-1 w-full flex items-center gap-3 px-2">
          <span className="text-[10px] font-mono font-bold text-gray-400">16 JUL</span>
          <div className="relative flex-1 h-2 bg-gray-800 rounded-full cursor-pointer overflow-hidden border border-gray-700/50">
            <motion.div 
              className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#FF5A1F] to-amber-400 rounded-full"
              style={{ width: `${progress}%` }}
              animate={isPlaying ? { width: ['10%', '100%'] } : {}}
              transition={isPlaying ? { repeat: Infinity, duration: 8, ease: 'linear' } : {}}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-[#FF5A1F]">TODAY</span>
        </div>

        {/* Presets Selector */}
        <div className="flex items-center gap-1 bg-gray-800/60 p-1 rounded-xl border border-gray-700/60 shrink-0">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                activePreset === preset.id
                  ? 'bg-[#FF5A1F] text-white shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
