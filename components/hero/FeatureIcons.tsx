'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import anime from 'animejs';
import { Network, Fingerprint, ShieldAlert, TrendingUp, FileText } from 'lucide-react';

const features = [
  { icon: Network, label: 'Criminal Network\nAnalysis' },
  { icon: Fingerprint, label: 'Entity Resolution\nEngine' },
  { icon: ShieldAlert, label: 'Cognitive Bias\nDetection' },
  { icon: TrendingUp, label: 'Predictive\nIntelligence' },
  { icon: FileText, label: 'Explainable\nReports' },
];

export default function FeatureIcons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.8 }
      );
    }
  }, []);

  const handleMouseEnter = (index: number) => {
    const el = iconsRef.current[index];
    if (el) {
      const icon = el.querySelector('svg');
      if (icon) {
        anime({
          targets: icon,
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
          duration: 600,
          easing: 'easeOutElastic(1, .5)',
        });
      }
    }
  };

  return (
    <div ref={containerRef} className="flex flex-wrap gap-8 mt-16">
      {features.map((feat, i) => (
        <div 
          key={i} 
          className="flex flex-col items-center gap-4 cursor-pointer group"
          ref={el => { iconsRef.current[i] = el; }}
          onMouseEnter={() => handleMouseEnter(i)}
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#EAEAEA] flex items-center justify-center text-[#FF5A1F] shadow-sm group-hover:border-[#FF5A1F] transition-colors">
            <feat.icon size={20} strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-bold text-center leading-tight uppercase tracking-widest text-[#6B7280] group-hover:text-[#111111] transition-colors whitespace-pre-line">
            {feat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
