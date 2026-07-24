'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  Fingerprint, 
  UserX, 
  PhoneCall, 
  Car, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface AIRecommendationsProps {
  onExecuteRecommendation: (title: string) => void;
}

export default function AIRecommendations({ onExecuteRecommendation }: AIRecommendationsProps) {
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const recommendations = [
    {
      id: 'rec_cctv',
      title: 'Collect CCTV from Exit Gate',
      description: 'Camera #3 recorded blue SUV exiting compound at 03:14 AM.',
      category: 'Digital Evidence',
      priority: 'HIGH',
      icon: Video,
      color: 'bg-red-50 text-red-600 border-red-200',
      actionText: 'Request Video Feed'
    },
    {
      id: 'rec_fingerprint',
      title: 'Fingerprint not uploaded to AFIS',
      description: 'Latent prints lifted from safe handle need CCTNS automated fingerprint verification.',
      category: 'Forensics',
      priority: 'HIGH',
      icon: Fingerprint,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      actionText: 'Upload to AFIS'
    },
    {
      id: 'rec_witness',
      title: 'Witness Ramesh not questioned',
      description: 'Named in initial FIR narrative. Formal statement pending under Sec 180 BNSS.',
      category: 'Witness',
      priority: 'MEDIUM',
      icon: UserX,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      actionText: 'Schedule Statement'
    },
    {
      id: 'rec_cdr',
      title: 'Mobile CDR pending from Airtel',
      description: 'Tower dump request sent on 20th July. Follow up with Telecom Nodal Officer.',
      category: 'Telecom',
      priority: 'MEDIUM',
      icon: PhoneCall,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      actionText: 'Check Nodal Portal'
    },
    {
      id: 'rec_vehicle',
      title: 'Vehicle owner unknown (KA-03-MN-4491)',
      description: 'Unregistered blue SUV spotted near Crime Scene. Query Vahan database.',
      category: 'RTO / Vahan',
      priority: 'URGENT',
      icon: Car,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      actionText: 'Lookup Vahan DB'
    }
  ];

  const toggleComplete = (id: string, title: string) => {
    if (completedItems.includes(id)) {
      setCompletedItems(prev => prev.filter(i => i !== id));
    } else {
      setCompletedItems(prev => [...prev, id]);
      onExecuteRecommendation(title);
    }
  };

  return (
    <div className="bg-white border border-[#EBF0F5] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] animate-pulse" />
            <h3 className="text-base font-extrabold text-[#111111] tracking-tight">
              ArcCraft AI Recommendations
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-full">
            {recommendations.length - completedItems.length} Actionable Recommendations
          </span>
        </div>

        <div className="flex flex-col gap-3 my-4">
          {recommendations.map((rec) => {
            const IconComp = rec.icon;
            const isDone = completedItems.includes(rec.id);

            return (
              <div 
                key={rec.id}
                className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${isDone ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100 hover:border-[#FFE4DC] hover:shadow-sm'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${rec.color}`}>
                    <IconComp size={16} />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {rec.title}
                      </span>
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {rec.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleComplete(rec.id, rec.title)}
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-[#111111] hover:bg-[#FF5A1F] text-white shadow-sm'}`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 size={12} />
                        <span>Done</span>
                      </>
                    ) : (
                      <>
                        <span>{rec.actionText}</span>
                        <ArrowRight size={11} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 text-[10px] text-gray-400 font-medium flex items-center justify-between">
        <span>💡 AI automatically prioritizes tasks based on statutory timelines & evidence strength.</span>
      </div>
    </div>
  );
}
