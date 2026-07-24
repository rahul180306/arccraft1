'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Activity, Check, Clock, AlertTriangle, X } from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';

interface InvestigationHealthGaugeProps {
  score: number;
  health: {
    evidence: string;
    timeline: string;
    legal: string;
    witnesses: string;
    digital: string;
  };
}

export default function InvestigationHealthGauge({ score, health }: InvestigationHealthGaugeProps) {
  const isDarkMode = useUIStore((s) => s.isDarkMode);

  // Calculate circumference for the SVG circle (r=36 -> c=2*pi*r)
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
      case 'excellent':
      case 'verified':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'pending':
      case 'weak':
      case 'processing':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'missing':
      case 'failed':
      case 'critical':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
      case 'excellent':
      case 'verified':
        return <Check size={10} />;
      case 'pending':
      case 'weak':
      case 'processing':
        return <Clock size={10} />;
      case 'missing':
      case 'failed':
      case 'critical':
        return <AlertTriangle size={10} />;
      default:
        return <Activity size={10} />;
    }
  };

  return (
    <div className={`p-4 rounded-xl border-2 flex flex-col sm:flex-row items-center gap-6 ${
      isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-white border-gray-200'
    }`}>
      
      {/* Gauge */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-24 h-24 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className={isDarkMode ? 'text-gray-800' : 'text-gray-200'}
          />
          {/* Progress circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-xl font-black tracking-tighter ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {score}%
          </span>
          <span className={`text-[8px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Health
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="flex-1 w-full grid grid-cols-2 gap-2">
        {Object.entries(health).map(([category, status]) => (
          <div key={category} className={`flex items-center justify-between p-2 rounded-lg border ${
            isDarkMode ? 'bg-[#111115] border-gray-800/50' : 'bg-gray-50 border-gray-200/50'
          }`}>
            <span className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {category}
            </span>
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
              {status}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
