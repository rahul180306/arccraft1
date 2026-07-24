'use client';

import React from 'react';

interface StatusBadgeProps {
  label: string;
  type?: 'success' | 'urgent' | 'warning' | 'info' | 'ai' | 'neutral';
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export default function StatusBadge({
  label,
  type = 'neutral',
  size = 'sm',
  showDot = true,
  className = ''
}: StatusBadgeProps) {
  const badgeStyles = {
    success: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] dark:bg-[#052E16] dark:text-[#6EE7B7] dark:border-[#065F46]',
    urgent: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] dark:bg-[#450A0A] dark:text-[#FCA5A5] dark:border-[#7F1D1D]',
    warning: 'bg-[#FFFBEB] text-[#B45309] border-[#FCD34D] dark:bg-[#451A03] dark:text-[#FBBF24] dark:border-[#78350F]',
    info: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] dark:bg-[#172554] dark:text-[#93C5FD] dark:border-[#1E40AF]',
    ai: 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE] dark:bg-[#2E1065] dark:text-[#C4B5FD] dark:border-[#5B21B6]',
    neutral: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB] dark:bg-[#273244] dark:text-[#D1D5DB] dark:border-[#374151]'
  };

  const dotStyles = {
    success: 'bg-emerald-500',
    urgent: 'bg-red-500 animate-pulse',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    ai: 'bg-[#FF5A1F] animate-pulse',
    neutral: 'bg-gray-400'
  };

  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5 rounded-full gap-1.5',
    md: 'text-[10px] px-2.5 py-1 rounded-full gap-2'
  };

  return (
    <span className={`inline-flex items-center font-mono font-bold uppercase tracking-wider border shrink-0 ${badgeStyles[type]} ${sizeClasses[size]} ${className}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[type]}`} />}
      <span>{label}</span>
    </span>
  );
}
