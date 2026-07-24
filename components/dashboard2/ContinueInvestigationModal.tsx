'use client';

import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle,
  Fingerprint,
  Video,
  UserCheck,
  Send
} from 'lucide-react';

interface ContinueInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export default function ContinueInvestigationModal({ isOpen, onClose, onShowToast }: ContinueInvestigationModalProps) {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: 'Review Scene Inspection & Seizure Mahazar',
      status: 'Completed',
      detail: 'Crime Scene: Building #4B, Anekal Main Road. Seized: Broken padlock, brass door fitting, crowbar impressions.',
      action: 'Confirm Seizure List'
    },
    {
      step: 2,
      title: 'Verify AFIS Fingerprint Match',
      status: 'Active',
      detail: 'Latent print #2 matches Accused Suresh @ Bullet Suresh (Score 89%). CCTNS Criminal ID: KA-KRPR-2022-901.',
      action: 'Confirm Suspect Match'
    },
    {
      step: 3,
      title: 'Examine Exit Gate CCTV Video',
      status: 'Pending',
      detail: 'Keyframe detected blue SUV KA-03-MN-4491 fleeing scene at 03:14 AM.',
      action: 'Verify License Plate'
    },
    {
      step: 4,
      title: 'Record Final Witness Statement',
      status: 'Pending',
      detail: 'Witness Ramesh Kumar statement under Sec 180 BNSS.',
      action: 'Draft Statement'
    },
    {
      step: 5,
      title: 'Submit Form 173 Chargesheet Draft',
      status: 'Pending',
      detail: 'Submit completed dossier to VI ACMM Court.',
      action: 'Submit Chargesheet'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-[32px] max-w-3xl w-full shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-[#111827] text-white flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5A1F] text-white flex items-center justify-center font-extrabold shadow">
              <Briefcase size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#FF5A1F] uppercase font-bold bg-[#FF5A1F]/10 px-2.5 py-0.5 rounded-full border border-[#FF5A1F]/20">
                  ACTIVE DOSSIER WORKFLOW
                </span>
                <span className="text-xs font-mono text-gray-400">FIR KRP/2026/0456</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-0.5">
                Investigator Case Execution Plan
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Step List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1" data-lenis-prevent>
          {steps.map((st) => (
            <div 
              key={st.step}
              onClick={() => setActiveStep(st.step)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${activeStep === st.step ? 'bg-[#FFF5F2] border-[#FF5A1F] shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${st.step < activeStep ? 'bg-emerald-600 text-white' : activeStep === st.step ? 'bg-[#FF5A1F] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {st.step < activeStep ? <CheckCircle2 size={16} /> : st.step}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-gray-900">{st.title}</h3>
                    <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${st.step < activeStep ? 'bg-emerald-100 text-emerald-800' : activeStep === st.step ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
                      {st.step < activeStep ? 'DONE' : activeStep === st.step ? 'IN PROGRESS' : 'QUEUED'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium mt-1 leading-relaxed">{st.detail}</p>
                </div>
              </div>

              {activeStep === st.step && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeStep < steps.length) {
                      setActiveStep(prev => prev + 1);
                      onShowToast(`Completed Step ${st.step}: ${st.title}`);
                    } else {
                      onShowToast('All investigation steps completed! Chargesheet draft finalized.');
                      onClose();
                    }
                  }}
                  className="bg-[#111111] hover:bg-[#FF5A1F] text-white px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-md flex items-center gap-1.5"
                >
                  <span>{st.action}</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 font-semibold">
          <span>Assigned Officer: <strong>Inspector Arjun (IO)</strong></span>
          <button 
            onClick={onClose}
            className="text-gray-700 hover:text-black font-bold uppercase tracking-wider"
          >
            Close Plan
          </button>
        </div>
      </div>
    </div>
  );
}
