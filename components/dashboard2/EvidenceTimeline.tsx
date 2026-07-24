'use client';

import React from 'react';
import { 
  FileText, 
  Video, 
  Fingerprint, 
  UserCheck, 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  timeLabel: string;
  title: string;
  subtitle: string;
  actor: string;
  icon: any;
  status: 'Completed' | 'Pending Today' | 'Scheduled';
  badgeColor: string;
}

export default function EvidenceTimeline() {
  const events: TimelineEvent[] = [
    {
      id: 'e1',
      timeLabel: 'Yesterday 09:30 AM',
      title: 'FIR KRP/2026/0456 Registered',
      subtitle: 'Complainant statement logged at KR Puram Station',
      actor: 'WPC Bhavya',
      icon: FileText,
      status: 'Completed',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'e2',
      timeLabel: 'Yesterday 02:15 PM',
      title: 'Victim Statement Recorded',
      subtitle: 'Recorded under Sec 180 BNSS (Ramesh Kumar)',
      actor: 'IO Inspector Arjun',
      icon: UserCheck,
      status: 'Completed',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'e3',
      timeLabel: 'Yesterday 07:45 PM',
      title: 'CCTV Exit Gate Video Ingested',
      subtitle: 'Camera #3 footage imported (SHA-256 Hash verified)',
      actor: 'ArcCraft AI Ingestion',
      icon: Video,
      status: 'Completed',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'e4',
      timeLabel: 'Today 08:00 AM',
      title: 'Forensic Fingerprint AFIS Match',
      subtitle: 'Match found with history record (Accused Suresh @ Bullet Suresh)',
      actor: 'FSL Lab Bangalore',
      icon: Fingerprint,
      status: 'Completed',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'e5',
      timeLabel: 'Today 10:15 AM',
      title: 'Suspect Custody & Arrest Seizure',
      subtitle: 'Arrest memo compiled & medical examination completed',
      actor: 'PSI Mahesh',
      icon: UserCheck,
      status: 'Completed',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'e6',
      timeLabel: 'Today 05:00 PM',
      title: 'Final Chargesheet Draft Review',
      subtitle: 'Pending IO Arjun signature & DSP review upload',
      actor: 'Inspector Arjun',
      icon: FileCheck,
      status: 'Pending Today',
      badgeColor: 'bg-amber-100 text-amber-800 animate-pulse'
    }
  ];

  return (
    <div className="bg-white border border-[#EBF0F5] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#FF5A1F]" />
            <h3 className="text-base font-extrabold text-[#111111] tracking-tight">
              Investigation Evidence Timeline
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#FF5A1F] uppercase tracking-widest bg-[#FFF5F2] px-2.5 py-1 rounded-full border border-[#FFE4DC]">
            Live Event Feed
          </span>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-gray-200 ml-4 my-5 space-y-5">
          {events.map((ev) => {
            const IconComp = ev.icon;
            return (
              <div key={ev.id} className="relative pl-6 group">
                {/* Timeline node icon */}
                <div className={`absolute -left-[15px] top-0.5 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${ev.status === 'Completed' ? 'bg-[#111111] text-[#FF5A1F]' : 'bg-[#FF5A1F] text-white animate-bounce'}`}>
                  <IconComp size={13} />
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      {ev.timeLabel}
                    </span>
                    <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${ev.badgeColor}`}>
                      {ev.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-gray-900 group-hover:text-[#FF5A1F] transition-colors">
                    {ev.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-medium">
                    {ev.subtitle}
                  </p>
                  <span className="text-[9px] font-mono font-bold text-gray-400">
                    By: {ev.actor}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 text-[10px] text-gray-400 font-medium flex items-center justify-between">
        <span>Timeline automatically synced with Station Diary & CCTNS Portal.</span>
      </div>
    </div>
  );
}
