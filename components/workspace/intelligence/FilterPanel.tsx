'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Filter, Eye, EyeOff, Users, Package, MapPin, AlertTriangle, ShieldAlert } from 'lucide-react';

// ─── Category Config (must match PlotlyCulpritAnalytics) ─────────────────────

export type PlotlyCategory =
  | 'Culprit'
  | 'Affected Victim'
  | 'Confiscated Evidence'
  | 'Property Damage'
  | 'Crime Location'
  | 'Witness Statement';

export type FilterableCategory = Exclude<PlotlyCategory, 'Culprit'>;

interface CategoryConfig {
  color: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  count: number;
}

const CATEGORY_CONFIG: Record<FilterableCategory, CategoryConfig> = {
  'Affected Victim':      { color: '#F59E0B', label: 'Victims',   description: 'People harmed or robbed',     icon: <Users size={11} />,        count: 3 },
  'Confiscated Evidence': { color: '#3B82F6', label: 'Evidence',  description: 'Items seized by police',      icon: <Package size={11} />,      count: 5 },
  'Crime Location':       { color: '#8B5CF6', label: 'Locations', description: 'Key scene & tower locations', icon: <MapPin size={11} />,       count: 2 },
  'Witness Statement':    { color: '#10B981', label: 'Witnesses', description: 'CrPC recorded statements',    icon: <Eye size={11} />,           count: 3 },
  'Property Damage':      { color: '#EC4899', label: 'Damage',    description: 'Structural items destroyed',  icon: <AlertTriangle size={11} />, count: 3 },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as FilterableCategory[];

// ─── Edge Style Legend ────────────────────────────────────────────────────────

const EDGE_STYLES: Array<{ dash: string; label: string; color: string }> = [
  { dash: 'solid',   label: 'Victims / Damage',  color: '#F59E0B' },
  { dash: 'dotted',  label: 'Evidence',           color: '#3B82F6' },
  { dash: 'dashed',  label: 'Witnesses',          color: '#10B981' },
  { dash: 'dashdot', label: 'Locations',          color: '#8B5CF6' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface FilterPanelProps {
  isDarkMode: boolean;
  // New Plotly-aware props
  activeFilters: Set<PlotlyCategory>;
  onToggleFilter: (cat: PlotlyCategory) => void;
  // Legacy props (kept for backward compatibility, no-op)
  hiddenTypes?: string[];
  onToggleType?: (type: string) => void;
  riskFilter?: string;
  onRiskFilter?: (risk: string) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FilterPanel({
  isDarkMode,
  activeFilters,
  onToggleFilter,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const panelBg   = isDarkMode ? 'bg-[#111115] border-gray-800' : 'bg-white border-gray-200';
  const textMain  = isDarkMode ? '#F3F4F6' : '#111827';
  const textSub   = isDarkMode ? '#6B7280' : '#9CA3AF';
  const dividerBg = isDarkMode ? '#1F2937' : '#E5E7EB';
  const hoverBg   = isDarkMode ? 'hover:bg-gray-800/60' : 'hover:bg-gray-50';

  const activeCount = activeFilters.size;
  const totalCount  = ALL_CATEGORIES.length;

  return (
    <div className="absolute left-0 top-0 bottom-0 z-10 flex items-start">

      {/* ── Panel Body ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 210, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`h-full flex flex-col border-r overflow-hidden shrink-0 ${panelBg}`}
          >
            {/* Header */}
            <div
              className="p-3 border-b flex items-center justify-between shrink-0"
              style={{ borderColor: dividerBg }}
            >
              <div className="flex items-center gap-2">
                <Filter size={12} style={{ color: textSub }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: textSub }}>
                  Graph Filters
                </span>
              </div>
              {/* Active count badge */}
              <span
                className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                style={{
                  background: '#FF5A1F18',
                  color: '#FF5A1F',
                  border: '1px solid #FF5A1F33',
                }}
              >
                {activeCount}/{totalCount}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-3">

              {/* ── Culprit Anchor (always visible) ── */}
              <div>
                <div className="text-[9px] font-black uppercase tracking-wider px-1 mb-1.5" style={{ color: textSub }}>
                  Focal Node
                </div>
                <div
                  className="flex items-center gap-2 px-2.5 py-2 rounded-xl border"
                  style={{
                    background: '#EF444415',
                    borderColor: '#EF444440',
                  }}
                >
                  <div className="w-5 h-5 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                    <ShieldAlert size={11} className="text-red-500" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black" style={{ color: '#EF4444' }}>
                      Suresh Kumar
                    </div>
                    <div className="text-[9px] font-mono" style={{ color: textSub }}>
                      Always visible · Prime Accused
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="h-px w-full" style={{ background: dividerBg }} />

              {/* ── Category Filters ── */}
              <div>
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: textSub }}>
                    Entity Categories
                  </span>
                  <button
                    onClick={() => {
                      if (activeCount === totalCount) {
                        ALL_CATEGORIES.forEach(cat => activeFilters.has(cat) && onToggleFilter(cat));
                      } else {
                        ALL_CATEGORIES.forEach(cat => !activeFilters.has(cat) && onToggleFilter(cat));
                      }
                    }}
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded-md transition-colors"
                    style={{
                      color: '#FF5A1F',
                      background: '#FF5A1F12',
                      border: '1px solid #FF5A1F30',
                    }}
                  >
                    {activeCount === totalCount ? 'Hide All' : 'Show All'}
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  {ALL_CATEGORIES.map(cat => {
                    const cfg = CATEGORY_CONFIG[cat];
                    const active = activeFilters.has(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => onToggleFilter(cat)}
                        title={cfg.description}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all w-full border ${hoverBg}`}
                        style={{
                          background: active ? `${cfg.color}12` : 'transparent',
                          borderColor: active ? `${cfg.color}45` : dividerBg,
                          opacity: active ? 1 : 0.55,
                        }}
                      >
                        {/* Checkbox */}
                        <div
                          className="w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-all"
                          style={{
                            background: active ? `${cfg.color}22` : 'transparent',
                            border: `1.5px solid ${active ? cfg.color : textSub}`,
                          }}
                        >
                          {active && (
                            <div className="w-2 h-2 rounded-sm" style={{ background: cfg.color }} />
                          )}
                        </div>

                        {/* Category icon */}
                        <div
                          className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${cfg.color}20`, color: cfg.color }}
                        >
                          {cfg.icon}
                        </div>

                        {/* Label + description + count */}
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-[11px] font-bold leading-none mb-0.5"
                            style={{ color: active ? textMain : textSub }}
                          >
                            {cfg.label}
                          </div>
                          <div className="text-[9px] font-mono truncate" style={{ color: textSub }}>
                            {cfg.description}
                          </div>
                        </div>

                        {/* Count badge */}
                        <span
                          className="shrink-0 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                          style={{
                            background: active ? cfg.color : dividerBg,
                            color: active ? '#fff' : textSub,
                          }}
                        >
                          {cfg.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="h-px w-full" style={{ background: dividerBg }} />

              {/* ── Edge / Connection Legend ── */}
              <div>
                <div className="text-[9px] font-black uppercase tracking-wider px-1 mb-2" style={{ color: textSub }}>
                  Connection Types
                </div>
                <div className="flex flex-col gap-1.5 px-1">
                  {EDGE_STYLES.map(e => (
                    <div key={e.label} className="flex items-center gap-2">
                      {/* Edge style preview */}
                      <div className="w-10 h-0 relative shrink-0 flex items-center">
                        <div
                          className="w-full"
                          style={{
                            height: 2,
                            background: e.color,
                            opacity: 0.75,
                            borderTop: e.dash === 'dotted'
                              ? `2px dotted ${e.color}`
                              : e.dash === 'dashed'
                              ? `2px dashed ${e.color}`
                              : e.dash === 'dashdot'
                              ? `2px dashed ${e.color}`
                              : 'none',
                            ...(e.dash === 'solid' ? { borderTop: `2px solid ${e.color}` } : {}),
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-medium" style={{ color: textSub }}>
                        {e.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="h-px w-full" style={{ background: dividerBg }} />

              {/* ── Quick Stats ── */}
              <div>
                <div className="text-[9px] font-black uppercase tracking-wider px-1 mb-2" style={{ color: textSub }}>
                  Case Summary
                </div>
                <div className="flex flex-col gap-1 px-1">
                  {[
                    { label: 'FIR Number',    value: 'KRP/2026/0456',  color: '#EF4444' },
                    { label: 'Total Loot',    value: '₹36,30,000',     color: '#3B82F6' },
                    { label: 'Prop. Damage',  value: '₹2,80,000',      color: '#EC4899' },
                    { label: 'Arrests Made',  value: '1 (Suresh K.)',   color: '#10B981' },
                    { label: 'Evidence Count', value: '5 items',        color: '#3B82F6' },
                    { label: 'Witnesses',     value: '3 recorded',      color: '#10B981' },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <span className="text-[10px] font-medium" style={{ color: textSub }}>{stat.label}</span>
                      <span className="text-[10px] font-black" style={{ color: stat.color }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle Tab ── */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className={`absolute ${isOpen ? 'left-[210px]' : 'left-0'} top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-5 h-14 rounded-r-lg transition-all shadow-md z-20 ${
          isDarkMode ? 'bg-[#111115] border border-gray-800 border-l-0 text-gray-400' : 'bg-white border border-gray-200 border-l-0 text-gray-500'
        }`}
        title={isOpen ? 'Collapse filter panel' : 'Expand filter panel'}
      >
        {isOpen ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
      </button>
    </div>
  );
}
