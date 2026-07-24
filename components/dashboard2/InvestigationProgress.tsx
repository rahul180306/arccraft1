'use client';

import React from 'react';
import { Layers, CheckCircle2, Clock } from 'lucide-react';

interface Stage {
  name: string;
  percent: number;
  status: 'Complete' | 'In Progress' | 'Pending';
  details: string;
  color: string;
}

export default function InvestigationProgress() {
  const stages: Stage[] = [
    { name: 'Case Registration & FIR', percent: 100, status: 'Complete', details: 'FIR KRP/2026/0456 registered at KR Puram PS', color: 'bg-emerald-500' },
    { name: 'Physical Evidence Collection', percent: 75, status: 'In Progress', details: '3 items seized from scene, 1 item pending lab seal', color: 'bg-[#FF5A1F]' },
    { name: 'Witness & Victim Statements', percent: 60, status: 'In Progress', details: '2 statements recorded, Ramesh Kumar interview pending', color: 'bg-[#FF5A1F]' },
    { name: 'Forensic Lab (FSL) Reports', percent: 40, status: 'In Progress', details: 'Fingerprint match complete (89%), Digital CDR pending', color: 'bg-amber-500' },
    { name: 'Chargesheet Drafting (Form 173)', percent: 20, status: 'Pending', details: 'Drafting initiated, awaiting IO signature', color: 'bg-gray-400' },
  ];

  return (
    <div className="bg-white border border-[#EBF0F5] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-[#FF5A1F]" />
            <h3 className="text-base font-extrabold text-[#111111] tracking-tight">
              Investigation Progress Tracker
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-full">
            Stage 2 of 5 Active
          </span>
        </div>

        <div className="flex flex-col gap-4 my-4">
          {stages.map((stage) => (
            <div key={stage.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-800">{stage.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${stage.status === 'Complete' ? 'bg-emerald-100 text-emerald-800' : stage.status === 'In Progress' ? 'bg-[#FFF5F2] text-[#FF5A1F]' : 'bg-gray-100 text-gray-600'}`}>
                    {stage.status}
                  </span>
                  <span className="font-mono font-black text-gray-900">{stage.percent}%</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 rounded-full ${stage.color}`}
                  style={{ width: `${stage.percent}%` }}
                />
              </div>

              <span className="text-[9px] text-gray-400 font-medium">{stage.details}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 text-[10px] text-gray-400 font-medium">
        Target Chargesheet Submission: <strong>Within 60 Days (Sec 193 BNSS)</strong>
      </div>
    </div>
  );
}
