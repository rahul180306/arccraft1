'use client';

import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import Hero from '@/components/hero/Hero';
import SmarterInvestigations from '@/components/sections/SmarterInvestigations';
import HowItWorks from '@/components/sections/HowItWorks';
import ImpactProof from '@/components/sections/ImpactProof';
import Footer from '@/components/sections/Footer';

export default function LandingPageWorkspace() {
  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-[#111111] overflow-x-hidden relative">
      <Navbar />
      <main className="w-full">
        <Hero />
        <SmarterInvestigations />
        <HowItWorks />
        <ImpactProof />
      </main>
      <Footer />
    </div>
  );
}
