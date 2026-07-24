'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';

interface SmartQuestionsProps {
  onChecklistUpdate: (question: string, status: boolean) => void;
}

export default function SmartQuestions({ onChecklistUpdate }: SmartQuestionsProps) {
  const [questions, setQuestions] = useState([
    {
      id: 'q1',
      question: 'Did you collect fingerprints from the point of entry?',
      hint: 'Required for forensic scene report under Sec 176 BNSS',
      status: true,
      category: 'Scene Inspection'
    },
    {
      id: 'q2',
      question: 'Was nearby CCTV within 500m radius checked?',
      hint: 'Identified 2 shop cameras on Anekal Main Road',
      status: false,
      category: 'Digital Surveillance'
    },
    {
      id: 'q3',
      question: 'Was recovered weapon / crowbar sent to FSL?',
      hint: 'Awaiting malkhana dispatch tag generation',
      status: false,
      category: 'Forensic Lab'
    },
    {
      id: 'q4',
      question: 'Are call detail records (CDR) tower dump requested?',
      hint: 'Airtel & Jio nodal officers notified',
      status: true,
      category: 'Telecom Intelligence'
    },
    {
      id: 'q5',
      question: 'Has vehicle ownership been verified on Vahan portal?',
      hint: 'Blue SUV KA-03-MN-4491 chassis query pending',
      status: false,
      category: 'Vehicle Tracking'
    }
  ]);

  const toggleStatus = (id: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        const nextState = !q.status;
        onChecklistUpdate(q.question, nextState);
        return { ...q, status: nextState };
      }
      return q;
    }));
  };

  const completedCount = questions.filter(q => q.status).length;
  const progressPercent = Math.round((completedCount / questions.length) * 100);

  return (
    <div className="bg-white border border-[#EBF0F5] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#111111] tracking-tight">
                Senior Officer Guided Checklist
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">
                Standard Operational Procedures (SOP) verification for FIR KRP/2026/0456
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-black text-[#111111] font-mono">{progressPercent}%</span>
            <span className="text-[9px] text-gray-400 font-bold uppercase block">Completed</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-[#FF5A1F] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Questions list */}
        <div className="flex flex-col gap-2.5 mt-4">
          {questions.map((q) => (
            <div 
              key={q.id}
              onClick={() => toggleStatus(q.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${q.status ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-gray-200 hover:border-[#FFE4DC]'}`}
            >
              <div className="flex items-center gap-3">
                <button className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${q.status ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 bg-white'}`}>
                  {q.status && <CheckCircle2 size={13} />}
                </button>
                <div className="flex flex-col">
                  <span className={`text-xs font-bold ${q.status ? 'text-emerald-900 line-through' : 'text-gray-800'}`}>
                    {q.question}
                  </span>
                  <span className="text-[9px] font-medium text-gray-500 mt-0.5">
                    {q.hint}
                  </span>
                </div>
              </div>

              <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${q.status ? 'bg-emerald-200/60 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {q.status ? 'VERIFIED' : 'PENDING'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-gray-100 text-[10px] text-gray-400 font-medium flex items-center gap-1.5">
        <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
        <span>Completing SOP questions ensures high convictions & bulletproof court chargesheets.</span>
      </div>
    </div>
  );
}
