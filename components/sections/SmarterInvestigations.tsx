'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrainCircuit, Share2, Scale, Compass, ShieldCheck } from 'lucide-react';

const cards = [
  {
    icon: BrainCircuit,
    title: 'Evidence Intelligence',
    description: 'Extract meaningful insights from documents, images, videos, and forensic data.',
  },
  {
    icon: Share2,
    title: 'Hidden Connections',
    description: 'Uncover relationships between persons, locations, devices, and organizations.',
  },
  {
    icon: Scale,
    title: 'Bias-Aware Analysis',
    description: 'Detect cognitive bias patterns and prompt objective, evidence-first decisions.',
  },
  {
    icon: Compass,
    title: 'Explainable AI',
    description: 'Every insight is traceable, verifiable, and supported by transparent reasoning.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Compliant',
    description: 'Enterprise-grade security with role-based access and full audit trails.',
  },
];

export default function SmarterInvestigations() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  return (
    <section id="features" ref={containerRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full select-none">
      <div className="section-header text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111111]">
          Built for <span className="text-[#FF5A1F]">Smarter</span> Investigations
        </h2>
        <p className="text-[#6B7280] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          ArcCraft combines advanced AI models with proven investigative workflows to bring clarity, speed, and accuracy to every case.
        </p>
      </div>

      <div 
        ref={cardsRef} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {cards.map((card, i) => (
          <div 
            key={i}
            className="group relative bg-white border border-[#EAEAEA] rounded-[20px] p-6 flex flex-col gap-5 hover:border-[#FF5A1F] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(255,90,31,0.04)] hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FAFAFA] to-[#FFF5F2] border border-[#EAEAEA] flex items-center justify-center text-[#FF5A1F] group-hover:scale-110 transition-transform duration-300">
              <card.icon size={20} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
                {card.title}
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
