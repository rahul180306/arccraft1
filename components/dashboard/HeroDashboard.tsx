'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import CaseOverview from './CaseOverview';
import InvestigationFlow from './InvestigationFlow';
import NetworkGraph from './NetworkGraph';
import RiskScore from './RiskScore';

export default function HeroDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial reveal animation
    if (dashboardRef.current) {
      gsap.fromTo(
        dashboardRef.current,
        { scale: 0.96, autoAlpha: 0, y: 40 },
        { scale: 1, autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.4 }
      );
    }

    // Subtle floating animations for inner elements
    if (leftColRef.current && rightColRef.current) {
      gsap.to(leftColRef.current, {
        y: -5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.2
      });
      gsap.to(rightColRef.current, {
        y: -4,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5
      });
    }
  }, []);

  // Subtle tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dashboardRef.current) return;
    
    const rect = dashboardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -2; // max 2 degrees
    const rotateY = ((x - centerX) / centerX) * 2;
    
    gsap.to(dashboardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      ease: 'power1.out',
      duration: 0.5
    });
  };

  const handleMouseLeave = () => {
    if (dashboardRef.current) {
      gsap.to(dashboardRef.current, {
        rotateX: 0,
        rotateY: 0,
        ease: 'power3.out',
        duration: 1
      });
    }
  };

  return (
    <div 
      ref={dashboardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ visibility: 'hidden' }}
      className="w-full h-[650px] bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-[#EAEAEA] p-8 flex gap-8 transform-gpu"
    >
      {/* Left Column */}
      <div ref={leftColRef} className="w-5/12 h-full flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF5A1F]"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]">Case Overview</span>
          </div>
          <CaseOverview />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF5A1F]"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]">Investigation Flow</span>
          </div>
          <InvestigationFlow />
        </div>
      </div>

      {/* Right Column */}
      <div ref={rightColRef} className="w-7/12 h-full border-l border-[#EAEAEA] pl-8 flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF5A1F]"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]">Criminal Network Graph</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
             <NetworkGraph />
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-[#EAEAEA]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF5A1F]"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]">Risk Score</span>
          </div>
          <RiskScore />
        </div>
      </div>
    </div>
  );
}
