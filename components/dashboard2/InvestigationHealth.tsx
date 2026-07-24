'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ArrowUpRight, 
  ShieldAlert,
  Sliders
} from 'lucide-react';

interface InvestigationHealthProps {
  onFixWeakArea: (weakArea: string) => void;
}

export default function InvestigationHealth({ onFixWeakArea }: InvestigationHealthProps) {
  const [healthScore, setHealthScore] = useState(74);

  const weakAreas = [
    {
      id: 'w_witness',
      title: 'Witness Statements',
      detail: '2 out of 5 statements recorded',
      status: 'Critical Gap',
      impact: '-12% Health Score',
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600 border-red-200'
    },
    {
      id: 'w_digital',
      title: 'Digital Evidence Verification',
      detail: 'CCTV video hash digest pending SHA-256 certificate',
      status: 'Pending Hash',
      impact: '-8% Health Score',
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      id: 'w_weapon',
      title: 'Weapon / Tool Recovery',
      detail: 'Crowbar used for breaking lock not yet seized',
      status: 'Seizure Pending',
      impact: '-6% Health Score',
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    }
  ];

  return (
    <div className="bg-white border border-[#EBF0F5] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-[#111111] tracking-tight">
              Investigation Health
            </h3>
            <span className="text-[9px] font-mono font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Action Required
            </span>
          </div>
          <button 
            onClick={() => onFixWeakArea('Overview')}
            className="text-[10px] font-bold uppercase text-[#FF5A1F] hover:underline flex items-center gap-1"
          >
            <span>Audit Report</span>
            <ArrowUpRight size={12} />
          </button>
        </div>

        {/* Score Radial & Score breakdown */}
        <div className="flex flex-col sm:flex-row items-center gap-6 my-5">
          {/* Circular Score Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="#F3F4F6"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="#FF5A1F"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset={2 * Math.PI * 46 - (healthScore / 100) * (2 * Math.PI * 46)}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-[#111111] tracking-tight">{healthScore}%</span>
              <span className="text-[8px] font-mono font-bold text-gray-400 uppercase">Health Score</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <div className="text-xs font-bold text-gray-900">
              Dossier Readiness Level: <span className="text-[#FF5A1F]">Moderate</span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
              Court conviction probability estimated at <strong>78%</strong>. Address the 3 weak areas below to achieve <strong>90%+ conviction score</strong>.
            </p>
          </div>
        </div>

        {/* Actionable Weak Areas */}
        <div className="border-t border-gray-100 pt-3">
          <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-wider block mb-2.5">
            ⚠️ WEAK AREAS REQUIRING ATTENTION:
          </span>

          <div className="flex flex-col gap-2">
            {weakAreas.map((item) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={item.id}
                  onClick={() => onFixWeakArea(item.title)}
                  className="p-3 rounded-2xl bg-gray-50/80 hover:bg-[#FFF5F2] border border-gray-200 hover:border-[#FFE4DC] transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg border ${item.color}`}>
                      <IconComp size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900">{item.title}</span>
                      <span className="text-[9px] text-gray-500 font-medium">{item.detail}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-mono font-bold text-red-600 block">{item.impact}</span>
                    <span className="text-[8px] font-bold uppercase text-[#FF5A1F] hover:underline">Fix Now →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-gray-100 text-[9px] text-gray-400 font-medium text-center">
        Higher health scores significantly reduce defense cross-examination vulnerability.
      </div>
    </div>
  );
}
