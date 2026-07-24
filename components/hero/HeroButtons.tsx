'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import anime from 'animejs';
import { useUIStore } from '@/lib/stores/uiStore';

export default function HeroButtons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const secondaryBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.6 }
      );
    }

    const animateRipple = (e: MouseEvent, button: HTMLButtonElement, color: string) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const circle = document.createElement('span');
      circle.style.position = 'absolute';
      circle.style.top = `${y}px`;
      circle.style.left = `${x}px`;
      circle.style.width = '0px';
      circle.style.height = '0px';
      circle.style.borderRadius = '50%';
      circle.style.backgroundColor = color;
      circle.style.transform = 'translate(-50%, -50%)';
      circle.style.pointerEvents = 'none';
      button.appendChild(circle);

      anime({
        targets: circle,
        width: rect.width * 2.5,
        height: rect.width * 2.5,
        opacity: [0.3, 0],
        duration: 600,
        easing: 'easeOutSine',
        complete: () => {
          circle.remove();
        }
      });
    };

    const handlePrimaryClick = (e: MouseEvent) => animateRipple(e, primaryBtnRef.current!, 'rgba(255,255,255,0.4)');
    const handleSecondaryClick = (e: MouseEvent) => animateRipple(e, secondaryBtnRef.current!, 'rgba(0,0,0,0.1)');

    const primaryBtn = primaryBtnRef.current;
    const secondaryBtn = secondaryBtnRef.current;

    primaryBtn?.addEventListener('click', handlePrimaryClick);
    secondaryBtn?.addEventListener('click', handleSecondaryClick);

    return () => {
      primaryBtn?.removeEventListener('click', handlePrimaryClick);
      secondaryBtn?.removeEventListener('click', handleSecondaryClick);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-wrap gap-4 mt-8">
      <button 
        ref={primaryBtnRef}
        onClick={() => {
          setTimeout(() => {
            useUIStore.getState().setActiveTab('Dashboard');
            useUIStore.getState().showToast('Welcome to ArcCraft OS Dashboard');
          }, 200);
        }}
        className="relative overflow-hidden bg-[#FF5A1F] text-white font-bold text-[11px] uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_8px_16px_rgba(255,90,31,0.2)] hover:bg-[#e04d19] transition-colors cursor-pointer"
      >
        Explore Dashboard
      </button>
      <button 
        ref={secondaryBtnRef}
        onClick={() => {
          const element = document.getElementById('how-it-works');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="relative overflow-hidden bg-white text-[#111111] font-bold text-[11px] uppercase tracking-widest px-8 py-4 rounded-full border border-[#EAEAEA] shadow-sm hover:border-[#111111] transition-colors cursor-pointer"
      >
        See How It Works
      </button>
    </div>
  );
}
