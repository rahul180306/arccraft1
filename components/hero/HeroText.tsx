'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroText() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const q = gsap.utils.selector(containerRef);
      gsap.fromTo(
        q('.hero-line'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-6 w-full max-w-xl">
      <h1 className="text-[64px] leading-[0.9] font-black tracking-[-0.04em] uppercase text-[#111111]">
        <div className="overflow-hidden"><div className="hero-line">Investigation</div></div>
        <div className="overflow-hidden"><div className="hero-line">Intelligence</div></div>
        <div className="overflow-hidden"><div className="hero-line text-[#FF5A1F]">Copilot.</div></div>
      </h1>
      <div className="overflow-hidden mt-4">
        <p className="hero-line text-lg text-[#6B7280] font-medium leading-relaxed">
          An AI-powered copilot for law enforcement that analyzes evidence, uncovers hidden connections, reduces cognitive bias, and delivers explainable insights to support better decisions.
        </p>
      </div>
    </div>
  );
}
