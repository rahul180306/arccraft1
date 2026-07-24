'use client';

import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  FileSpreadsheet, 
  UserX, 
  ArrowUpRight 
} from 'lucide-react';

interface LiveAlertsProps {
  onTakeAction: (alertTitle: string) => void;
}

export default function LiveAlerts({ onTakeAction }: LiveAlertsProps) {
  const alerts = [
    {
      id: 'a1',
      title: 'Chargesheet Due Tomorrow',
      detail: 'FIR KRP/2026/0312 — 90-day statutory limit approaching under Sec 193 BNSS.',
      time: 'Urgent (24h)',
      type: 'danger',
      icon: FileSpreadsheet
    },
    {
      id: 'a2',
      title: 'Witness Statement Overdue',
      detail: 'Key witness Kavitha (Mobile: 98450XXXXX) uncontactable for 48 hours.',
      time: '48h Overdue',
      type: 'warning',
      icon: UserX
    },
    {
      id: 'a3',
      title: 'Forensics (FSL) Report Delayed',
      detail: 'Cyber hard drive extraction report pending at FSL Bangalore for 14 days.',
      time: 'Delayed 3 days',
      type: 'warning',
      icon: Clock
    },
    {
      id: 'a4',
      title: 'Supervisor Review Pending',
      detail: 'DSP approval required for adding Section 303 (House Breaking) to FIR.',
      time: 'Awaiting Sign',
      type: 'info',
      icon: ShieldAlert
    }
  ];

  return (
    <div className="bg-white border border-[#EBF0F5] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <h3 className="text-base font-extrabold text-[#111111] tracking-tight">
              Action Required (Operational Alerts)
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            {alerts.length} Pending
          </span>
        </div>

        <div className="flex flex-col gap-3 my-4">
          {alerts.map((al) => {
            const IconComp = al.icon;
            return (
              <div 
                key={al.id}
                onClick={() => onTakeAction(al.title)}
                className="p-3.5 rounded-2xl border border-gray-100 hover:border-red-200 hover:bg-red-50/30 transition-all cursor-pointer flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 ${al.type === 'danger' ? 'bg-red-100 text-red-600' : al.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-600'}`}>
                    <IconComp size={16} />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                        {al.title}
                      </span>
                      <span className="text-[8px] font-mono font-bold uppercase text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                        {al.time}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium leading-normal mt-0.5">
                      {al.detail}
                    </p>
                  </div>
                </div>

                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-red-600 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 text-[10px] text-gray-400 font-medium text-center">
        West Midlands Police Operational Standard: Resolving alerts within 24h boosts conviction speed by 3.2x.
      </div>
    </div>
  );
}
