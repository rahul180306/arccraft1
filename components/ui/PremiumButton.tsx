'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'dark' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export default function PremiumButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  className = '',
  type = 'button',
  icon
}: PremiumButtonProps) {
  const variantStyles = {
    primary: 'bg-[#FF5A1F] hover:bg-[#e04d19] text-white shadow-lg shadow-[#FF5A1F]/20 border border-[#FF5A1F]',
    secondary: 'bg-[#FFF5F2] hover:bg-[#FFE4DC] text-[#FF5A1F] border border-[#FFE4DC]',
    dark: 'bg-[#111111] hover:bg-[#222222] text-white shadow-md border border-gray-800',
    glass: 'bg-white/80 hover:bg-white text-gray-900 border border-gray-200 backdrop-blur-md shadow-sm',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md border border-red-600'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[10px] font-extrabold rounded-xl gap-1.5',
    md: 'px-4 py-2.5 text-xs font-black rounded-2xl gap-2',
    lg: 'px-6 py-3.5 text-sm font-black rounded-2xl gap-2.5'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      whileHover={isDisabled ? undefined : { y: -1, scale: 1.01 }}
      whileTap={isDisabled ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className={`inline-flex items-center justify-center uppercase tracking-wider transition-all duration-200 cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
}
