'use client';

import React from 'react';
import { motion } from 'motion/react';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  isDarkMode?: boolean;
  hoverGlow?: 'orange' | 'blue' | 'emerald' | 'none';
  padding?: string;
  onClick?: () => void;
}

export default function PremiumCard({
  children,
  className = '',
  isDarkMode = false,
  hoverGlow = 'orange',
  padding = 'p-6',
  onClick
}: PremiumCardProps) {
  const glowClasses = {
    orange: 'hover:shadow-[0_12px_30px_-10px_rgba(255,90,31,0.2)] hover:border-[#FF5A1F]/40',
    blue: 'hover:shadow-[0_12px_30px_-10px_rgba(59,130,246,0.2)] hover:border-blue-500/40',
    emerald: 'hover:shadow-[0_12px_30px_-10px_rgba(16,185,129,0.2)] hover:border-emerald-500/40',
    none: 'hover:shadow-md'
  };

  return (
    <motion.div
      whileHover={{ y: onClick ? -2 : 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`relative rounded-[24px] border transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white border-[#E5E7EB] dark:bg-[#111827] dark:border-[#374151] text-[#111827] dark:text-[#F9FAFB] shadow-xs dark:shadow-xl ${glowClasses[hoverGlow]} ${onClick ? 'cursor-pointer' : ''} ${padding} ${className}`}
    >
      {/* Subtle top inner gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5A1F]/30 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
