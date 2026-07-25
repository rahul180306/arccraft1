'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Video, FileText, Scale } from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';

interface UnitStatus {
  name: string;
  iconClass: string;
  statusText: string;
  progress: number;
  isActive: boolean;
  isComplete: boolean;
  color: string;
}

interface ActiveUnitsMonitorProps {
  currentPhaseIndex: number;
  isSimulating: boolean;
}

export default function ActiveUnitsMonitor({ currentPhaseIndex, isSimulating }: ActiveUnitsMonitorProps) {
  const isDarkMode = useUIStore((s) => s.isDarkMode);

  const [units, setUnits] = useState<UnitStatus[]>([
    {
      name: 'Investigation Orchestrator',
      iconClass: 'fi fi-ss-brain-circuit',
      statusText: 'Standing By',
      progress: 0,
      isActive: false,
      isComplete: false,
      color: 'text-[#FF5A1F] bg-[#FF5A1F]/10 border-[#FF5A1F]/30',
    },
    {
      name: 'Video Intelligence Agent',
      iconClass: 'fi fi-sr-camera',
      statusText: 'Standing By',
      progress: 0,
      isActive: false,
      isComplete: false,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    },
    {
      name: 'Evidence Audit Agent',
      iconClass: 'fi fi-sr-fingerprint',
      statusText: 'Standing By',
      progress: 0,
      isActive: false,
      isComplete: false,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    },
    {
      name: 'Report Compilation Agent',
      iconClass: 'fi fi-sr-newspaper',
      statusText: 'Standing By',
      progress: 0,
      isActive: false,
      isComplete: false,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    }
  ]);

  useEffect(() => {
    let tickInterval: any;

    const frameId = requestAnimationFrame(() => {
      if (!isSimulating && currentPhaseIndex === -1) {
        setUnits(prev => prev.map(u => ({ ...u, statusText: 'Standing By', progress: 0, isActive: false, isComplete: false })));
        return;
      }

      if (currentPhaseIndex >= 5) {
        setUnits(prev => prev.map(u => ({ ...u, statusText: 'Completed', progress: 100, isActive: false, isComplete: true })));
        return;
      }

      setUnits(prev => {
        const newUnits = [...prev];
        
        // Orchestrator
        if (currentPhaseIndex === 0 || currentPhaseIndex === 3) {
          newUnits[0].isActive = true;
          newUnits[0].statusText = currentPhaseIndex === 0 ? 'Coordinating Investigation' : 'Resolving Conflicts';
          newUnits[0].progress = currentPhaseIndex === 0 ? 30 : 80;
        } else {
          newUnits[0].isActive = false;
          newUnits[0].statusText = currentPhaseIndex > 0 ? 'Monitoring' : 'Standing By';
          newUnits[0].progress = currentPhaseIndex > 0 ? 100 : 0;
          newUnits[0].isComplete = currentPhaseIndex > 0;
        }

        // Evidence & Video
        if (currentPhaseIndex === 1) {
          newUnits[1].isActive = true;
          newUnits[1].statusText = 'Scanning CCTV_014.mp4...';
          newUnits[1].progress = 65;
          
          newUnits[2].isActive = true;
          newUnits[2].statusText = 'Matching AFIS-FP-01...';
          newUnits[2].progress = 70;
        } else if (currentPhaseIndex > 1) {
          newUnits[1].isActive = false;
          newUnits[1].statusText = 'Completed';
          newUnits[1].progress = 100;
          newUnits[1].isComplete = true;

          newUnits[2].isActive = false;
          newUnits[2].statusText = 'Completed';
          newUnits[2].progress = 100;
          newUnits[2].isComplete = true;
        }

        // Legal
        if (currentPhaseIndex === 4) {
          newUnits[3].isActive = true;
          newUnits[3].statusText = 'Validating BNSS Sections...';
          newUnits[3].progress = 85;
        } else if (currentPhaseIndex > 4) {
          newUnits[3].isActive = false;
          newUnits[3].statusText = 'Verified';
          newUnits[3].progress = 100;
          newUnits[3].isComplete = true;
        }

        return newUnits;
      });
    });

    if (isSimulating) {
      tickInterval = setInterval(() => {
        setUnits(prev => prev.map(u => {
          if (u.isActive && u.progress < 98) {
            return { ...u, progress: u.progress + Math.floor(Math.random() * 5) + 1 };
          }
          return u;
        }));
      }, 500);
    }

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(tickInterval);
    };
  }, [currentPhaseIndex, isSimulating]);


  if (!isSimulating && currentPhaseIndex < 0) return null;

  const completedUnits = units.filter(u => u.isComplete).length;
  const overallProgress = Math.floor((units.reduce((acc, u) => acc + Math.min(u.progress, 100), 0)) / units.length);

  return (
    <div className={`w-full p-3 border-b flex flex-col gap-3 ${isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-gray-50 border-gray-200'} shrink-0`}>
      
      {/* OVERALL PROGRESS: Evidence Collection */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#111115] border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex flex-col gap-1.5 w-full sm:max-w-md">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#FF5A1F]">
            <span>Investigation Progress</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              className="absolute top-0 left-0 h-full bg-[#FF5A1F]"
            />
          </div>
        </div>
        <div className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-400 shrink-0">
          {completedUnits}/{units.length} Units Complete
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {units.map((unit, idx) => {
        return (
          <div key={idx} className={`flex flex-col gap-1.5 p-2.5 rounded-lg border transition-all ${
            unit.isActive 
              ? `${unit.color.split(' ')[1]} ${unit.color.split(' ')[2]} shadow-sm` 
              : isDarkMode ? 'bg-[#111115] border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              <i className={`${unit.iconClass} text-xs flex items-center justify-center ${unit.isActive ? unit.color.split(' ')[0] : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}></i>
              <span className={`text-[9px] font-black uppercase tracking-wider truncate ${
                unit.isActive ? unit.color.split(' ')[0] : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
              }`}>
                {unit.name}
              </span>
            </div>
            
            <div className={`text-[10px] font-medium truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {unit.statusText}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(unit.progress, 100)}%` }}
                  className={`absolute top-0 left-0 h-full ${
                    unit.isActive ? unit.color.split(' ')[0].replace('text-', 'bg-') : (unit.isComplete ? 'bg-emerald-500' : 'bg-gray-400')
                  }`}
                />
              </div>
              <span className={`text-[9px] font-mono font-bold w-6 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {Math.min(unit.progress, 100)}%
              </span>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
