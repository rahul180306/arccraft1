'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FileText, Search, Fingerprint, Network, ShieldAlert, Scale, Lightbulb, CheckCircle2 } from 'lucide-react';

const steps = [
  { icon: FileText, label: 'FIR / Case Intake', active: false, past: true },
  { icon: Search, label: 'Evidence Analysis', active: false, past: true },
  { icon: Fingerprint, label: 'Entity Resolution', active: false, past: true },
  { icon: Network, label: 'Knowledge Graph', active: true, past: false },
  { icon: ShieldAlert, label: 'Bias Detection', active: false, past: false },
  { icon: Scale, label: 'Competing Hypotheses', active: false, past: false },
  { icon: Lightbulb, label: 'Explainable Recommendation', active: false, past: false },
  { icon: CheckCircle2, label: 'Officer Decision', active: false, past: false },
];

export default function InvestigationFlow() {
  const activeIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIconRef.current) {
      gsap.to(activeIconRef.current, {
        scale: 1.1,
        boxShadow: '0 0 15px rgba(255,90,31,0.4)',
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, []);

  return (
    <div className="relative mt-4 ml-2 flex flex-col justify-between h-[280px]">
      {/* Background line - perfectly centered and robust */}
      <div className="absolute left-[11px] top-3 bottom-3 w-[2px] border-l-2 border-dashed border-[#EAEAEA] z-0 pointer-events-none" />
      
      {/* High-contrast active progress line */}
      <div className="absolute left-[11px] top-3 h-[42%] w-[2px] border-l-2 border-dashed border-[#FF5A1F] z-0 pointer-events-none" />

      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-4 relative z-10">
          <div 
            ref={step.active ? activeIconRef : null}
            className={`w-6 h-6 rounded-full flex items-center justify-center bg-white transition-all duration-300
              ${step.active ? 'border-2 border-[#FF5A1F] text-[#FF5A1F]' : 
                step.past ? 'border border-[#FF5A1F] text-[#FF5A1F]' : 
                'border border-[#EAEAEA] text-[#9CA3AF]'}`}
          >
            <step.icon size={11} strokeWidth={step.active ? 2.5 : 2} />
          </div>
          <span className={`text-[10px] md:text-[11px] font-semibold tracking-wide transition-colors duration-300 uppercase
            ${step.active ? 'text-[#111111]' : step.past ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

