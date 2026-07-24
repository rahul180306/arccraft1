'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, Search, Cpu, Eye, CheckSquare } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: Database,
    title: 'Ingest',
    description: 'Collect data from multiple sources securely.',
  },
  {
    number: '2',
    icon: Search,
    title: 'Analyze',
    description: 'AI models extract entities, patterns, and anomalies.',
  },
  {
    number: '3',
    icon: Cpu,
    title: 'Correlate',
    description: 'Build knowledge graphs and link hidden dots.',
  },
  {
    number: '4',
    icon: Eye,
    title: 'Evaluate',
    description: 'Bias detection and competing hypotheses generation.',
  },
  {
    number: '5',
    icon: CheckSquare,
    title: 'Decide',
    description: 'Generate explainable insights for confident decisions.',
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelector('.section-header'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    if (stepsRef.current) {
      gsap.fromTo(
        stepsRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  return (
    <section id="how-it-works" ref={containerRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full select-none border-t border-[#EAEAEA]">
      <div className="section-header text-center mb-20 space-y-4">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111111]">
          How <span className="text-[#111111]">Arc</span><span className="text-[#FF5A1F]">Craft</span> Works
        </h2>
        <p className="text-[#6B7280] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          A unified AI workflow designed to assist investigators at every step.
        </p>
      </div>

      <div 
        ref={stepsRef}
        className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-4 relative"
      >
        {/* Connection Line - hidden on mobile/tablet */}
        <div className="absolute top-10 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#FF5A1F]/10 via-[#FF5A1F]/40 to-[#FF5A1F]/10 hidden lg:block z-0" />

        {steps.map((step, i) => (
          <div 
            key={i}
            className="flex-1 flex flex-col items-center text-center gap-6 relative z-10 w-full group"
          >
            {/* Step Icon with numeric badge */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white border-2 border-[#EAEAEA] group-hover:border-[#FF5A1F] flex items-center justify-center text-[#FF5A1F] shadow-sm group-hover:shadow-[0_8px_24px_rgba(255,90,31,0.12)] transition-all duration-300 transform group-hover:scale-105">
                <step.icon size={28} strokeWidth={1.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#111111] group-hover:bg-[#FF5A1F] text-white text-xs font-bold rounded-full flex items-center justify-center transition-colors duration-300">
                {step.number}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2 max-w-[220px]">
              <h3 className="font-bold text-base text-[#111111] uppercase tracking-wider">
                {step.number}. {step.title}
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
