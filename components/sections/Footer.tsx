'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Twitter, Mail, ChevronRight } from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentYear = 2025; // Matching the exact text from the image: "© 2025 ArcCraft"

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  return (
    <footer className="w-full bg-[#FAFAFA] py-12 px-4 sm:px-6 md:px-12 select-none">
      <div 
        ref={containerRef}
        id="footer-card"
        className="max-w-7xl mx-auto w-full bg-[#111111] text-white rounded-[32px] p-8 md:p-16 border border-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.15)] flex flex-col gap-12 md:gap-16 relative overflow-hidden"
      >
        {/* Subtle decorative grid background & glowing gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#FF5A1F] rounded-full blur-[140px] opacity-10 pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#FF5A1F] rounded-full blur-[140px] opacity-5 pointer-events-none" />

        {/* 1. TOP SECTION (CTA BANNER) */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text content */}
          <div className="max-w-xl space-y-4 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Ready to Transform <br className="hidden sm:block" /> Investigations?
            </h2>
            <p className="text-sm md:text-base text-[#9CA3AF] leading-relaxed">
              Join law enforcement agencies using ArcCraft to solve cases faster, reduce bias, and deliver justice with confidence.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0 justify-center">
            <button 
              onClick={() => {
                useUIStore.getState().setActiveTab('Dashboard');
                useUIStore.getState().showToast('Welcome to ArcCraft OS Dashboard');
              }}
              className="flex items-center justify-center gap-2 bg-[#FF5A1F] text-white font-bold text-[11px] uppercase tracking-widest px-8 py-5 rounded-full hover:bg-[#e04d19] transition-all duration-300 shadow-[0_8px_24px_rgba(255,90,31,0.25)] hover:shadow-[0_12px_32px_rgba(255,90,31,0.35)] group cursor-pointer"
            >
              <span>Launch Platform</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="flex items-center justify-center bg-transparent text-white border border-white/20 font-bold text-[11px] uppercase tracking-widest px-8 py-5 rounded-full hover:bg-white hover:text-[#111111] hover:border-white transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>

        {/* HORIZONTAL DIVIDER 1 */}
        <div className="w-full h-[1px] bg-white/10 relative z-10" />

        {/* 2. MID SECTION (COLUMNS) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 items-start">
          
          {/* Brand & info Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center">
              <span className="text-2xl font-sans font-black tracking-tighter">
                <span className="text-white">Arc</span><span className="text-[#FF5A1F]">Craft</span>
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#9CA3AF] leading-relaxed max-w-sm">
              AI-powered investigation intelligence copilot for modern law enforcement.
            </p>
            <div className="flex gap-4 items-center">
              <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#FF5A1F] hover:border-[#FF5A1F] transition-all duration-300 bg-white/5">
                <Github size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#FF5A1F] hover:border-[#FF5A1F] transition-all duration-300 bg-white/5">
                <Linkedin size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#FF5A1F] hover:border-[#FF5A1F] transition-all duration-300 bg-white/5">
                <Twitter size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#FF5A1F] hover:border-[#FF5A1F] transition-all duration-300 bg-white/5">
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Architecture', 'Integrations', 'Pricing', 'Updates'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-[#9CA3AF] hover:text-[#FF5A1F] transition-colors font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">Resources</h4>
            <ul className="space-y-3">
              {['Documentation', 'Research', 'Case Studies', 'Blog', 'Support'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-[#9CA3AF] hover:text-[#FF5A1F] transition-colors font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-[#9CA3AF] hover:text-[#FF5A1F] transition-colors font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated Column */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">Stay Updated</h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Get the latest updates on AI and investigations.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 max-w-sm mt-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 text-xs bg-[#1A1A1A] text-white border border-white/15 rounded-full outline-none focus:border-[#FF5A1F] transition-colors"
              />
              <button 
                type="submit" 
                className="bg-[#FF5A1F] text-white font-bold text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-full hover:bg-[#e04d19] transition-colors shrink-0 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* HORIZONTAL DIVIDER 2 */}
        <div className="w-full h-[1px] bg-white/10 relative z-10" />

        {/* 3. BOTTOM SECTION (COPYRIGHT & META) */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">
          <div>
            © {currentYear} ArcCraft. All rights reserved.
          </div>
          <div className="hidden sm:block text-[#6B7280]">
            Built for justice. Designed for the future.
          </div>
          <div>
            v1.0.0
          </div>
        </div>

      </div>
    </footer>
  );
}
