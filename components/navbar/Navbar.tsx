'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useUIStore } from '@/lib/stores/uiStore';

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, []);

  const handleStart = () => {
    useUIStore.getState().setActiveTab('Dashboard');
    useUIStore.getState().showToast('Welcome to ArcCraft OS Dashboard');
  };

  return (
    <header 
      ref={navRef}
      style={{ visibility: 'hidden' }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[95%] max-w-7xl backdrop-blur-md bg-white/70 border border-[#EAEAEA] rounded-full px-6 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center">
        <span className="text-2xl font-sans font-black tracking-tighter">
          <span className="text-[#111111]">Arc</span><span className="text-[#FF5A1F]">Craft</span>
        </span>
      </div>
      <div className="hidden md:flex gap-8 bg-[#111111] text-[#FAFAFA] rounded-full px-8 py-3 items-center shadow-lg">
        <button 
          onClick={() => {
            const element = document.getElementById('features');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-none outline-none font-sans"
        >
          Features
        </button>
        <button 
          onClick={() => {
            const element = document.getElementById('how-it-works');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-none outline-none font-sans"
        >
          How It Works
        </button>
        <button 
          onClick={handleStart}
          className="text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer font-sans bg-transparent border-none outline-none"
        >
          Login
        </button>
        <button 
          onClick={handleStart}
          className="text-[10px] font-bold uppercase tracking-widest bg-[#FF5A1F] text-white px-5 py-2.5 rounded-full hover:bg-[#e04d19] transition-colors ml-2 font-sans cursor-pointer border-none outline-none"
        >
          Start
        </button>
      </div>
    </header>
  );
}
