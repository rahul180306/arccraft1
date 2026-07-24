'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface FilterPanelProps {
  isDarkMode: boolean;
  hiddenTypes: string[];
  onToggleType: (type: string) => void;
  riskFilter: string;
  onRiskFilter: (risk: string) => void;
}

const NODE_TYPE_CONFIG: Array<{ id: string; label: string; color: string; shape: string; iconClass: string }> = [
  { id: 'person',       label: 'Person',       color: '#A855F7', shape: '●', iconClass: 'fi fi-rs-user' },
  { id: 'vehicle',      label: 'Vehicle',       color: '#10B981', shape: '■', iconClass: 'fi fi-rs-car-alt' },
  { id: 'location',     label: 'Location',      color: '#3B82F6', shape: '◆', iconClass: 'fi fi-rs-marker' },
  { id: 'evidence',     label: 'Evidence',      color: '#EF4444', shape: '▲', iconClass: 'fi fi-rs-document' },
  { id: 'organization', label: 'Organization',  color: '#F59E0B', shape: '⬡', iconClass: 'fi fi-rs-building' },
  { id: 'phone',        label: 'Phone/CDR',     color: '#06B6D4', shape: '⬠', iconClass: 'fi fi-rs-phone-call' },
  { id: 'bank',         label: 'Bank/Finance',  color: '#EC4899', shape: '▣', iconClass: 'fi fi-rs-bank' },
  { id: 'event',        label: 'Event',         color: '#8B5CF6', shape: '★', iconClass: 'fi fi-rs-calendar' },
];

const RISK_FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'critical', label: '🔴 Critical' },
  { id: 'high',     label: '🟠 High' },
  { id: 'medium',   label: '🟡 Medium' },
  { id: 'low',      label: '🟢 Low' },
];

export default function FilterPanel({ isDarkMode, hiddenTypes, onToggleType, riskFilter, onRiskFilter }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const panelBg = isDarkMode ? 'bg-[#111115] border-gray-800' : 'bg-white border-gray-200';
  const textPrimary = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSub = isDarkMode ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="absolute left-0 top-0 bottom-0 z-10 flex items-start">
      {/* Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 192, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`h-full flex flex-col border-r overflow-hidden shrink-0 ${panelBg}`}
          >
            <div className="p-3 border-b flex items-center justify-between shrink-0" style={{ borderColor: isDarkMode ? '#1F2937' : '#E5E7EB' }}>
              <div className="flex items-center gap-2">
                <Filter size={12} className={textSub} />
                <span className={`text-[10px] font-black uppercase tracking-wider ${textSub}`}>Filter</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-3">
              
              {/* Node Types */}
              <div>
                <div className={`text-[9px] font-black uppercase tracking-wider px-1 mb-1.5 ${textSub}`}>Entity Types</div>
                <div className="flex flex-col gap-0.5">
                  {NODE_TYPE_CONFIG.map(type => {
                    const isHidden = hiddenTypes.includes(type.id);
                    return (
                      <button
                        key={type.id}
                        onClick={() => onToggleType(type.id)}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all w-full ${
                          isHidden
                            ? (isDarkMode ? 'opacity-40 hover:opacity-70' : 'opacity-30 hover:opacity-60')
                            : (isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100')
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0"
                          style={{
                            background: isHidden ? 'transparent' : `${type.color}20`,
                            border: `1.5px solid ${isHidden ? '#6B7280' : type.color}`
                          }}
                        >
                          {!isHidden && (
                            <div className="w-1.5 h-1.5 rounded-sm" style={{ background: type.color }} />
                          )}
                        </div>
                        
                        {/* Shape indicator */}
                        <span style={{ color: isHidden ? '#6B7280' : type.color, fontSize: 10 }}>{type.shape}</span>
                        
                        <span className={`text-[10px] font-bold ${isHidden ? (isDarkMode ? 'text-gray-600' : 'text-gray-400') : textPrimary}`}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className={`h-px w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />

              {/* Risk Filter */}
              <div>
                <div className={`text-[9px] font-black uppercase tracking-wider px-1 mb-1.5 ${textSub}`}>Risk Level</div>
                <div className="flex flex-col gap-0.5">
                  {RISK_FILTERS.map(r => (
                    <button
                      key={r.id}
                      onClick={() => onRiskFilter(r.id)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-[10px] font-bold transition-all w-full ${
                        riskFilter === r.id
                          ? 'bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/30'
                          : (isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100')
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend Divider */}
              <div className={`h-px w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />

              {/* Shape Legend */}
              <div>
                <div className={`text-[9px] font-black uppercase tracking-wider px-1 mb-1.5 ${textSub}`}>Shape Legend</div>
                <div className="flex flex-col gap-1 px-1">
                  {[
                    { shape: '● Ellipse', desc: 'Person' },
                    { shape: '■ Rectangle', desc: 'Vehicle' },
                    { shape: '◆ Diamond', desc: 'Location' },
                    { shape: '▲ Triangle', desc: 'Evidence' },
                    { shape: '⬡ Hexagon', desc: 'Org' },
                  ].map(item => (
                    <div key={item.shape} className="flex justify-between">
                      <span className={`text-[9px] font-mono ${textSub}`}>{item.shape}</span>
                      <span className={`text-[9px] font-medium ${textSub}`}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Tab */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className={`absolute ${isOpen ? 'left-[192px]' : 'left-0'} top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-5 h-14 rounded-r-lg transition-all shadow-md z-20 ${
          isDarkMode ? 'bg-[#111115] border border-gray-800 border-l-0 text-gray-400' : 'bg-white border border-gray-200 border-l-0 text-gray-500'
        }`}
        title={isOpen ? 'Collapse filter panel' : 'Expand filter panel'}
      >
        {isOpen ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
      </button>
    </div>
  );
}
