'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, User, Car, MapPin, Building2, FileText, Phone, CreditCard,
  Shield, AlertTriangle, ChevronRight, ExternalLink, Clock, Link2,
  Fingerprint, Camera, FileCheck, Zap, Hash
} from 'lucide-react';
import { CyNode } from './CytoscapeGraph';

interface EntityPanelProps {
  node: CyNode | null;
  onClose: () => void;
  isDarkMode: boolean;
  onOpenTimeline?: (nodeId: string) => void;
  onAIExpand?: (nodeId: string) => void;
}

const NODE_ICONS: Record<string, React.ReactNode> = {
  person:       <User size={16} />,
  vehicle:      <Car size={16} />,
  location:     <MapPin size={16} />,
  organization: <Building2 size={16} />,
  evidence:     <FileText size={16} />,
  phone:        <Phone size={16} />,
  bank:         <CreditCard size={16} />,
  event:        <Zap size={16} />,
};

const NODE_COLORS: Record<string, { accent: string; badge: string }> = {
  person:       { accent: '#A855F7', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  vehicle:      { accent: '#10B981', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  location:     { accent: '#3B82F6', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  organization: { accent: '#F59E0B', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  evidence:     { accent: '#EF4444', badge: 'bg-red-500/10 text-red-400 border-red-500/30' },
  phone:        { accent: '#06B6D4', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  bank:         { accent: '#EC4899', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
  event:        { accent: '#8B5CF6', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
};

const RISK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical Risk', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
  high:     { label: 'High Risk',     color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  medium:   { label: 'Medium Risk',   color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  low:      { label: 'Low Risk',      color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  none:     { label: 'No Risk Flag',  color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30' },
};

export default function EntityPanel({ node, onClose, isDarkMode, onOpenTimeline, onAIExpand }: EntityPanelProps) {
  const panelBg = isDarkMode ? 'bg-[#111115] border-gray-800' : 'bg-white border-gray-200';
  const subCardBg = isDarkMode ? 'bg-[#18181C] border-gray-800' : 'bg-gray-50 border-gray-200';
  const textPrimary = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSub = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 32 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`absolute top-0 right-0 h-full w-[300px] xl:w-[320px] flex flex-col border-l shadow-2xl overflow-hidden z-20 ${panelBg}`}
        >
          {/* Header */}
          <div
            className="p-4 border-b flex items-start justify-between gap-3 shrink-0"
            style={{ borderColor: isDarkMode ? '#1F2937' : '#E5E7EB', background: `${NODE_COLORS[node.type]?.accent}12` }}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: `${NODE_COLORS[node.type]?.accent}20`, color: NODE_COLORS[node.type]?.accent, border: `1.5px solid ${NODE_COLORS[node.type]?.accent}40` }}
              >
                {NODE_ICONS[node.type] || <Hash size={16} />}
              </div>
              <div className="min-w-0">
                <h3 className={`text-sm font-black truncate ${textPrimary}`}>{node.label}</h3>
                <p className={`text-[10px] font-medium truncate ${textSub}`}>{node.subtitle || node.type}</p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${NODE_COLORS[node.type]?.badge}`}>
                    {node.type}
                  </span>
                  {node.risk && node.risk !== 'none' && (
                    <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${RISK_CONFIG[node.risk]?.bg} ${RISK_CONFIG[node.risk]?.color}`}>
                      {RISK_CONFIG[node.risk]?.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button onClick={onClose} className={`p-1.5 rounded-lg shrink-0 transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            
            {/* Details Grid */}
            {node.details && Object.keys(node.details).length > 0 && (
              <div className={`p-3 rounded-xl border ${subCardBg}`}>
                <div className={`text-[10px] font-black uppercase tracking-wider mb-2.5 ${textSub}`}>Entity Details</div>
                <div className="flex flex-col gap-2">
                  {Object.entries(node.details).filter(([, v]) => v != null).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2">
                      <span className={`text-[9px] font-bold uppercase tracking-wider w-20 shrink-0 mt-0.5 ${textSub}`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`text-[10px] font-semibold leading-tight ${textPrimary}`}>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Score Bar */}
            {node.risk && node.risk !== 'none' && (
              <div className={`p-3 rounded-xl border ${subCardBg}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${textSub}`}>Risk Score</span>
                  <span className={`text-[10px] font-black ${RISK_CONFIG[node.risk]?.color}`}>
                    {node.risk === 'critical' ? '95' : node.risk === 'high' ? '75' : node.risk === 'medium' ? '50' : '20'}/100
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: node.risk === 'critical' ? '95%' : node.risk === 'high' ? '75%' : node.risk === 'medium' ? '50%' : '20%' }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: node.risk === 'critical' ? '#EF4444' : node.risk === 'high' ? '#F97316' : node.risk === 'medium' ? '#EAB308' : '#22C55E' }}
                  />
                </div>
              </div>
            )}

            {/* Connected FIRs Badge */}
            {node.details?.casesLinked && (
              <div className={`p-3 rounded-xl border ${subCardBg}`}>
                <div className={`text-[10px] font-black uppercase tracking-wider mb-2 ${textSub}`}>Linked Cases</div>
                <div className="flex items-center gap-3">
                  <div className={`text-2xl font-black ${textPrimary}`}>{node.details.casesLinked}</div>
                  <div className={`text-[10px] font-medium ${textSub}`}>FIRs linked to this entity in the KSP CCTNS database</div>
                </div>
              </div>
            )}

            {/* Notes */}
            {node.details?.notes && (
              <div className={`p-3 rounded-xl border ${subCardBg}`}>
                <div className={`text-[10px] font-black uppercase tracking-wider mb-2 ${textSub}`}>Intelligence Note</div>
                <p className={`text-[10px] font-medium leading-relaxed ${textPrimary}`}>{node.details.notes}</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className={`p-3 border-t flex flex-col gap-2 shrink-0 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <button
              onClick={() => onAIExpand?.(node.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-black transition-all shadow-sm"
            >
              <i className="fi fi-ss-brain-circuit text-sm flex items-center"></i>
              <span>AI: Expand Connections</span>
              <ChevronRight size={13} className="ml-auto" />
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenTimeline?.(node.id)}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[10px] font-black transition-all border ${isDarkMode ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-200 hover:bg-gray-100 text-gray-700'}`}
              >
                <Clock size={11} />
                <span>Timeline</span>
              </button>
              <button
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[10px] font-black transition-all border ${isDarkMode ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-200 hover:bg-gray-100 text-gray-700'}`}
              >
                <ExternalLink size={11} />
                <span>Open FIR</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
