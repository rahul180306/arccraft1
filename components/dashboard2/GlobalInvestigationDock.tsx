'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  FileText, 
  Users, 
  CheckSquare, 
  ShieldCheck, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Clock,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import PremiumButton from '@/components/ui/PremiumButton';

import { useUIStore } from '@/lib/stores/uiStore';

interface GlobalInvestigationDockProps {
  onOpenCopilot?: (prompt?: string) => void;
  onOpenContinueModal?: () => void;
  onShowToast?: (msg: string) => void;
}

export default function GlobalInvestigationDock() {
  return null;
}

